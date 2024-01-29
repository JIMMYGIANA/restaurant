// auth-interceptor.ts
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private readonly _userService: UserService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = this._userService.token;
    // If no token is available, continue with the original request
    if (token == null)
      return next.handle(request);

    // Cloning the request and setting the token as a cookie
    const authRequest = request.clone({
      withCredentials: true, // Send cookies with the request
      headers: request.headers.set('Authorization', 'Bearer ' + token)
    });

    // Passing the new request to the next handler
    return next.handle(authRequest);
  }

}
