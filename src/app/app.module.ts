
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BarComponent } from './components/bar/bar.component';
import { DrinkComponent } from './components/bar/drink/drink.component';
import { CashComponent } from './components/cash/cash.component';
import { ReceiptComponent } from './components/cash/receipt/receipt.component';
import { UserStatsComponent } from './components/cash/user-stats/user-stats.component';
import { HomeComponent } from './components/home/home.component';
import { DishComponent } from './components/kitchen/dish/dish.component';
import { KitchenComponent } from './components/kitchen/kitchen.component';
import { LoginComponent } from './components/login/login.component';
import { OrdersComponent } from './components/orders/orders.component';
import { OrderMenuComponent } from './components/restaurant/order-menu/order-menu.component';
import { OrderTableComponent } from './components/restaurant/order-table/order-table.component';
import { OrderDishComponent } from './components/restaurant/orderDish/order.component';
import { RestaurantComponent } from './components/restaurant/restaurant.component';
import { TableComponent } from './components/restaurant/table/table.component';
import { AuthInterceptor } from './services/auth-interceptor';
import { WebSocketService } from './services/webSocket.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
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
    OrderTableComponent,
    ReceiptComponent,
    UserStatsComponent
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
    MatExpansionModule
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
