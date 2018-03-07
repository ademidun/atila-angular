//https://angular.io/guide/dynamic-form#questionnaire-data
import { Component, Input, OnInit, ChangeDetectorRef, AfterViewInit }  from '@angular/core';
import { FormGroup, NgForm }                 from '@angular/forms';

import { QuestionBase }              from '../_models/question-base';

import { QuestionService }    from '../_services/question.service';
import { QuestionControlService }    from '../_services/question-control.service';
import { ApplicationService }    from '../_services/application.service';
// import { WebFormsService } from "../_services/web-forms.service";
import { Observable } from 'rxjs/Observable';

import { UploadFile,isValidDemoFile } from '../_models/upload-file';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';

import { AuthService } from "../_services/auth.service";

import { MyFirebaseService } from "../_services/myfirebase.service";
import {MatProgressBar} from '@angular/material';
import * as firebase from "firebase";

import { TruncatePipe } from '../_pipes/truncate.pipe';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';

// const ReconnectingWebSocket = require('reconnecting-websocket');

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss'],
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
  automationProgress: any;
  socket: WebSocket;


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
    public firebaseService: MyFirebaseService,
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

    if (this.generalData.demoMode) {
      let snackBarRef = this.snackBar.open("Changes Not Saved in Demo Mode.", 'Register', {
        duration: 3000
      });
      snackBarRef.onAction().subscribe(
        () => {
          this.router.navigate(['/register']);
        });

      return;
    }

    this.initializeLinks();

    //Next, we will save the application edits to the database.
    this.showAutomationLoading = true;

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


    this.initializeLinks();
    this.showAutomationLoading = true;

    let sendData = {
      //'generalData': this.generalData,We only need
      'profileForm': this.profileForm.value,
      'application': this.generalData.application,
    };

    if (this.generalData.demoMode) {

      let parseData = Object.assign({}, sendData);
      parseData.application = sendData.application.responses;

      try{
        if (environment.production) {
          parseData.application = JSON.stringify(parseData.application)
        }
        try {
          this.firebaseService.saveUserAnalytics(parseData, 'live_demo');
        }
        catch (err)
        {
          console.error('live demo analytics err', err);
          this.firebaseService.saveAny(err.toString(),'error_logs/live_demo');
        }
      }
      catch (err) {
        console.error('Error while handling error log save', err);
      }

      this.socketAutomation();

      return;


    }

    else {

      this.socketAutomation();

      return;
    }

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
    /*
        this.observable = this.questionService.automateResponse(appId,sendData);
        this.observable.subscribe(
          res => {

            this.uploadUrl = res.upload_url;
            if(this.generalData.scholarship.submission_info.application_form_type=='Web'){

            this.preAndPostScreenshots = res.screenshot_confirmation_images;
            for (var i = 0; i < this.preAndPostScreenshots.length; i++) {
              this.preAndPostScreenshots[i] = "data:image/png;base64," + this.preAndPostScreenshots[i];

            }
            // Show the full screen screnshot first.
            this.preAndPostScreenshots.reverse();


            }


            this.payLoad = JSON.stringify(res.message);
          },
          err =>{

            this.showAutomationLoading = false;
            this.payLoad = JSON.stringify(err.message);

            this.snackBar.open("Automation error: "+this.payLoad,'',{
              duration: 3000
            });

          },
          () => {
            this.showAutomationLoading = false;

          }
        )
        */

  }


  socketAutomation() {

    let ws_scheme = window.location.protocol == "https:" ? "wss" : "ws";
    let environmentIndex = environment.apiUrl.indexOf('://');
    let environmentHost = environment.apiUrl.slice(environmentIndex+3);

    let socketId = Date.now().toString() + Math.random().toString(36).substring(5);

    this.socket = new WebSocket(ws_scheme + ':/' + environmentHost + "application-automation/");

      this.socket.onopen = (event) => {

        let sendData = {
          //'generalData': this.generalData,We only need
          'profileForm': this.profileForm.value,
          'application': this.generalData.application,
          'socketId':   socketId,
          'appId': this.generalData.application.id,
        };

        this.socket.send(JSON.stringify(sendData));

        this.socket.onmessage = (res) => {

          let data = res.data;

          data = JSON.parse(data);

          switch (data.msg_status) {
            case 'in_progress':
              // Message
              this.automationProgress = Math.ceil(data.progress_value);
              break;

            case 'finished':
              this.uploadUrl = data.upload_url;
              if(this.generalData.scholarship.submission_info.application_form_type=='Web'){

                this.preAndPostScreenshots = data.screenshot_confirmation_images;
                for (let i = 0; i < this.preAndPostScreenshots.length; i++) {
                  this.preAndPostScreenshots[i] = "data:image/png;base64," + this.preAndPostScreenshots[i];

                }
                // Show the full screen screnshot first.
                this.preAndPostScreenshots.reverse();

              }
              this.payLoad = JSON.stringify(data.message);
              break;

            case 'error':
              this.showAutomationLoading = false;
              this.payLoad = JSON.stringify(data.message);

              this.snackBar.open("Automation error: "+this.payLoad,'',{
                duration: 3000
              });
              break;

            default:
              return;
          }
        };

        this.socket.onclose = (event) => {
          this.showAutomationLoading = null;
          this.automationProgress = null;
          this.socket.close(1000,JSON.stringify(event));
        };

        this.socket.onerror = (err) => {
          this.socket.close(1000,JSON.stringify(err));
        }

      };



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

    if (this.generalData.demoMode && !isValidDemoFile(fileInput.target.files[0], this.snackBar, this.router)) {
      return;
    }

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
    // todo use template string e.g. `scholarships/${this.generalData.scholarship.id}`
    this.uploadFile.path = `scholarships/${this.generalData.scholarship.id}/application-documents/${this.generalData.application.user}/${this.generalData.application.id}/`;

    if(this.generalData.application.metadata['test_mode']) {
      console.log('test_mode,this.generalData',this.generalData.application.metadata['test_mode'], this.generalData);
      this.uploadFile.path = `scholarships/${this.generalData.scholarship.id}/application-documents/${this.generalData.application.user}/${this.generalData.application.id}/`;
    }

    this.uploadFile.path = this.uploadFile.path + this.uploadFile.name;


    console.log('this.uploadFile.path ',this.uploadFile.path );
    this.uploadFile.metadata['owner'] = this.generalData.application.owner;

    let options = {};
    if(this.generalData.demoMode) {
      options['demoMode'] = true;
    }
    // todo show snackbar error handler if upload fails
    this.firebaseService.fileUpload(this.uploadFile,options)
      .subscribe(
        res => {
          console.log('firebaseService.fileUpload.subscribe res',res);
          let uploadTask = res;

          uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
            (snapshot:any) => {
              this.uploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

            },
            (err)=> {
              this.snackBar.open('Upload Error','',{ duration: 3000});
              this.uploadProgress = null;
            },
            () => {
              this.generalData.application.document_urls[this.formFileEvent.target.id] = uploadTask.snapshot.downloadURL;
              this.generalData.application.responses[this.formFileEvent.target.id] = uploadTask.snapshot.downloadURL;

              this.uploadProgress = null;

              this.snackBar.open('File successfully uploaded.');
            });
        },
        err => {

          console.log('firebaseService.fileUpload.subscribe err',err);
          this.snackBar.open(err,'',{ duration: 3000});
        },
      )

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
