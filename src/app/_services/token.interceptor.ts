import { Injectable, Injector } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpResponse, HttpErrorResponse
} from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import { Router } from '@angular/router'
import { MatSnackBar } from '@angular/material';
// https://ryanchenkie.com/angular-authentication-using-the-http-client-and-http-interceptors

//cyclic dependency https://github.com/angular/angular/issues/18224
@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(public inj: Injector) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const auth = this.inj.get(AuthService);
    // req = req.clone({
    //   setHeaders: {
    //     Authorization: `Bearer ${this.auth.getToken()}`
    //   }
    // });

    if(!auth.getToken()){
        return next.handle(req);
    }
    // We should use `JWT ${this.auth.getToken()}` but we don't want to trigger the actual jwt verification on backend
    // so we use Bearer for now, so we can parse the content from JSON
    
    req = req.clone({
        setHeaders: {
          Authorization: `JWT ${auth.decryptLocalStorage('token')}`,
        }
      });
      
    return next.handle(req);
  }
}
