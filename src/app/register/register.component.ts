import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";

import { MatSnackBar } from '@angular/material';
import { UserProfile } from '../_models/user-profile';
import { User } from '../_models/user';
import { Observable } from 'rxjs/Rx';

import { UserProfileService } from '../_services/user-profile.service';

import { AuthService } from "../_services/auth.service";


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  

  model = new User('','','');
  
  pageNo: number =1;

EDUCATION_LEVEL = [
  'University', 
  'College', 
  'Workplace or Apprenticeship',
]

EDUCATION_FIELD = [
  'Arts (Undergrad)',
  'STEM (Undergrad)',
  'Trade School', 
  'Visual + Performing Arts', 
  'Law School', 
  'Medical School', 
  'MBA', 
  'Arts (Grad School)', 
  'STEM (Grad School)', 
  'Other' 
]  
locationData = {
  'city': '',
  'province': '',
  'country': '',
}
  constructor(
    public router: Router,
    public snackBar: MatSnackBar,
    public userProfileService: UserProfileService,
    public authService: AuthService) { }


userProfile = new UserProfile();
  ngOnInit() {
  }

  registerUser(registerForm: NgForm) {
    if (registerForm.valid) {
      let postOperation: Observable<any>;
      // Create a new User
      Array('country','province','city').forEach(element => {
        
        
        this.locationData[element]= this.userProfile[element];
      });
      var sendData = {
        user: this.model,
        userProfile: this.userProfile,
        locationData: this.locationData,
      };
      postOperation = this.userProfileService.createUserAndProfile(sendData);
      // Subscribe to Observable
      postOperation.subscribe( 
        data => {
          this.model = new User('','','');
          this.showSnackBar('Registration successful', 3000);
          this.authService.isLoggedIn = true;
          // Store userId in loacl storage
          
          if (data.id) {
            // this.cookieService.putObject('userId', data.id);
            localStorage.setItem('userId', data.id); 
          }
          if (data.token) {
            localStorage.setItem('token', data.token); 
          }
          this.router.navigate(['scholarships-list']);
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


  nextPage() {
    this.pageNo = Math.min(3,this.pageNo+1);
  }

  prevPage() {
    this.pageNo = Math.max(1,this.pageNo-1);
  }

}
