import { CdkTableDataSourceInput } from '@angular/cdk/table';
import { Component } from '@angular/core';
import { Observable, forkJoin, map, of, switchMap, take } from 'rxjs';
import { IDish } from 'src/app/model/dishModel';
import { IOrder } from 'src/app/model/orderModel';
import { CooksService } from 'src/app/services/cooks.service';
import { RestaurantService } from 'src/app/services/restaurant.service';


export interface PeriodicElement {
  name: string;
  orderNumber: number;
  weight: number;
  symbol: string;
}

// const ELEMENT_DATA: PeriodicElement[] = [
//   {orderNumber: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
//   {orderNumber: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
//   {orderNumber: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
//   {orderNumber: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
//   {orderNumber: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
//   {orderNumber: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
//   {orderNumber: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
//   {orderNumber: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
//   {orderNumber: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
//   {orderNumber: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
// ];

@Component({
  selector: 'app-kitchen',
  templateUrl: './kitchen.component.html',
  styleUrls: ['./kitchen.component.css']
})
export class KitchenComponent {

  protected readonly orders: Observable<IOrder[]> = this.cooksService.readOrders();

  displayedColumns: string[] = ['order', 'dishName'];

  // dataSource = this.orders.pipe(
  //   map(orders => {
  //     const result: any[] = [];
  //     if (orders) {
  //       orders.forEach(o => {
  //         if (o.dishes) {
  //           o.dishes.forEach(dish => {
  //             result.push({
  //               order: o.number,
  //               dishName: this.cooksService.getDish(dish).pipe(take(1)).subscribe()
  //             })
  //           })
  //         }
  //       })
  //     }

  //     return result;
  //   }
  //   )
  // );

  dataSource$: Observable<{ order: number; dishName: string }[]> = this.orders.pipe(
    switchMap((orders: IOrder[] | null) => {
      if (!orders) {
        return of([]); // Provide a default value (empty array) if orders is null
      }

      const dishObservables: Observable<IDish>[] = orders.reduce((acc: Observable<IDish>[], o: IOrder) => {
        if (o.dishes) {
          const dishObservablesForOrder = o.dishes.map(dish => {
            return this.cooksService.getDish(dish);
          });
          return [...acc, ...dishObservablesForOrder];
        } else {
          return acc;
        }
      }, []);

      return forkJoin(dishObservables).pipe(
        map((dishes: IDish[]) => {
          const result: any[] = [];

          orders.forEach((o, orderIndex) => {
            if (o.dishes) {
              o.dishes.forEach((dish, dishIndex) => {
                result.push({
                  order: o.number,
                  dishName: dishes[orderIndex * o.dishes.length + dishIndex].name,
                });
              });
            }
          });

          return result;
        })
      );
    })
  );

  constructor(
    private restaurantService: RestaurantService,
    private cooksService: CooksService
  ) {
    // this.dataSource = this.orders.pipe(
    //   map(orders => orders
    //     .map(order => order.dishes
    //       .map(dish => ({
    //         orderNumber: order.number,
    //         dishName: cooksService.getDish(dish).pipe(
    //           map(dish => dish.name)
    //         )
    //       }))
    //     )
    //   ) 
    // );
  }
}
