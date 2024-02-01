import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject, Observable, filter, map, of, take, tap } from 'rxjs';
import { IOrder } from 'src/app/model/orderModel';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { WaitersService } from 'src/app/services/waiters.service';
import { WebSocketService } from 'src/app/services/webSocket.service';


@Component({
  selector: 'app-order-table',
  templateUrl: './order-table.component.html',
  styleUrl: './order-table.component.css',
  changeDetection: ChangeDetectionStrategy.Default
})
export class OrderTableComponent {

  protected readonly ordersTable$$: BehaviorSubject<IOrder[]>;

  protected readonly tableNumber$$ = new BehaviorSubject<number>(0);
  

  constructor(
    private dialogRef: MatDialogRef<OrderTableComponent>,
    private restaurantService: RestaurantService,
    private waitersService: WaitersService,
    protected webSocketService: WebSocketService, 
    @Inject(MAT_DIALOG_DATA) public data: { tableNumber: number }
  ) {
    console.log('Numero del tavolo:', data.tableNumber);
    this.ordersTable$$ = new BehaviorSubject<IOrder[]>([]);

    this.waitersService.readOrdersTable(data.tableNumber).pipe(
      map(orders => orders.filter((o) => o.orderServed == null && o.orderPayed == null)),
      tap(orders => this.ordersTable$$.next(orders))
    ).subscribe();

    this.tableNumber$$.next(data.tableNumber);
  }

  serveOrder(orderNumber: number, orderTable: number) {
    this.waitersService.serveOrder({
      number: orderNumber,
      table: orderTable
    }).pipe(take(1)).subscribe(() => {
      this.webSocketService.notifyOrderServed(orderNumber, orderTable);

      this.waitersService.readOrdersTable(this.tableNumber$$.value).pipe(
        map(orders => orders.filter((o) => o.orderServed == null)),
        tap(orders => this.ordersTable$$.next(orders))
      );

      this.closeDialog();
    });
}

  closeDialog(): void {
    this.dialogRef.close();
  }
}
