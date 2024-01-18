
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RestaurantComponent } from './components/restaurant/restaurant.component';
import { TableComponent } from './components/restaurant/table/table.component';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import { OrderMenuComponent } from './components/restaurant/order-menu/order-menu.component';
import { OrderDishComponent } from './components/restaurant/orderDish/order.component';
import { DishComponent } from './components/kitchen/dish/dish.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import {Component} from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { AuthInterceptor } from './services/auth-interceptor';
import { KitchenComponent } from './components/kitchen/kitchen.component';
import { BarComponent } from './components/bar/bar.component';
import {MatTableModule} from '@angular/material/table';
import { CashComponent } from './components/cash/cash.component';
import { OrdersComponent } from './components/orders/orders.component';
import { WebSocketService } from './services/webSocket.service';
import { DrinkComponent } from './components/bar/drink/drink.component';
import { OrderTableComponent } from './components/restaurant/order-table/order-table.component';

@NgModule({
  declarations: [
    AppComponent,
    TableComponent,
    LoginComponent,
    RestaurantComponent,
    OrdersComponent,
    OrderMenuComponent,
    OrderDishComponent,
    DishComponent,
    KitchenComponent,
    BarComponent,
    CashComponent,
    DishComponent,
    DrinkComponent,
    OrderTableComponent

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
    MatTableModule
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
