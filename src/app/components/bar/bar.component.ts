import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { tap, switchMap, BehaviorSubject, Observable, Subject, combineLatest, distinctUntilChanged, map, shareReplay, take, takeUntil } from 'rxjs';
import { IOrder } from 'src/app/model/orderModel';
import { BarsService } from 'src/app/services/bars.service';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { UserService } from 'src/app/services/user.service';
import { WebSocketService } from 'src/app/services/webSocket.service';

@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.css'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class BarComponent implements OnInit, OnDestroy {

  private readonly onDestroy$ = new Subject<void>();

  protected orders$: Observable<IOrder[]> = this.barsService.readOrders().pipe(
    map(orders => orders.filter(order => order.orderPreparedDrink == null)),
    shareReplay(1)
  );

  protected readonly orders$$ = new BehaviorSubject<IOrder[]>([]);

  protected readonly tableNumber$: Observable<number> = this.barsService.tableNumber().pipe(distinctUntilChanged(), shareReplay(1));

  protected readonly ordersGrouped$: Observable<{ key: string, items: IOrder[] }[]> = combineLatest([this.orders$, this.tableNumber$])
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
    this.barsService.takeOrder({
      number: orderNumber,
      table: orderTable
    }).pipe(take(1)).subscribe(() => {
      this.barsService.readOrders().pipe(
        map(orders => orders.filter(order => order.orderPreparedDrink == null)),
        shareReplay(1),
        tap(orders => this.orders$$.next(orders))
      ).subscribe();
    });

    
  }

  protected completeOrder(orderNumber: number, orderTable: number){
    this.barsService.completeOrder({
      number: orderNumber,
      table: orderTable
    }).pipe(take(1)).subscribe(() => {
      this.webSocketService.notifyOrderReady(orderNumber, orderTable, 'Drinks');
    
    this.barsService.readOrders().pipe(
      map(orders => orders.filter(order => order.orderPreparedDrink == null)),
      shareReplay(1),
      tap(orders => this.orders$$.next(orders))
    ).subscribe();
    });

    this.barsService.orderDrinksPreparation({
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
    private barsService: BarsService,
    private webSocketService: WebSocketService,
    private cdr: ChangeDetectorRef
  ) {
    this.cdr.markForCheck();

    
  }

  ngOnInit(): void {
    this.webSocketService.connect();

    this.orders$.pipe(
      tap(orders => this.orders$$.next(orders))
    ).subscribe();
  
    // Subscribe to WebSocket events
    this.webSocketService.on<IOrder>('newOrder').pipe(
      switchMap((orderData: any) => this.barsService.readOrder(orderData.data.orderNumber, orderData.data.tableNumber))
    ).subscribe(newOrder => {
      console.log('NEW ORDER ----- '+newOrder)
      this.orders$$.next([...this.orders$$.value, newOrder]);
      this.cdr.markForCheck();
    });

    this.webSocketService.on<IOrder>('orderPreparing').subscribe(() => {
      // Handle the new order, maybe update your orders list
      console.log('Drinks preparing');
    });

    this.webSocketService.on<IOrder>('orderReady').subscribe(() => {
      // Handle the new order, maybe update your orders list
      console.log('Drinks completed');
    });
  }

  ngOnDestroy(): void {
    this.webSocketService.disconnect();
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
