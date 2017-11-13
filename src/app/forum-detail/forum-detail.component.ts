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
    private route: ActivatedRoute,
    private _ngZone: NgZone,
    private userProfileService: UserProfileService,
    private titleService: Title,
    private commentService: CommentService,
    private forumService: ForumService,) { 
      this.userId = parseInt(localStorage.getItem('userId'));
    }

  ngOnInit() {

    this.forumService.getBySlug(this.route.snapshot.params['slug']).subscribe(
      forum => {
        this.forum = forum;
        this.forum.starting_comment = null;
        this.titleService.setTitle('Atila Forum - ' + this.forum.title);
        this.commentService.getComments(this.forum.id,'Forum').subscribe(
          res => {
            console.log('forumService.getComments',res)
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
    console.log('about to save the comment commentTemp; ', commentTemp);
    
    let postOperation = this.commentService.create(commentTemp);

    postOperation.subscribe(
      res => {
        console.log('postComment response; ', res);
        this.comments.unshift(res);
      },

      err =>{
        console.log('postComment err: ', err);
      }
      
    )
    
    this.userComment.text = "";
    this.userComment.title = "";
  }
  trackByFn(index: any, item: any) {
    return index;

  }

}
