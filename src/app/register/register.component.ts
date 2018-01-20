import { Component, OnInit } from '@angular/core';
import {NgForm, NgModel} from "@angular/forms";
import { Router, RouterModule } from "@angular/router";

import { MatSnackBar } from '@angular/material';
import { UserProfile, toTitleCase } from '../_models/user-profile';
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


    if (registerForm.valid) {
      this.disableRegistrationButton = true;
      let postOperation: Observable<any>;
      // Create a new User

      let sendData = {
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
    return toTitleCase(str);
  }

  /**
   * Adding Google Places API Autocomplete for User Location:
   * @param {google.maps.places.PlaceResult} placeResult
   * https://developers.google.com/maps/documentation/javascript/reference#PlaceResult
   * https://developers.google.com/maps/documentation/javascript/places-autocomplete#address_forms
   * https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete-addressform
   * https://stackoverflow.com/questions/42341930/google-places-autocomplete-angular2
   */
  placeAutoComplete(placeResult:any, locationModel: NgModel){ //Assign types to the parameters place result is a PlaceResult Type, see documentation


    this.predictLocation(this.locationData, placeResult);

  }

  /**
   * Translate the PlaceResult object into an Atila location object, containing only the city, province/state and country.
   * @param location
   * @param placeResult
   */
  predictLocation(location, placeResult){

    var addressComponents = placeResult.address_components ;

    var keys = ['city', 'province', 'country'];

    //TODO: Find a more elegant solution for this.


    addressComponents.forEach((element, i, arr) => {
      if(element.types[0]=='locality' || element.types[0]=='administrative_area_level_3' ||  element.types[0]=='postal_town'||  element.types[0]=='sublocality_level_1'){
        this.locationData.city = element.long_name;
      }

      if(element.types[0]=='administrative_area_level_1'){
        this.locationData.province = element.long_name;
      }

      if(element.types[0]=='country'){
        this.locationData[element.types[0]] = element.long_name;
      }
    });

  }


  /**
   * If user presses enter on location button, don't allow the form to submit because we still need to pull the location Data from Google Maps.
   */
  keyDownHandler(event: Event) {

    if((<KeyboardEvent>event).keyCode == 13) {

      event.preventDefault();
    }
    //TODO! Change this, allow user to submit with enterButton.
  }

}
