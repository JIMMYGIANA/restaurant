import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IDish } from "../model/dishModel";
import { IOrder } from "../model/orderModel";
import { WebSocketService } from "./webSocket.service";
import { IDrink } from "../model/drinkModel";


@Injectable({
    providedIn: 'root',
  })
export class BarsService {
    private baseUrl = 'http://localhost:3000/api';

    constructor(private http: HttpClient, private webSocketService: WebSocketService) {}

    readOrders(): Observable<IOrder[]> {
        return this.http.get<IOrder[]>(`${this.baseUrl}/orders/readOrdersBar`);
    }

    readOrder(orderNumber: number, tableNumber: number): Observable<IOrder> {
        const params = new HttpParams()
            .set('orderNumber', orderNumber.toString())
            .set('tableNumber', tableNumber.toString());;
        return this.http.get<IOrder>(`${this.baseUrl}/orders/readOrder`, { params });
    }

    getDrink(data: any): Observable<IDrink> {
        const params = new HttpParams().set('number', data.toString());
        return this.http.get<IDrink>(`${this.baseUrl}/menu/getDrink`, { params });
    }

    tableNumber(): Observable<number> {
        return this.http.get<number>(`${this.baseUrl}/tables/tableNumber`);
    }


    takeOrder(data: any): Observable<any> {
        return this.http.patch(`${this.baseUrl}/orders/takeOrderDrink`, data);
    }

    completeOrder(data: any) {
        return this.http.patch(`${this.baseUrl}/orders/completeOrderDrink`, data);
    }

    orderDrinksPreparation(data: any) {
        return this.http.post(`${this.baseUrl}/statistics/orderDrinksPreparation`, data);
    }

}