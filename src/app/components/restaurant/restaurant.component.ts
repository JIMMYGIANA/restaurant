import { UserService } from 'src/app/services/user.service';

import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, repeat, repeatWhen, switchMap, tap } from 'rxjs';
import { ITable } from 'src/app/model/tableModel';
import { WaitersService } from 'src/app/services/waiters.service';
import { WebSocketService } from 'src/app/services/webSocket.service';
import { IOrder } from 'src/app/model/orderModel';
import { IReceipt } from 'src/app/model/receiptModel';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RestaurantComponent implements OnInit, OnDestroy {

  protected readonly restaurantName: string = 'Jimmy\'s reastaurant';

  protected readonly tables: Observable<ITable[]> = this.waitersService.readTables().pipe(
    repeatWhen(() => this.notification)
  );

  protected readonly notification = this.webSocketService.on<IReceipt>('newReceipt');

  protected readonly notificationOrderReady = this.webSocketService.on<IOrder>('orderReady').pipe(
    tap((order: any) => alert('Order '+order.data.orderNumber+'\nTable '+order.data.tableNumber+'\n'+ order.data.typeOrder+' ready!' ))
  );
 
  protected logout(){
    this.userService.logout();
    this.router.navigate(['']);
  }

  protected orders(){
    this.router.navigate(['/orders']);
  }

  constructor(
    protected readonly router: Router,
    private userService: UserService,
    private waitersService: WaitersService,
    private webSocketService: WebSocketService
    ){
      this.tables.forEach(t => console.log(t));
  }


  ngOnInit(): void {
    this.webSocketService.connect();

    this.notification.subscribe(() => {
      // Handle the new order, maybe update your orders list
      console.log('Receipt:');
    });
    
    this.notificationOrderReady.subscribe(() => {
      console.log('Order Ready');
    });

    this.webSocketService.on<IOrder>('newOrder').subscribe(() => {
      // Handle the new order, maybe update your orders list
      console.log('New Order Arrived:');
    });

    

  }

  ngOnDestroy(): void {
    this.webSocketService.disconnect();
  }


}


