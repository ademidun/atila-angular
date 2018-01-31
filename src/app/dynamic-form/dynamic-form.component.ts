//https://angular.io/guide/dynamic-form#questionnaire-data
import { Component, Input, OnInit, ChangeDetectorRef, AfterViewInit }  from '@angular/core';
import { FormGroup, NgForm }                 from '@angular/forms';

import { QuestionBase }              from '../_models/question-base';

import { QuestionService }    from '../_services/question.service';
import { QuestionControlService }    from '../_services/question-control.service';
import { ApplicationService }    from '../_services/application.service';
// import { WebFormsService } from "../_services/web-forms.service";
import { Observable } from 'rxjs/Observable';

import { UploadFile } from '../_models/upload-file';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';

import { AuthService } from "../_services/auth.service";

import { MyFirebaseService } from "../_services/myfirebase.service";
import {MatProgressBar} from '@angular/material';
import * as firebase from "firebase";

import { TruncatePipe } from '../_pipes/truncate.pipe';
import {Router} from '@angular/router';



@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  providers: [ QuestionControlService ]
})
export class DynamicFormComponent implements OnInit, AfterViewInit {

  @Input() questions: QuestionBase<any>[] = [];
  @Input() form: FormGroup;
  @Input() profileForm: NgForm;
  @Input() generalData: any;
  observable: Observable<any>;
  isFormReady: boolean;

  payLoad = '';
  myJSON = JSON;

  uploadUrl: string;



  formFile: File;
  formFileEvent: any;
  uploadFile: UploadFile;
  showAutomationLoading=false;
  emailBody: any;
  appMailToLink: any;
  timeOfDay;
  uploadProgress: any;

  // A base 64 encoded string image of the screenshot of the automated web form before and After Submission.
  preAndPostScreenshots: any[];

  constructor(
    public qcs: QuestionControlService,
    public questionService: QuestionService,
    public applicationService: ApplicationService,
    public authService: AuthService,
    public cdr: ChangeDetectorRef,
    public snackBar: MatSnackBar,
    public router: Router,
    // public webFormService: WebFormsService
  ) {

   }

  ngOnInit() {
    if(this.questions){
    this.timeOfDay = this.getTimeOfDay();
      this.form = this.qcs.toFormGroupNoValidator(this.questions);

    }

    this.writeEmail();
  }

  ngAfterViewInit(){
    this.cdr.detectChanges();

  }
  /**
   * Save the application to the database without automating and save the uploaded document urls.
   * @param event
   */
  saveApplication(event: Event){
    // First, we will save the URLs of the uploaded documents
      event.preventDefault();


    this.initializeLinks();

    //Next, we will save the application edits to the database.
    this.showAutomationLoading = true;
    this.payLoad = this.form.value;




    this.payLoad = JSON.stringify(this.payLoad);

    var sendData = {
      //'generalData': this.generalData,We only need
      'profileForm': this.profileForm.value,
      'application': this.generalData.application,
    };

    var appId = this.generalData.application.id;



    this.observable = this.questionService.saveResponse(appId,sendData);
    this.observable.subscribe(
      res => {

        this.payLoad = JSON.stringify(res.message);
        let config = new MatSnackBarConfig();
        config.panelClass = ['custom-snackbar-styles'];
        config.duration = 20000;
        let snackBarRef = this.snackBar.open("Saved Application", 'See My Applications',config);

        snackBarRef.onAction().subscribe(
          () => {
            this.router.navigate(['profile',this.generalData.userProfile.username,'my-atila']);
          },
        )
      },
      err =>{

        this.showAutomationLoading = false;
        this.payLoad = JSON.stringify(err.message);
        this.snackBar.open("Automation error:" + err.message,'',{
          duration: 3000
        });

      },
      () => {
        this.showAutomationLoading = false;
      }
    )

  }

  onSubmit() {
    this.showAutomationLoading = true;
    this.payLoad = this.form.value;

    this.payLoad = JSON.stringify(this.payLoad);
    this.initializeLinks();

    var sendData = {
      //'generalData': this.generalData,We only need
      'profileForm': this.profileForm.value,
      'application': this.generalData.application,
    };

    var appId = this.generalData.application.id;

    this.writeEmail();
    /*
    TODO: Add client-side selenium hosting
    if(this.generalData.scholarship.submission_info.application_form_type=='Web' && this.generalData.scholarship.is_automated){

       , this.generalData.scholarship.submission_info.application_form_type +  JSON.stringify(this.generalData.scholarship.is_automated));

       this.webFormService.fillWebForm(this.generalData.scholarship.submission_info, this.form.value, sendData)
       .then(
         res =>
          err =>
       )
    }
    */


    this.observable = this.questionService.automateResponse(appId,sendData);
    this.observable.subscribe(
      res => {

        this.uploadUrl = res.upload_url;
        if(this.generalData.scholarship.submission_info.application_form_type=='Web'){

        this.preAndPostScreenshots = res.screenshot_confirmation_images;
        for (var i = 0; i < this.preAndPostScreenshots.length; i++) {
          this.preAndPostScreenshots[i] = "data:image/png;base64," + this.preAndPostScreenshots[i];

        }


        }


        this.payLoad = JSON.stringify(res.message);
      },
      err =>{

        this.showAutomationLoading = false;
        this.payLoad = JSON.stringify(err.message);

        this.snackBar.open("Automation error",'',{
          duration: 3000
        });

      },
      () => {
        this.showAutomationLoading = false;

      }
    )

  }

  /**
   * Get all the urls of the uploaded documents on the page.
   */
  initializeLinks() {


    var results = document.getElementsByClassName("scholarship-document");

    for (var i = 0; i < results.length; i++) {
      let documentKey = results[i].getAttribute("name");
      let documentUrl = results[i].getAttribute("href");

      if(documentUrl != "") {

        this.generalData.application.document_urls[documentKey] = documentUrl;
      }
    }


    for(let key in this.generalData.application.document_urls) {

      if(this.generalData.application.document_urls.hasOwnProperty(key)) {

        this.generalData.application.responses[key]= this.generalData.application.document_urls[key];
      }

    }
  }
  fileChangeEvent(fileInput: any){


    //TODO: this seems a bit redundant
    this.formFile = fileInput.target.files[0];
    this.formFileEvent = fileInput;
  }

  /**
   * Upload the user documents to the cloud database and save the url path to the document as this.generalData.application.document_urls[documentKey] = documentUrl;
   * @param event
   */
  uploadUserDocuments(event: Event){


    event.preventDefault();
    //let uploadOperation: Observable<any>;

    //create Upload file and configure its properties before uploading.


    this.uploadFile = new UploadFile(this.formFile);
    this.uploadFile.name = this.authService.hashFileName(this.formFile.name);
    this.uploadFile.path = "scholarships/" + this.generalData.scholarship.id + "/application-documents/" + this.generalData.application.id + "/";
    this.uploadFile.path = this.uploadFile.path + this.uploadFile.name


    this.fileUpload(this.uploadFile)
    .subscribe(
      res =>{

      }
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
        this.uploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

      },
        (error)=> {

      },
        () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        //var downloadURL = uploadTask.snapshot.downloadURL;

        //this.userProfile.form_url = uploadTask.snapshot.downloadURL;

        //this.generalData.userProfile[this.formFileEvent.target.id] = uploadTask.snapshot.downloadURL;
        this.generalData.application.document_urls[this.formFileEvent.target.id] = uploadTask.snapshot.downloadURL;
        this.generalData.application.responses[this.formFileEvent.target.id] = uploadTask.snapshot.downloadURL;

        this.uploadProgress = null;
      });


  }

  getTimeOfDay(){
    var myDate = new Date();
    var hrs = myDate.getHours();

    var timeString;
    if (hrs < 12)
        timeString = 'Morning';
    else if (hrs >= 12 && hrs <= 17)
        timeString = 'Afternoon';
    else if (hrs >= 17 && hrs <= 24)
        timeString = 'Evening';

    return timeString;
  }

  /**
   * TODO: Make this more dynamic/customized TRY to be DRY.
   */
  writeEmail(){

    let email = this.applicationService.writeEmail(this.generalData);

    this.emailBody = email[0];

    this.appMailToLink = email[1];
  }
  saveToClipBoard(divId: string){

      let copyText = $(`#${divId}`);
      //var copyText = document.getElementById("myInput");
      copyText.select();
      document.execCommand("copy");




      this.snackBar.open("Copied to Clipboard",' Send Email',{
        duration: 3000
      });
  }



}
