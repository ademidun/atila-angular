import { Component, OnInit, ViewChild } from '@angular/core';

import { AuthService } from "../_services/auth.service";
import {Router, RouterModule} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { MatSnackBar } from '@angular/material';
import { NavbarComponent } from '../navbar/navbar.component';

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
  constructor(
    public authService: AuthService,
    public router: Router,
    public snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  login() {
    let loginOperation: Observable<any>;
    this.isLoading = true;
    loginOperation = this.authService.login(this.credentials);
    loginOperation.subscribe(
        // We're assuming the response will be an object
        // with the JWT on an id_token key
        data => {


          this.authService.encryptlocalStorage('token', data.token);
          // this.cookieService.putObject('userId', data.id);
          this.authService.encryptlocalStorage('uid',data.id);
          this.authService.isLoggedIn = true;
          this.router.navigate(["/scholarships-list"]);

        },
        err => {


          this.snackBar.open("Incorrect login credentials", '', {
            duration: 3000
          })
        },

        () => this.isLoading = false,
      );
  }

}
