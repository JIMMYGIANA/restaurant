import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser } from '../model/userModel';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = 'http://localhost:3000'; // Sostituisci con l'URL del tuo server Express

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(`${this.baseUrl}/`);
  }

  createUser(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/createUser`, user);
  }

  deleteUser(user: any): Observable<any> {
    return this.http.delete(`${this.baseUrl}/deleteUser`, { body: user });
  }
}
