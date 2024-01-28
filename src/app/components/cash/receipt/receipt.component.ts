import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, of, tap } from 'rxjs';
import { IReceipt } from 'src/app/model/receiptModel';
import { CashierService } from 'src/app/services/cashier.service';
import { IOrder } from 'src/app/model/orderModel';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { WaitersService } from 'src/app/services/waiters.service';
import { WebSocketService } from 'src/app/services/webSocket.service';



@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrl: './receipt.component.css'
})
export class ReceiptComponent {

  protected readonly receipt$: Observable<IReceipt>;

  protected readonly receiptNumber$;

  constructor(
    private dialogRef: MatDialogRef<ReceiptComponent>,
    private cashierService: CashierService,
    @Inject(MAT_DIALOG_DATA) public data: { receiptNumber: number }
  ) {
    this.receipt$ = this.cashierService.readReceipt(data.receiptNumber).pipe(
      tap((receipt) => console.log(receipt))
    );

    this.receiptNumber$ = of(data.receiptNumber);
  }
}
