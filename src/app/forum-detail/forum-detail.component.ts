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
import {MatSnackBar} from '@angular/material';
import {SeoService} from '../_services/seo.service';
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
  forumMetaData: any = {};
  showPostHelper;
  constructor(
    public route: ActivatedRoute,
    public _ngZone: NgZone,
    public userProfileService: UserProfileService,
    public titleService: Title,
    public commentService: CommentService,
    public forumService: ForumService,
    public authService: AuthService,
    public snackBar: MatSnackBar,
    public seoService: SeoService,) {
      this.userId = parseInt(this.authService.decryptLocalStorage('uid'));
    }

  ngOnInit() {
    let defaultProfileImage = 'https://firebasestorage.googleapis.com/v0/b/atila-7.appspot.com/o/user-profiles%2Fgeneral-data%2Fdefault-profile-pic.png?alt=media&token=455c59f7-3a05-43f1-a79e-89abff1eae57';
    let atilaImage = 'https://firebasestorage.googleapis.com/v0/b/atila-7.appspot.com/o/public%2Fatila-image-preview-nov-24-2.png?alt=media&token=f4bb94ac-60f6-451a-a3df-f2300d92818d"';


    this.forumService.getBySlug(this.route.snapshot.params['slug']).subscribe(
      forum => {
        this.forum = forum;
        try {
          this.seoService.generateTags({
            title: this.forum.title,
            description: this.forum.starting_comment.text,
            image:  !this.forum.user.profile_pic_url || this.forum.user.profile_pic_url == defaultProfileImage ? atilaImage :this.forum.user.profile_pic_url,
            slug: `forum/${this.forum.slug}/`
          });
        }
        catch (err) {

        }
        this.forum.starting_comment = null;
        this.titleService.setTitle( this.forum.title + ' - Atila Forum');


        this.commentService.getComments(this.forum.id,'Forum').subscribe(
          res => {

            this.forum.starting_comment = res.starting_comment;
            this.comments = res.forum_comments;
            this.forumMetaData['hideTitle'] = true;
            this.forumMetaData['titleComment'] = true;
          }
        )
      }
    );

    this.userComment = new Comment(this.userId);
  }

  postComment(){

    //prevent ScholarshipComments from tracking the changes to UserComment;
    // TODO: Consider using deepcopy of comment
    if( !this.authService.isUserLoggedIn()){
      this.snackBar.open("Please Login In", '', {
        duration: 3000
      });
      return;

    }
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
