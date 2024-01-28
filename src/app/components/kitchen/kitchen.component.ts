import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, combineLatest, defer, map, switchMap, take } from 'rxjs';
import { distinctUntilChanged, shareReplay, takeUntil, tap } from 'rxjs/operators';
import { IOrder } from 'src/app/model/orderModel';
import { CooksService } from 'src/app/services/cooks.service';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { UserService } from 'src/app/services/user.service';
import { WebSocketService } from 'src/app/services/webSocket.service';
import { ReactiveComponent } from '../reactive.component';

@Component({
  selector: 'app-kitchen',
  templateUrl: './kitchen.component.html',
  styleUrls: ['./kitchen.component.css'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class KitchenComponent extends ReactiveComponent implements OnInit, OnDestroy {

  protected readonly orders$$ = new BehaviorSubject<IOrder[]>([]);
  protected readonly orders$ = defer(() => {
    return this._cooksService.readOrders();
  }).pipe(
    map(orders => orders.filter(order => order.orderPreparedCook == null)),
    shareReplay(1)
  );

  protected readonly tableNumber$: Observable<number> = this._cooksService.tableNumber().pipe(distinctUntilChanged(), shareReplay(1));

  protected readonly ordersGrouped$: Observable<{ key: string, items: IOrder[] }[]> = combineLatest([this.orders$$, this.tableNumber$])
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

  protected takeOrder(orderNumber: number, orderTable: number) {
    this._cooksService.takeOrder({
      number: orderNumber,
      table: orderTable
    }).pipe(take(1)).subscribe(() => {
      this._webSocketService.notifyOrderPreparing(orderNumber, orderTable);


      this._cooksService.readOrders().pipe(
        map(orders => orders.filter(order => order.orderPreparedCook == null)),
        shareReplay(1),
        tap(orders => this.orders$$.next(orders))
      ).subscribe();
    });
  }

  protected completeOrder(orderNumber: number, orderTable: number) {
    this._cooksService.completeOrder({
      number: orderNumber,
      table: orderTable
    }).pipe(take(1)).subscribe(() => {

      this._webSocketService.notifyOrderReady(orderNumber, orderTable, 'Dishes');

      this._cooksService.readOrders().pipe(
        map(orders => orders.filter(order => order.orderPreparedCook == null)),
        shareReplay(1),
        tap(orders => this.orders$$.next(orders))
      ).subscribe();
    });

    this._cooksService.orderDishesPreparation({
      orderNumber: orderNumber,
      tableNumber: orderTable
    }).pipe(take(1)).subscribe();
  }

  protected logout() {
    this._userService.logout();
    this.router.navigate(['']);
  }

  constructor(
    protected readonly router: Router,
    private readonly _userService: UserService,
    private readonly _restaurantService: RestaurantService,
    private readonly _cooksService: CooksService,
    private readonly _webSocketService: WebSocketService,
    private readonly _cdr: ChangeDetectorRef
  ) {
    super();
  }

  public ngOnInit(): void {

    // Subscribe to WebSocket events
    this._webSocketService
      .on<IOrder>('newOrder')
      .pipe(
        switchMap((orderData: any) => {
          return this._cooksService.readOrder(orderData.data.orderNumber, orderData.data.tableNumber);
        }))
      .subscribe(newOrder => {
        console.log('NEW ORDER ----- ' + newOrder);
        this.orders$$.next([newOrder, ...this.orders$$.value]);
        this._cdr.markForCheck();
      });

    this._webSocketService.on<IOrder>('orderPreparing').subscribe(() => {
      // Handle the new order, maybe update your orders list
      console.log('Dishes prepering');
    });

    this._webSocketService.on<IOrder>('orderReady').subscribe(() => {
      // Handle the new order, maybe update your orders list
      console.log('Dishes completed');
    });

    this.orders$.subscribe(orders => this.orders$$.next(orders));

    this._webSocketService.connect();
  }

  public override ngOnDestroy(): void {
    super.ngOnDestroy();
    this._webSocketService.disconnect();
  }
}
