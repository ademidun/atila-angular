import { Component, OnInit } from '@angular/core';
import { UserProfileService } from "../_services/user-profile.service";

import { AuthService } from '../_services/auth.service';

import { UserProfile } from '../_models/user-profile';
import { MatSnackBar} from '@angular/material';
import { Router } from '@angular/router';
import {environment} from '../../environments/environment';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  public isLoggedIn: boolean = false;
  public userProfile: UserProfile;

  public user = {
    username: '',
    email: '',
  }
  constructor(
    public userProfileService: UserProfileService,
    public authService: AuthService,
    public snackBar: MatSnackBar,
    public router: Router,

  ) { }

  ngOnInit() {
    this.authService.isLoggedIn =false;
    if (this.userProfileService.isLoggedIn()) {
      this.isLoggedIn = true;
      this.authService.isLoggedIn = true;


    }

    if (this.authService.decryptLocalStorage('uid')) {
      this.isLoggedIn = true;
      this.authService.isLoggedIn = true;
    }

    if(this.isLoggedIn){
      this.userProfileService.getById(parseInt(this.authService.decryptLocalStorage('uid')))
      .subscribe(

        data => {
          this.userProfile = data;



        },
      )
    }




  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.userProfile = null;

    let snackBarRef = this.snackBar.open("Successfully logged out", 'Log In', {
      duration: 3000
    });

    snackBarRef.onAction().subscribe(
      () => {

        this.router.navigate(['login']);
      },
      err =>  {}
    )

    this.router.navigate([''])
    localStorage.clear();
  }


}
