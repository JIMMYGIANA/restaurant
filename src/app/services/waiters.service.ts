import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ITable } from '../model/tableModel';
import { IOrder } from '../model/orderModel';

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
}
