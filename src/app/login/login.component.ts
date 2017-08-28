import { Component, OnInit } from '@angular/core';

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
  constructor() { }

  ngOnInit() {
  }

}
