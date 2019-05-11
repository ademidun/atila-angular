import { Component, OnInit } from '@angular/core';
import { UserProfileService } from "../_services/user-profile.service";

import { AuthService } from '../_services/auth.service';

import { UserProfile } from '../_models/user-profile';
import { MatSnackBar} from '@angular/material';
import { Router } from '@angular/router';
import {environment} from '../../environments/environment';
import {MyFirebaseService} from '../_services/myfirebase.service';
import {MASTER_LIST_EVERYTHING} from '../_models/constants';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  public isLoggedIn: boolean = false;
  public userProfile: UserProfile;
  MASTER_LIST_EVERYTHING = MASTER_LIST_EVERYTHING.map(item => item.toLowerCase());

  public user = {
    username: '',
    email: '',
  };

  userId: any;
  encodeURIComponent = encodeURIComponent;
  public query: any;
  constructor(
    public userProfileService: UserProfileService,
    public authService: AuthService,
    public firebaseService: MyFirebaseService,
    public snackBar: MatSnackBar,
    public router: Router,

  ) { }

  ngOnInit() {
    this.authService.isLoggedIn =false;
    this.userId =  this.authService.decryptLocalStorage('uid');


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

        this.login();
      },
      err =>  {}
    )

    this.router.navigate([''])
    localStorage.clear();
  }

  login(event?) {
    if (event) {
      event.preventDefault();
    }

    this.router.navigateByUrl('/login?redirect='+this.router.url, {
      preserveQueryParams: true, preserveFragment: true, queryParamsHandling: 'merge'});
    this.authService.redirectUrl = this.router.url;
  }
  search(query) {
    this.query = query;

    this.router.navigateByUrl(`search?q=${query}&q_source=navbar`, {preserveQueryParams: true, preserveFragment: true});

  }


}
