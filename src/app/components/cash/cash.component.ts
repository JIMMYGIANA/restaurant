import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, repeatWhen, take, tap } from 'rxjs';
import { IOrder } from 'src/app/model/orderModel';
import { IReceipt } from 'src/app/model/receiptModel';
import { IOrderStatistics } from 'src/app/model/statisticsModels/orderStatisticsModel';
import { ITable } from 'src/app/model/tableModel';
import { IUser, UserRole } from 'src/app/model/userModel';
import { CashierService } from 'src/app/services/cashier.service';
import { UserService } from 'src/app/services/user.service';
import { WebSocketService } from 'src/app/services/webSocket.service';
import { ReceiptComponent } from './receipt/receipt.component';
import { UserStatsComponent } from './user-stats/user-stats.component';


@Component({
  selector: 'app-cash',
  templateUrl: './cash.component.html',
  styleUrls: ['./cash.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class CashComponent implements OnInit {

  protected panelOpenState = false;

  protected readonly receiptNotification$$ = new BehaviorSubject<number>(0);

  protected readonly setClientNotification = this.webSocketService.on<any>('setClients');

  protected readonly newOrderNotification = this.webSocketService.on<IOrder>('newOrder').pipe(
    tap(() => console.log("NEW_ORDER")),
  );

  protected readonly orderPreparingNotification = this.webSocketService.on<IOrder>('orderPreparing').pipe(
    tap(() => console.log("ORDER_PREP"))
  );

  protected readonly orderReadyNotification = this.webSocketService.on<IOrder>('orderReady').pipe(
    tap(() => console.log("ORDER_READY"))
  );

  protected readonly orderServedNotification = this.webSocketService.on<IOrder>('orderServed').pipe(
    tap(() => console.log("ORDER_SERVED"))
  );

  protected readonly tables$: Observable<ITable[]> = this.cashierService.readTables().pipe(
    repeatWhen(() => this.receiptNotification$$),
    repeatWhen(() => this.setClientNotification),
    tap(() => console.log('---------------------------'))
  );

  protected readonly orders$: Observable<IOrder[]> = this.cashierService.readOrders().pipe(
    repeatWhen(() => this.newOrderNotification),
    repeatWhen(() => this.orderPreparingNotification),
    repeatWhen(() => this.orderReadyNotification),
  );

  protected readonly ordersStatistics: Observable<IOrderStatistics[]> = this.cashierService.readOrdersStatistics().pipe(
    repeatWhen(() => this.newOrderNotification),
    repeatWhen(() => this.orderPreparingNotification),
    repeatWhen(() => this.orderReadyNotification),
  );

  protected readonly receipts$: Observable<IReceipt[]> = this.cashierService.readReceipts();

  protected readonly users$: Observable<IUser[]> = this.cashierService.readUsers();

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
    private dialog: MatDialog
  ) {
  }

  ngOnDestroy(): void {
    this.webSocketService.disconnect();
  }

  ngOnInit(): void {
    this.webSocketService.connect();

    this.receiptNotification$$.subscribe((item) => {
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

  viewUserStats(userEmail: string, userRole: UserRole): void {
    this.dialog.open(UserStatsComponent, {
      width: '90%',
      height: '90vh',
      data: {
        userEmail: userEmail,
        userRole: userRole
      }
    })
  }

}
