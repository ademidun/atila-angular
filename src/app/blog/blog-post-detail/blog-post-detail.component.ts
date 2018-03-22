import {Component, NgZone, OnInit} from '@angular/core';
import {BlogPostService} from "../../_services/blog-post.service";

import {BlogPost, likeContent} from "../../_models/blog-post";
import {Comment} from "../../_models/comment";

import {UserProfile} from '../../_models/user-profile';

import {UserProfileService} from '../../_services/user-profile.service';

import {CommentService} from '../../_services/comment.service';

import {ActivatedRoute, ActivationEnd, Router} from '@angular/router';
import {Title} from '@angular/platform-browser';

import {AuthService} from "../../_services/auth.service";
import {MatDialog, MatSnackBar} from '@angular/material';
import {MyFirebaseService} from '../../_services/myfirebase.service';
import {SeoService} from '../../_services/seo.service';
import {SearchService} from '../../_services/search.service';
import {genericItemTransform} from '../../_shared/utils';
import {SubscriberDialogComponent} from '../../subscriber-dialog/subscriber-dialog.component';


@Component({
  selector: 'app-blog-post-detail',
  templateUrl: './blog-post-detail.component.html',
  styleUrls: ['./blog-post-detail.component.scss']
})
export class BlogPostDetailComponent implements OnInit {

  comments: Comment[];
  //commentType ="Forum";
  blogPost: BlogPost;
  userComment: Comment;
  userProfile: UserProfile;
  userId;
  relatedItems: any = [];
  subscriber: any = {};
  slugUsername: any = {};
  slugTitle: any = {};

  constructor(public route: ActivatedRoute,
              public router: Router,
              public _ngZone: NgZone,
              public userProfileService: UserProfileService,
              public titleService: Title,
              public commentService: CommentService,
              public blogPostService: BlogPostService,
              public snackBar: MatSnackBar,
              public authService: AuthService,
              public firebaseService: MyFirebaseService,
              public seoService: SeoService,
              public dialog: MatDialog,
              public searchService: SearchService,)
              {
                this.userId = parseInt(this.authService.decryptLocalStorage('uid'));

                router.events.subscribe(data=>{
                  if(data instanceof ActivationEnd){
                    this.slugUsername = data.snapshot.params['username'];
                    this.slugTitle = data.snapshot.params['slug'];
                    this.ngOnInitHelper();
                  }
                });
              }

  ngOnInitHelper() {
    if (!this.slugUsername && !this.slugTitle) {
      return;
    }
      this.blogPostService.getBySlug(this.slugUsername, this.slugTitle).subscribe(
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
          }

          // this.titleService.setTitle(this.blogPost.title + ' - Atila');
          if (!isNaN(this.userId)) {

            this.userProfileService.getById(parseInt(this.userId)).subscribe(
              res => {
                this.userProfile = res;

                if (this.blogPost.up_votes_id.includes(this.userId)) {//if the current user (ID) already liked the video, disable the up_vote_button
                  this.blogPost['alreadyLiked'] = true;
                }

              }
            );

            this.userComment = new Comment(this.userId);
          }

          else {
            this.userComment = new Comment(0);
          }
          this.commentService.getComments(this.blogPost.id, 'BlogPost').subscribe(
            res => {

              this.comments = res.comments;
            }
          );

          this.getRelatedItems();

        },
      );

  }
  ngOnInit() {

  }


  postComment() {

    //prevent ScholarshipComments from tracking the changes to UserComment;
    // TODO: Consider using deepcopy of comment

    if (!this.authService.isUserLoggedIn()) {
      this.snackBar.open("Please Login In", '', {
        duration: 3000
      });
      return;

    }
    var commentTemp: Comment = new Comment(this.userId);

    commentTemp['blog_post'] = this.blogPost.id;

    commentTemp.text = this.userComment.text;
    commentTemp.title = this.userComment.title;


    let postOperation = this.commentService.create(commentTemp);

    postOperation.subscribe(
      res => {

        this.comments.unshift(res);
      },

      err => {

      }
    )

    this.userComment.text = "";
    this.userComment.title = "";
  }

  scrollToComments() {
    $("html, body").animate({scrollTop: $('.comment-box').offset().top}, 1000);
  }

  trackByFn(index: any, item: any) {
    return index;

  }

  likeContent(content: BlogPost) {
    this.blogPost = likeContent(content, this.userProfile, this.blogPostService, this.firebaseService, this.snackBar)
  }

  logRelatedItemClick(item) {
    let itemCopy: any = {};
    itemCopy.item_type = item.type;
    itemCopy.title = item.title;
    itemCopy.item_id= item.id;
    itemCopy.share_source= 'blog_detail';
    this.firebaseService.saveUserAnalytics(itemCopy,'related_item_click');

  }

  getRelatedItems() {
    let queryString= `?type=blog&id=${this.blogPost.id}`;

    this.searchService.relatedItems(queryString)
      .subscribe( res => {
        this.relatedItems = res.items.map( item => {
          return genericItemTransform(item);
        });

        this.relatedItems = this.relatedItems.slice(0,3);


      });
  }

  addSubscriber(event?: KeyboardEvent) {


    if(!this.subscriber.email) {
      this.subscriber.response ='Please enter email.';
      return;
    }
    // In case we want to see if people are more likely to submit by typing Enter or clicking.
    if (event) {
      this.subscriber.dialog_open_event = event.key;
    }
    else {
      this.subscriber.dialog_open_event = 'ButtonClick';
    }

    this.subscriber.utm_source =       'blog_detail';
    this.subscriber.utm_type =       'blog';
    this.subscriber.utm_id =       this.blogPost.id;
    this.subscriber.utm_title =       this.blogPost.title;

    let dialogRef = this.dialog.open(SubscriberDialogComponent, {
      width: '300px',
      data: this.subscriber,
    });


    dialogRef.afterClosed().subscribe(
      result => {
        this.subscriber = result;
        if(this.subscriber) {

          this.subscriber.dialog_submit_event = result.dialog_submit_event || 'ButtonClick';

          $.getJSON('//freegeoip.net/json/?callback=?',
            data => {
              this.subscriber.geo_ip = data;

              this.firebaseService.addSubscriber(this.subscriber)
                .then(res => {
                    this.subscriber.response ='Successfully subscribed to Atila 😄.';
                  },
                  err => this.subscriber.response ='Subscription error.');
            });
        }
        else {
          this.subscriber = {};
          this.subscriber.response ='Please enter subscription information 😄.';
        }


      });
  }

}
