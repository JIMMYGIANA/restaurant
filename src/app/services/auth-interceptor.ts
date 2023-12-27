// auth-interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const authToken = localStorage.getItem('authToken');

    if (authToken) {
      // Cloning the request and adding the Authorization header
      const authRequest = request.clone({
        setHeaders: { Authorization: `Bearer ${authToken}` },
      });

      // Passing the new request to the next handler
      return next.handle(authRequest);
    }

    // If no token is available, continue with the original request
    return next.handle(request);
  }
}
