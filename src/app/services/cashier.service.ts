import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser } from '../model/userModel';
import { ITable } from '../model/tableModel';
import { IDish } from '../model/dishModel';
import { IReceipt } from '../model/receiptModel';
import { IOrder } from '../model/orderModel';
import { IOrderStatistics } from '../model/statisticsModels/orderStatisticsModel';

@Injectable({
  providedIn: 'root',
})
export class CashierService {
  private baseUrl = 'http://localhost:3000/api'; // Sostituisci con l'URL del tuo server Express

  constructor(private http: HttpClient) {}

  readDishes(): Observable<IDish[]> {
    return this.http.get<IDish[]>(`${this.baseUrl}/menu/dishes`);
  }

  readDrinks(): Observable<IDish[]> {
    return this.http.get<IDish[]>(`${this.baseUrl}/menu/drinks`);
  }

  readTables(): Observable<ITable[]> {
    return this.http.get<ITable[]>(`${this.baseUrl}/tables/readTables`);
  }

  readOrders(): Observable<IOrder[]> {
    return this.http.get<IOrder[]>(`${this.baseUrl}/orders/readOrdersCash`);
  }

  readOrdersStatistics(): Observable<IOrderStatistics[]>{
    return this.http.get<IOrderStatistics[]>(`${this.baseUrl}/orders/getOrdersStatistics`);
  }
  
  createReceipt(tableNumber: number) {
    const params = new HttpParams()
            .set('tableNumber', tableNumber.toString());
    return this.http.post(`${this.baseUrl}/receipt/createReceipt`, {params});
  }

  readReceipts(){
    return this.http.get<IReceipt[]>(`${this.baseUrl}/receipts/receipts`);
  }

  deleteReceipt(receiptNumber: number){
    const params = new HttpParams()
            .set('receiptNumber', receiptNumber.toString());
    return this.http.delete(`${this.baseUrl}/receipts/deleteReceipt`, { params });
  }  
}
