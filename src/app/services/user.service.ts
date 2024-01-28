import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable, Subject, catchError, distinctUntilChanged, map, merge, multicast, of, refCount, switchMap, take, takeUntil, tap, throwError } from 'rxjs';
import { IUser, UserRole } from '../model/userModel';

export interface IUserSessionInfo {
  readonly token: string;
  readonly userRole: UserRole;
}

const AUTH_TOKEN = 'authToken';
const USER_SESSION = 'user-session';

@Injectable({
  providedIn: 'root',
})
export class UserService implements OnDestroy {

  private readonly _destructionTrigger$$ = new Subject<void>();
  public readonly destroyed$ = this._destructionTrigger$$.pipe(take(1));

  private readonly _baseUrl = 'http://localhost:3000/api/users/'; // Sostituisci con l'URL del tuo server Express

  private readonly _session$$ = new BehaviorSubject<IUserSessionInfo | null | undefined>(undefined);
  public get session() { return this._session$$.value; }
  private deserializeSession(): IUserSessionInfo | null | undefined {
    if (!this._cookieService.check(USER_SESSION))
      return undefined;
    const serializedSession = this._cookieService.get(USER_SESSION);
    return JSON.parse(serializedSession) as IUserSessionInfo;
  }
  private setSession(value: IUserSessionInfo | null | undefined): void {
    if (value != null) {
      const serializedSession = JSON.stringify(value);
      this._cookieService.set(USER_SESSION, serializedSession);
    }
    else
      this._cookieService.delete(USER_SESSION);
    this._session$$.next(value);
  }
  public readonly session$ = this._session$$.asObservable();

  private readonly _token$$ = new BehaviorSubject<string | null | undefined>(undefined);
  public get token() { return this._token$$.value; }
  public readonly token$ = this.session$.pipe(
    map(session => session?.token),
    multicast(() => this._token$$),
    refCount(),
    distinctUntilChanged());

  private readonly _userRole$$ = new BehaviorSubject<UserRole | null | undefined>(undefined);
  public get userRole() { return this._userRole$$.value; }
  public readonly userRole$ = this.session$.pipe(
    map(session => session?.userRole),
    multicast(() => this._userRole$$),
    refCount(),
    distinctUntilChanged());

  public get isLoggedIn() { return this.token != null; }
  public readonly isLoggedIn$ = this.token$.pipe(map(() => this.isLoggedIn), distinctUntilChanged());

  constructor(
    private readonly _http: HttpClient,
    private readonly _cookieService: CookieService,
    private readonly _router: Router) {

    this.setSession(this.deserializeSession());

    merge(this.token$, this.userRole$)
      .pipe(takeUntil(this.destroyed$))
      .subscribe();
  }

  public ngOnDestroy(): void {
    this._destructionTrigger$$.next();
    this._destructionTrigger$$.complete();
  }

  public login(credentials: any) {
    return this._http.post<IUserSessionInfo>(`${this._baseUrl}login`, credentials).pipe(
      catchError((error: Error) => {
        console.error('Authentication error:', error);
        if (error instanceof HttpErrorResponse) {
          // Handle HTTP errors (status code, etc.)
          console.error('HTTP Error Status:', error.status);
          console.error('HTTP Error Message:', error.message);
          // You can extract more information from the error object if needed
        } else {
          // Handle non-HTTP errors
          console.error('Non-HTTP Error:', error);
        }
        // Provide user-friendly feedback or redirect to an error page
        // For example, set a variable for displaying an error message in the UI
        // this.loginError = 'Invalid username or password';
        return throwError(() => error);
      }),
      switchMap(response => {
        if (this.token != null)
          return this.logout().pipe(map(() => response));
        return of(response);
      }),
      tap({
        next: response => {
          console.log('Observable emitted value:', response);
          this.setSession(response);
        },
        complete: () => {
          console.log('Observable completed'); // Ensure this log is reached
        }
      }));
  }

  public logout() {
    return this._http.post<void>(`${this._baseUrl}logout`, {}).pipe(tap(() => {
      this.setSession(undefined);
    }));
  }

  getAllUsers(): Observable<IUser[]> {
    return this._http.get<IUser[]>(`${this._baseUrl}`);
  }

  createUser(user: any): Observable<any> {
    return this._http.post(`${this._baseUrl}createUser`, user);
  }

  deleteUser(user: any): Observable<any> {
    return this._http.delete(`${this._baseUrl}deleteUser`, { body: user });
  }
}
