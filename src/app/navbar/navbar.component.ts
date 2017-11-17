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
  private userProfile: UserProfile;

  private user = {
    username: '',
    email: '',
  }
  constructor(
    private userProfileService: UserProfileService,
    private authService: AuthService,
    private snackBar: MdSnackBar,
    private router: Router,
    
  ) { }

  ngOnInit() {
    this.authService.isLoggedIn =false;
    if (this.userProfileService.isLoggedIn()) {
      this.isLoggedIn = true;
      this.authService.isLoggedIn = true;

      console.log('navbar.component.ts this.authService.secretKey', this.authService.secretKey);
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
          console.log('data',data);

          console.log('navbar.component.ts this.authService.secretKey', this.authService.secretKey);
        },
      ) 
    }

    console.log('navbar.component.ts this.authService.secretKey', this.authService.secretKey);

    
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
        console.log('The snack-bar action was triggered!');
        this.router.navigate(['login']);
      },
      err =>  console.log('The snack-bar action was triggered! error', err),
    )

    this.router.navigate([''])
    localStorage.clear();
  }


}
