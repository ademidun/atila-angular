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
    private route: ActivatedRoute,
    private _ngZone: NgZone,
    private userProfileService: UserProfileService,
    private titleService: Title,
    private commentService: CommentService,
    private blogPostService: BlogPostService,

    private authService: AuthService,
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
            console.log('blogPostService.getComments',res)
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
