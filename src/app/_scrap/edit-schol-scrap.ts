import { Component, OnInit } from '@angular/core';

import { Scholarship } from '../_models/scholarship';
import { ActivatedRoute, Router } from '@angular/router';
import { ScholarshipService } from '../_services/scholarship.service';
import { ApplicationService } from '../_services/application.service';
import { Observable } from 'rxjs/Rx';
import { NgZone } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { MdSnackBar } from '@angular/material';
import { UserProfileService } from '../_services/user-profile.service';
import {NgForm} from '@angular/forms';
import { DatePipe } from '@angular/common';

import { AuthService } from "../_services/auth.service";
import { Title }     from '@angular/platform-browser';



@Component({
  selector: 'app-edit-scholarship',
  templateUrl: './edit-scholarship.component.html',
  styleUrls: ['./edit-scholarship.component.scss'],
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

  FUNDING_TYPES = [
    'Scholarship',
    'Loan',
    'Other',
  ];

  scholarship: Scholarship;
  cityString: String;
  provinceString: String = "";
  countryString: String = "";
  scholarshipSlug: string = "";
  userId: number;
  appId: number;

  private reviews: any[];
  private reviewsLoaded: boolean = false;
  private scholarshipOwner;
  private generalInfo = true;

  constructor(
    route: ActivatedRoute,
    private scholarshipService: ScholarshipService,
    private applicationService: ApplicationService,
    private _ngZone: NgZone,
    public dialog: MdDialog,
    private snackBar: MdSnackBar,
    private userProfileService: UserProfileService,
    private titleService: Title,
    private authService: AuthService,
  ) {
    // Get the id that was passed in the route
    this.scholarshipSlug = route.snapshot.params['slug']; 
    this.userId = parseInt(this.authService.decryptLocalStorage('uid')); // Current user
  }

  ngOnInit() {
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

  //Convert the string input to the json object to match the respective scholarship fields.

  stringInputToArray(event: any){
    console.log('toArrayInput, event', event);
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

  //city, province, and country are stored as arrays (specifically Json dictionaries,)
  //We must convert them to comma seperated strings in order to display them as text inputs
  // TODO: Make this function less repetitive. 

  arrayToString(){
    var i =0;
    for(var city in this.scholarship.city){
      if(i==0){
        console.log('city',city);
        console.log('this.scholarship.city[city]',this.scholarship.city[city]);
        this.cityString = city;
      }
      else{
        this.cityString = this.cityString + ", " + city;
      }
      i++;
    }

    i =0;
    for(var province in this.scholarship.province){
      if(i==0){
        this.provinceString = province;
      }
      else{
        this.provinceString = this.provinceString + ", " + province;
      }
      i++;
    }


    i =0;
    for(var country in this.scholarship.country){
      if(i==0){
        this.countryString = country;
      }
      else{
        this.countryString = this.countryString + ", " + country;
      }
      i++;
    }

  }
  
  disableEditNonUsers(scholarshipForm: any){
    
    console.log('this.userId: ', this.userId,'. disableEditNonUsers: ' ,scholarshipForm);

    if(!this.userId){
      console.log('this.userId: ', this.userId,'. disableEditNonUsers: ' ,scholarshipForm);
    }
  }

    // Go to next part of scholarship creation
    next() {
      this.generalInfo = false;
    }
  
    back() {
      this.generalInfo = true;
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
          },
          err => console.log('scholarshipService.update err', err),
        )
      }
      
    }

}
