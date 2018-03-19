import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import { UserProfile, toTitleCase } from '../../_models/user-profile';
import { UserProfileService } from "../../_services/user-profile.service";

import {NgForm, NgModel} from '@angular/forms';

import { Observable } from 'rxjs/Observable';

import { Router, ActivatedRoute } from '@angular/router'
import {MatAutocompleteSelectedEvent, MatSnackBar} from '@angular/material';

import { Title }     from '@angular/platform-browser';

import { UploadFile } from '../../_models/upload-file';

import { AuthService } from "../../_services/auth.service";

import { MyFirebaseService } from "../../_services/myfirebase.service";

import * as firebase from "firebase";
import {environment} from '../../../environments/environment';

import {FormControl} from '@angular/forms';
import {startWith} from 'rxjs/operators/startWith';
import {map} from 'rxjs/operators/map';
import {debounceTime} from 'rxjs/operators/debounceTime';
import {ACTIVITIES, COUNTRIES, DISABILITY, ETHNICITY, RELIGION, SCHOOLS_DICT, SPORTS} from '../../_models/constants';
import {ScholarshipService} from '../../_services/scholarship.service';
import {SCHOOLS_LIST, MAJORS_LIST, LANGUAGE} from '../../_models/constants';
import {prettifyKeys} from '../../_shared/utils';
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EditProfileComponent implements OnInit {

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

  userProfile = new UserProfile();
  profileInfo = true;
  documentScholarshipsPercent =87;

  Object = Object;
  userName: string;

  formFile: File;
  environment = environment;
  formFileEvent: any;
  uploadFile: UploadFile;
  verificationResponse: any;
  locationPlaceHolder: any;
  SCHOOLS_LIST = SCHOOLS_LIST;
  MAJORS_LIST = MAJORS_LIST;
  locationData = {
    'city': '',
    'province': '',
    'country': '',
  };
  uploadProgress: any;

  myControl: FormControl = new FormControl();

  schoolNames: any;

  filteredOptions: Observable<string[]>;

  autoCompleteLists = {
    'activities': ACTIVITIES,
    'sports': SPORTS,
    'ethnicity': ETHNICITY,
    'religion': RELIGION,
    'heritage': COUNTRIES,
    'disability': DISABILITY,
    'citizenship': COUNTRIES,
    'language': LANGUAGE,
  };


  constructor(
    public userProfileService: UserProfileService,
    public router: Router,
    public route: ActivatedRoute,
    public snackBar: MatSnackBar,
    public titleService: Title,
    public authService: AuthService,
    public scholarshipService: ScholarshipService,
    public firebaseService: MyFirebaseService,
  ) {
    this.userName = route.snapshot.params['username'];

    this.schoolNames = SCHOOLS_DICT.map(school => school.name);
  }

  ngOnInit() {
    let userId = this.authService.decryptLocalStorage('uid');
    if (userId) {
      this.userProfileService.getById(parseInt(userId))
        .subscribe(
          data => {
            this.userProfile = data;
            let profileTitle = this.userProfile.first_name +' '+ this.userProfile.last_name + "'s Profile"
            this.titleService.setTitle('Atila - ' + profileTitle);
            this.initializeLocations(this.userProfile.city);

            this.initializeForm();

          },
          err => {


          }
        )
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

            return this.filteredOptions = res.map(element => element['name']);
          },
            err => {

          });
      });
      */

    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(val => this.filterUserInput(val))
      );

  }

  filterUserInput(val: string): string[] {

    //Allow user input to be used if no other choices available;

    let customOptions = this.schoolNames.filter(option =>
      option.toLowerCase().indexOf(val.toLowerCase()) !== -1);

    customOptions.push(val);
    return customOptions;
  }


  switchPage(){
    this.profileInfo = !this.profileInfo;
  }
// https://stackoverflow.com/questions/44227682/angular2-dynamically-add-inputs-for-an-array-of-items

initializeLocations(cities: Array<any>){

    if(cities.length>0){
      this.locationData.city= cities[0].name;
      this.locationData.country=cities[0].country;
      this.locationData.province=cities[0].province;
    }

  }
  saveProfile(profileForm?) {

  this.userProfile.metadata['stale_cache'] = true;
    if(!profileForm) {
      let sendData = {
        userProfile: this.userProfile,
        locationData: this.locationData,
      };


      this.userProfileService.updateAny(sendData)
        .subscribe(
          data => {

            this.showSnackBar("Successfully Updated Your Profile.",'', 3000);
          },
          err => {

            this.showSnackBar('Profile updated unsuccessfully - ' + err.error? err.error: err,'', 3000);
          }
        );
      return;
    }
    if (profileForm.valid) {

      let sendData = {
        userProfile: this.userProfile,
        locationData: this.locationData,
      };


      this.userProfileService.updateAny(sendData)
        .subscribe(
          data => {

            this.showSnackBar("Successfully Updated Your Profile.",'', 3000);
          },
          err => {

            this.showSnackBar('Profile updated unsuccessfully - ' + err.error? err.error: err,'', 3000);
          }
        )



    } else {
      this.showSnackBar("Form is not valid",'', 3000);
    }
  }


  fileChangeEvent(fileInput: any){

    //TODO: this seems a bit redundant
    this.formFile = fileInput.target.files[0];
    this.formFileEvent = fileInput;
  }

  uploadUserDocuments(){
    //let uploadOperation: Observable<any>;

    //create Upload file and configure its properties before uploading.

    this.uploadFile = new UploadFile(this.formFile);

    this.uploadFile.metadata['user_field'] = this.formFileEvent.target.id;
    this.uploadFile.metadata['original_name'] = this.uploadFile.name;
    this.uploadFile.metadata['owner'] = this.userProfile.user;
    this.uploadFile.name = this.authService.hashFileName(this.formFile.name);
    // this.uploadFile.path = "user-profiles/" + this.userProfile.user + "/documents/";
    this.uploadFile.path = "user-profiles/" + this.userProfile.user + "/documents/";
    if(this.userProfile.metadata['test_mode']) {

      this.uploadFile.path = "user-profiles/" + 777+ "/documents/";
    }
    this.uploadFile.path = this.uploadFile.path + this.uploadFile.name;


    this.firebaseService.fileUpload(this.uploadFile)
      .subscribe(
        res => {

          let uploadTask = res;
          uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
            (snapshot: any) => {
              this.uploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            },
            (error) => {

              this.snackBar.open('Upload Error','',{ duration: 3000});
              this.uploadProgress = null;
            },
            () => {
              // Handle successful uploads on complete
              // For instance, get the download URL: https://firebasestorage.googleapis.com/...
              //var downloadURL = uploadTask.snapshot.downloadURL;

              //this.userProfile.form_url = uploadTask.snapshot.downloadURL;

              //get the userProfile attribute that needs to be saved.
              //Will this have a significant impact on speed? As opposed to just saving the event ID as a variable
              this.userProfile[this.formFileEvent.target.id] = uploadTask.snapshot.downloadURL;
              this.saveProfile();
              this.uploadProgress = null;

            });
        },
        err => {
          this.showSnackBar(err.message,'', 3000);
        },);

  }

  deleteArrayitem(arr: any[], index) {
    arr.splice(index,1)
  }



// SnackBar notification
showSnackBar(text: string, action = '', duration: number) {
  this.snackBar.open(text, action, {
    duration: duration
  });
}

  verifyAccount(){
    this.userProfileService.refreshVerificationToken(this.userProfile.username)
      .subscribe(
        res =>  {
          this.verificationResponse = res.message;
        },
              err => {},
      )
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

  /**
   * If the Google Place API did not load, then change the placeholder message to only ask for a city (or country?).
   */
  googlePlaceNoLoad(){
    // TODO: Figure out if we need to include this function googlePlaceNoLoad() for the googlePlaceDirective to work.
    this.locationPlaceHolder = 'City'
  }

  typeaheadEvent(event) {
      this.userProfile[event.type] = event.event.item;
  }

  prettifyKeys(str) {
    return prettifyKeys(str);
  }

}


