import { Component, OnInit } from '@angular/core';
import { ForumService } from "../_services/forum.service";

import { Forum } from "../_models/forum";

import { UserProfile } from '../_models/user-profile';

import { UserProfileService } from '../_services/user-profile.service';

@Component({
  selector: 'app-forums-list',
  templateUrl: './forums-list.component.html',
  styleUrls: ['./forums-list.component.scss']
})
export class ForumsListComponent implements OnInit {

  private forums: Forum[]
  newForum: Forum;
  userProfile: UserProfile;
  constructor(
    private forumService: ForumService,
    private userProfileService: UserProfileService,
  ) { }

  ngOnInit() {
    var userId = parseInt(localStorage.getItem('userId'));
    this.userProfileService.getById(userId).subscribe(
      res => {
        this.userProfile = res;
        this.newForum = new Forum();
      }
    )
    this.forumService.list().subscribe(
      res => {
        this.forums = res.results;
      }
    );
   
    

  }

  postForum(){

  }

}
