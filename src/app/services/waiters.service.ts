import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ITable } from '../model/tableModel';
import { IOrder } from '../model/orderModel';
import { IOrderStatistics } from '../model/statisticsModels/orderStatisticsModel';

@Injectable({
  providedIn: 'root',
})
export class WaitersService {
  private baseUrl = 'http://localhost:3000/api'; // Sostituisci con l'URL del tuo server Express

  constructor(private http: HttpClient) {}

  readTables(): Observable<ITable[]> {
    return this.http.get<ITable[]>(`${this.baseUrl}/tables/readTables`);
  }

  addClient(data: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/tables/updateTableClients`, data);
  }

  createOrder(data: any): Observable<any> {
    return this.http.post<IOrder>(`${this.baseUrl}/orders/createOrder`, data);
  }

  createOrderStatistics(data: any): Observable<any> {
    return this.http.post<IOrderStatistics>(`${this.baseUrl}/statistics/orderStatistics`, data);
  }

  getOrders() {
    return this.http.get<IOrder[]>(`${this.baseUrl}/orders/readOrdersWaiter`);
  }

  serveOrder(data: any) {
    return this.http.patch(`${this.baseUrl}/orders/serveOrder`, data);
  }

  orderCreation(data: any): Observable<any> {
    return this.http.post<IOrder>(`${this.baseUrl}/statistics/orderCreation`, data);
  }

  orderServed(data: any): Observable<any> {
    return this.http.post<IOrder>(`${this.baseUrl}/statistics/orderServed`, data);
  }

}
