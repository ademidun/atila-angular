import { Component, OnInit } from '@angular/core';
import { UserProfile } from '../_models/user-profile';

import { UserProfileService } from '../_services/user-profile.service';
import { ActivatedRoute, Router } from '@angular/router';

import { Title }     from '@angular/platform-browser';
@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss']
})
export class ProfileViewComponent implements OnInit {

  userProfile: UserProfile;
  userNameSlug: string;
  constructor(
    route: ActivatedRoute,
    private userProfileService: UserProfileService,
    private titleService: Title,
  ) { 
    this.userNameSlug = route.snapshot.params['username'];
  }

  ngOnInit() {
    this.userProfileService.getByUsername(this.userNameSlug).subscribe(
      res => {
        this.userProfile = res;
        this.titleService.setTitle('Atila - ' + this.userProfile.first_name + " " +this.userProfile.last_name +"'s profile");
      } 
    )
  }

}
