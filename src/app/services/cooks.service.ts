import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IOrder } from "../model/orderModel";
import { Observable, map } from "rxjs";
import { IDish } from "../model/dishModel";
import { WebSocketService } from "./webSocket.service";


@Injectable({
    providedIn: 'root',
  })
export class CooksService {
    private baseUrl = 'http://localhost:3000/api';

    constructor(private http: HttpClient, private webSocketService: WebSocketService) {}

    readOrders(): Observable<IOrder[]> {
        return this.http.get<IOrder[]>(`${this.baseUrl}/orders/readOrdersCook`);
    }

    readOrder(orderNumber: number, tableNumber: number): Observable<IOrder> {
        const params = new HttpParams()
            .set('orderNumber', orderNumber.toString())
            .set('tableNumber', tableNumber.toString());
        return this.http.get<IOrder>(`${this.baseUrl}/orders/readOrder`, { params });
    }

    getDish(data: any): Observable<IDish> {
        const params = new HttpParams().set('number', data.toString());
        return this.http.get<IDish>(`${this.baseUrl}/menu/getDish`, { params });
    }

    tableNumber(): Observable<number> {
        return this.http.get<number>(`${this.baseUrl}/tables/tableNumber`);
    }

    takeOrder(data: any): Observable<any> {
        return this.http.patch(`${this.baseUrl}/orders/takeOrderCook`, data);
    }

    completeOrder(data: any) {
        return this.http.patch(`${this.baseUrl}/orders/completeOrderCook`, data);
    }

    orderDishesPreparation(data: any) {
        return this.http.post(`${this.baseUrl}/statistics/orderDishesPreparation`, data);
    }

}

