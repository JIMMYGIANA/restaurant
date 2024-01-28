import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser } from '../model/userModel';
import { ITable } from '../model/tableModel';
import { IDish } from '../model/dishModel';
import { IReceipt } from '../model/receiptModel';
import { IOrder } from '../model/orderModel';
import { IOrderStatistics } from '../model/statisticsModels/orderStatisticsModel';
import { IDrink } from '../model/drinkModel';

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
    return this.http.get<IOrderStatistics[]>(`${this.baseUrl}/statistics/getOrdersStatistics`);
  }
  
  createReceipt(tableNumber: number) {
    return this.http.post(`${this.baseUrl}/receipts/createReceipt`, { tableNumber });
  }

  readReceipts(){
    return this.http.get<IReceipt[]>(`${this.baseUrl}/receipts/receipts`);
  }

  readReceipt(receiptNumber: number){
    const params = new HttpParams()
            .set('receiptNumber', receiptNumber.toString());
    return this.http.get<IReceipt>(`${this.baseUrl}/receipts/receipt`, {params});
  }

  deleteReceipt(receiptNumber: number){
    const params = new HttpParams()
            .set('receiptNumber', receiptNumber.toString());
    return this.http.delete(`${this.baseUrl}/receipts/deleteReceipt`, { params });
  }  

  readUsers() : Observable<IUser[]> {
    return this.http.get<IUser[]>(`${this.baseUrl}/users/getUsers`);
  }

  readCreationStats(userEmail: string) {
    const params = new HttpParams()
            .set('userEmail', userEmail.toString());
    return this.http.get<IOrderStatistics[]>(`${this.baseUrl}/statistics/getCreationStats`, {params});
  }

  readPreparationCookStats(userEmail: string) {
    const params = new HttpParams()
            .set('userEmail', userEmail.toString());
    return this.http.get<IOrderStatistics[]>(`${this.baseUrl}/statistics/getPreparationCookStats`, {params});
  }

  readPreparationDrinkStats(userEmail: string) {
    const params = new HttpParams()
            .set('userEmail', userEmail.toString());
    return this.http.get<IOrderStatistics[]>(`${this.baseUrl}/statistics/getPreparationDrinkStats`, {params});
  }

  readServeStats(userEmail: string) {
    const params = new HttpParams()
            .set('userEmail', userEmail.toString());
    return this.http.get<IOrderStatistics[]>(`${this.baseUrl}/statistics/getServeStats`, {params});
  }

  // manage restaurant
  createUser(userData: IUser){
    return this.http.post(`${this.baseUrl}/users/createUser`, userData);
  }

  createTable(tableData: ITable){
    return this.http.post(`${this.baseUrl}/tables/createTable`, tableData);
  }

  createDish(dishData: IDish){
    return this.http.post(`${this.baseUrl}/menu/createDish`, dishData);
  }

  createDrink(drinkData: IDrink){
    return this.http.post(`${this.baseUrl}/menu/createDrink`, drinkData);
  }

  deleteUser(userEmail: string){
    const params = new HttpParams()
            .set('userEmail', userEmail.toString());
    return this.http.delete(`${this.baseUrl}/users/deleteUser`, {params});
  }

  deleteTable(tableNumber: number){
    const params = new HttpParams()
            .set('tableNumber', tableNumber.toString());
    return this.http.delete(`${this.baseUrl}/tables/deleteTable`, {params});
  }

  deleteDish(dishNumber: number){
    const params = new HttpParams()
            .set('rdishNumber', dishNumber.toString());
    return this.http.delete(`${this.baseUrl}/cashier/deleteDish`, {params});
  }

  deleteDrink(drinkNumber: number){
    const params = new HttpParams()
            .set('drinkNumber', drinkNumber.toString());
    return this.http.delete(`${this.baseUrl}/cashier/deleteDrink`, {params});
  }
}
