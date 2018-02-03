import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AuthService } from '../_services/auth.service';
import {MatSnackBar} from '@angular/material';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(public authService: AuthService,
              public router: Router,
              public snackBar: MatSnackBar){

  }
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if (this.authService.isLoggedIn) { return true; }

    // Navigate to the login page with extras
    this.snackBar.open("Unauthorized Access", '', {
      duration: 3000
    });
    this.router.navigate(['/login']);
    return false;
  }
}
