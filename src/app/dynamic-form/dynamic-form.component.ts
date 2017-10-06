import { Component, Input, OnInit }  from '@angular/core';
import { FormGroup, NgForm }                 from '@angular/forms';

import { QuestionBase }              from '../_models/question-base';
import { QuestionService }    from '../_services/question.service';
import { QuestionControlService }    from '../_services/question-control.service';

import { Observable } from "rxjs/Rx";

import { UploadFile } from '../_models/upload-file';

import { AuthService } from "../_services/auth.service";

import { MyFirebaseService } from "../_services/myfirebase.service";
import {MdProgressBarModule} from '@angular/material';
import * as firebase from "firebase";




@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  providers: [ QuestionControlService ]
})
export class DynamicFormComponent implements OnInit {

  @Input() questions: QuestionBase<any>[] = [];
  @Input() form: FormGroup;
  @Input() profileForm: NgForm;
  @Input() generalData: any;
  appData: any;
  observable: Observable<any>;
  isFormReady: boolean;

  payLoad = '';

  uploadUrl: string;
  keyGetter = Object.keys;


  formFile: File;
  formFileEvent: any;
  uploadFile: UploadFile;
  showAutomationLoading=false;
    
  constructor(
    private qcs: QuestionControlService,
    private questionService: QuestionService,
    private authService: AuthService,
  ) { 
    
   }

  ngOnInit() {
    if(this.questions){
      this.form = this.qcs.toFormGroup(this.questions);

    }

    this.appData = this.generalData.appData.responses;
  }
  saveDocumentsUrls(){
    var results = document.getElementsByClassName("scholarship-document");
    console.log('saveDocuments().results',results);
    this.generalData.documentUploads = { };
    for (var i = 0; i < results.length; i++) {
      let documentKey = results[i].getAttribute("name");

      let documentUrl = results[i].getAttribute("href"); 
      this.generalData.documentUploads[documentKey] = documentUrl;

  }


  console.log('saveDocuments().this.generalData.documentUploads',this.generalData.documentUploads);

  }
  onSubmit() {
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
    console.log('onSubmit() sendData:' , sendData);

    this.observable = this.questionService.saveResponse(appId,sendData);
    this.observable.subscribe(
      res => {
        console.log('Response succesful:' , res);
        this.uploadUrl = res.upload_url;
      },

      err =>console.log('Error DynamicFormComponent:' , err),

      () => {
        this.showAutomationLoading = false;
      }
    )
  }

  fileChangeEvent(fileInput: any){
    console.log("fileInput:", fileInput);
  
    //TODO: this seems a bit redundant
    this.formFile = fileInput.target.files[0];
    this.formFileEvent = fileInput;  
  }
  
  uploadUserDocuments(){
    //let uploadOperation: Observable<any>;
  
    //create Upload file and configure its properties before uploading.
    console.log('uploadUserDocuments() this.generalData.appData.responses',this.generalData.appData.responses);
    console.log('uploadUserDocuments() formFileEvent ',this.formFileEvent);
    this.uploadFile = new UploadFile(this.formFile);
    this.uploadFile.name = this.formFile.name;
    this.uploadFile.path = "scholarships/" + this.generalData.scholarship.id + "/application-documents/" + this.generalData.appData.id + "/";
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
  
        //this.generalData.userProfile[this.formFileEvent.target.id] = uploadTask.snapshot.downloadURL;
        this.generalData.appData.responses[this.formFileEvent.target.id] = uploadTask.snapshot.downloadURL;
        console.log('this.generalData.appData.responses[this.formFileEvent.target.id]',this.generalData.appData.responses[this.formFileEvent.target.id]) ;                                              
      });
    
    
  }
  
    
  

}