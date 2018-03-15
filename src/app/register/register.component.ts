import {Component, OnInit} from '@angular/core';
import {FormGroup, NgForm} from "@angular/forms";
import {Router} from "@angular/router";

import {MatSnackBar} from '@angular/material';
import {UserProfile} from '../_models/user-profile';
import {User} from '../_models/user';
import {Observable} from 'rxjs/Observable';

import {UserProfileService} from '../_services/user-profile.service';

import {AuthService} from "../_services/auth.service";
import {MAJORS_LIST, SCHOOLS_LIST} from '../_models/constants';
import {AutoCompleteForm, initializeAutoCompleteOptions} from '../_shared/scholarship-form';

import * as firebase from "firebase";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {


  model = new User('', '', '', '');


  registrationResponse: any;

  isAgreeTerms: boolean;

  EDUCATION_LEVEL = [
    'Secondary School',
    'University',
    'College',
    'Workplace or Apprenticeship',
  ];

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
  ];
  SCHOOLS_LIST = SCHOOLS_LIST;
  MAJORS_LIST = MAJORS_LIST;
  locationData = {
    'city': '',
    'province': '',
    'country': '',
  };

  disableRegistrationButton: any;
  differentPassword: boolean;
  locationPlaceHolder: any;
  autoCompleteFormGroup: FormGroup;
  autoCompleteOptions: any;
  userProfile: UserProfile;

  constructor(public router: Router,
              public snackBar: MatSnackBar,
              public userProfileService: UserProfileService,
              public authService: AuthService) {
  }


  ngOnInit() {
    this.userProfile = new UserProfile();
    this.autoCompleteFormGroup = AutoCompleteForm();
    this.autoCompleteOptions = initializeAutoCompleteOptions(this.autoCompleteFormGroup);
  }

  registerUser(registerForm: NgForm) {

    // if(registerForm) {
    //
    //   this.userProfile.major = this.topMajorControl.value;
    //   return;
    //
    // }
    if (registerForm.valid) {


      if (this.model.password != this.model.confirmPassword) {
        this.snackBar.open('Your passwords do not match.', '', {duration: 3000});
        return;
      }
      this.disableRegistrationButton = true;
      let postOperation: Observable<any>;

      this.userProfile.metadata['incomplete_profile'] = true;
      let sendData = {
        user: this.model,
        userProfile: this.userProfile,
        locationData: null,
      };



      postOperation = this.userProfileService.createUserAndProfile(sendData);
      // Subscribe to Observable


      postOperation.subscribe(
        data => {
          this.model = new User(this.model.email, this.model.username, '', '');
          this.snackBar.open('Registration successful', '', {duration: 3000});

          this.authService.isLoggedIn = true;
          this.authService.encryptlocalStorage('token', data.token);
          // this.cookieService.putObject('userId', data.id);
          this.authService.encryptlocalStorage('uid', data.id);
          this.authService.encryptlocalStorage('firebase_token', data.firebase_token);
          this.userProfile = data.user_profile;

          try {
            firebase.auth().signInWithCustomToken(data.firebase_token)
              .then(res2 => {
                // this.router.navigate(['scholarship']);
              })
              .catch(error => {
                // Handle Errors here.

              });
          }
          catch (err) {

          }

          this.registrationResponse = true;
          this.disableRegistrationButton = false;

        },
        err => {

          this.disableRegistrationButton = false;
          if (err.error && typeof err.error.error) {
            this.snackBar.open(err.error.error, '', {duration: 3000});
          }
          else {
            this.snackBar.open(err.error, '', {duration: 3000});
          }

        },
        () => {
          $.getJSON('//freegeoip.net/json/?callback=?',
            data => {
              this.userProfile.metadata['registration_location'] = data;
              this.userProfileService.updateHelper(this.userProfile)
                .subscribe(res => {
                });

            },
            done => {

            });
        }
      )


    } else {
      this.snackBar.open("Invalid form", '', {
        duration: 3000
      });
    }

  }

  checkPassword() {

    this.differentPassword = this.model.password != this.model.confirmPassword;

  }


}
