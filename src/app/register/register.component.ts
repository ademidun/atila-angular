import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";

import { MdSnackBar } from '@angular/material';
import { UserProfile } from '../_models/user-profile';
import { User } from '../_models/user';
import { Observable } from 'rxjs/Rx';

import { UserProfileService } from '../_services/user-profile.service';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  
  
  constructor(
    private router: Router,
    private snackBar: MdSnackBar,
    private userProfileService: UserProfileService) { }

  model = new User('','','');

  ngOnInit() {
  }

  registerUser(registerForm: NgForm) {
    if (registerForm.valid) {
      let postOperation: Observable<any>;
      // Create a new User
      postOperation = this.userProfileService.createUser(this.model);
      // Subscribe to Observable
      postOperation.subscribe( 
        data => {
          this.model = new User('','','');
          this.showSnackBar('Registration successful', 3000);
          // Store userId in loacl storage
          console.log('registration data: ', data);
          if (data.id) {
            // this.cookieService.putObject('userId', data.id);
            localStorage.setItem('userId', data.id); 
          }
          if (data.token) {
            localStorage.setItem('token', data.token); 
          }
          this.router.navigate(['create-profile']);
        },
        err => {
          this.showSnackBar(err, 3000);
        }
      )
    } else {
      this.showSnackBar("Invalid form", 3000);
    }
  }

  // SnackBar notification
  showSnackBar(text: string, duration: number) {
    this.snackBar.open(text, '', {
      duration: duration
    });
  }

}
