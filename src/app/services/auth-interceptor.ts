// auth-interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private cookieService: CookieService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const authToken = this.cookieService.get('authToken');

    if (authToken) {
      // Cloning the request and setting the token as a cookie
      const authRequest = request.clone({
        withCredentials: true, // Send cookies with the request
      });

      // Passing the new request to the next handler
      return next.handle(authRequest);
    }

    // If no token is available, continue with the original request
    return next.handle(request);
  }
}
