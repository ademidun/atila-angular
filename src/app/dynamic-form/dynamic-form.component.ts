import { Component, Input, OnInit }  from '@angular/core';
import { FormGroup, NgForm }                 from '@angular/forms';

import { QuestionBase }              from '../_models/question-base';
import { QuestionService }    from '../_services/question.service';
import { QuestionControlService }    from '../_services/question-control.service';

import { Observable } from "rxjs/Rx";

import { UploadFile } from '../_models/upload-file';

import { AuthService } from "../_services/auth.service";

import { MyFirebaseService } from "../_services/myfirebase.service";

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
  saveDocuments(){
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
    this.payLoad = JSON.stringify(this.form.value);
    this.payLoad += JSON.stringify(this.form.value);

    var sendData = {
      'generalData': this.generalData,
      'profileForm': this.profileForm.value,
      'appForm': this.form.value,
    }
    var appId = this.generalData.appData.id;
    console.log('onSubmit() sendData:' , sendData);

    // this.observable = this.questionService.saveResponse(appId,sendData);
    // this.observable.subscribe(
    //   res => {
    //     console.log('Response succesful:' , res);
    //     this.uploadUrl = res.upload_url;
    //   },

    //   err =>console.log('Error DynamicFormComponent:' , err)
    // )
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
  
        //get the userProfile attribute that needs to be saved.
        //Will this have a significant impact on speed? As opposed to just saving the event ID as a variable   
        this.generalData.userProfile[this.formFileEvent.target.id] = uploadTask.snapshot.downloadURL;
        console.log('this.userProfile[this.formFileEvent.target.id]',this.generalData.userProfile[this.formFileEvent.target.id])                                               
      });
    
    
  }
  
    
  

}