import { Component, OnInit } from '@angular/core';
import { UserProfile } from '../_models/user-profile';

import {NgForm} from '@angular/forms';

import { Observable } from 'rxjs/Rx';
import { UserProfileService } from '../_services/user-profile.service';

import { Router, ActivatedRoute } from '@angular/router'
import { MdSnackBar } from '@angular/material';

    
@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.scss']
})


export class CreateProfileComponent implements OnInit {
   
   EDUCATION_LEVEL = [
       'University', 
       'College', 
       'Workplace or Apprenticeship',
   ]
   
   EDUCATION_FIELD = [
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
   userProfile = new UserProfile();
  userDocuments = { };
  private userId;
  
  documentScholarshipsPercent = 93; // TODO: Calculate % of scholarhips that require either a transcript, resume or reference letter.
  profileInfo = true;
  constructor(
    private userProfileService: UserProfileService,
    private router: Router,
    route: ActivatedRoute,
    private snackBar: MdSnackBar,

  ) { }

  ngOnInit() {
    this.userProfile.education_level = [this.EDUCATION_LEVEL[0]];
    this.userProfile.education_field = [this.EDUCATION_FIELD[0],this.EDUCATION_FIELD[1]];

    console.log('userProfile:', this.userProfile);
    console.log('this.userProfile.education_field:', this.userProfile.education_field);
    console.log('this.userProfile.education_level:', this.userProfile.education_level);

    this.userId = localStorage.getItem('userId');
    this.userProfile.user = this.userId;

  }

  fileChangeEvent(fileInput: any) {
    
    //Save each file in a dictionary of file inputs
    console.log("fileInput:", fileInput);
    this.userDocuments[fileInput.target.files[0].name] = fileInput.target.files[0];
  }

  // TODO: Remove this method? It doesn't actually get called.
  createProfile(profileForm: NgForm) {

    console.log('just entered createProfile:', profileForm);
    if (profileForm.valid) {
      let postOperation: Observable<UserProfile>;
      postOperation = this.userProfileService.update(this.userProfile);

      postOperation.subscribe(
        data => {
          this.router.navigate(['scholarships-list']);
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

  onSubmit(profileForm: NgForm){

    console.log("userDocuments:", this.userDocuments);

    console.log("profileForm:", profileForm);

    console.log("this.userProfile:", this.userProfile);

    if (profileForm.valid) {
      let postOperation: Observable<UserProfile>;
      postOperation = this.userProfileService.update(this.userProfile);

      postOperation.subscribe(
        data => {
          this.snackBar.open("Succesfully Made Your Profile, Welcome to Atila",'What Next?',{
            duration: 1000
          })
          .afterDismissed().subscribe( //navigate URLS after telling User that account creation is succesfule
            data => {
              this.router.navigate(['scholarships-list']);
            }
          )
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

  switchPage(){
    this.profileInfo = !this.profileInfo;
  }

  uploadDocuments(){

  }

}