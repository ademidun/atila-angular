import { Component, OnInit, AfterContentInit } from '@angular/core';
import { UserProfile } from '../_models/user-profile';

import { UploadFile } from '../_models/upload-file';
import { UserProfileService } from '../_services/user-profile.service';
import { ActivatedRoute, Router } from '@angular/router';

import { Title,DomSanitizer }     from '@angular/platform-browser';
import { AuthService } from "../_services/auth.service";
import { MatSnackBar } from '@angular/material';


import { MessagingService } from '../_services/messaging.service';

import { Thread } from '../_models/thread';

import { Observable } from 'rxjs/Observable';
import * as firebase from "firebase";
import * as $ from 'jquery';
import {ApplicationService} from '../_services/application.service';

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss']
})
export class ProfileViewComponent implements OnInit, AfterContentInit {

  userProfile: UserProfile;
  userNameSlug: string;
  profileOwner: boolean;
  profilePicFile: UploadFile;
  uploadProgress: number;
  showPreview:boolean = false;
  userApplications: any;
  profile_pic_url;

  currentUser:number;

  myAtilaMode: boolean;
  constructor(
    route: ActivatedRoute,
    public userProfileService: UserProfileService,
    public titleService: Title,
    public snackBar: MatSnackBar,
    public authService: AuthService,
    public router: Router,
    public messagingService: MessagingService,
    public applicationService: ApplicationService,
    public sanitization: DomSanitizer,
  ) {
    this.userNameSlug = route.snapshot.params['username'];
  }

  ngOnInit() {

    this.userProfileService.getByUsername(this.userNameSlug).subscribe(
      res => {
        this.userProfile = res;
        this.titleService.setTitle('Atila - ' + this.userProfile.first_name + " " +this.userProfile.last_name +"'s Profile");

        this.currentUser = parseInt(this.authService.decryptLocalStorage('uid')); // Current user
        this.profileOwner = (this.currentUser == this.userProfile.user);

        this.profile_pic_url = this.sanitization.bypassSecurityTrustStyle(`url(${this.userProfile.profile_pic_url})`);


        if (this.router.url.indexOf('my-atila') !== -1) {
          this.myAtilaMode = true;
        }
      }
    )

    //hide the .mat-card-header text div


  }

  ngAfterContentInit() {
    // https://stackoverflow.com/questions/43934727/how-to-use-jquery-plugin-with-angular-4

    $('.mat-card-header-text').css('display','none');

  }

//TODO: Nov 5 implement profile pic upload
  uploadProfilePic(uploadPicInput:HTMLInputElement){
    //let uploadOperation: Observable<any>;

    //create Upload file and configure its properties before uploading.

    var uploadPicFile = uploadPicInput.files[0];

    this.profilePicFile = new UploadFile(uploadPicFile);

    // Instructions on how the file should be saved to the database
    this.profilePicFile.uploadInstructions = {
      type: 'update_model',
      model: "UserProfile",
      id: this.userProfile.user,
      fieldName: 'profile_pic_url'
    };


    // the path where the file should be saved on firebase
    this.profilePicFile.path = "user-profiles/" + this.userProfile.user+ "/profile-pictures/";
    this.profilePicFile.path = this.profilePicFile.path + this.profilePicFile.name;


    this.fileUpload(this.profilePicFile)
    .subscribe(
      res => {}
    )



  }

  //TODO: Refactor this code into the firebase service
  //TODO:
  fileUpload(uploadFile: UploadFile){
    /**
     * Upload handler which gets the Firebase API keys before we upload the file.
     */
    return this.authService.getAPIKey("FIREBASE_CONFIG_KEYS")
    .map(res => this.uploadFileFirebase(res, uploadFile))
    .catch(err=>Observable.throw(err))
  }

  //TODO: Refactor this code into the firebase service
  //TODO: How can we get uploadFileFirebase to return an observable with the URL of the uploaded file
  uploadFileFirebase(res: Response, uploadFile: UploadFile){



    let config;
    config = res['api_key'];

    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    }

    //Initiliazing the firebase client
    //https://angularfirebase.com/lessons/angular-file-uploads-to-firebase-storage/
    //

    uploadFile.name = config.toString();
    let storage = firebase.storage();
    let storageRef = storage.ref();
    let uploadRef = storageRef.child(uploadFile.path);
    let metadata = {
      contentType: uploadFile.file.type,
      size: uploadFile.file.size,
      name: uploadFile.file.name,
    };

    let uploadTask = uploadRef.put(uploadFile.file, metadata);

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
    (snapshot:any) => {
      this.uploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

    },
    (error)=> {

    },
    () => {

      this.userProfile.profile_pic_url = uploadTask.snapshot.downloadURL;
      this.uploadProgress = null;
      this.saveProfile();
      console.log('finished upload this.userProfile:',this.userProfile);

    });


  }


  saveProfile(){

    this.userProfileService.updateHelper(this.userProfile)
    .subscribe(
      data => {
        this.showSnackBar("Succesfully Updated Your Profile",'', 3000);
        this.userProfile = data;
        console.log('finished upload this.userProfile:',this.userProfile);
      },
      err => {
        this.showSnackBar('Profile updated unsuccessfully - ' + err.error,'', 3000);
      }
    )
  }


  showSnackBar(text: string, action = '', duration: number) {
    this.snackBar.open(text, action, {
      duration: duration
    });
  }

  getApplications() {

    if(!this.userApplications){
      this.userProfileService.getApplications(this.userProfile.user)
        .subscribe(
          res => {
            this.userApplications = res.applications;
          },
        )
    }

  }

  saveMyAtila(objectType, atilaObject, index?) {

    if (objectType=='application') {
      let tempObject = Object.assign({}, atilaObject);
      delete tempObject.scholarship;
      this.applicationService.update(tempObject)
        .subscribe(
          res => {
            this.showSnackBar("Succesfully Updated Your Profile",'', 3000);
          },
          err => {
            this.showSnackBar("Error saving profile.",'', 3000);}
        )
    }

    if (objectType=='scholarship') {
      this.saveProfile();
    }
  }

  message() {
    let thread = new Thread([this.currentUser, this.userProfile.user]);
    this.messagingService.getOrCreateThread(thread)
      .subscribe(
        res => {

          //todo assosciate a username with a thread
          // this.router.navigate(['messages', this.currentUser]);
          this.router.navigate(['messages']);
        },
        err => {

        }
      )
  }



}
