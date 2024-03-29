import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IDish } from '../model/dishModel';
import { IOrder } from '../model/orderModel';
import { IReceipt } from '../model/receiptModel';
import { IOrderStatistics } from '../model/statisticsModels/orderStatisticsModel';
import { IDrink } from '../model/drinkModel';
import { IUser } from '../model/userModel';
import { ITable } from '../model/tableModel';

@Injectable({
  providedIn: 'root',
})
export class CashierService {

  private readonly _baseUrl = 'http://localhost:3000/api'; // Sostituisci con l'URL del tuo server Express

  constructor(private readonly _http: HttpClient) { }

  readDishes(): Observable<IDish[]> {
    return this._http.get<IDish[]>(`${this._baseUrl}/menu/dishes`);
  }

  readDrinks(): Observable<IDish[]> {
    return this._http.get<IDish[]>(`${this._baseUrl}/menu/drinks`);
  }

  readTables(): Observable<ITable[]> {
    return this._http.get<ITable[]>(`${this._baseUrl}/tables/readTables`);
  }

  readOrders(): Observable<IOrder[]> {
    return this._http.get<IOrder[]>(`${this._baseUrl}/orders/readOrdersCash`);
  }

  readOrdersStatistics(): Observable<IOrderStatistics[]> {
    return this._http.get<IOrderStatistics[]>(`${this._baseUrl}/statistics/getOrdersStatistics`);
  }

  createReceipt(tableNumber: number) {
    return this._http.post(`${this._baseUrl}/receipts/createReceipt`, { tableNumber });
  }

  readReceipts() {
    return this._http.get<IReceipt[]>(`${this._baseUrl}/receipts/receipts`);
  }

  readReceipt(receiptNumber: number) {
    const params = new HttpParams()
      .set('receiptNumber', receiptNumber.toString());
    return this._http.get<IReceipt>(`${this._baseUrl}/receipts/receipt`, { params });
  }

  deleteReceipt(receiptNumber: number) {
    const params = new HttpParams()
      .set('receiptNumber', receiptNumber.toString());
    return this._http.delete(`${this._baseUrl}/receipts/deleteReceipt`, { params });
  }

  readUsers(): Observable<IUser[]> {
    return this._http.get<IUser[]>(`${this._baseUrl}/users/getUsers`);
  }

  readCreationStats(userEmail: string) {
    const params = new HttpParams()
      .set('userEmail', userEmail.toString());
    return this._http.get<IOrderStatistics[]>(`${this._baseUrl}/statistics/getCreationStats`, { params });
  }

  readPreparationCookStats(userEmail: string) {
    const params = new HttpParams()
      .set('userEmail', userEmail.toString());
    return this._http.get<IOrderStatistics[]>(`${this._baseUrl}/statistics/getPreparationCookStats`, { params });
  }

  readPreparationDrinkStats(userEmail: string) {
    const params = new HttpParams()
      .set('userEmail', userEmail.toString());
    return this._http.get<IOrderStatistics[]>(`${this._baseUrl}/statistics/getPreparationDrinkStats`, { params });
  }

  readServeStats(userEmail: string) {
    const params = new HttpParams()
      .set('userEmail', userEmail.toString());
    return this._http.get<IOrderStatistics[]>(`${this._baseUrl}/statistics/getServeStats`, { params });
  }

  // manage restaurant
  createUser(userData: IUser){
    return this._http.post(`${this._baseUrl}/users/createUser`, userData);
  }

  createTable(tableData: ITable){
    return this._http.post(`${this._baseUrl}/tables/createTable`, tableData);
  }

  createDish(dishData: IDish){
    return this._http.post(`${this._baseUrl}/menu/createDish`, dishData);
  }

  createDrink(drinkData: IDrink){
    return this._http.post(`${this._baseUrl}/menu/createDrink`, drinkData);
  }

  deleteUser(userEmail: string){
    const params = new HttpParams()
            .set('userEmail', userEmail.toString());
    return this._http.delete(`${this._baseUrl}/users/deleteUser`, {params});
  }

  deleteTable(tableNumber: number){
    const params = new HttpParams()
            .set('tableNumber', tableNumber.toString());
    return this._http.delete(`${this._baseUrl}/tables/deleteTable`, {params});
  }

  deleteDish(dishNumber: number){
    const params = new HttpParams()
            .set('rdishNumber', dishNumber.toString());
    return this._http.delete(`${this._baseUrl}/cashier/deleteDish`, {params});
  }

  deleteDrink(drinkNumber: number){
    const params = new HttpParams()
            .set('drinkNumber', drinkNumber.toString());
    return this._http.delete(`${this._baseUrl}/cashier/deleteDrink`, {params});
  }

  
}
