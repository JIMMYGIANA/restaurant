// order-menu-dialog.service.ts
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OrderMenuComponent } from '../components/restaurant/order-menu/order-menu.component';

@Injectable({
  providedIn: 'root'
})
export class OrderMenuDialogService {
  constructor(private dialog: MatDialog) {}

  openOrderMenuDialog(): void {
    this.dialog.open(OrderMenuComponent, {
      width: '400px', // Set the width as per your requirement
      // Add any other configuration options here
    });
  }
}
