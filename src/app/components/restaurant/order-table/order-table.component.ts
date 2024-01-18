import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, filter, map, of } from 'rxjs';
import { IOrder } from 'src/app/model/orderModel';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { WaitersService } from 'src/app/services/waiters.service';


@Component({
  selector: 'app-order-table',
  templateUrl: './order-table.component.html',
  styleUrl: './order-table.component.css'
})
export class OrderTableComponent {

  protected readonly ordersTable$!: Observable<IOrder[]>;

  protected readonly tableNumber$!: Observable<number>;

  constructor(
    private dialogRef: MatDialogRef<OrderTableComponent>,
    private restaurantService: RestaurantService,
    private waitersService: WaitersService,
    @Inject(MAT_DIALOG_DATA) public data: { tableNumber: number }
  ) {
    console.log('Numero del tavolo:', data.tableNumber);
    this.ordersTable$ = this.waitersService.readOrders().pipe(
      map(orders => orders.filter((o) => o.orderServed == null))
    );
    this.tableNumber$ = of(data.tableNumber);

  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
