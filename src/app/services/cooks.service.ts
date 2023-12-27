import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IOrder } from "../model/orderModel";
import { Observable } from "rxjs";
import { IDish } from "../model/dishModel";


@Injectable({
    providedIn: 'root',
  })
export class CooksService {
    private baseUrl = 'http://localhost:3000/api/cook/';

    constructor(private http: HttpClient) {}

    readOrders(): Observable<IOrder[]> {
        return this.http.get<IOrder[]>(`${this.baseUrl}readOrders`);
    }

    takeOrder(data: any): Observable<any> {
        return this.http.patch(`${this.baseUrl}takeOrder`, data);
    }

    getDish(data: any): Observable<IDish> {
        const params = new HttpParams({ fromObject: data })
        return this.http.get<IDish>(`${this.baseUrl}getDish`, { params });
    }
}