import { Injectable } from '@angular/core';
import { filter, map, Observable } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private readonly socket$ = webSocket<any>('ws://localhost:4000'); // Replace with your WebSocket URL;

  constructor() { }

  connect(): void {
    this.socket$.next({}); // Initiate the connection
  }

  disconnect(): void {
    this.socket$.complete(); // Close the connection
  }

  on<T>(eventName: string): Observable<T> {
    return this.socket$.pipe(
      filter((message) => message.event === eventName),
      map((message) => message.data as T)
    );
  }

  emit<T>(eventName: string, data: T): void {
    this.socket$.next({ event: eventName, data });
  }

  // newOrder
  notifyOrderCreated(orderNumber: number, tableNumber: number): void {
    // You can customize the event name and data structure as needed
    console.log('orderNumber --- ' + orderNumber + ' tableNumber --- ' + tableNumber);
    this.emit('newOrder', { event: 'newOrder', data: { orderNumber: orderNumber, tableNumber: tableNumber } });
  }

  // newReceipt
  notifyReceiptCreated(receiptNumber: number, tableNumber: number): void {
    // You can customize the event name and data structure as needed
    console.log('receiptNumber --- ' + receiptNumber + ' tableNumber --- ' + tableNumber);
    this.emit('newReceipt', { event: 'newReceipt', data: { receiptNumber: receiptNumber, tableNumber: tableNumber } });
  }

  //orderPreparing
  notifyOrderPreparing(orderNumber: number, tableNumber: number): void {
    this.emit('orderPreparing', { event: 'orderPreparing', data: { orderNumber: orderNumber, tableNumber: tableNumber } });
  }

  //orderReady
  notifyOrderReady(orderNumber: number, tableNumber: number, typeOrder: string): void {
    this.emit('orderReady', { event: 'orderReady', data: { orderNumber: orderNumber, tableNumber: tableNumber, typeOrder: typeOrder } });
  }

  //orderReady
  notifyOrderServed(orderNumber: number, tableNumber: number): void {
    this.emit('orderServed', { event: 'orderServed', data: { orderNumber: orderNumber, tableNumber: tableNumber } });
  }

  //setClients
  notifySetClients(): void {
    this.emit('setClients', { event: 'setClients' });
  }
}
