import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, NgForm, NgModel} from "@angular/forms";
import { Router, RouterModule } from "@angular/router";

import {MatAutocompleteSelectedEvent, MatSnackBar} from '@angular/material';
import { UserProfile, toTitleCase } from '../_models/user-profile';
import { User } from '../_models/user';
import { Observable } from 'rxjs/Observable';

import { UserProfileService } from '../_services/user-profile.service';

import { AuthService } from "../_services/auth.service";
import {SCHOOLS_LIST, MAJORS_LIST} from '../_models/constants';
import {AutoCompleteForm, initializeAutoCompleteOptions} from '../_shared/scholarship-form';

import * as firebase from "firebase";
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {



  model = new User('','','','');

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
  constructor(
    public router: Router,
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
    console.log('registerForm',registerForm);
    // if(registerForm) {
    //
    //   this.userProfile.major = this.topMajorControl.value;
    //   return;
    //
    // }
    if (registerForm.valid) {


      if (this.model.password!=this.model.confirmPassword) {
        this.snackBar.open('Your passwords do not match.','', {duration: 3000});
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
      console.log('sendData',sendData);


      postOperation = this.userProfileService.createUserAndProfile(sendData);
      // Subscribe to Observable


      postOperation.subscribe(
        data => {
          this.model = new User(this.model.email,this.model.username,'','');
          this.showSnackBar('Registration successful', 3000);

          this.authService.isLoggedIn = true;
          this.authService.encryptlocalStorage('token', data.token);
          // this.cookieService.putObject('userId', data.id);
          this.authService.encryptlocalStorage('uid',data.id);
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
          if(err.error && typeof err.error.error ) {

            this.showSnackBar(err.error.error, 3000);
          }
          else {
            this.showSnackBar(err.error, 3000);
          }

        },
        () =>  {
          $.getJSON('//freegeoip.net/json/?callback=?',
            data => {
              this.userProfile.metadata['registration_location'] = data;
              this.userProfileService.updateHelper(this.userProfile)
                .subscribe(res=>{});

            },
            done => {

            });
        }
      )


    } else {
      this.showSnackBar("Invalid form", 3000);
    }



  }

  checkPassword() {

    this.differentPassword = this.model.password != this.model.confirmPassword;

  }


  deleteArrayitem(arr: any[], index) {
    arr.splice(index,1)
  }


  typeaheadEvent(event) {
    if (event.type == 'major') {
      this.userProfile.major = event.event.item;
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
  placeAutoComplete(placeResult:any, autoCompleteOptions?: any){ //Assign types to the parameters place result is a PlaceResult Type, see documentation

    this.predictLocation(this.locationData, placeResult, autoCompleteOptions);

  }

  /**
   * Translate the PlaceResult object into an Atila location object, containing only the city, province/state and country.
   * @param location
   * @param placeResult
   */
  predictLocation(location, placeResult, autoCompleteOptions?: any){

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
        this.locationData['country'] = element.long_name;
      }
    });
  }


  /**
   * If the Google Place API did not load, then change the placeholder message to only ask for a city (or country?).
   */
  googlePlaceNoLoad(){
    this.locationPlaceHolder = 'City'
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
