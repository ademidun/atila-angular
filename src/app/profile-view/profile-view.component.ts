import { Component, OnInit } from '@angular/core';
import { UserProfile } from '../_models/user-profile';

import { UserProfileService } from '../_services/user-profile.service';
import { ActivatedRoute, Router } from '@angular/router';

import { Title }     from '@angular/platform-browser';

import { MdSnackBar } from '@angular/material';

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss']
})
export class ProfileViewComponent implements OnInit {

  userProfile: UserProfile;
  userNameSlug: string;
  profileOwner: boolean;
  constructor(
    route: ActivatedRoute,
    private userProfileService: UserProfileService,
    private titleService: Title,
    private snackBar: MdSnackBar,
  ) { 
    this.userNameSlug = route.snapshot.params['username'];
  }

  ngOnInit() {
    this.userProfileService.getByUsername(this.userNameSlug).subscribe(
      res => {
        this.userProfile = res;
        this.titleService.setTitle('Atila - ' + this.userProfile.first_name + " " +this.userProfile.last_name +"'s profile");

        var activeUserId = parseInt(localStorage.getItem('userId')); // Current user
        this.profileOwner = (activeUserId == this.userProfile.user);
      } 
    )
  }

  uploadProfilePic(){

  }

  saveProfile(){
    this.userProfileService.updateHelper(this.userProfile)
    .subscribe(
      data => {
        this.showSnackBar("Succesfully Updated Your Profile, Welcome to Atila",'What Next?', 3000);
        this.userProfile = data;
      },
      err => {
        this.showSnackBar('Profile updated unsuccessfully - ' + err,'', 3000);
      }
    )
  }


  showSnackBar(text: string, action = '', duration: number) {
    this.snackBar.open(text, action, {
      duration: duration
    });
  }

}
