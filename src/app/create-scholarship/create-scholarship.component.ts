import { Component, OnInit } from '@angular/core';
import { Scholarship } from '../_models/scholarship';
import { ScholarshipService } from '../_services/scholarship.service';
import { Observable } from 'rxjs/Rx';
import { MdSnackBar } from '@angular/material'
import { Router } from '@angular/router'
import {MdDialog, MdDialogRef} from '@angular/material';
//import {AddQuestionModalComponent} from '../add-question-modal/add-question-modal.component';

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
  s3ApiKey: any;
  

  constructor(
    private router: Router,
    private snackBar: MdSnackBar,
    private scholarshipService: ScholarshipService,
    public dialog: MdDialog,
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
    this.stringDict.eligible_schools = 'Bishop Reding, Jean Vanier';
    this.stringDict['city'] = 'Milton';
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

}
