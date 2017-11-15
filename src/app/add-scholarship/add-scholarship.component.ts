import { Component, OnInit } from '@angular/core';
import { Scholarship } from '../_models/scholarship';
import { UploadFile } from '../_models/upload-file';
import { ScholarshipService } from '../_services/scholarship.service';
import { Observable } from 'rxjs/Rx';
import { MdSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

import {NgForm} from '@angular/forms';

import {NgModel} from '@angular/forms';
import { UserProfileService } from '../_services/user-profile.service';
import { AuthService } from "../_services/auth.service";
import { Title }     from '@angular/platform-browser';
import {MdDialog, MdDialogRef} from '@angular/material';
import {AddQuestionModalComponent} from '../add-question-modal/add-question-modal.component';
import { MyFirebaseService } from "../_services/myfirebase.service";

import { GooglePlaceDirective } from "../_directives/google-place.directive";
import * as firebase from "firebase";

@Component({
  selector: 'app-add-scholarship',
  templateUrl: './add-scholarship.component.html',
  styleUrls: ['./add-scholarship.component.scss']
})
export class AddScholarshipComponent implements OnInit {


  EDUCATION_LEVELS = [
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
  ]


  
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
  locationPlaceHolder
  countries = [];
  provinces = []
  cities = []

  activeCountry = '';
  activeProvince:any = {};
  scholarshipOwner;

  webForms;
  myJson = JSON;
  constructor(
    private router: Router,
    private snackBar: MdSnackBar,
    private scholarshipService: ScholarshipService,
    public dialog: MdDialog,
    private authService: AuthService,
    private route: ActivatedRoute,
    private userProfileService: UserProfileService,
    private titleService: Title,
  ) {
    this.scholarshipSlug = route.snapshot.params['slug']; 
   }

  ngOnInit() {
    // Retrieve the user id
    this.userId = parseInt(localStorage.getItem('userId'));

    if(this.scholarshipSlug){
      this.editMode = true;
      this.loadScholarshipDatabase();
    }

    

    this.loadScholarshipDefaults();

  }

  stringInputToArray(event: any){
    console.log('toArrayInput, event', event);
    console.log('this.stringDict; ', this.stringDict);
    console.log(this.scholarship);

    this.scholarship[event.target.name] = {};
    var tempString = event.target.value;
    tempString = tempString.trim();
    console.log('tempString', tempString);
    var stringArray: string[] = tempString.split(",");
    stringArray.forEach(element => {
      element = element.trim();
      this.scholarship[event.target.name][element] = element;
    });
    for( var key in stringArray){
      
      console.log("this.scholarship[event.target.name][key]", this.scholarship[event.target.name][key]);
    }

    console.log("this.scholarship[event.target.name]", this.scholarship[event.target.name]);
    console.log("event.target.value.split(',')", event.target.value.split(","));
    

   /* for (var i = 0; i < event.srcElement.form.length; i++) {
      console.log('form[',i,']: event.srcElement.form[i]', event.srcElement.form[i]);
      event.srcElement.form[i].disabled = true;
      
    }
    */


    console.log('after stringInputToArray: this.scholarship:', this.scholarship);

  }

  createLocation(type:string){

    switch (type) {
      case 'countries':
        { 
          this.countries.push({
            'country': ''
          });
        }
        break;
      case 'provinces':
      { 
        this.provinces.push({
          'country': this.activeCountry,
          'province':''
        });
      }
      break;
      case 'provinces':
      { 
        this.provinces.push({
          'country': this.activeCountry,
          'province':''
        });
      }
      break;
      
      case 'cities':
      { 
        //loop through the provinces objects, looking for the 
        //matching province and extract its country
        this.cities.push({
          'country': this.activeProvince.country,
          'province':this.activeProvince.province,
          'city': ''
        });

        console.log('editLocation this.provinces', this.provinces);
        console.log('editLocation this.provinces[0].province', this.provinces[0].province);
        console.log('editLocation this.activeProvince', this.activeProvince);
      }
      break;
      
      default:
        break;
    }

    console.log('editLocation this[type]', this[type]);
  }

  removeLocation(index:number,type:string, value:string){

    
    console.log('removeLocation', index,type, value);
    console.log('this[type]', this[type]);
    
    this[type].splice(index,1);
    
    /*switch (type) {
      case 'countries':
        { 
          this.countries.splice(index,1);
        }
        break;
      case 'provinces':
      { 
        this.provinces.splice(index,1);
      }
      break;
      case 'cities':
      { 
        this.cities.splice(index,1);
      }
      break;
      
      default:
        break;
    }
    */
    
  }

  editLocation(index:number, type: string, event: any){

    switch (type) {
      case 'countries':
        { 
          this.countries[index] = {
            'country':event.target.value
          };
        }
        break;
      case 'provinces':
      { 
        this.provinces[index] = {
          'country': this.activeCountry,
          'province':event.target.value
        };
      }
      break;

      case 'cities':
      {
        //loop through the provinces objects, looking for the 
        //matching province and extract its country

        this.cities[index] = {
          'country': this.activeProvince.country,
          'province':this.activeProvince.province,
          'city': event.target.value
        };
      }
      break;
      
      default:
        break;
    }
    console.log('editLocation', index, event.target.value);
  }

  setActiveLocation(event:any, type:string, value: any[]){
    //value will be an array of locations, we are looking for the
    //value where event.value == value[i].type
    
    console.log('setActiveLocation before',this.activeCountry);
    console.log('setActiveLocation before event',event);
    switch (type) {
      case 'country':
        {
          this.activeCountry = event.value;
        }
        break;
        
      case 'province':
      {
        this.activeProvince = {
          'country': '',
          'province': event.value
        } 

        for (var i = 0; i < this.provinces.length; i++) {
          var element = this.provinces[i];
          if(element.province==this.activeProvince.province){
            console.log('match  element.province,this.activeProvince', element.province,this.activeProvince);
            this.activeProvince.country = element.country;
            break;
          }
        }

      }

      break;
      default:
        break;
  }
    console.log('setActiveLocation AFTER',this.activeCountry);
  }

  trackByFn(index: any, item: any) {
    return index;

  }

  next() {
    this.pageNo = Math.min(3,this.pageNo+1);
  }

  loadScholarshipDefaults(){
    this.scholarship.owner = this.userId;
    this.scholarship.extra_questions = {};
    this.scholarship.submission_info = {};
    // TODO: Are most scholarships pdf forms this.APPLICATION_FORM_TYPES[0] or web forms this.APPLICATION_FORM_TYPES[1]
    this.scholarship.submission_info.application_form_type = [this.APPLICATION_FORM_TYPES[0]];
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
              console.log('edit-scholarship, ngOnInit: ', this.scholarship);
              this.arrayToString();
              
            },
            err => {
              console.log(err);
            }
          )
        }

        this.initializeLocations();
      },
      err => {
        console.log(err);
      }
    );
  }

  openModal() {
    let dialogRef = this.dialog.open(AddQuestionModalComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('dialogRef.afterClosed().subscribe(result => ', result);
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
  createScholarship(scholarshipForm) {

    if (scholarshipForm.valid) {
      console.log('createScholarship, this.scholarship: ',this.scholarship);
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


      console.log('createScholarship, sendData: ',sendData);

      if(this.editMode){
        this.scholarshipService.updateAny(sendData)
        .subscribe(
          res =>{
            console.log('scholarshipService.update res', res);
            this.snackBar.open("Scholarship succesfully Saved", '', {
              duration: 3000
            });
          },
          err => {console.log('scholarshipService.update err', err);
            this.snackBar.open("Error - " + err, '', {
            duration: 3000
          });
        }
        )
      }

      else{

        postOperation = this.scholarshipService.createAny(sendData);
        
        postOperation.subscribe(
          data => {
            console.log('scholarship created:',data)
            this.snackBar.open("Scholarship succesfully created", '', {
              duration: 3000
            });
            this.showFormUpload = true;
            this.scholarship=data;
            // todo change to this.router.navigate(['my-scholarships'])
            //this.router.navigate(['scholarships-list']);
          },
          err => {
            this.snackBar.open("Error - " + err, '', {
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
    console.log("fileInput:", fileInput);
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
    console.log('this.scholarshipFormFile',this.scholarshipFormFile)
    this.appFormFile.path = "scholarships/" + this.scholarship.id + "/scholarship-templates/"
    this.appFormFile.path = this.appFormFile.path + this.appFormFile.name
    console.log('this.appFormFile',this.appFormFile);
    
    this.fileUpload(this.appFormFile)
    .subscribe(
      res => console.log('uploadScholarshipAppForm, subscribe() res', res)
    )
  
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
    console.log("uploadFileInternal: res",res,'uploadFile',uploadFile);
    
    let config;
    config = res['api_key'];
    console.log("config",config);
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    }
    console.log("firebase after config",firebase);
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
    console.log('uploadRef',uploadRef)
    console.log('uploadRef.getDownloadURL()',uploadRef.getDownloadURL());
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
        console.log('Upload is ' + progress + '% done');
      },
        (error)=> {
        console.log(error);
      },
        () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        //var downloadURL = uploadTask.snapshot.downloadURL;
        console.log('Finished upload: uploadTask.snapshot', uploadTask.snapshot );
        this.scholarship.form_url = uploadTask.snapshot.downloadURL;
        this.showUploadLoading = false;
                                                          
      });
    
    
  }


  initializeLocations(){
    // See createLocations() int edit-scholarship or add-scholarship.component.ts
    for (var index = 0; index < this.scholarship.country.length; index++) {
      var element = this.scholarship.country[index];
      this.countries.push({
        'country': element.name
      });
    }

    for (var index = 0; index < this.scholarship.province.length; index++) {
      var element = this.scholarship.province[index];
      this.provinces.push({
        'country': element.country,
        'province':element.name
      });
    }

    for (var index = 0; index < this.scholarship.city.length; index++) {
      var element = this.scholarship.city[index];
      this.cities.push({
        'country': element.country,
        'province':element.province,
        'city': element.name,
      });
    }
  }
  
  saveTableChanges(tableData: any[]){
    this.webForms = tableData;
    console.log('saveTableChanges() tableData: ', tableData);
    console.log('saveTableChanges() this.webForms: ', this.webForms);
    console.log('saveTableChanges() this.scholarship.submission_info: ', this.scholarship.submission_info);
    this.scholarship.submission_info.web_form_entries= tableData;
    console.log('saveTableChanges() this.scholarship',this.scholarship)
  }
  saveEditScholarship(scholarshipForm: NgForm) {
    
    console.log('!!this.scholarship.extra_questions', !!this.scholarship.extra_questions);

    if (scholarshipForm.valid){
      this.scholarshipService.update(this.scholarship)
      .subscribe(
        res =>{
          this.scholarship = res,
          console.log('scholarshipService.update res', res);
          this.snackBar.open("Scholarship succesfully Saved", '', {
            duration: 3000
          });
        },
        err => {console.log('scholarshipService.update err', err);
          this.snackBar.open("Error - " + err, '', {
          duration: 3000
        });
      }
      )
    }
          
  }
  
  arrayToString(){
    var i =0;
    //convert the various JSOn values to string for displaying in the text input
    for (var key in this.stringDict){//for each key [ 'city', 'proince',...] 
    i =0;
      for(var element in this.scholarship[key]){ //i.e. for each value within the city key, append each city value to a city string
          if(i==0){
            console.log('city',);
            console.log('this.scholarship.city[city]',this.scholarship[key]);
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
    console.log('Preview.componenent placeAutoComplete() event: ', placeResult, 'location: ', location);

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
    console.log('BEFORE delete this.locationInput', this.locationInput);
    this.locationInput = {};
    
    console.log('AFTER delete this.locationInput', this.locationInput);
    addressComponents.forEach(element => {
      console.log('addressComponents.forEach(element', element);
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

    console.log('locationList:', this.locationList);

    

    
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
    console.log('keyDownHandler, regular key press NBD ', event);
    
    if((<KeyboardEvent>event).keyCode == 13) {
      console.log('you just clicked enter');
      // rest of your code
      console.log('keyDownHandler', event);

      event.preventDefault(); 
    }
    //TODO! Change this, allow user to submit with enterButton.
  }
  }



