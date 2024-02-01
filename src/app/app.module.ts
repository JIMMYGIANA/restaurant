
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RestaurantComponent } from './components/restaurant/restaurant.component';
import { TableComponent } from './components/restaurant/table/table.component';
import {Component} from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BarComponent } from './components/bar/bar.component';
import { DrinkComponent } from './components/bar/drink/drink.component';
import { CashComponent } from './components/cash/cash.component';
import { ReceiptComponent } from './components/cash/receipt/receipt.component';
import { UserStatsComponent } from './components/cash/user-stats/user-stats.component';
import { UserCrudComponent } from './components/cash/user-crud/user-crud.component';
import { TableCrudComponent } from './components/cash/table-crud/table-crud.component';
import { DrinkCrudComponent } from './components/cash/drink-crud/drink-crud.component';
import { DishCrudComponent } from './components/cash/dish-crud/dish-crud.component';
import { MenuComponent } from './components/menu/menu.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './components/home/home.component';
import { DishComponent } from './components/kitchen/dish/dish.component';
import { KitchenComponent } from './components/kitchen/kitchen.component';
import { OrdersComponent } from './components/orders/orders.component';
import { OrderMenuComponent } from './components/restaurant/order-menu/order-menu.component';
import { OrderTableComponent } from './components/restaurant/order-table/order-table.component';
import { OrderDishComponent } from './components/restaurant/orderDish/order.component';
import { AuthInterceptor } from './services/auth-interceptor';
import { WebSocketService } from './services/webSocket.service';
import { OrderDrinkComponent } from './components/restaurant/order-drink/order-drink.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TableComponent,
    LoginComponent,
    RestaurantComponent,
    OrdersComponent,
    OrderMenuComponent,
    OrderDrinkComponent,
    OrderDishComponent,
    DishComponent,
    KitchenComponent,
    BarComponent,
    CashComponent,
    DishComponent,
    DrinkComponent,
    OrderTableComponent,
    ReceiptComponent,
    UserStatsComponent,
    UserCrudComponent,
    TableCrudComponent,
    DrinkCrudComponent,
    DishCrudComponent,
    MenuComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    HttpClientModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatTableModule,
    MatExpansionModule,
    FormsModule,
    ReactiveFormsModule,

  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    WebSocketService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
