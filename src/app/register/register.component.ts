import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, NgForm, NgModel} from "@angular/forms";
import { Router, RouterModule } from "@angular/router";

import {MatAutocompleteSelectedEvent, MatSnackBar} from '@angular/material';
import { UserProfile, toTitleCase } from '../_models/user-profile';
import { User } from '../_models/user';
import { Observable } from 'rxjs/Observable';

import { UserProfileService } from '../_services/user-profile.service';

import { AuthService } from "../_services/auth.service";
import {SCHOOLS_DICT, MAJORS_DICT} from '../_models/constants';
import {startWith} from 'rxjs/operators/startWith';
import {map} from 'rxjs/operators/map';
import {AutoCompleteForm, initializeAutoCompleteOptions} from '../_shared/scholarship-form';

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
  locationData = {
  'city': '',
  'province': '',
  'country': '',
};

  disableRegistrationButton: any;
  differentPassword: boolean;
  locationPlaceHolder: any;
  filteredOptions: Observable<string[]>;
  filteredMajors: Observable<string[]>;
  topFilteredMajors: Observable<string[]>;

  schoolNames: any;
  majorNames: any;


  myControl: FormControl = new FormControl();
  majorControl: FormControl = new FormControl();
  topMajorControl: FormControl = new FormControl();

  autCompleteFormGroup: FormGroup;
  autCompleteOptions: any;
  userProfile: UserProfile;
  constructor(
    public router: Router,
    public snackBar: MatSnackBar,
    public userProfileService: UserProfileService,
    public authService: AuthService) {
  }



  ngOnInit() {
    this.userProfile = new UserProfile();


    this.schoolNames = SCHOOLS_DICT.map(school => school.name);

    if(MAJORS_DICT) {
      this.majorNames = MAJORS_DICT.map(major => major.name);
    }
    this.initializeForm();

    this.autCompleteFormGroup = AutoCompleteForm();


    this.autCompleteOptions = initializeAutoCompleteOptions(this.autCompleteFormGroup);

    console.log('this.autCompleteFormGroup',this.autCompleteFormGroup);
    console.log('this.autCompleteOptions',this.autCompleteOptions);
  }

  registerUser(registerForm: NgForm) {

    // if(registerForm) {
    //
    //   this.userProfile.major = this.topMajorControl.value;
    //   return;
    //
    // }

    if (registerForm) {
      console.log('this.userProfile', this.userProfile);

      this.disableRegistrationButton = false;
      return
    }

    if (registerForm.valid) {
      this.disableRegistrationButton = true;
      let postOperation: Observable<any>;


      // Create a new User
      this.userProfile.major = this.topMajorControl.value;
      for (let key in ['city', 'province', 'country'] ) {
        this.locationData[key] = this.locationData[key] ? this.toTitleCase(this.locationData[key]) : this.locationData[key];
      }
      let sendData = {
        user: this.model,
        userProfile: this.userProfile,
        locationData: this.locationData,
      };



      postOperation = this.userProfileService.createUserAndProfile(sendData);
      // Subscribe to Observable
      postOperation.subscribe(
        data => {
          this.model = new User('','','','');
          this.showSnackBar('Registration successful', 3000);

          this.authService.isLoggedIn = true;
          this.authService.encryptlocalStorage('token', data.token);
          // this.cookieService.putObject('userId', data.id);
          this.authService.encryptlocalStorage('uid',data.id);

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

  autoCompleteSelected(event?: Event | MatAutocompleteSelectedEvent | any, selectionType?: any, selectionValue?: any) {

    if (event.childComponent) { //Check if this event was triggered by the inerited autocomponent

      selectionType = event.selectionType;
      event = event.event;
    }

    if (selectionType) {

      if (selectionType == 'eligible_schools') {
        if (selectionValue) {
          this.userProfile.eligible_schools.push(selectionValue);
        }
        else {
          this.userProfile.eligible_schools.push(event.option.value);
          event.option.value = "";
        }

      }

      else if (selectionType == 'eligible_programs') {
        if (selectionValue) {
          this.userProfile.eligible_programs.push(selectionValue);
          selectionValue = "";
        }
        else {
          this.userProfile.eligible_programs.push(event.option.value);
          event.option.value = "";
        }

      }
    }

    // if( typeof(event) == 'Event' && (<KeyboardEvent>event).keyCode == 13) {
    if( (<KeyboardEvent>event).keyCode == 13) {

      event.preventDefault();
    }

  }

  initializeForm() {
    /*
    //https://stackoverflow.com/questions/43575515/md-autocomplete-angular2-getting-data-from-server-with-a-service
    this.myControl.valueChanges
      //.debounceTime(500)
      .subscribe(query => {
        this.scholarshipService.searchSchools(query)
          .then(res => {
            console.log('res',res);
            return this.filteredOptions = res.map(element => element['name']);
          },
            err => {
              console.log('err',err);
          });
      });
      */

    let formControl =  new FormControl();

    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(val => this.filterUserInput(val,'school'))
      );

    this.filteredMajors = this.majorControl.valueChanges
      .pipe(
        startWith(''),
        map(val => this.filterUserInput(val,'major'))
      );

    this.topFilteredMajors = this.topMajorControl.valueChanges
      .pipe(
        startWith(''),
        map(val => this.filterUserInput(val,'major'))
      );

  }

  filterUserInput(val: string, type: string): string[] {

    //Allow user input to be used if no other choices available;

    if(type =='school') {
      let customOptions = this.schoolNames.filter(option =>
        option.toLowerCase().indexOf(val.toLowerCase()) !== -1);

      customOptions.push(val);
      return customOptions;
    }
    if (type == 'major') {

      let customOptions = this.majorNames.filter(option =>
        option.toLowerCase().indexOf(val.toLowerCase()) !== -1);

      customOptions.push(val);
      return customOptions;
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
