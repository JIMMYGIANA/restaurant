
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
import { OrderComponent } from './components/restaurant/order/order.component';
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

@NgModule({
  declarations: [
    AppComponent,
    TableComponent,
    LoginComponent,
    RestaurantComponent,
    OrderMenuComponent,
    OrderComponent,
    KitchenComponent,
    BarComponent,
    CashComponent
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
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
