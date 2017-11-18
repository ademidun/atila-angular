import { Component, OnInit } from '@angular/core';
import { ForumService } from "../_services/forum.service";

import { Forum } from "../_models/forum";
import { Comment } from "../_models/comment";

import { UserProfile } from '../_models/user-profile';

import { UserProfileService } from '../_services/user-profile.service';
import { AuthService } from "../_services/auth.service";
@Component({
  selector: 'app-forums-list',
  templateUrl: './forums-list.component.html',
  styleUrls: ['./forums-list.component.scss']
})
export class ForumsListComponent implements OnInit {

  public forums: Forum[]
  newForum: Forum;
  forumComment:Comment;
  userProfile: UserProfile;
  constructor(
    public forumService: ForumService,
    public userProfileService: UserProfileService,
    public authService: AuthService,
  ) { }

  ngOnInit() {
    var userId = parseInt(this.authService.decryptLocalStorage('uid'));
    this.newForum = new Forum(userId,'');
    this.forumComment = new Comment(userId,'','');
    this.userProfileService.getById(userId).subscribe(
      res => {
        this.userProfile = res;

      }
    )
    this.forumService.list().subscribe(
      res => {
        this.forums = res.results;
      }
    );
   
    

  }

  postForum(){
    this.forumComment.title = this.newForum.title;
    var sendData = {
      'forum': this.newForum,
      'comment': this.forumComment,
    }
    //TODO remove this when you reformat scholarships to inherit from BaseComment in backend
    delete this.forumComment.parent_model_type;
    delete this.forumComment.parent_model_id;
    console.log('postForum() sendData', sendData);

    this.forumService.create(sendData).subscribe(
      res => this.forums.unshift(res),

      err => {

      },
      () => {
        this.forumComment.text = "";
        this.newForum.title = "";
      }
    )

  }

}
