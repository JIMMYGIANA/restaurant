import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser } from '../model/userModel';
import { ITable } from '../model/tableModel';
import { IDish } from '../model/dishModel';

@Injectable({
  providedIn: 'root',
})
export class RestaurantService {
  private baseUrl = 'http://localhost:3000/'; // Sostituisci con l'URL del tuo server Express

  constructor(private http: HttpClient) {}

  readDishes(): Observable<IDish[]> {
    return this.http.get<IDish[]>(`${this.baseUrl}dishes`);
  }

  readDrinks(): Observable<IDish[]> {
    return this.http.get<IDish[]>(`${this.baseUrl}drinks`);
  }

  

}
