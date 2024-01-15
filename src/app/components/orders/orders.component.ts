import { Component } from '@angular/core';
import { Observable, filter, map, take } from 'rxjs';
import { IOrder } from 'src/app/model/orderModel';
import { WaitersService } from 'src/app/services/waiters.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent {

  protected readonly orders: Observable<IOrder[]> = this.waitersService.getOrders().pipe(
    map(orders => 
      orders.filter(order => 
        order.orderPreparedCook != null && order.orderServed == null
    ))
  );

  protected serve(orderNumber: number, orderTable: number){
    this.waitersService.serveOrder({
      number: orderNumber,
      table: orderTable
    }).pipe(take(1)).subscribe();
  }

  constructor(
    private waitersService: WaitersService
    ){
  }

}
