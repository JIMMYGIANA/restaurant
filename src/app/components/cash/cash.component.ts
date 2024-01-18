import { BehaviorSubject, Observable, combineLatest, map, take, repeatWhen, tap, repeat } from 'rxjs';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CashierService } from 'src/app/services/cashier.service';
import { ITable } from 'src/app/model/tableModel';
import { IReceipt } from 'src/app/model/receiptModel';
import { IOrder } from 'src/app/model/orderModel';
import { IOrderStatistics } from 'src/app/model/statisticsModels/orderStatisticsModel';
import { WebSocketService } from 'src/app/services/webSocket.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-cash',
  templateUrl: './cash.component.html',
  styleUrls: ['./cash.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class CashComponent implements OnInit {

  protected readonly receiptNotification = this.webSocketService.on<IReceipt>('newReceipt').pipe(
    tap(() => console.log("RECEIPT"))
  );

  protected readonly setClientNotification = this.webSocketService.on<any>('setClients').pipe(
    tap(() => console.log("SET_CLIENT"))
  )

  protected readonly newOrderNotification = this.webSocketService.on<IOrder>('newOrder').pipe(
    tap(() => console.log("NEW_ORDER")),
  );

  protected readonly orderPreparingNotification = this.webSocketService.on<IOrder>('orderPreparing').pipe(
    tap(() => console.log("ORDER_PREP"))
  );

  protected readonly orderReadyNotification = this.webSocketService.on<IOrder>('orderReady').pipe(
    tap(() => console.log("ORDER_READY"))
  );

  protected readonly tables: Observable<ITable[]> = this.cashierService.readTables().pipe(
    repeatWhen(()=> this.receiptNotification),
    repeatWhen(() => this.setClientNotification),
    tap(() => console.log('---------------------------'))
  );

  protected readonly orders: Observable<IOrder[]> = this.cashierService.readOrders().pipe(
    repeatWhen(()=> this.newOrderNotification),
    repeatWhen(()=> this.orderPreparingNotification),
    repeatWhen(()=> this.orderReadyNotification),
  );

  protected readonly ordersStatistics: Observable<IOrderStatistics[]> = this.cashierService.readOrdersStatistics().pipe(
    repeatWhen(()=> this.newOrderNotification),
    repeatWhen(()=> this.orderPreparingNotification),
    repeatWhen(()=> this.orderReadyNotification),
  );

  protected readonly receipts: Observable<IReceipt[]> = this.cashierService.readReceipts();

  protected readonly mergedOrders?: Observable<any[]>;

  protected logout(){
    this.userService.logout();
    this.router.navigate(['']);
  }

  constructor(
    private readonly userService: UserService,
    protected readonly router: Router,
    private cashierService: CashierService,
    private webSocketService: WebSocketService,
    private cdr: ChangeDetectorRef
    ){
      this.orders.forEach(t => t.map(order => console.log(order.dishes.length)));
  
      this.mergedOrders = combineLatest([this.orders, this.ordersStatistics]).pipe(
        map(([orders, ordersStatistics]) => {
          return orders.map(order => {
            const correspondingStat = ordersStatistics.find(stat => stat.orderNumber === order.number);
            return { ...order, ...correspondingStat };
          });
        })
      );

      this.mergedOrders.forEach(t => console.log(t));
      
    }

  ngOnDestroy(): void {
    this.webSocketService.disconnect();
  }

  ngOnInit(): void {
    this.webSocketService.connect();

    this.receiptNotification.subscribe((item) => {
      console.log(item)
    });
    this.newOrderNotification.subscribe();
    this.orderPreparingNotification.subscribe();
    this.orderReadyNotification.subscribe();
    this.setClientNotification.subscribe(() => {
      console.log("Set clients")
    });
  }

  createReceipt(tableNumber: number): void {

    this.cashierService.createReceipt(tableNumber).pipe(
      //tap(() => this.webSocketService.notifyOrderCreated()),
      take(1),
    ).subscribe((response: any) => {
      this.webSocketService.notifyReceiptCreated(response.data, tableNumber);
    });

    this.cdr.detectChanges();

  }

}
