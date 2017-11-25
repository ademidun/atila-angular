import { Component, OnInit, Inject } from '@angular/core';
import { UserProfile } from '../_models/user-profile'
import { UserProfileService } from "../_services/user-profile.service";

import {NgForm} from '@angular/forms';

import { Observable } from 'rxjs/Observable';

import { Router, ActivatedRoute } from '@angular/router'
import { MatSnackBar } from '@angular/material';

import { Title }     from '@angular/platform-browser';

import { UploadFile } from '../_models/upload-file';

import { AuthService } from "../_services/auth.service";

import { MyFirebaseService } from "../_services/myfirebase.service";

import * as firebase from "firebase";

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {

  EDUCATION_LEVEL = [
    'High School',
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

  userProfile = new UserProfile();
  profileInfo = true;
  documentScholarshipsPercent =87;

  userDocuments = {};

  userName: string;

  formFile: File;
  formFileEvent: any;
  uploadFile: UploadFile;
  locationData = {
    'city': '',
    'province': '',
    'country': '',
  }

  constructor(
    public userProfileService: UserProfileService,
    public router: Router,
    public route: ActivatedRoute,
    public snackBar: MatSnackBar,
    public titleService: Title,
    public authService: AuthService,
  ) {
    this.userName = route.snapshot.params['username'];
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


          },
          err => {


          }
        )
    }
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
  saveProfile(profileForm) {
    if (profileForm.valid) {

      var sendData = {
        userProfile: this.userProfile,
        locationData: this.locationData,
      }


      this.userProfileService.updateAny(sendData)
      .subscribe(
        data => {

          this.showSnackBar("Succesfully Updated Your Profile, Welcome to Atila",'What Next?', 3000);
        },
        err => {

          this.showSnackBar('Profile updated unsuccessfully - ' + err.error? err.error: err,'', 3000);
        }
      )



    } else {
      this.showSnackBar("Profile is not valid",'', 3000);
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
    this.uploadFile.name = this.authService.hashFileName(this.formFile.name);
    this.uploadFile.path = "user-profiles/" + this.userProfile.user + "/documents/"
    this.uploadFile.path = this.uploadFile.path + this.uploadFile.name


    this.fileUpload(this.uploadFile)
    .subscribe(
      res => {}
    )

  }

//TODO: Refactor this code into the firebase service
fileUpload(uploadFile: UploadFile){
  return this.authService.getAPIKey("FIREBASE_CONFIG_KEYS")
  .map(res => this.uploadFileFirebase(res, uploadFile))
  .catch(err=>Observable.throw(err))
}

uploadFileFirebase(res: Response, uploadFile: UploadFile){



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

      //this.userProfile.form_url = uploadTask.snapshot.downloadURL;

      //get the userProfile attribute that needs to be saved.
      //Will this have a significant impact on speed? As opposed to just saving the event ID as a variable
      this.userProfile[this.formFileEvent.target.id] = uploadTask.snapshot.downloadURL;

    });


    }


// SnackBar notification
showSnackBar(text: string, action = '', duration: number) {
  this.snackBar.open(text, action, {
    duration: duration
  });
}

}


