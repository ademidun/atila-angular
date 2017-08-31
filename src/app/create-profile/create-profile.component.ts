import { Component, OnInit } from '@angular/core';
import { UserProfile } from '../_models/user-profile';

import {NgForm} from '@angular/forms';

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
  model = new UserProfile();
  documentScholarshipsPercent = 93; // TODO: Calculate % of scholarhips that require either a transcript, resume or reference letter.
  profileInfo = true;
  constructor() { }

  ngOnInit() {
  }

  fileChangeEvent(fileInput: any) {
    
    console.log("fileInput:", fileInput);

  }

  createProfile(profileForm: NgForm) {
    
    console.log("profileForm:", profileForm);

  }

  onSubmit(profileForm: NgForm){
    console.log("profileForm:", profileForm);
  }

  switchPage(){
    this.profileInfo = !this.profileInfo;
  }

}
