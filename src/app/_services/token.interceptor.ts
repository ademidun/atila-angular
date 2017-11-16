import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs/Observable';

// https://ryanchenkie.com/angular-authentication-using-the-http-client-and-http-interceptors
@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(public auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // req = req.clone({
    //   setHeaders: {
    //     Authorization: `Bearer ${this.auth.getToken()}`
    //   }
    // });
    
    console.log('tokenInterceptor req.headers',req.headers);
    if(!this.auth.getToken()){
        return next.handle(req);
    }
    req = req.clone({
        setHeaders: {
          Authorization: `JWT ${this.auth.getToken()}`
        }
      });
    console.log('tokenInterceptor req.headers',req.headers);
    return next.handle(req);
  }
}