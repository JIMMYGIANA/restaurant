
import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, take, tap } from 'rxjs';
import { IDish } from 'src/app/model/dishModel';
import { IDrink } from 'src/app/model/drinkModel';
import { IOrder } from 'src/app/model/orderModel';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { WaitersService } from 'src/app/services/waiters.service';
import { WebSocketService } from 'src/app/services/webSocket.service';

@Component({
  selector: 'app-order-menu',
  templateUrl: './order-menu.component.html',
  styleUrls: ['./order-menu.component.css']
})
export class OrderMenuComponent {
  
  protected readonly dishes: Observable<IDish[]> = this.restaurantService.readDishes();
  protected readonly drinks: Observable<IDrink[]> = this.restaurantService.readDrinks();

  private order!: any;

  // Your component logic goes here
  constructor(
    private dialogRef: MatDialogRef<OrderMenuComponent>,
    private restaurantService: RestaurantService,
    private waitersService: WaitersService,
    @Inject(MAT_DIALOG_DATA) public data: { tableNumber: number, tableClients: number},
    private webSocketService: WebSocketService
    ) {
      console.log('Numero del tavolo:', data.tableNumber);
      this.order = {
        table: this.data.tableNumber,
        dishes: [],
        drinks: []
      };

    }

  closeDialog(): void {
    this.dialogRef.close();
  }

  onPlateNumberChange(data: { plateCount: number, plateNumber: number }) {
    // Gestisci il valore ricevuto dal componente figlio
    console.log('Nuovo valore di plateNumber nel componente padre:', data.plateCount);
    
    for (let i = 0; i < data.plateCount; i++) {
      this.order.dishes.push(data.plateNumber);
    }
  }

  createOrder(){
    if(this.order.table > 0){
      this.waitersService.createOrder(this.order).pipe(
        take(1),
      ).subscribe((response: any) => {
        this.webSocketService.notifyOrderCreated(response.data, this.data.tableNumber);
      });
      const orderStat = {
        orderNumber: this.order.number,
        tableNumber: this.data.tableNumber,
        dishes: this.order.dishes.lenght,
        drinks: this.order.drinks.lenght,
        clients: this.data.tableClients
      };
      this.waitersService.createOrderStatistics(orderStat).pipe(take(1)).subscribe();

      this.closeDialog();
    } else alert('Error creating order')
  }

}
