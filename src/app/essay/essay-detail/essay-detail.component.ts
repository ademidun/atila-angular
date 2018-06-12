import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {BlogPostService} from "../../_services/blog-post.service";

import {BlogPost, likeContent} from "../../_models/blog-post";
import {Comment} from "../../_models/comment";

import {UserProfile, DEFAULTPROFILEPICURL} from '../../_models/user-profile';

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
import {Subscription} from 'rxjs/Subscription';
import {EssayService} from '../../_services/essay.service';
import {Essay} from '../../_models/essay';

@Component({
  selector: 'app-essay-detail',
  templateUrl: './essay-detail.component.html',
  styleUrls: ['./essay-detail.component.scss']
})
export class EssayDetailComponent implements OnInit, OnDestroy {

  comments: Comment[];
  //commentType ="Forum";
  essay: Essay;
  userComment: Comment;
  userProfile: UserProfile;
  userId;
  relatedItems: any = [];
  subscriber: any = {};
  slugUsername: any = {};
  slugTitle: any = {};
  routerChanges: Subscription;

  constructor(public route: ActivatedRoute,
    public router: Router,
    public _ngZone: NgZone,
    public userProfileService: UserProfileService,
    public titleService: Title,
    public commentService: CommentService,
    public essayService: EssayService,
    public snackBar: MatSnackBar,
    public authService: AuthService,
    public firebaseService: MyFirebaseService,
    public seoService: SeoService,
    public dialog: MatDialog,
    public searchService: SearchService,)
  {
    this.userId = parseInt(this.authService.decryptLocalStorage('uid'));

    this.routerChanges = router.events.subscribe(data=>{
      if(data instanceof ActivationEnd){


        if (this.userProfileService.viewHistoryChanges) {
          this.userProfileService.viewHistoryChanges.unsubscribe();
        }
        this.slugUsername = data.snapshot.params['username'];
        this.slugTitle = data.snapshot.params['slug'];
        this.ngOnInitHelper();
      }
    });
  }

  ngOnInitHelper() {

    if (this.userProfileService.viewHistoryChanges) {
      this.userProfileService.viewHistoryChanges.unsubscribe();
    }

    if (!this.slugUsername || !this.slugTitle) {
      return;
    }
    let slugCopy = {username:this.slugUsername, title:this.slugTitle};
    this.essayService.getBySlug(this.slugUsername, this.slugTitle).subscribe(
      res => {
        this.essay = res.essay;

        console.log('this.userProfile, this.essay',this.userProfile, this.essay);

        //this.updateMeta();

        let essayImageSeo = DEFAULTPROFILEPICURL;

        if (this.essay.user && !this.essay.user.profile_pic_url.includes(DEFAULTPROFILEPICURL)){
          essayImageSeo = this.essay.user.profile_pic_url;
        }
        try {
          this.seoService.generateTags({
            title: this.essay.title,
            description: this.essay.description,
            image: essayImageSeo,
            slug: `essay/${this.essay.user.username}/${this.essay.slug}`
          });
        }
        catch (err) {
        }

        if (!isNaN(this.userId)) {

          this.userProfileService.getById(parseInt(this.userId)).subscribe(
            res => {
              this.userProfile = res;
            }
          );

          this.userComment = new Comment(this.userId);
        }

      },
      err => {
        let snackBarRef = this.snackBar.open("Blog Post Not Found.", 'Try User\'s Blogs', {
          duration: 5000
        });

        // this.slugUsername keeps appearing as undefined
        snackBarRef.onAction().subscribe(
          () => {
            this.router.navigate(['blog',slugCopy.username]);
          });

        setTimeout(() => {
          this.router.navigate(['blog',slugCopy.username]);
        }, 500);
      }


    );

  }
  ngOnInit() {

  }

  ngOnDestroy() {
    this.routerChanges.unsubscribe();
    if (this.userProfileService.viewHistoryChanges) {
      this.userProfileService.viewHistoryChanges.unsubscribe();
    }

  }

  scrollToElement(selector) {
    try{
      console.log('scrollToElement',this.scrollToElement);
      $("html, body").animate({scrollTop: $(selector).offset().top}, 1000);
    }
    catch(e) {
      console.log('scrollToElement catch e',e);

    }
  }



}
