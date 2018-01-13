import { Component, OnInit, AfterViewInit} from '@angular/core';
import { Scholarship } from '../_models/scholarship';
import { UploadFile } from '../_models/upload-file';
import { ScholarshipService } from '../_services/scholarship.service';
import { Observable } from 'rxjs/Observable';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

import {NgForm} from '@angular/forms';

import {NgModel} from '@angular/forms';
import { UserProfileService } from '../_services/user-profile.service';
import { AuthService } from "../_services/auth.service";
import { Title }     from '@angular/platform-browser';
import {MatDialog, MatDialogRef} from '@angular/material';
import {AddQuestionModalComponent} from '../add-question-modal/add-question-modal.component';
import { MyFirebaseService } from "../_services/myfirebase.service";

import { GooglePlaceDirective } from "../_directives/google-place.directive";
import * as firebase from "firebase";

@Component({
  selector: 'app-add-scholarship',
  templateUrl: './add-scholarship.component.html',
  styleUrls: ['./add-scholarship.component.scss']
})
export class AddScholarshipComponent implements OnInit, AfterViewInit{


  EDUCATION_LEVEL = [
    'Secondary School',
    'University',
    'College',
    'Workplace or Apprenticeship',
  ]

  EDUCATION_FIELDS = [
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

  stringDict = {
    'city': '',
    'province': '',
    'country': '',
    'eligible_schools':''
  }


  FUNDING_TYPES = [
    'Scholarship',
    'Loan',
    'Other',
  ];

  APPLICATION_FORM_TYPES = [
    'PDF',
    'Web',
    'Other'
  ];


  APPLICATION_SUBMISSION_TYPES = [
    'Email',
    'Physical Mail',
    'Web',
    'Other'
  ];

  LOCATION_TYPES = ['city','province','country']

  userId: number;
  pageNo: number =1;
  scholarship: Scholarship = new Scholarship();
  generalInfo = true; // Display general info section
  showFormUpload = false;
  scholarshipFormFile: File;
  scholarshipSlug;
  appFormFile: UploadFile;
  showUploadLoading=false;
  editMode =false;
  locationData = [];
  locationList = [];
  locationInput: any = {
    city: '',
  }
  locationPlaceHolder = 'City, Province/State, or Country';
  isOwner = false;
  countries = [];
  provinces = []
  cities = []

  activeCountry = '';
  activeProvince:any = {};
  scholarshipOwner;

  scholarshipErrors: any;

  webForms : any;
  myJson = JSON;
  constructor(
    public router: Router,
    public snackBar: MatSnackBar,
    public scholarshipService: ScholarshipService,
    public dialog: MatDialog,
    public authService: AuthService,
    public route: ActivatedRoute,
    public userProfileService: UserProfileService,
    public titleService: Title,
    public firebaseService: MyFirebaseService,
  ) {
    this.scholarshipSlug = route.snapshot.params['slug'];
  }

  ngOnInit() {
    // Retrieve the user id
    this.userId = parseInt(this.authService.decryptLocalStorage('uid'));



    if(this.scholarshipSlug){
      this.editMode = true;
      this.loadScholarshipDatabase();
    }



    this.loadScholarshipDefaults();

  }

  ngAfterViewInit() {

  }

  next() {
    this.pageNo = Math.min(3,this.pageNo+1);
  }

  loadScholarshipDefaults(){
    this.scholarship.owner = this.userId;
    this.scholarship.extra_questions = {};
    this.scholarship.submission_info = {};
    this.webForms = [{"question_key": "", "attribute_type": "", "attribute_value": ""}];
    // TODO: Are most scholarships pdf forms this.APPLICATION_FORM_TYPES[0] or web forms this.APPLICATION_FORM_TYPES[1]
    this.scholarship.submission_info.application_form_type = this.APPLICATION_FORM_TYPES[0];
    this.scholarship.funding_type = [this.FUNDING_TYPES[0]];
    this.scholarship.reference_letter_required =0;
    this.scholarship.number_available_scholarships =1;
    this.stringDict.eligible_schools = '';
    this.stringDict['city'] = '';

    this.scholarship.submission_info.web_form_entries = [
      {
        attribute_type : '',
        attribute_value: '',
        question_key: ''
      },];

    this.scholarship.submission_info.web_form_parent = {
      element_type: '',
      attribute_type : '',
      attribute_value: '',
    };

    this.userProfileService.getById(this.scholarship.owner)
      .subscribe(
        user => {
          this.scholarshipOwner = user;
          if (this.userId==this.scholarship.owner) {
            this.isOwner = true;
          }
          this.arrayToString();

        },
        err => {

        },
      )

  }

  loadScholarshipDatabase(){
    this.scholarshipService.getBySlug(this.scholarshipSlug)
      .subscribe(
        scholarship => {
          this.scholarship = scholarship;


          //If the current scholarship has a web form and the web_form_entries have not been defined, initialize them with default values
          if(this.scholarship.submission_info.application_form_type=='Web' && !this.scholarship.submission_info.web_form_entries){
            this.scholarship.submission_info.web_form_entries = [
              {
                attribute_type : '',
                attribute_value: '',
                question_key: ''
              },
            ];
          }
          if(this.scholarship.submission_info.application_form_type=='Web' && !this.scholarship.submission_info.web_form_parent){
            this.scholarship.submission_info.web_form_parent = {
              element_type: '',
              attribute_type : '',
              attribute_value: '',
            };
          }
          //The webForms value in the table is populated using the scholarship.submission_info.web_form_entries
          this.webForms = this.scholarship.submission_info.web_form_entries;

          // Get the user profile of the scholarship owner

          this.titleService.setTitle('Atila - Edit - ' + this.scholarship.name);

          if (this.scholarship.owner){
            this.userProfileService.getById(scholarship.owner)
              .subscribe(
                user => {
                  this.scholarshipOwner = user;
                  if (this.userId==this.scholarship.owner) {
                    this.isOwner = true;
                  }
                  this.arrayToString();

                },
                err => {

                },
              )
          }

          this.initializeLocations();
        },
        err => {

        },

        () => {
              if (this.userId==this.scholarship.owner) {
                this.isOwner = true;
              }

              if(this.editMode && !this.isOwner){
                $("#scholarshipForm :input").prop("disabled", true);
              }
        }
      );
  }

  openModal() {
    let dialogRef = this.dialog.open(AddQuestionModalComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        this.scholarship.extra_questions[result.key] = result;
      }
    });
  }

  // Edit existing question
  edit(key: string) {
    let dialogRef = this.dialog.open(AddQuestionModalComponent, {
      data: this.scholarship.extra_questions[key]
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.scholarship.extra_questions[key] = result;
      }
    });
  }

  // Edit existing question from question array
  delete(key: string) {
    delete this.scholarship.extra_questions[key];
  }

  back() {
    this.pageNo = Math.max(1,this.pageNo-1);
  }

  generateArray(obj){
    return Object.keys(obj).map((key)=>{ return obj[key]});
  }

  saveScholarship(scholarshipForm: NgForm) {

    this.scholarshipErrors = null;
    if(this.editMode && !this.isOwner){
      this.snackBar.open("You are not authorized to make Changes", '', {
        duration: 3000
      });
      return;
    }
    if (scholarshipForm.valid) {
      let postOperation: Observable<Scholarship>;
      this.scholarship.owner = this.userId;

      let locationData  = {
        countries: this.countries,
        provinces: this.provinces,
        cities: this.cities
      }

      let sendData = {
        'scholarship': this.scholarship,
        'locationData': this.locationList,
      }




      if(this.editMode){


        this.scholarshipService.updateAny(sendData)
          .subscribe(
            res =>{

              this.loadScholarshipDatabase();

              this.snackBar.open("Scholarship succesfully Saved", '', {
                duration: 3000
              });

            },
            err => {
              this.scholarshipErrors = JSON.stringify(err.error);

              this.firebaseService.saveAny('error_logs/scholarships',err);
              this.snackBar.open("Error - " + this.scholarshipErrors, '', {
                duration: 3000
              });
            }
          )
      }

      else{

        postOperation = this.scholarshipService.createAny(sendData);

        postOperation.subscribe(
          data => {

            this.snackBar.open("Scholarship succesfully created", '', {
              duration: 3000
            });
            this.showFormUpload = true;
            this.scholarship=data;
            // todo change to this.router.navigate(['my-scholarships'])
            //this.router.navigate(['scholarships-list']);
          },
          err => {
            this.scholarshipErrors = JSON.stringify(err.error);
            this.firebaseService.saveAny('error_logs/scholarships',err);
            this.snackBar.open("Error - " + this.scholarshipErrors, '', {
              duration: 3000
            });

          }
        )
      }
    }
    else {

      this.snackBar.open("Invalid form", '', {
        duration: 3000
      });
    }
  }

  scholarshipAppFormChangeEvent(fileInput: any){

    this.scholarshipFormFile = fileInput.target.files[0];
  }

  uploadScholarshipAppForm(){
    //let uploadOperation: Observable<any>;

    //create Upload file and configure its properties before uploading.
    this.showUploadLoading = true;
    this.appFormFile = new UploadFile(this.scholarshipFormFile);
    this.appFormFile.name = this.scholarshipFormFile.name;
    this.appFormFile.uploadInstructions = {
      type: 'update_model',
      model: "Scholarship",
      id: this.scholarship.id,
      fieldName: 'form_url'
    }

    this.appFormFile.path = "scholarships/" + this.scholarship.id + "/scholarship-templates/"
    this.appFormFile.path = this.appFormFile.path + this.appFormFile.name


    delete this.scholarship.submission_info['pdf_already_parsed'];
    this.fileUpload(this.appFormFile)
      .subscribe(
        res => {
        }
      )

  }

  formNeedsParsing() {
    delete this.scholarship.submission_info['pdf_already_parsed'];
  }

  //TODO: Refactor this code into the firebase service
  fileUpload(uploadFile: UploadFile){
    return this.authService.getAPIKey("FIREBASE_CONFIG_KEYS")
      .map(res => this.uploadFileFirebase(res, uploadFile))
      .catch(err=>Observable.throw(err))
  }

  uploadFileFirebase(res: Response, uploadFile: UploadFile){
    /**
     * Refactor this into a firebase service, using streaming of observables.
     */


    let config;
    config = res['api_key'];

    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    }

    uploadFile.name = config.toString();
    //why does google documentation use var instead of ref

    //preparing the firebase storage for upload
    var storage = firebase.storage();
    let storageRef = storage.ref();
    let uploadRef = storageRef.child(uploadFile.path);
    var metadata = {
      contentType: uploadFile.file.type,
      size: uploadFile.file.size,
      name: uploadFile.file.name,
    };


    var uploadTask = uploadRef.put(uploadFile.file, metadata);

    //https://firebase.google.com/docs/storage/web/upload-files?authuser=0

    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot:any) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

      },
      (error)=> {

      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        //var downloadURL = uploadTask.snapshot.downloadURL;

        this.scholarship.form_url = uploadTask.snapshot.downloadURL;
        this.showUploadLoading = false;

      });


  }

  initializeLocations(){
    // See createLocations() int edit-scholarship or add-scholarship.component.ts
    for (var index = 0; index < this.scholarship.country.length; index++) {
      var element = this.scholarship.country[index];
      this.locationList.push({
        'country': element.name
      });
    }

    for (var index = 0; index < this.scholarship.province.length; index++) {
      var element = this.scholarship.province[index];
      this.locationList.push({
        'country': element.country,
        'province':element.name
      });
    }

    for (var index = 0; index < this.scholarship.city.length; index++) {
      var element = this.scholarship.city[index];
      this.locationList.push({
        'country': element.country,
        'province':element.province,
        'city': element.name,
      });
    }


  }

  deleteLocationRow(index: number){
    this.locationList.splice(index,1)
  }
  saveTableChanges(tableData: any[]){
    this.webForms = tableData;
    this.scholarship.submission_info.web_form_entries= tableData;

  }

  arrayToString(){
    var i =0;
    //convert the various JSOn values to string for displaying in the text input
    for (var key in this.stringDict){//for each key [ 'city', 'proince',...]
      i =0;
      for(var element in this.scholarship[key]){ //i.e. for each value within the city key, append each city value to a city string
        if(i==0){


          this.stringDict[key]= element;
        }
        else{
          this.stringDict[key] = this.stringDict[key] + ", " + element;
        }
        i++;
      }

    }


  }

  //Location Google API

  /**
   * Adding Google Places API Autocomplete for User Location:
   * @param {google.maps.places.PlaceResult} placeResult
   * https://developers.google.com/maps/documentation/javascript/reference#PlaceResult
   * https://developers.google.com/maps/documentation/javascript/places-autocomplete#address_forms
   * https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete-addressform
   * https://stackoverflow.com/questions/42341930/google-places-autocomplete-angular2
   */
  placeAutoComplete(placeResult:any, locationModel: NgModel){ //Assign types to the parameters place result is a PlaceResult Type, see documentation


    this.predictLocation(this.locationInput, placeResult);

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
    //remove the autocomplet original query

    this.locationInput = {};


    addressComponents.forEach(element => {

      if(element.types[0]=='locality' || element.types[0]=='administrative_area_level_3'){
        this.locationInput.city = element.long_name;
        this.locationInput.name = this.locationInput.city;
      }

      if(element.types[0]=='administrative_area_level_1'){
        this.locationInput.province = element.long_name;
      }

      if(element.types[0]=='country'){
        this.locationInput[element.types[0]] = element.long_name;
      }
    });

    //prevent changes in locationInput to be tracked in LocationList
    this.locationList.push(JSON.parse(JSON.stringify(this.locationInput)));






  }
  /**
   * If the Google Place API did not load, then change the placeholder message to only ask for a city (or country?).
   */
  googlePlaceNoLoad(){
    this.locationPlaceHolder = 'City'
  }

  configureSubmissionInfo() {
    if(typeof this.scholarship.submission_info.email_subject_is_custom == 'undefined') {
      this.scholarship.submission_info.email_subject_is_custom = false;
      this.scholarship.submission_info.email_subject = `${this.scholarshipOwner.first_name} ${this.scholarshipOwner.last_name}'s ${this.scholarship.name} Application`;
    }
  }

  /**
   * If user presses enter on location button, don't allow the form to submit because we still need to pull the location Data from Google Maps.
   */
  keyDownHandler(event: Event) {


    if((<KeyboardEvent>event).keyCode == 13) {

      // rest of your code


      event.preventDefault();
    }
    //TODO! Change this, allow user to submit with enterButton.
  }

  // convertHtml(){
  //   // https://stackoverflow.com/questions/8806673/html-how-to-retain-formatting-in-textarea/22353003#22353003
  //   jQuery('#htmlTextArea').val( jQuery('#htmlsource').html() );
  // }

}


