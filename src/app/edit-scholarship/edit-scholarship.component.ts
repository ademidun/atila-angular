import { Component, OnInit } from '@angular/core';
import { Scholarship } from '../_models/scholarship';
import { ScholarshipService } from '../_services/scholarship.service';
import { Observable } from 'rxjs/Rx';
import { MdSnackBar } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

import {NgForm} from '@angular/forms';

import { UserProfileService } from '../_services/user-profile.service';

import { Title }     from '@angular/platform-browser';
import {MdDialog, MdDialogRef} from '@angular/material';
import {AddQuestionModalComponent} from '../add-question-modal/add-question-modal.component';

@Component({
  selector: 'app-edit-scholarship',
  templateUrl: './edit-scholarship.component.html',
  styleUrls: ['./edit-scholarship.component.scss']
})
export class EditScholarshipComponent implements OnInit {


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
  showFormUpload = true;
  scholarshipFormFile: File;
  s3ApiKey: any;

  scholarshipSlug: string = "";
  
  private scholarshipOwner;
  

  constructor(
    private route: ActivatedRoute,
    private snackBar: MdSnackBar,
    private scholarshipService: ScholarshipService,
    public dialog: MdDialog,
    private userProfileService: UserProfileService,
    private titleService: Title,
  ) { 
    this.scholarshipSlug = route.snapshot.params['slug']; 
    this.userId = parseInt(localStorage.getItem('userId')); // Current user
  }

  ngOnInit() {
    // Retrieve the user id
    this.userId = parseInt(localStorage.getItem('userId'));
     // Load scholarship from the id
     this.scholarshipService.getBySlug(this.scholarshipSlug)
     .subscribe(
       scholarship => {
         this.scholarship = scholarship;
         // Get the user profile of the scholarship owner

         this.titleService.setTitle('Atila - Edit - ' + this.scholarship.name);

         if (this.scholarship.owner){
           this.userProfileService.getById(scholarship.owner)
           .subscribe(
             user => {
               this.scholarshipOwner = user;
               console.log('edit-scholarship, ngOnInit: ', this.scholarship);
               this.arrayToString();
               
             },
             err => {
               console.log(err);
             }
           )
         }
       },
       err => {
         console.log(err);
       }
     );

   // Load reviews
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
  openModal() {
    let dialogRef = this.dialog.open(AddQuestionModalComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('dialogRef.afterClosed().subscribe(result => ', result);
        this.scholarship.extra_questions[result.key] = result;
      } 
      
      else{
        console.log('else result',result);
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
        console.log('result',result);
        this.scholarship.extra_questions[key] = result;
      }
      else{
        console.log('else result',result);
      }      
    });
  }
  
  // Edit existing question from question array
  delete(key: string) {
    delete this.scholarship.extra_questions[key];
  }

  next() {
    this.pageNo = Math.min(3,this.pageNo+1);
  }


  arrayToString(){
    var i =0;
    //convert the various JSOn values to string for displaying in the text input
    for (var key in this.stringDict){//for each key [ 'city', 'proince',...] 
    i =0;
      for(var element in this.scholarship[key]){ //i.e. for each value within the city key, append each city value to a city string
          if(i==0){
            console.log('city',);
            console.log('this.scholarship.city[city]',this.scholarship[key]);
            this.stringDict[key]= element;
          }
          else{
            this.stringDict[key] = this.stringDict[key] + ", " + element;
          }
          i++;
      }

    }

  }

  back() {
    this.pageNo = Math.max(1,this.pageNo-1);
  }

  generateArray(obj){
    return Object.keys(obj).map((key)=>{ return obj[key]});
 }
 saveEditScholarship(scholarshipForm: NgForm) {
  
        console.log('!!this.scholarship.extra_questions', !!this.scholarship.extra_questions);
  
        if(!this.scholarship.extra_questions){
          this.scholarship.extra_questions = { };
        }
        if (scholarshipForm.valid){
          this.scholarshipService.update(this.scholarship)
          .subscribe(
            res =>{
              this.scholarship = res,
              console.log('scholarshipService.update res', res);
              this.snackBar.open("Scholarship succesfully Saved", '', {
                duration: 3000
              });
            },
            err => {console.log('scholarshipService.update err', err);
              this.snackBar.open("Error - " + err, '', {
              duration: 3000
            });
          }
          )
        }
        
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

}
