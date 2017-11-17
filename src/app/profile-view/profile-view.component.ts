import { Component, OnInit, AfterContentInit } from '@angular/core';
import { UserProfile } from '../_models/user-profile';

import { UploadFile } from '../_models/upload-file';
import { UserProfileService } from '../_services/user-profile.service';
import { ActivatedRoute, Router } from '@angular/router';

import { Title }     from '@angular/platform-browser';
import { AuthService } from "../_services/auth.service";
import { MdSnackBar } from '@angular/material';


import { MessagingService } from '../_services/messaging.service';

import { Thread } from '../_models/thread';

import { Observable } from 'rxjs/Rx';
import * as firebase from "firebase";
import * as $ from 'jquery';
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

  currentUser:number;
  constructor(
    route: ActivatedRoute,
    private userProfileService: UserProfileService,
    private titleService: Title,
    private snackBar: MdSnackBar,
    private authService: AuthService,
    private router: Router,
    private messagingService: MessagingService
  ) { 
    this.userNameSlug = route.snapshot.params['username'];
  }

  ngOnInit() {
    this.userProfileService.getByUsername(this.userNameSlug).subscribe(
      res => {
        this.userProfile = res;
        this.titleService.setTitle('Atila - ' + this.userProfile.first_name + " " +this.userProfile.last_name +"'s profile");

        this.currentUser = parseInt(this.authService.decryptLocalStorage('uid')); // Current user
        this.profileOwner = (this.currentUser == this.userProfile.user);
      } 
    )

    //hide the .mat-card-header text div

    
  }

  ngAfterContentInit() {
    // https://stackoverflow.com/questions/43934727/how-to-use-jquery-plugin-with-angular-4
    console.log('ngAfterContentInit to hide .mat-card-header-text BEFORE',$('.mat-card-header-text'));
    
    $('.mat-card-header-text').css('display','none');
    
    console.log('ngAfterContentInit to hide .mat-card-header-text AFTER',$('.mat-card-header-text'));
  }

//TODO: Nov 5 implement profile pic upload
  uploadProfilePic(uploadPicInput:HTMLInputElement){
    //let uploadOperation: Observable<any>;

    //create Upload file and configure its properties before uploading.
    console.log('uploadPicInput',uploadPicInput);

    var uploadPicFile = uploadPicInput.files[0];

    console.log('uploadPicFile',uploadPicFile);

    
    this.profilePicFile = new UploadFile(uploadPicFile);

    // Instructions on how the file should be saved to the database
    this.profilePicFile.uploadInstructions = {
      type: 'update_model',
      model: "UserProfile",
      id: this.userProfile.user,
      fieldName: 'profile_pic_url'
    }
    console.log('this.profilePicFile',this.profilePicFile)

    // the path where the file should be saved on firebase
    this.profilePicFile.path = "user-profiles/" + this.userProfile.user+ "/profile-pictures/"
    this.profilePicFile.path = this.profilePicFile.path + this.profilePicFile.name
    console.log('this.profilePicFile',this.profilePicFile);
    
    this.fileUpload(this.profilePicFile)
    .subscribe(
      res => console.log('uploadScholarshipAppForm, subscribe() res', res)
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
    
    console.log("uploadFileInternal: res",res,'uploadFile',uploadFile);
    
    let config;
    config = res['api_key'];
    console.log("config",config);
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    }
    
    //Initiliazing the firebase client
    //https://angularfirebase.com/lessons/angular-file-uploads-to-firebase-storage/
    //

    uploadFile.name = config.toString();
    var storage = firebase.storage();
    let storageRef = storage.ref();
    let uploadRef = storageRef.child(uploadFile.path);
    var metadata = {
      contentType: uploadFile.file.type,
      size: uploadFile.file.size,
      name: uploadFile.file.name,
    };
    
    var uploadTask = uploadRef.put(uploadFile.file, metadata);

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
    (snapshot:any) => {
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      this.uploadProgress = progress;
      console.log('Upload is ' + progress + '% done');
    },
    (error)=> {
      console.log(error);
    },
    () => {
      console.log('Finished upload: uploadTask.snapshot', uploadTask.snapshot );
      this.userProfile.profile_pic_url = uploadTask.snapshot.downloadURL;
      this.uploadProgress = null;
      this.saveProfile();
                                                        
    });
    
    
  }
  

  saveProfile(){
    this.userProfileService.updateHelper(this.userProfile)
    .subscribe(
      data => {
        this.showSnackBar("Succesfully Updated Your Profile",'', 3000);
        this.userProfile = data;
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

  message() {
    let thread = new Thread([this.currentUser, this.userProfile.user]);
    this.messagingService.getOrCreateThread(thread)
      .subscribe(
        res => {
          console.log(res);
          //todo assosciate a username with a thread
          // this.router.navigate(['messages', this.currentUser]);
          this.router.navigate(['messages']);
        }, 
        err => {
          console.log(err);
        }
      )
  }

}
