import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AuthService } from '../_services/auth.service';
import {MatSnackBar} from '@angular/material';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(public authService: AuthService,
              public router: Router,
              public snackBar: MatSnackBar) {

  }
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if (state.url === '/') {
      if (this.authService.isUserLoggedIn()) {
        this.router.navigate(['/scholarship']);
        return false;
      }
      else {
        return true;
      }
    }

    if (this.authService.isLoggedIn) { return true; }
    // Navigate to the login page with extras
    this.snackBar.open('Unauthorized access', '', {
      duration: 3000
    });
    this.router.navigateByUrl('/login?redirect=' + this.router.url, {
      preserveQueryParams: true,
      preserveFragment: true,
      queryParamsHandling: 'merge'
    });
    this.authService.redirectUrl = this.router.url;
    return false;
  }
}
