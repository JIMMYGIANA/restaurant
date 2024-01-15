import { Observable, combineLatest, map, take } from 'rxjs';
import { Component, OnInit } from '@angular/core';
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
  styleUrls: ['./cash.component.css']
})
export class CashComponent implements OnInit {

  protected readonly tables: Observable<ITable[]> = this.cashierService.readTables();

  protected readonly orders: Observable<IOrder[]> = this.cashierService.readOrders();

  protected readonly ordersStatistics: Observable<IOrderStatistics[]> = this.cashierService.readOrdersStatistics();

  protected readonly receipts: Observable<IReceipt[]> = this.cashierService.readReceipts();

  protected mergedOrders?: Observable<any[]>;

  protected logout(){
    this.userService.logout();
    this.router.navigate(['']);
  }

  constructor(
    private readonly userService: UserService,
    protected readonly router: Router,
    private cashierService: CashierService,
    private webSocketService: WebSocketService
    ){
      this.orders.forEach(t => t.map(order => console.log(order.dishes.length)));
  
      this.webSocketService.on<IReceipt>('newReceipt').subscribe(() => {
        // Handle the new order, maybe update your orders list
        console.log('New Order Arrived:');
        });
    }

  ngOnDestroy(): void {
    this.webSocketService.disconnect();
  }

  ngOnInit(): void {
    this.webSocketService.connect();

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

  createReceipt(tableNumber: number): void {

    this.cashierService.createReceipt(tableNumber).pipe(
      //tap(() => this.webSocketService.notifyOrderCreated()),
      take(1),
    ).subscribe((response: any) => {
      this.webSocketService.notifyReceiptCreated(response.data, tableNumber)
    });
  }

}
