import { Component, Input, OnInit, ChangeDetectorRef, AfterViewInit }  from '@angular/core';
import { FormGroup, NgForm }                 from '@angular/forms';

import { QuestionBase }              from '../_models/question-base';
import { QuestionService }    from '../_services/question.service';
import { QuestionControlService }    from '../_services/question-control.service';
// import { WebFormsService } from "../_services/web-forms.service";
import { Observable } from "rxjs/Rx";

import { UploadFile } from '../_models/upload-file';
import { MatSnackBar } from '@angular/material';

import { AuthService } from "../_services/auth.service";

import { MyFirebaseService } from "../_services/myfirebase.service";
import {MatProgressBar} from '@angular/material';
import * as firebase from "firebase";

import { TruncatePipe } from '../_pipes/truncate.pipe';



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
  appData: any;
  observable: Observable<any>;
  isFormReady: boolean;

  payLoad = '';
  myJSON = JSON;

  uploadUrl: string;
  keyGetter = Object.keys;



  formFile: File;
  formFileEvent: any;
  uploadFile: UploadFile;
  showAutomationLoading=false;
  cusomEmail: any;
  emailBody: any;
  appMailToLink: any;
  timeOfDay;

  // A base 64 encoded string image of the screenshot of the automated web form before and After Submission.
  preAndPostScreenshots: any[];
    
  constructor(
    public qcs: QuestionControlService,
    public questionService: QuestionService,
    public authService: AuthService,
    public cdr: ChangeDetectorRef,
    public snackBar: MatSnackBar,
    // public webFormService: WebFormsService
  ) { 
    
   }

  ngOnInit() {
    if(this.questions){
    this.timeOfDay = this.getTimeOfDay();
      this.form = this.qcs.toFormGroup(this.questions);

    }

    this.appData = this.generalData.appData.responses;
    
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
      var results = document.getElementsByClassName("scholarship-document");
      
      
      for (var i = 0; i < results.length; i++) {
        let documentKey = results[i].getAttribute("name");
        let documentUrl = results[i].getAttribute("href"); 
        this.generalData.documentUploads[documentKey] = documentUrl;
      }

    
    
    
    //Next, we will save the application edits to the database.
    this.showAutomationLoading = true;
    this.payLoad = this.form.value;


    for(var key in this.generalData.documentUploads) {
      
      this.payLoad[key]= this.generalData.documentUploads[key];

    }


    this.payLoad = JSON.stringify(this.payLoad);
    var sendData = {
      //'generalData': this.generalData,We only need 
      'profileForm': this.profileForm.value,
      'appForm': this.form.value,
      'documentUrls':this.generalData.documentUploads,
    }
    var appId = this.generalData.appData.id;


    
    
    this.observable = this.questionService.saveResponse(appId,sendData);
    this.observable.subscribe(
      res => {
        
        this.payLoad = JSON.stringify(res.message);
      },
      err =>{
        
        this.showAutomationLoading = false;
        this.payLoad = JSON.stringify(err.message);

      },
      () => {
        this.showAutomationLoading = false;
      }
    )

  }

  onSubmit() {
    this.showAutomationLoading = true;
    this.payLoad = this.form.value;


    
    
    
    
    
    if(!this.generalData.documentUploads || Object.keys(this.generalData.documentUploads).length === 0){ //if the dictionary is empty use the default values.
      this.generalData.documentUploads = this.generalData.appData.document_urls;
    }
    for(var key in this.generalData.documentUploads) {
      
      this.payLoad[key]= this.generalData.documentUploads[key];
      this.form.value[key]= this.generalData.documentUploads[key];
      
    }


    
    this.payLoad = JSON.stringify(this.payLoad);
    var sendData = {
      //'generalData': this.generalData,We only need 
      'profileForm': this.profileForm.value,
      'appForm': this.form.value,
      'documentUrls':this.generalData.documentUploads,
    }
    var appId = this.generalData.appData.id;
    
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

      },
      () => {
        this.showAutomationLoading = false;

      }
    )
    
  }

  fileChangeEvent(fileInput: any){
    
  
    //TODO: this seems a bit redundant
    this.formFile = fileInput.target.files[0];
    this.formFileEvent = fileInput;  
  }
  
  /**
   * Upload the user documents to the cloud database and save the url path to the document as this.generalData.documentUploads[documentKey] = documentUrl;
   * @param event 
   */
  uploadUserDocuments(event: Event){


    event.preventDefault();
    //let uploadOperation: Observable<any>;
  
    //create Upload file and configure its properties before uploading.
    
    
    this.uploadFile = new UploadFile(this.formFile);
    this.uploadFile.name = this.formFile.name;
    this.uploadFile.path = "scholarships/" + this.generalData.scholarship.id + "/application-documents/" + this.generalData.appData.id + "/";
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
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        
      },
        (error)=> {
        
      },
        () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        //var downloadURL = uploadTask.snapshot.downloadURL;
        
        //this.userProfile.form_url = uploadTask.snapshot.downloadURL;
  
        //this.generalData.userProfile[this.formFileEvent.target.id] = uploadTask.snapshot.downloadURL;
        this.generalData.appData.responses[this.formFileEvent.target.id] = uploadTask.snapshot.downloadURL;
        this.generalData.documentUploads[this.formFileEvent.target.id] =  uploadTask.snapshot.downloadURL;
        
        
      });
    
    
  }
  
  generateCustomEmail(){
      var myDate = new Date();
      var hrs = myDate.getHours();
    
    
      if (hrs < 12)
          this.timeOfDay = 'Morning';
      else if (hrs >= 12 && hrs <= 17)
          this.timeOfDay = 'Afternoon';
      else if (hrs >= 17 && hrs <= 24)
          this.timeOfDay = 'Evening';

    var bodySentence = [
      'This email contains my application for the' +  this.generalData.scholarship.name+', please see attatched.',
      'This email is in response to the' +  this.generalData.scholarship.name+'. Please see attatched for the relevant documents.',
    ]

    var concludingSentence = [
      'Thank you for sponsoring this scholarship.',
      
    ]
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

    this.emailBody = `        
    To: ${this.generalData.scholarship.submission_info.email_address}
    
    Subject: ${this.generalData.userProfile.first_name} ${this.generalData.userProfile.last_name}'s ${this.generalData.scholarship.name} Application
    
    Good ${this.timeOfDay},
  
    My name is ${this.generalData.userProfile.first_name} ${this.generalData.userProfile.last_name}.
    This email contains my application for the ${this.generalData.scholarship.name}, please see attatched. Thank you for sponsoring this scholarship.
  
    Regards,
    ${this.generalData.userProfile.first_name}`;

    this.appMailToLink = `mailto:${this.generalData.scholarship.submission_info.email_address}
    ?&subject=${this.generalData.userProfile.first_name} ${this.generalData.userProfile.last_name}'s ${this.generalData.scholarship.name} Application
    &body=Good ${this.timeOfDay},
    
    My name is ${this.generalData.userProfile.first_name} ${this.generalData.userProfile.last_name}.
    This email contains my application for the ${this.generalData.scholarship.name}, please see attached. Thank you for sponsoring this scholarship.
    
    Regards,
    ${this.generalData.userProfile.first_name}`;

      this.appMailToLink = encodeURI(this.appMailToLink);
  }
  saveToClipBoard(divId: string){
      
      var copyText = $(divId);
      //var copyText = document.getElementById("myInput");
      copyText.select();
      document.execCommand("copy");
      

      

      this.snackBar.open("Copied to Clipboard",' Send Email',{
        duration: 3000
      });
  }
    
  

}