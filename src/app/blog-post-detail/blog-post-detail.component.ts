import { Component, OnInit } from '@angular/core';
import { BlogPostService } from "../_services/blog-post.service";

import { BlogPost} from "../_models/blog-post";
import { Comment } from "../_models/comment";

import { UserProfile } from '../_models/user-profile';

import { UserProfileService } from '../_services/user-profile.service';

import { CommentService } from '../_services/comment.service';

import { ActivatedRoute, Router } from '@angular/router';

import { NgZone } from '@angular/core';
import {Meta, Title} from '@angular/platform-browser';

import { AuthService } from "../_services/auth.service";
import {MatSnackBar} from '@angular/material';


@Component({
  selector: 'app-blog-post-detail',
  templateUrl: './blog-post-detail.component.html',
  styleUrls: ['./blog-post-detail.component.scss']
})
export class BlogPostDetailComponent implements OnInit {

  comments: Comment[];
  //commentType ="Forum";
  blogPost: BlogPost;
  userComment:Comment;
  userProfile: UserProfile;
  userId;
  constructor(
    public route: ActivatedRoute,
    public _ngZone: NgZone,
    public userProfileService: UserProfileService,
    public titleService: Title,
    public commentService: CommentService,
    public blogPostService: BlogPostService,
    public snackBar: MatSnackBar,
    public metaService: Meta,
    public authService: AuthService,
    ) {
      this.userId = parseInt(this.authService.decryptLocalStorage('uid'));
    }

  ngOnInit() {

    this.blogPostService.getBySlug(this.route.snapshot.params['username'],this.route.snapshot.params['slug']).subscribe(
      res => {
        this.blogPost = (<any>res).blog;

        this.updateMeta();
        this.titleService.setTitle(this.blogPost.title);

        this.commentService.getComments(this.blogPost.id,'BlogPost').subscribe(
          res => {

            this.comments = res.comments;
          }
        )

      }
    );
    if (! isNaN(this.userId)){

      this.userProfileService.getById(parseInt(this.userId)).subscribe(
        res =>{
          this.userProfile = res;
        }
      );

      this.userComment = new Comment(this.userId);
    }

    else{
      this.userComment = new Comment(0);
    }



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

    commentTemp['blog_post'] = this.blogPost.id;

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

  updateMeta(){

    const fullUrl = "https://atila.ca/blog/"+this.route.snapshot.params['username']+"/"+this.route.snapshot.params['slug'];

    this.metaService.updateTag({
        content: this.blogPost.title
      },
      "property='og:title'"
    );

    this.metaService.updateTag({
        content: this.blogPost.description
      },
      "property='og:description'"
    );
    this.metaService.updateTag({
        content: this.blogPost.description
      },
      "name='Description'"
    );

    this.metaService.updateTag({
        content: this.blogPost.header_image_url
      },
      "property='og:image'"
    );

    this.metaService.updateTag({
        content: fullUrl
      },
      "property='og:url'"
    );

    this.metaService.updateTag({
        content: this.blogPost.title
      },
      "name='twitter:title'"
    );

    this.metaService.updateTag({
        content: this.blogPost.description
      },
      "name='twitter:description'"
    );

    this.metaService.updateTag({
        content: this.blogPost.header_image_url
      },
      "name='twitter:image'"
    );
    this.metaService.updateTag({
        content: fullUrl
      },
      "name='twitter:url'"
    );


    this.metaService.updateTag({
        content: this.blogPost.title
      },
      "itemprop='name'"
    );

    this.metaService.updateTag({
        content: this.blogPost.description
      },
      "itemprop='description'"
    );

    this.metaService.updateTag({
        content: this.blogPost.header_image_url
      },
      "itemprop='image'"
    );

    console.log('fullUrl',fullUrl);
    console.log('this.route',this.route);
    console.log('this.route.snapshot',this.route.snapshot);
    console.log('document.location',document.location);

  }




}
