import {Component, OnDestroy, OnInit} from '@angular/core';
import { ForumService } from "../../_services/forum.service";

import { Forum } from "../../_models/forum";
import { Comment } from "../../_models/comment";

import { UserProfile } from '../../_models/user-profile';

import { UserProfileService } from '../../_services/user-profile.service';

import { CommentService } from '../../_services/comment.service';

import {ActivatedRoute, ActivationEnd, Router} from '@angular/router';

import { NgZone } from '@angular/core';
import { Title }     from '@angular/platform-browser';
import { AuthService } from "../../_services/auth.service";
import {MatDialog, MatSnackBar} from '@angular/material';
import {SeoService} from '../../_services/seo.service';
import {SearchService} from '../../_services/search.service';
import {genericItemTransform} from '../../_shared/utils';
import {SubscriberDialogComponent} from '../../subscriber-dialog/subscriber-dialog.component';
import {MyFirebaseService} from '../../_services/myfirebase.service';
import {Subscription} from 'rxjs/Subscription';
@Component({
  selector: 'app-forum-detail',
  templateUrl: './forum-detail.component.html',
  styleUrls: ['./forum-detail.component.scss']
})
export class ForumDetailComponent implements OnInit, OnDestroy {

  comments: Comment[];
  //commentType ="Forum";
  forum: Forum;
  userComment:Comment;
  userProfile: UserProfile;
  userId;
  forumMetaData: any = {};
  showPostHelper;
  relatedItems: any = [];
  subscriber: any = {};
  forumSlug: any = {};
  routerChanges: Subscription;
  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public _ngZone: NgZone,
    public userProfileService: UserProfileService,
    public titleService: Title,
    public commentService: CommentService,
    public forumService: ForumService,
    public authService: AuthService,
    public snackBar: MatSnackBar,
    public seoService: SeoService,
    public dialog: MatDialog,
    public searchService: SearchService,
    public firebaseService: MyFirebaseService,) {
      this.userId = parseInt(this.authService.decryptLocalStorage('uid'));


    //reload the url if a new slug is clicked from related items
    this.routerChanges = router.events.subscribe(data=>{
      if(data instanceof ActivationEnd){
        this.forumSlug = route.snapshot.params['slug'];
        this.ngOnInitHelper();
      }
    });
    }

  ngOnInitHelper() {

    let defaultProfileImage = 'https://firebasestorage.googleapis.com/v0/b/atila-7.appspot.com/o/user-profiles%2Fgeneral-data%2Fdefault-profile-pic.png?alt=media&token=455c59f7-3a05-43f1-a79e-89abff1eae57';
    let atilaImage = 'https://firebasestorage.googleapis.com/v0/b/atila-7.appspot.com/o/public%2Fatila-gradient-banner-march-14.png?alt=media&token=9d791ba9-18d0-4750-ace8-b390a4e90fdc"';

    if (!this.forumSlug){
      return;
    }
    this.forumService.getBySlug(this.forumSlug).subscribe(
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
        // this.titleService.setTitle( this.forum.title + ' - Atila Forum');


        this.commentService.getComments(this.forum.id,'Forum').subscribe(
          res => {

            this.forum.starting_comment = res.starting_comment;
            this.comments = res.forum_comments;
            this.forumMetaData['hideTitle'] = true;
            this.forumMetaData['titleComment'] = true;

            this.forumMetaData['isShareItem'] = true;

            this.forumMetaData['shareItem'] = {
              title : this.forum.starting_comment.title,
              url : `https://atila.ca/forum/${this.forum.slug}/`,
              id : this.forum.id,
              type : 'forum',
              source : 'forum_detail',
            }
          }
        );
        this.getRelatedItems();
      }
    );

    this.userComment = new Comment(this.userId);
  }

  ngOnInit(){}

  ngOnDestroy() {
    this.routerChanges.unsubscribe();
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


  logRelatedItemClick(item) {
    let itemCopy: any = {};
    itemCopy.item_type = item.type;
    itemCopy.title = item.title;
    itemCopy.item_id= item.id;
    itemCopy.share_source= 'forum_detail';
    this.firebaseService.saveUserAnalytics(itemCopy,'related_item_click');


  }

  getRelatedItems() {
    let queryString= `?type=forum&id=${this.forum.id}`;

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

    this.subscriber.utm_source =       'forum_detail';
    this.subscriber.utm_type =       'forum';
    this.subscriber.utm_id =       this.forum.id;
    this.subscriber.utm_title =       this.forum.starting_comment.title;

    let dialogRef = this.dialog.open(SubscriberDialogComponent, {
      width: '300px',
      data: this.subscriber,
    });


    dialogRef.afterClosed().subscribe(
      result => {
        this.subscriber = result;
        if(this.subscriber) {

          this.subscriber.dialog_submit_event = result.dialog_submit_event || 'ButtonClick';

          $.getJSON('//api.ipstack.com/check?access_key=9e6a79fc9c2f5ab8b7f4f42095469029&output=json&legacy=1',
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
