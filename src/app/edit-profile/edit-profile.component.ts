import { Component, OnInit, Inject } from '@angular/core';
import { UserProfile } from '../_models/user-profile'
import { UserProfileService } from "../_services/user-profile.service";

import {NgForm} from '@angular/forms';

import { Observable } from 'rxjs/Rx';

import { Router, ActivatedRoute } from '@angular/router'
import { MdSnackBar } from '@angular/material';

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
    private userProfileService: UserProfileService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MdSnackBar,
    private titleService: Title,
    private authService: AuthService,
  ) { 
    this.userName = route.snapshot.params['username'];
  }

  ngOnInit() {
    let userId = localStorage.getItem('userId');
    if (userId) {
      this.userProfileService.getById(parseInt(userId))
        .subscribe(
          data => {
            this.userProfile = data;
            console.log("Data:", JSON.stringify(data));
            console.log("Data:", data);
            let profileTitle = this.userProfile.first_name +' '+ this.userProfile.last_name + "'s Profile"
            this.titleService.setTitle('Atila - ' + profileTitle);
            this.initializeLocations(this.userProfile.city);
          },
          err => {
            console.log(err);
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
      console.log("userDocuments:", this.userDocuments);
      
      console.log("profileForm:", profileForm);
      
      console.log("this.userProfile:", this.userProfile);

      this.userProfileService.updateAny(sendData)
      .subscribe(
        data => {
          console.log("Updated Data:", data);
          this.showSnackBar("Succesfully Updated Your Profile, Welcome to Atila",'What Next?', 3000);
        },
        err => {
          this.showSnackBar('Profile updated unsuccessfully - ' + err,'', 3000);
        }
      )



    } else {
      this.showSnackBar("Profile is not valid",'', 3000);
    }
  }
  /*onSubmit(profileForm: NgForm){
        
        console.log("onSubmit(), userDocuments:", this.userDocuments);
    
        console.log("profileForm:", profileForm);
    
        console.log("this.userProfile:", this.userProfile);
    
        if (profileForm.valid) {
          let postOperation: Observable<UserProfile>;
          //postOperation = this.userProfileService.update(this.userProfile);
    
          postOperation.subscribe(
            data => {
              this.snackBar.open("Succesfully Made Your Profile, Welcome to Atila",'What Next?',{
                duration: 1000
              })
              .afterDismissed().subscribe( //navigate URLS after telling User that account creation is succesfule
                data => {
                  this.router.navigate(['scholarships-list']);
                }
              )
            },
            err => {
              this.snackBar.open("Error - " + err, '', {
                duration: 3000
              });
            }
          )
        } else {
          this.snackBar.open("Invalid form", '', {
            duration: 3000
          });
        }
    
  }
  */
      
  fileChangeEvent(fileInput: any){
    console.log("fileInput:", fileInput);

    //TODO: this seems a bit redundant
    this.formFile = fileInput.target.files[0];
    this.formFileEvent = fileInput;  
  }

  uploadUserDocuments(){
    //let uploadOperation: Observable<any>;

    //create Upload file and configure its properties before uploading.

    this.uploadFile = new UploadFile(this.formFile);
    this.uploadFile.name = this.formFile.name;
    this.uploadFile.path = "user-profiles/" + this.userProfile.user + "/documents/"
    this.uploadFile.path = this.uploadFile.path + this.uploadFile.name
    console.log('this.uploadFile',this.uploadFile);
    
    this.fileUpload(this.uploadFile)
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
      //this.userProfile.form_url = uploadTask.snapshot.downloadURL;

      //get the userProfile attribute that needs to be saved.
      //Will this have a significant impact on speed? As opposed to just saving the event ID as a variable   
      this.userProfile[this.formFileEvent.target.id] = uploadTask.snapshot.downloadURL;
      console.log('this.userProfile[this.formFileEvent.target.id]',this.userProfile[this.formFileEvent.target.id])                                               
    });
  
  
    }

  
// SnackBar notification
showSnackBar(text: string, action = '', duration: number) {
  this.snackBar.open(text, action, {
    duration: duration
  });
}

}


