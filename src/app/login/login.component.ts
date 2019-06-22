import { Component, OnInit, ViewChild } from '@angular/core';

import { AuthService } from "../_services/auth.service";
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { MatSnackBar } from '@angular/material';
import { NavbarComponent } from '../navbar/navbar.component';
import {UserProfileService} from '../_services/user-profile.service';

import {Location} from '@angular/common';

export class Credentials {
  username: string;
  password: string
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  @ViewChild(NavbarComponent) navbarComponent: NavbarComponent;

  credentials: Credentials = {
    username:'',
    password:'',

   };

  isLoading =false;
  forgotPassword = false;
  resetResponse = ' ';

  redirectUrl = null;
  //true, but don't show up as text
  constructor(
    public authService: AuthService,
    public router: Router,
    public snackBar: MatSnackBar,
    public userProfileService: UserProfileService,
    public activatedRoute: ActivatedRoute,
    public location: Location) { }

  ngOnInit() {
    this.redirectUrl = this.activatedRoute.snapshot.queryParams['redirect'];

    if (this.redirectUrl) {
      this.redirectUrl = this.authService.redirectUrl;
      this.location.replaceState(`/login?redirect=${this.redirectUrl}`);
    }
  }

  login(event=null) {

    if (this.isLoading) {
      return;
    }

    let loginOperation: Observable<any>;
    this.isLoading = true;
    loginOperation = this.authService.login(this.credentials);
    loginOperation.subscribe(
        data => {
          this.router.navigateByUrl(this.redirectUrl || "/scholarship",  {
            preserveQueryParams: true, preserveFragment: true, });
          this.isLoading = false;
        },
        err => {
          this.snackBar.open("Incorrect login credentials", '', {
            duration: 3000
          });
          this.isLoading = false;
        }
      );
  }

  resetPassword(resetEmailUsername: HTMLInputElement) {

    if (this.isLoading) {
      return;
    }

    this.resetResponse = null;
    this.isLoading = true;
    const userInput = {
      username: resetEmailUsername.value
    };


    this.userProfileService.resetPassword(userInput)
      .subscribe(
        res =>  {
          this.resetResponse = res.message;
          this.isLoading = false;
        },
        err => {
          if(err.error) {
            this.resetResponse = err.error.message || err.error.error;
          }
          else {
            this.resetResponse = err.error || 'Rest failed. Please email admin info@atila.ca'
          }
          this.isLoading = false;

        }
      )

  }
}
