import { CdkTableDataSourceInput } from '@angular/cdk/table';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subject, combineLatest, forkJoin, from, map, of, switchMap, take } from 'rxjs';
import { IDish } from 'src/app/model/dishModel';
import { IOrder } from 'src/app/model/orderModel';
import { CooksService } from 'src/app/services/cooks.service';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { distinctUntilChanged, filter, groupBy, mergeMap, shareReplay, takeUntil, tap, toArray } from 'rxjs/operators';
import { IDrink } from 'src/app/model/drinkModel';
import { WebSocketService } from 'src/app/services/webSocket.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';




@Component({
  selector: 'app-kitchen',
  templateUrl: './kitchen.component.html',
  styleUrls: ['./kitchen.component.css'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class KitchenComponent implements OnInit, OnDestroy {

  private readonly onDestroy$ = new Subject<void>();

  protected orders$: Observable<IOrder[]> = this.cooksService.readOrders().pipe(
    map(orders => orders.filter(order => order.orderPreparedCook == null)),
    shareReplay(1)
  );

  protected readonly orders$$ = new BehaviorSubject<IOrder[]>([]);

  protected readonly tableNumber: Observable<number> = this.cooksService.tableNumber().pipe(distinctUntilChanged(), shareReplay(1));

  protected readonly ordersGrouped$: Observable<{ key: string, items: IOrder[] }[]> = combineLatest([this.orders$$, this.tableNumber])
  .pipe(
    takeUntil(this.onDestroy$),
    map(([orders, tableNumber]) => {
      const groupedOrders: Record<string, IOrder[]> = orders.reduce((acc: Record<string, IOrder[]>, order) => {
        const key = order.table.toString();
        acc[key] = (acc[key] || []).concat(order);
        return acc;
      }, {});

      return Object.entries(groupedOrders).map(([key, items]) => ({ key, items }));
    })
  );

  protected takeOrder(orderNumber: number, orderTable: number){
    this.cooksService.takeOrder({
      number: orderNumber,
      table: orderTable
    }).pipe(take(1)).subscribe();
  }

  protected completeOrder(orderNumber: number, orderTable: number){
    this.cooksService.completeOrder({
      number: orderNumber,
      table: orderTable
    }).pipe(take(1)).subscribe();
    this.cooksService.orderDishesPreparation({
      orderNumber: orderNumber,
      tableNumber: orderTable
    }).pipe(take(1)).subscribe();
  }

  protected logout(){
    this.userService.logout();
    this.router.navigate(['']);
  }

  constructor(
    protected readonly router: Router,
    private userService: UserService,
    private restaurantService: RestaurantService,
    private cooksService: CooksService,
    private webSocketService: WebSocketService,
    private cdr: ChangeDetectorRef
  ) {
    this.cdr.markForCheck();
  }
  
  ngOnInit(): void {
    this.webSocketService.connect();

    // Subscribe to WebSocket events
    this.webSocketService.on<IOrder>('newOrder').pipe(
      switchMap((orderData: any) => this.cooksService.readOrder(orderData.data.orderNumber, orderData.data.tableNumber))
    ).subscribe(newOrder => {
      console.log('NEW ORDER ----- '+newOrder);
      this.orders$$.next([newOrder, ...this.orders$$.value]);
      this.cdr.markForCheck();
    });

    this.orders$.pipe(
      tap(orders => this.orders$$.next(orders))
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.webSocketService.disconnect();
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
