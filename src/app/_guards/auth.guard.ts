import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AuthService } from '../_services/auth.service';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(public authService: AuthService, public router: Router){
    
  }
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    console.log('auth.guard canActivate this.authService',this.authService);
    if (this.authService.isLoggedIn) { return true; }
    
    // Navigate to the login page with extras
    this.router.navigate(['/login']);
    return false;
  }
}
