import { Component, OnInit } from '@angular/core';
import { Scholarship } from '../_models/scholarship';
import { UploadFile } from '../_models/upload-file';
import { ScholarshipService } from '../_services/scholarship.service';
import { Observable } from 'rxjs/Rx';
import { MdSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

import {NgForm} from '@angular/forms';

import { UserProfileService } from '../_services/user-profile.service';
import { AuthService } from "../_services/auth.service";
import { Title }     from '@angular/platform-browser';
import {MdDialog, MdDialogRef} from '@angular/material';
import {AddQuestionModalComponent} from '../add-question-modal/add-question-modal.component';
import { MyFirebaseService } from "../_services/myfirebase.service";

import * as firebase from "firebase";

@Component({
  selector: 'app-create-scholarship',
  templateUrl: './create-scholarship.component.html',
  styleUrls: ['./create-scholarship.component.scss']
})
export class CreateScholarshipComponent implements OnInit {


EDUCATION_LEVELS = [
    'University', 
    'College', 
    'Workplace or Apprenticeship',
]

EDUCATION_FIELDS = [
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

stringDict = {
  'city': '',
  'province': '',
  'country': '',
  'eligible_schools':''
}


FUNDING_TYPES = [
  'Scholarship',
  'Loan',
  'Other',
];;
  
  userId: number;
  pageNo: number =1;
  scholarship: Scholarship = new Scholarship();
  generalInfo = true; // Display general info section
  showFormUpload = false;
  scholarshipFormFile: File;
  appFormFile: UploadFile;
  
  constructor(
    private router: Router,
    private snackBar: MdSnackBar,
    private scholarshipService: ScholarshipService,
    public dialog: MdDialog,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    // Retrieve the user id
    this.userId = parseInt(localStorage.getItem('userId'));
    this.loadScholarshipDefaults();

  }

  stringInputToArray(event: any){
    console.log('toArrayInput, event', event);
    console.log('this.stringDict; ', this.stringDict);
    console.log(this.scholarship);

    this.scholarship[event.target.name] = {};
    var tempString = event.target.value;
    tempString = tempString.trim();
    console.log('tempString', tempString);
    var stringArray: string[] = tempString.split(",");
    stringArray.forEach(element => {
      element = element.trim();
      this.scholarship[event.target.name][element] = element;
    });
    for( var key in stringArray){
      
      console.log("this.scholarship[event.target.name][key]", this.scholarship[event.target.name][key]);
    }

    console.log("this.scholarship[event.target.name]", this.scholarship[event.target.name]);
    console.log("event.target.value.split(',')", event.target.value.split(","));
    

   /* for (var i = 0; i < event.srcElement.form.length; i++) {
      console.log('form[',i,']: event.srcElement.form[i]', event.srcElement.form[i]);
      event.srcElement.form[i].disabled = true;
      
    }
    */


    console.log('after stringInputToArray: this.scholarship:', this.scholarship);

  }

  next() {
    this.pageNo = Math.min(3,this.pageNo+1);
  }

  loadScholarshipDefaults(){
    this.scholarship.owner = this.userId;
    this.scholarship.extra_questions = {};
    this.scholarship.number_available_scholarships =1;
    this.stringDict.eligible_schools = '';
    this.stringDict['city'] = '';
  }

  openModal() {
    let dialogRef = this.dialog.open(AddQuestionModalComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('dialogRef.afterClosed().subscribe(result => ', result);
        this.scholarship.extra_questions[result.key] = result;
      }      
    });
  }

  // Edit existing question
  edit(key: string) {
    let dialogRef = this.dialog.open(AddQuestionModalComponent, {
      data: this.scholarship.extra_questions[key]
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.scholarship.extra_questions[key] = result;
      }      
    });
  }
  
  // Edit existing question from question array
  delete(key: string) {
    delete this.scholarship.extra_questions[key];
  }

  back() {
    this.pageNo = Math.max(1,this.pageNo-1);
  }

  generateArray(obj){
    return Object.keys(obj).map((key)=>{ return obj[key]});
 }
  createScholarship(scholarshipForm) {

    if (scholarshipForm.valid) {
      console.log('createScholarship, this.scholarship: ',this.scholarship);
      let postOperation: Observable<Scholarship>;
      this.scholarship.owner = this.userId;
      postOperation = this.scholarshipService.create(this.scholarship);

      postOperation.subscribe(
        data => {
          console.log('scholarship created:',data)
          this.snackBar.open("Scholarship succesfully created", '', {
            duration: 3000
          });
          this.showFormUpload = true;
          this.scholarship=data;
          // todo change to this.router.navigate(['my-scholarships'])
          //this.router.navigate(['scholarships-list']);
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

  scholarshipAppFormChangeEvent(fileInput: any){
    console.log("fileInput:", fileInput);
    this.scholarshipFormFile = fileInput.target.files[0];  
  }
  
  uploadScholarshipAppForm(){
    //let uploadOperation: Observable<any>;
  
    //create Upload file and configure its properties before uploading.
  
    this.appFormFile = new UploadFile(this.scholarshipFormFile);
    this.appFormFile.name = this.scholarshipFormFile.name;
    this.appFormFile.uploadInstructions = {
      type: 'update_model',
      model: "Scholarship",
      id: this.scholarship.id,
      fieldName: 'form_url'
    }
    console.log('this.scholarshipFormFile',this.scholarshipFormFile)
    this.appFormFile.path = "scholarships/" + this.scholarship.id + "/scholarship-templates/"
    this.appFormFile.path = this.appFormFile.path + this.appFormFile.name
    console.log('this.appFormFile',this.appFormFile);
    
    this.fileUpload(this.appFormFile)
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
        this.scholarship.form_url = uploadTask.snapshot.downloadURL;
                                                          
      });
    
    
      }
  
  
  
  
  }


