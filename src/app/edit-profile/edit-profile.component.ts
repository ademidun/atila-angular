import { Component, OnInit, Inject } from '@angular/core';
import { UserProfile } from '../_models/user-profile'
import { UserProfileService } from "../_services/user-profile.service";

import {NgForm} from '@angular/forms';

import { Observable } from 'rxjs/Rx';

import { Router, ActivatedRoute } from '@angular/router'
import { MdSnackBar } from '@angular/material';

import { Title }     from '@angular/platform-browser';

    
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {

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
  profileInfo = true;
  

  userDocuments = {}; 

  userName: string;
  constructor(
    private userProfileService: UserProfileService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MdSnackBar,
    private titleService: Title,
  ) { 
    this.userName = route.snapshot.params['username'];
  }

  ngOnInit() {
    let userId = localStorage.getItem('userId');
    if (userId) {
      this.userProfileService.getByUsername(this.userName)
        .subscribe(
          data => {
            this.userProfile = data;
            console.log("Data:", JSON.stringify(data));
          let profileTitle = this.userProfile.first_name + this.userProfile.last_name + "'s Profile"
          this.titleService.setTitle('Atila - ' + profileTitle);
          },
          err => {
            console.log(err);
          }
        )
    } 
  }

  switchPage(){
    this.profileInfo = !this.profileInfo;
  }

  saveProfile(profileForm) {
    if (profileForm.valid) {
          
      console.log("userDocuments:", this.userDocuments);
      
          console.log("profileForm:", profileForm);
      
          console.log("this.userProfile:", this.userProfile);

      this.userProfileService.update(this.userProfile)
      .subscribe(
        data => {
          console.log("Updated Data:", JSON.stringify(data));
          this.showSnackBar("Succesfully Updated Your Profile, Welcome to Atila",'What Next?', 3000);
        },
        err => {
          this.showSnackBar('Profile updated unsuccessfully - ' + err,'', 3000);
        }
      )



    } else {
      this.showSnackBar("Profile is not valid",'', 3000);
    }
  }
  onSubmit(profileForm: NgForm){
    
        console.log("userDocuments:", this.userDocuments);
    
        console.log("profileForm:", profileForm);
    
        console.log("this.userProfile:", this.userProfile);
    
        if (profileForm.valid) {
          let postOperation: Observable<UserProfile>;
          //postOperation = this.userProfileService.update(this.userProfile);
    
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
      
  // SnackBar notification
  showSnackBar(text: string, action = '', duration: number) {
    this.snackBar.open(text, action, {
      duration: duration
    });
  }

}


