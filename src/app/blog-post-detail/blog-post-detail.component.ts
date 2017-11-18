import { Component, OnInit } from '@angular/core';
import { BlogPostService } from "../_services/blog-post.service";

import { BlogPost} from "../_models/blog-post";
import { Comment } from "../_models/comment";

import { UserProfile } from '../_models/user-profile';

import { UserProfileService } from '../_services/user-profile.service';

import { CommentService } from '../_services/comment.service';

import { ActivatedRoute, Router } from '@angular/router';

import { NgZone } from '@angular/core';
import { Title }     from '@angular/platform-browser';

import { AuthService } from "../_services/auth.service";

    
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

    public authService: AuthService,
    ) { 
      this.userId = parseInt(this.authService.decryptLocalStorage('uid'));
    }

  ngOnInit() {

    this.blogPostService.getBySlug(this.route.snapshot.params['username'],this.route.snapshot.params['slug']).subscribe(
      res => {
        this.blogPost = res.blog;
        this.titleService.setTitle(this.blogPost.title);
        
        this.commentService.getComments(this.blogPost.id,'BlogPost').subscribe(
          res => {
            
            this.comments = res.comments;
          }
        )
        
      }
    );

    this.userProfileService.getById(parseInt(this.userId)).subscribe(
      res =>{
        this.userProfile = res;
      }
    );

    this.userComment = new Comment(this.userId);
  }

  
  postComment(){
    
    //prevent ScholarshipComments from tracking the changes to UserComment;
    // TODO: Consider using deepcopy of comment
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

  


}
