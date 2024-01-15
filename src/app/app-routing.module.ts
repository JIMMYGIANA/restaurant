import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RestaurantComponent } from './components/restaurant/restaurant.component';
import { KitchenComponent } from './components/kitchen/kitchen.component';
import { BarComponent } from './components/bar/bar.component';
import { CashComponent } from './components/cash/cash.component';
import { OrdersComponent } from './components/orders/orders.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'restaurant', component: RestaurantComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'kitchen', component: KitchenComponent },
  { path: 'bar', component: BarComponent },
  { path: 'cash', component: CashComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
