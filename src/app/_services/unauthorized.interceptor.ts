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

export class UnAuthorizedInterceptor implements HttpInterceptor {
    
      constructor(public auth: AuthService,
                  private router: Router,
                  private snackBar: MdSnackBar) {}
    
      intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        
        return next.handle(request).do((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            // do stuff with response if you want
            console.log('UnAuthorizedInterceptor request, event', request, event )
          }
        }, (err: any) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 401) {
  
              console.log('UnAuthorizedInterceptor request, event', err );
              // redirect to the login route
              this.snackBar.open('Please log in' + err.message, '', {
                duration: 3000
              });
              this.router.navigate(['/login']);
              // or show a modal
            }
          }
        });
      }
    }