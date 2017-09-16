import { Component, OnInit } from '@angular/core';
import { UserProfileService } from "../_services/user-profile.service";

import { AuthService } from '../_services/auth.service';

import { UserProfile } from '../_models/user-profile';
import { MdSnackBar} from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  private isLoggedIn: boolean = false;
  private user: UserProfile;
  constructor(
    private userProfileService: UserProfileService,
    private authService: AuthService,
    private snackBar: MdSnackBar,
    private router: Router,
    
  ) { }

  ngOnInit() {

    if (this.userProfileService.isLoggedIn()) {
      this.isLoggedIn = true;
    }

    if (localStorage.getItem('userId')) {
      this.isLoggedIn = true;
    }
    
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.user = null;

    let snackBarRef = this.snackBar.open("Successfully logged out", 'Log In', {
      duration: 3000
    });

    snackBarRef.onAction().subscribe(
      () => {
        console.log('The snack-bar action was triggered!');
        this.router.navigate(['login']);
      },
      err =>  console.log('The snack-bar action was triggered! error', err),
    )

    this.router.navigate([''])
    localStorage.clear();
  }

}
