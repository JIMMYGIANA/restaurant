import { BehaviorSubject, Observable, combineLatest, map, take, repeatWhen, tap, repeat, filter, defer } from 'rxjs';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CashierService } from 'src/app/services/cashier.service';
import { ITable } from 'src/app/model/tableModel';
import { IReceipt } from 'src/app/model/receiptModel';
import { IOrder } from 'src/app/model/orderModel';
import { IOrderStatistics } from 'src/app/model/statisticsModels/orderStatisticsModel';
import { WebSocketService } from 'src/app/services/webSocket.service';
import { UserService } from 'src/app/services/user.service';
import { ReceiptComponent } from './receipt/receipt.component';
import { MatDialog } from '@angular/material/dialog';
import { IUser, UserRole } from 'src/app/model/userModel';
import { UserStatsComponent } from './user-stats/user-stats.component';
import { UserCrudComponent } from './user-crud/user-crud.component';
import { TableCrudComponent } from './table-crud/table-crud.component';
import { DishCrudComponent } from './dish-crud/dish-crud.component';
import { DrinkCrudComponent } from './drink-crud/drink-crud.component';


@Component({
  selector: 'app-cash',
  templateUrl: './cash.component.html',
  styleUrls: ['./cash.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class CashComponent implements OnInit {

  protected panelOpenState = false;

  protected UserRole = UserRole;

  protected readonly userNotification$$ = new BehaviorSubject<number>(0);

  protected readonly tableNotification$$ = new BehaviorSubject<number>(0);

  protected readonly receiptNotification$$ = new BehaviorSubject<number>(0);

  protected readonly setClientNotification: Observable<any> = this.webSocketService.on<any>('setClients').pipe(
    tap(() => console.log("SET_CLIENTS"))
  );

  protected readonly newOrderNotification = this.webSocketService.on<IOrder>('newOrder').pipe(
    tap(() => console.log("NEW_ORDER")),
  );

  protected readonly orderReadyNotification = this.webSocketService.on<IOrder>('orderReady').pipe(
    tap(() => console.log("ORDER_READY"))
  );

  protected readonly orderServedNotification = this.webSocketService.on<IOrder>('orderServed').pipe(
    tap(() => console.log("ORDER_SERVED"))
  );

  protected readonly tables$: Observable<ITable[]> = defer(() => this.cashierService.readTables()).pipe(
    repeatWhen(() => this.newOrderNotification),
    repeatWhen(() => this.setClientNotification),
    repeatWhen(() => this.orderReadyNotification),
    repeatWhen(() => this.tableNotification$$),
    repeatWhen(() => this.receiptNotification$$)
  );

  protected readonly orders: Observable<IOrder[]> = defer(() => this.cashierService.readOrders()).pipe(
    repeatWhen(() => this.newOrderNotification),
    repeatWhen(() => this.orderReadyNotification),
  );

  protected readonly ordersStatistics: Observable<IOrderStatistics[]> = defer(() => this.cashierService.readOrdersStatistics()).pipe(
    repeatWhen(() => this.newOrderNotification),
    repeatWhen(() => this.orderReadyNotification),
  );

  protected readonly receipts$: Observable<IReceipt[]> = defer(() => this.cashierService.readReceipts()).pipe(
    repeatWhen(() => this.receiptNotification$$)
  );

  protected readonly users$: Observable<IUser[]> = defer(() => this.cashierService.readUsers()).pipe(
    repeatWhen(() => this.userNotification$$)
  );

  protected logout() {
    this.userService.logout();
    this.router.navigate(['']);
  }

  constructor(
    private readonly userService: UserService,
    protected readonly router: Router,
    private cashierService: CashierService,
    private webSocketService: WebSocketService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
  ) {
    this.orders.forEach(t => t.map(order => console.log(order.dishes.length)));
  }

  ngOnDestroy(): void {
    this.webSocketService.disconnect();
  }

  ngOnInit(): void {
    this.webSocketService.connect();

    this.newOrderNotification.subscribe();
    this.orderReadyNotification.subscribe();
    this.setClientNotification.subscribe();
  }

  createReceipt(tableNumber: number): void {

    this.cashierService.createReceipt(tableNumber).pipe(
      //tap(() => this.webSocketService.notifyOrderCreated()),
      take(1),
    ).subscribe((response: any) => {
      this.webSocketService.notifyReceiptCreated(response.data, tableNumber);
      this.receiptNotification$$.next(0);
      this.viewReceiptDetails(response.data);
    });

    this.cdr.detectChanges();

  }

  viewReceiptDetails(receiptNumber: number): void { 
    this.dialog.open(ReceiptComponent, {
      width: '90%',  
      height: '90vh',
      data: { 
        receiptNumber: receiptNumber
      }
    })
  }

  viewUserStats(userEmail: string, userRole: UserRole) : void {
    this.dialog.open(UserStatsComponent, {
      width: '90%',  
      height: '90vh',
      data: { 
        userEmail: userEmail,
        userRole: userRole
      }
    })
  }

  viewUserCreate() : void {
    const dialogRef = this.dialog.open(UserCrudComponent, {
      width: '90%',  
      height: '90vh'
    });

    dialogRef.afterClosed().subscribe(result => {
      // 'result' contains the data passed when the dialog is closed
      console.log('Dialog closed with result:', result);
  
      this.userNotification$$.next(0);
      // Add your logic here to handle the result or perform any other actions
    });
  }

  viewTableCreate() : void {
    const dialogRef = this.dialog.open(TableCrudComponent, {
      width: '90%',  
      height: '90vh'
    });

    dialogRef.afterClosed().subscribe(result => {
      // 'result' contains the data passed when the dialog is closed
      console.log('Dialog closed with result:', result);
  
      this.tableNotification$$.next(0);
      // Add your logic here to handle the result or perform any other actions
    });
  }

  navigateToMenu(): void {
    // Navigate to the 'menu' route with data as a route parameter
    this.router.navigate(['/menu', { userRole: UserRole.Cashier }]);
  }

 

}
