import { Component, OnInit } from '@angular/core';
import { ForumService } from "../_services/forum.service";

import { Forum } from "../_models/forum";
import { Comment } from "../_models/comment";

import { UserProfile } from '../_models/user-profile';

import { UserProfileService } from '../_services/user-profile.service';

import { CommentService } from '../_services/comment.service';

import { ActivatedRoute, Router } from '@angular/router';

import { NgZone } from '@angular/core';
import { Title }     from '@angular/platform-browser';
import { AuthService } from "../_services/auth.service";
@Component({
  selector: 'app-forum-detail',
  templateUrl: './forum-detail.component.html',
  styleUrls: ['./forum-detail.component.scss']
})
export class ForumDetailComponent implements OnInit {

  comments: Comment[];
  //commentType ="Forum";
  forum: Forum;
  userComment:Comment;
  userProfile: UserProfile;
  userId;
  constructor(    
    public route: ActivatedRoute,
    public _ngZone: NgZone,
    public userProfileService: UserProfileService,
    public titleService: Title,
    public commentService: CommentService,
    public forumService: ForumService,
    public authService: AuthService,) { 
      this.userId = parseInt(this.authService.decryptLocalStorage('uid'));
    }

  ngOnInit() {

    this.forumService.getBySlug(this.route.snapshot.params['slug']).subscribe(
      forum => {
        this.forum = forum;
        this.forum.starting_comment = null;
        this.titleService.setTitle('Atila Forum - ' + this.forum.title);
        this.commentService.getComments(this.forum.id,'Forum').subscribe(
          res => {
            
            this.forum.starting_comment = res.starting_comment;
            this.comments = res.forum_comments;
          }
        )
      }
    )

    this.userComment = new Comment(this.userId);
  }

  postComment(){
    
    //prevent ScholarshipComments from tracking the changes to UserComment;
    // TODO: Consider using deepcopy of comment
    var commentTemp:Comment = new Comment(this.userId);

    commentTemp['forum'] = this.forum.id;

    commentTemp.text = this.userComment.text;
    commentTemp.title = this.userComment.title;
    
    
    let postOperation = this.commentService.create(commentTemp);

    postOperation.subscribe(
      res => {
        
        this.comments.unshift(res);
      },

      err =>{
        
      }
      
    )
    
    this.userComment.text = "";
    this.userComment.title = "";
  }
  trackByFn(index: any, item: any) {
    return index;

  }

}
