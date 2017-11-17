import { Component, OnInit, ViewChild } from '@angular/core';

import { AuthService } from "../_services/auth.service";
import {Router, RouterModule} from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { MdSnackBar } from '@angular/material';
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
  constructor(
    private authService: AuthService, 
    private router: Router,
    private snackBar: MdSnackBar) { }

  ngOnInit() {
  }

  onLogin() {
    let loginOperation: Observable<any>;
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
          console.log('login.componenent this.auth',this.authService);
        },
        err => {
          this.snackBar.open("Incorrect login credentials", '', {
            duration: 3000
          })
        }
      ); 
  }

}
