import { Observable, BehaviorSubject, switchMap, forkJoin, combineLatest, map, multicast, refCount } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';
import { ReactiveComponent } from '../../reactive.component';
import { IDish } from 'src/app/model/dishModel';
import { CooksService } from 'src/app/services/cooks.service';

@Component({
  selector: 'app-dishes',
  templateUrl: './dishes.component.html',
  styleUrl: './dishes.component.css'
})
export class DishesComponent extends ReactiveComponent implements OnInit{
  
  private readonly _dishIds$$ = new BehaviorSubject<number[]>([]);
  public get dishIds() { return this._dishIds$$.value; }
  @Input() public set dishIds(value: number[]) { this._dishIds$$.next(value); }
  public readonly dishIds$ = this._dishIds$$.asObservable(); 

  private readonly _dishes$$ = new BehaviorSubject<IDish[]>([]);
  public get dishes() { return this._dishes$$.value; }
  public readonly dishes$ = this.dishIds$.pipe(switchMap(ids => {
    const dishRequests = ids.map(id => this._cookService.getDish(id));
    const dishes$ = combineLatest(dishRequests).pipe(
      map(dishes => this.sortDishes(dishes))
    );
    return dishes$;
  }),
  multicast(() => this._dishes$$),
  refCount());

  sortDishes(dishes: IDish[]){
    const ris = dishes.sort((d1, d2) => d1.productionTime > d2.productionTime ? -1 : d2.productionTime > d1.productionTime ? 0 : 1);
    return ris;
  }

  constructor(
    private readonly _cookService: CooksService
  ) {
    super();
  }

  ngOnInit(): void {
    this.subscribe(this.dishes$);
  }

}
