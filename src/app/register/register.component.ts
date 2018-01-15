import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";

import { MatSnackBar } from '@angular/material';
import { UserProfile } from '../_models/user-profile';
import { User } from '../_models/user';
import { Observable } from 'rxjs/Observable';

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

  registrationResponse: any;

  isAgreeTerms: boolean;

  EDUCATION_LEVEL = [
    'Secondary School',
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
};

  disableRegistrationButton: any;
  constructor(
    public router: Router,
    public snackBar: MatSnackBar,
    public userProfileService: UserProfileService,
    public authService: AuthService) { }


userProfile = new UserProfile();
  ngOnInit() {
  }

  registerUser(registerForm: NgForm) {

    Array('country','province','city').forEach(element => {
      this.locationData[element]= this.userProfile[element];

    });
    if (registerForm.valid) {
      this.disableRegistrationButton = true;
      let postOperation: Observable<any>;
      // Create a new User



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
          this.authService.encryptlocalStorage('token', data.token);
          // this.cookieService.putObject('userId', data.id);
          this.authService.encryptlocalStorage('uid',data.id);

          this.registrationResponse = true;
          this.disableRegistrationButton = false;


          setTimeout(() => {
            this.router.navigate(['scholarships-list']);
          }, 7000);
        },
        err => {

          this.disableRegistrationButton = false;
          if(err.error && typeof err.error.error ) {

            this.showSnackBar(err.error.error, 3000);
          }
          else {
            this.showSnackBar(err.error, 3000);
          }

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

  toTitleCase(str) {
    var i, j, lowers, uppers;
    str = str.replace(/([^\W_]+[^\s-]*) */g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });

    // Certain minor words should be left lowercase unless
    // they are the first or last words in the string
    lowers = ['A', 'An', 'The', 'And', 'But', 'Or', 'For', 'Nor', 'As', 'At',
      'By', 'For', 'From', 'In', 'Into', 'Near', 'Of', 'On', 'Onto', 'To', 'With'];
    for (i = 0, j = lowers.length; i < j; i++) {
      str = str.replace(new RegExp('\\s' + lowers[i] + '\\s', 'g'),
        function(txt) {
          return txt.toLowerCase();
        });
    }


    // Certain words such as initialisms or acronyms should be left uppercase
    uppers = ['Id', 'Tv'];
    for (i = 0, j = uppers.length; i < j; i++) {
      str = str.replace(new RegExp('\\b' + uppers[i] + '\\b', 'g'),
        uppers[i].toUpperCase());
    }

    return str;
  }

  userProfileTitleCase(key) {

    this.userProfile[key] = this.toTitleCase(this.userProfile[key]);
  }
}
