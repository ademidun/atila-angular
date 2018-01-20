import {Injectable, Injector} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpResponse, HttpErrorResponse
} from '@angular/common/http';
//import { AuthService } from './auth.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import { Router } from '@angular/router'
import { MatSnackBar } from '@angular/material';
import {AuthService} from './auth.service';
// https://ryanchenkie.com/angular-authentication-using-the-http-client-and-http-interceptors
@Injectable()

export class UnAuthorizedInterceptor implements HttpInterceptor {

      constructor(public router: Router,
                  public snackBar: MatSnackBar,
                  public injector: Injector
                   ) { }

      intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(request).do((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            // do stuff with response if you want

            return next.handle(request);
          }
        }, (err: any) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 401 ||err.status === 403 ) {

              // Clear local storage so new keys like xkcd can be generated
              //https://github.com/angular/angular/issues/18224#issuecomment-316957213
              let authService = this.injector.get(AuthService);
              authService.logout();

              // redirect to the login route
              let snackBarRef = this.snackBar.open("Unauthorized Access", 'Login', {
                duration: 5000
              });

              snackBarRef.onAction().subscribe(
                () => {
                  this.router.navigate(['/login']);
                },
              );
              setTimeout(() => {
                this.router.navigate(['/login']);
              }, 5000);
              // or show a modal
            }
          }
        });
      }
    }
