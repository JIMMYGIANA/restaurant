import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BarComponent } from './components/bar/bar.component';
import { CashComponent } from './components/cash/cash.component';
import { HomeComponent } from './components/home/home.component';
import { KitchenComponent } from './components/kitchen/kitchen.component';
import { LoginComponent } from './components/login/login.component';
import { OrdersComponent } from './components/orders/orders.component';
import { RestaurantComponent } from './components/restaurant/restaurant.component';
import { isLoggedInGuard } from './guards/is-logged-in.guard';
import { isLoggedOutGuard } from './guards/is-logged-out.guard';
import { MenuComponent } from './components/menu/menu.component';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [isLoggedInGuard] },
  { path: 'login', component: LoginComponent, canActivate: [isLoggedOutGuard] },
  { path: 'restaurant', component: RestaurantComponent, canActivate: [isLoggedInGuard] },
  { path: 'orders', component: OrdersComponent, canActivate: [isLoggedInGuard] },
  { path: 'kitchen', component: KitchenComponent, canActivate: [isLoggedInGuard] },
  { path: 'bar', component: BarComponent, canActivate: [isLoggedInGuard] },
  { path: 'cash', component: CashComponent, canActivate: [isLoggedInGuard] },
  { path: 'menu', component: MenuComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }