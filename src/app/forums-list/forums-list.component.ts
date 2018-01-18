import { Component, OnInit } from '@angular/core';
import { ForumService } from "../_services/forum.service";

import { Forum } from "../_models/forum";
import { Comment } from "../_models/comment";

import { UserProfile } from '../_models/user-profile';

import { UserProfileService } from '../_services/user-profile.service';
import { AuthService } from "../_services/auth.service";
import {MatSnackBar} from '@angular/material';
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
  isLoading =true;
  constructor(
    public forumService: ForumService,
    public userProfileService: UserProfileService,
    public authService: AuthService,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    var userId = parseInt(this.authService.decryptLocalStorage('uid'));
    if (! isNaN(userId)){
      this.newForum = new Forum(userId,'');

      this.forumComment = new Comment(userId,'','');
      this.userProfileService.getById(userId).subscribe(
        res => {
          this.userProfile = res;

          this.forumService.list().subscribe(
            res => {
              this.forums = res.results;

              this.forums.forEach(forum => {
                if (forum.starting_comment.up_votes_id.includes(this.userProfile.user)) {
                  forum['alreadyLiked'] = true;
                }
              });
              this.isLoading = false;
            },

            err =>{
              this.isLoading = false;
            }
          );


        },
        err=> {
        }

      );
    }

    else {
      this.forumService.list().subscribe(
        res => {
          this.forums = res.results;
          this.isLoading = false;
        },

        err =>{
          this.isLoading = false;
        }
      );
    }




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


  likeContent(content: Forum, index?) {

    console.log('likeContent(content, index?)', content, index);

    if (!this.userProfile) {
      this.snackBar.open("Please log in to like.", '', {
        duration: 3000
      });

      return;
    }

    if(content.starting_comment.up_votes_id ) {

      if (!content.starting_comment.up_votes_id.includes(this.userProfile.user)) {
        content.starting_comment.up_votes_id.push(this.userProfile.user);
        content.starting_comment.up_votes_count += 1;
        content['alreadyLiked'] = true;

        let sendData = {
          id: content.starting_comment.id,
          up_votes_id: content.starting_comment.up_votes_id,
          up_votes_count: content.starting_comment.up_votes_count,
        }
        this.forumService.partialUpdateComments(sendData)
          .subscribe(res=>console.log('likeContent() res', res),
            err =>console.log('likeContent() err', err))
      }

      else  {
        let index = content.starting_comment.up_votes_id.indexOf(this.userProfile.user);
        content.starting_comment.up_votes_id.splice(index, 1);
        content.starting_comment.up_votes_count -= 1;
        content['alreadyLiked'] = false;

        let sendData = {
          id: content.starting_comment.id,
          up_votes_id: content.starting_comment.up_votes_id,
          up_votes_count: content.starting_comment.up_votes_count,
        };

        this.forumService.partialUpdateComments(sendData)
          .subscribe(res=>console.log('likeContent() res', res),
            err =>console.log('likeContent() err', err))
      }
    }

  }

}
