import { Component, OnInit } from '@angular/core';

import { AuthService } from "../_services/auth.service";
import {Router, RouterModule} from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { MdSnackBar } from '@angular/material';

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

  credentials: Credentials = {
    username:'',
    password:'',
 
   };
  constructor(
    private auth: AuthService, 
    private router: Router,
    private snackBar: MdSnackBar) { }

  ngOnInit() {
  }

  onLogin() {
    let loginOperation: Observable<any>;
    loginOperation = this.auth.login(this.credentials);
    loginOperation.subscribe(
        // We're assuming the response will be an object
        // with the JWT on an id_token key
        data => {
          localStorage.setItem('token', data.token);
          // this.cookieService.putObject('userId', data.id);
          localStorage.setItem('userId', data.id)
          this.router.navigateByUrl("/scholarships-list");
        },
        err => {
          this.snackBar.open("Incorrect login credentials", '', {
            duration: 3000
          })
        }
      ); 
  }

}