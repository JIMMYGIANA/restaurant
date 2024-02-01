import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { tap, switchMap, BehaviorSubject, Observable, Subject, combineLatest, distinctUntilChanged, map, shareReplay, take, takeUntil, defer } from 'rxjs';
import { IOrder } from 'src/app/model/orderModel';
import { BarsService } from 'src/app/services/bars.service';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { UserService } from 'src/app/services/user.service';
import { WebSocketService } from 'src/app/services/webSocket.service';
import { ReactiveComponent } from '../reactive.component';

@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.css'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class BarComponent extends ReactiveComponent implements OnInit, OnDestroy {

  protected readonly orders$$ = new BehaviorSubject<IOrder[]>([]);
  protected readonly orders$ = defer(() => {
    return this._barsService.readOrders();
  }).pipe(
    map(orders => orders.filter(order => order.orderPreparedDrink == null)),
    shareReplay(1)
  );

  protected readonly tableNumber$: Observable<number> = this._barsService.tableNumber().pipe(distinctUntilChanged(), shareReplay(1));

  protected readonly ordersGrouped$: Observable<{ key: string, items: IOrder[] }[]> = combineLatest([this.orders$, this.tableNumber$])
  .pipe(
    takeUntil(this.destroyed$),
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
    this._barsService.takeOrder({
      number: orderNumber,
      table: orderTable
    }).pipe(take(1)).subscribe(() => {
      this._barsService.readOrders().pipe(
        map(orders => orders.filter(order => order.orderPreparedDrink == null)),
        shareReplay(1),
        tap(orders => this.orders$$.next(orders))
      ).subscribe();
    });
  }

  protected completeOrder(orderNumber: number, orderTable: number){
    this._barsService.completeOrder({
      number: orderNumber,
      table: orderTable
    }).pipe(take(1)).subscribe(() => {
      
      this._webSocketService.notifyOrderReady(orderNumber, orderTable, 'Drinks');
    
      this._barsService.readOrders().pipe(
        map(orders => orders.filter(order => order.orderPreparedDrink == null)),
        shareReplay(1),
        tap(orders => this.orders$$.next(orders))
      ).subscribe();
    });

    this._barsService.orderDrinksPreparation({
      orderNumber: orderNumber,
      tableNumber: orderTable
    }).pipe(take(1)).subscribe();
  }

  protected logout(){
    this._userService.logout();
    this.router.navigate(['']);
  }

  constructor(
    protected readonly router: Router,
    private _userService: UserService,
    private _restaurantService: RestaurantService,
    private _barsService: BarsService,
    private _webSocketService: WebSocketService,
    private _cdr: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit(): void {
  
    // Subscribe to WebSocket events
    this._webSocketService.
      on<IOrder>('newOrder')
      .pipe(
        switchMap((orderData: any) => {
          return this._barsService.readOrder(orderData.data.orderNumber, orderData.data.tableNumber);
        }))
    .subscribe(newOrder => {
      console.log('NEW ORDER ----- '+newOrder)
      this.orders$$.next([...this.orders$$.value, newOrder]);
      this._cdr.markForCheck();
    });

    this._webSocketService.on<IOrder>('orderPreparing').subscribe(() => {
      // Handle the new order, maybe update your orders list
      console.log('Drinks preparing');
    });

    this._webSocketService.on<IOrder>('orderReady').subscribe(() => {
      // Handle the new order, maybe update your orders list
      console.log('Drinks completed');
    });

    this.orders$.subscribe(orders => this.orders$$.next(orders));

    this._webSocketService.connect();

  }

  public override ngOnDestroy(): void {
    super.ngOnDestroy();
    this._webSocketService.disconnect();
  }
}
