import { Injectable } from '@angular/core';
import { filter, map, Observable, Subject } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { IOrder } from '../model/orderModel';

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

  // on<T>(eventName: string): Observable<T> {
  //   return this.socket$.asObservable().pipe(
  //     filter((message) => message.event === eventName),
  //     map((message) => message.data as T)
  //   );
  // }

  on<T>(eventName: string): Subject<T> {
    const subject = new Subject<T>();
  
    this.socket$.asObservable().pipe(
      filter((message) => message.event === eventName),
      map((message) => message.data as T)
    ).subscribe(
      (value) => subject.next(value),  // Forward the value to the subject
      (error) => subject.error(error), // Forward errors to the subject
      () => {} // No completion here, as the subject should never complete
    );
  
    return subject;
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

  //orderReady
  notifyOrderReady(orderNumber: number, tableNumber: number, typeOrder: string): void {
    this.emit('orderReady', { event: 'orderReady', data: { orderNumber: orderNumber, tableNumber: tableNumber, typeOrder: typeOrder } });
  }

  //orderServed
  notifyOrderServed(orderNumber: number, tableNumber: number): void {
    this.emit('orderServed', { event: 'orderServed', data: { orderNumber: orderNumber, tableNumber: tableNumber } });
  }

  //setClients
  notifySetClients(): void {
    this.emit('setClients', { event: 'setClients' });
  }
}
