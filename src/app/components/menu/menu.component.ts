import { DishType } from './../../model/dishModel';
import { Component, Input, OnInit } from '@angular/core';
import { RestaurantComponent } from '../restaurant/restaurant.component';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { BehaviorSubject, Observable, defer, repeatWhen } from 'rxjs';
import { IDish } from 'src/app/model/dishModel';
import { DrinkType, IDrink } from 'src/app/model/drinkModel';
import { UserRole } from 'src/app/model/userModel';
import { MatDialog } from '@angular/material/dialog';
import { DishCrudComponent } from '../cash/dish-crud/dish-crud.component';
import { DrinkCrudComponent } from '../cash/drink-crud/drink-crud.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {

  UserRole = UserRole;

  DishType = DishType;

  protected readonly dishNotification$$ = new BehaviorSubject<number>(0);

  protected readonly drinkNotification$$ = new BehaviorSubject<number>(0);

  protected readonly dishes$: Observable<IDish[]> = defer(() => this.restaurantService.readDishes()).pipe(
    repeatWhen(() => this.dishNotification$$)
  );

  protected readonly drinks$: Observable<IDrink[]> = defer(() => this.restaurantService.readDrinks()).pipe(
    repeatWhen(() => this.drinkNotification$$)
  );

  protected userRole: UserRole | undefined;

  constructor(
    private readonly restaurantService: RestaurantService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    protected readonly router: Router,
  ){
    this.userRole = undefined;
  }

  ngOnInit(): void {
    // Access the data parameter from the route
    this.route.paramMap.subscribe(params => {
      if(params.get('userRole') != null){
        this.userRole = +params.get('userRole')!;
      }
      console.log(this.userRole);
      // Do something with the data
    });
  }

  viewDishCreate() : void {
    const dialogRef = this.dialog.open(DishCrudComponent, {
      width: '90%',  
      height: '90vh'
    });

    dialogRef.afterClosed().subscribe(result => {
      // 'result' contains the data passed when the dialog is closed
      console.log('Dialog closed with result:', result);
  
      this.dishNotification$$.next(0);
      // Add your logic here to handle the result or perform any other actions
    });
  }

  viewDrinkCreate() : void {
    const dialogRef = this.dialog.open(DrinkCrudComponent, {
      width: '90%',  
      height: '90vh'
    });

    dialogRef.afterClosed().subscribe(result => {
      // 'result' contains the data passed when the dialog is closed
      console.log('Dialog closed with result:', result);
  
      this.drinkNotification$$.next(0);
      // Add your logic here to handle the result or perform any other actions
    });
  }

  getDishTypeString(typeNumber: number): string {
    switch (typeNumber) {
      case DishType.Appetizers:
        return 'Appetizers';
      case DishType.FirstPlate:
        return 'First Plate';
      case DishType.SecondPlate:
        return 'Second Plate';
      case DishType.SidePlate:
        return 'Side Plate';
      case DishType.Dessert:
        return 'Dessert';
      default:
        return 'Unknown';
    }
  }

  getDrinkTypeString(typeNumber: number): string {
    switch (typeNumber) {
      case DrinkType.Drink:
        return 'Drink';
      case DrinkType.Cocktail:
        return 'Cocktail';
      case DrinkType.Beer:
        return 'Beer';
      case DrinkType.Bitter:
        return 'Bitter';
      case DrinkType.SuperAlcohol:
        return 'Super alcohol';
      default:
        return 'Unknown';
    }
  }

  navigateToCash(): void {
    // Navigate to the 'menu' route with data as a route parameter
    this.router.navigate(['/cash']);
  }
  
}
