import { Component, OnInit } from '@angular/core';
import { BlogPostService } from "../_services/blog-post.service";

import { BlogPost, likeContent} from "../_models/blog-post";
import { Comment } from "../_models/comment";

import { UserProfile } from '../_models/user-profile';

import { UserProfileService } from '../_services/user-profile.service';

import { CommentService } from '../_services/comment.service';

import { ActivatedRoute, Router } from '@angular/router';

import { NgZone } from '@angular/core';
import {Meta, Title} from '@angular/platform-browser';

import { AuthService } from "../_services/auth.service";
import {MatSnackBar} from '@angular/material';
import {MyFirebaseService} from '../_services/myfirebase.service';
import {SeoService} from '../_services/seo.service';


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
    public firebaseService: MyFirebaseService,
    public seoService: SeoService,
    ) {
      this.userId = parseInt(this.authService.decryptLocalStorage('uid'));
    }

  ngOnInit() {

    this.blogPostService.getBySlug(this.route.snapshot.params['username'],this.route.snapshot.params['slug']).subscribe(
      res => {
        this.blogPost = (<any>res).blog;

        //this.updateMeta();
        try {
          this.seoService.generateTags({
            title: this.blogPost.title,
            description: this.blogPost.description,
            image: this.blogPost.header_image_url,
            slug: `blog/${this.blogPost.user.username}/${this.blogPost.slug}`
          });
        }
        catch (err) {
          console.log('seoService Error', err);
        }

        this.titleService.setTitle(this.blogPost.title);
        if (! isNaN(this.userId)){

          this.userProfileService.getById(parseInt(this.userId)).subscribe(
            res =>{
              this.userProfile = res;

              if(this.blogPost.up_votes_id.includes(this.userId)){//if the current user (ID) already liked the video, disable the up_vote_button
                this.blogPost['alreadyLiked'] = true;
              }
            }
          );

          this.userComment = new Comment(this.userId);
        }

        else{
          this.userComment = new Comment(0);
        }
        this.commentService.getComments(this.blogPost.id,'BlogPost').subscribe(
          res => {

            this.comments = res.comments;
          }
        )

      },
    );




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

    const fullUrl = document.location.href;

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


  }

  likeContent(content: BlogPost) {

    this.blogPost =  likeContent(content, this.userProfile, this.blogPostService, this.firebaseService, this.snackBar)

  }




}
