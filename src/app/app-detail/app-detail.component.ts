import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { UserProfile } from '../_models/user-profile';
import { ApplicationService } from '../_services/application.service';
import { UserProfileService } from '../_services/user-profile.service';
import { QuestionService } from '../_services/question.service';
import { QuestionControlService } from '../_services/question-control.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Scholarship } from '../_models/scholarship';
import { AuthService } from "../_services/auth.service";
import {UploadFile} from '../_models/upload-file';

import * as firebase from "firebase";
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-app-detail',
  templateUrl: './app-detail.component.html',
  styleUrls: ['./app-detail.component.scss'],
  providers: [ApplicationService, QuestionService]
})
export class AppDetailComponent implements OnInit {

  // http://jsoneditoronline.org/?id=8d09e72ec5d46b9df58e23def50233a0


  scholarship: Scholarship;
  userProfile: UserProfile;
  application: any;
  appId: number;
  /**
   * Share scholarship, application and UserProfile data with children components. e.g. Dynamic Form component
   */
  generalData: any;
  profileForm: FormGroup;
  userId;
  formFile: File;
  formFileEvent: any;
  uploadFile: UploadFile;

  questions: any[];
  observable: Observable<any>;
  dynamicForm: FormGroup;

  userProfileDynamicQuestions: any;


  locationData = {
    'city': '',
    'province': '',
    'country': '',
  };
  // Questions included in every application
  basicQuestions = ['first_name', 'last_name', 'street_address','postal_code','email'];

  locationQuestions: any;

  constructor(
    public applicationService: ApplicationService,
    route: ActivatedRoute,
    public qService: QuestionService,
    public qcs: QuestionControlService,
    public userProfileService: UserProfileService,
    public authService: AuthService,
    public router: Router,
    public snackBar: MatSnackBar,
  ) {
    this.appId = parseInt(route.snapshot.params['id']);

  }


  ngOnInit() {
    this.getAppData();



    this.observable = this.qService.getQuestions2(this.appId);
    this.observable.subscribe(
      res => {
        res = res.scholarshipQuestions;
          this.questions = Object.keys(res).map(function (k) { return res[k] }); //similiar to python or LISP's lambda

      },
      err => console.error('error! in AppDetailComponent QuestionService', this.profileForm),
      () => {


        if (this.questions) {
          this.dynamicForm = this.qcs.toFormGroup(this.questions);
        }

      }
    )

  }

  getAppData() {
    let postOperation: Observable<any>;
    this.userId = this.authService.decryptLocalStorage('uid');
    postOperation = this.applicationService.getAppData(this.appId);

    postOperation
      .subscribe(
      res => {
        this.userProfile = res.userProfile;

        if(this.userId!=this.userProfile.user) {
          this.snackBar.open("Unauthorized Access", '', {
            duration: 2000
          });
          setTimeout(() => {
            this.router.navigate(['']);
          }, 2100);

          return;
        }

        this.generalData = res;
        this.generalData.application = res.application;
        this.generalData.documentUploads = res.application.document_urls || {};

        this.generalData.application.document_urls = res.application.document_urls || {};

        this.userProfile = res.userProfile;
        this.scholarship = res.scholarship;

        this.userProfileDynamicQuestions = this.userProfileService.getDynamicProfileQuestions();
        this.locationQuestions = this.userProfileService.getLocationQuestions();


        this.filterQuestions();
        let locationFormControls = this.qcs.toFormControls(this.locationQuestions);

        this.profileForm = this.qcs.toFormGroup(this.userProfileDynamicQuestions);

        let locations = ['city', 'province', 'country'];
        locationFormControls.forEach( (control,index, arr) => {
          this.profileForm.addControl(locations[0], control);
          locations.splice(0,1);
        });



      },
      error => console.error('AppDetailComponent getAppData', error),

      () => {

        if(this.userId!=this.userProfile.user) {
          return;
        }

        this.initializeLocations(this.userProfile.city);


      }
      )

  }

  initializeLocations(cities: Array<any>){
    if(cities.length>0){
      this.locationData.city= cities[0].name;
      this.locationData.country=cities[0].country;
      this.locationData.province=cities[0].province;
    }

    this.generalData.locationData = this.locationData;

  }

  saveUserProfile(form: NgForm){


    var sendData = {
      userProfile: this.userProfile,
      locationData: this.locationData,
    };



    let saveProfileObservable = this.userProfileService.updateAny(sendData);

    saveProfileObservable.subscribe(
      res => {

        this.snackBar.open("Saved Profile", '', {
          duration: 3000
        });
      },
      err =>{

        this.snackBar.open("Error Saving Profile", '', {
          duration: 3000
        });
      }
    );

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
        this.generalData.application.document_urls[this.formFileEvent.target.id] = uploadTask.snapshot.downloadURL;

      });


  }

  filterQuestions(){

    let scholarshipQuestions = Object.keys(this.scholarship.extra_questions);


    try {
      this.scholarship.submission_info.web_form_entries.forEach( entry => {
        scholarshipQuestions.push(entry.question_key);
      })
    }
    catch(err) {
    }

    try {
      this.scholarship.submission_info.pdf_questions.forEach( entry => {
        scholarshipQuestions.push(entry);
      })
    }
    catch(err) {
    }

    scholarshipQuestions = scholarshipQuestions.concat(this.basicQuestions);
    // remove duplicate questions
    scholarshipQuestions = scholarshipQuestions.filter((val, i, arr) => arr.indexOf(val) == i);



    this.userProfileDynamicQuestions = this.userProfileDynamicQuestions.filter(function(item){
      return scholarshipQuestions.indexOf(item.key) != -1;
    });

  }

}
