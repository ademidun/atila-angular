import { Injectable } from '@angular/core';
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
import { MdSnackBar } from '@angular/material';
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

    if(!this.auth.getToken()){
        return next.handle(req);
    }
    // We should use `JWT ${this.auth.getToken()}` but we don't want to trigger the actual jwt verification on backend
    // so we use Bearer for now, so we can parse the content from JSON

    req = req.clone({
        setHeaders: {
          Authorization: `JWT ${this.auth.decryptLocalStorage('token')}`,
        }
      });
      console.log('tokenInterceptor req.headers',req.headers);
    return next.handle(req);
  }
}
