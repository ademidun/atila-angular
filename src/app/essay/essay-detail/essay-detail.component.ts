import {Component, OnDestroy, OnInit} from '@angular/core';
import {Comment} from '../../_models/comment';

import {DEFAULTPROFILEPICURL, UserProfile} from '../../_models/user-profile';

import {UserProfileService} from '../../_services/user-profile.service';

import {ActivatedRoute, ActivationEnd, Router} from '@angular/router';
import {Title} from '@angular/platform-browser';

import {AuthService} from '../../_services/auth.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {MyFirebaseService} from '../../_services/myfirebase.service';
import {SeoService} from '../../_services/seo.service';
import {Subscription} from 'rxjs/Subscription';
import {EssayService} from '../../_services/essay.service';
import {Essay} from '../../_models/essay';
import {genericItemTransform, toTitleCase} from '../../_shared/utils';
import {SearchService} from '../../_services/search.service';

@Component({
  selector: 'app-essay-detail',
  templateUrl: './essay-detail.component.html',
  styleUrls: ['./essay-detail.component.scss']
})
export class EssayDetailComponent implements OnInit, OnDestroy {

  comments: Comment[];
  essay: Essay;
  userComment: Comment;
  userProfile: UserProfile;
  userId;
  relatedItems: any = [];
  subscriber: any = {};
  slugUsername: any = {};
  slugTitle: any = {};
  routerChanges: Subscription;
  private isLoadingRelatedItems: boolean;

  constructor(public route: ActivatedRoute,
              public router: Router,
              public userProfileService: UserProfileService,
              public titleService: Title,
              public essayService: EssayService,
              public snackBar: MatSnackBar,
              public authService: AuthService,
              public firebaseService: MyFirebaseService,
              public seoService: SeoService,
              public dialog: MatDialog,
              public searchService: SearchService,) {
    this.userId = parseInt(this.authService.decryptLocalStorage('uid'), 10);

    this.routerChanges = router.events.subscribe(data => {
      if (data instanceof ActivationEnd) {


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
    const slugCopy = {username: this.slugUsername, title: this.slugTitle};
    this.essayService.getBySlug(this.slugUsername, this.slugTitle).subscribe(
      res => {
        this.essay = res.essay;
        this.getRelatedItems();

        let essayImageSeo = 'https://firebasestorage.googleapis.com/v0/b/atila-7.appspot.com/o/' +
          'public%2Fatila-essays-logo.png?alt=media&token=c4eb9b0a-f17a-4cb6-a80d-d6d839956a24';

        if (this.essay.user && !this.essay.user.profile_pic_url.includes(DEFAULTPROFILEPICURL)) {
          essayImageSeo = this.essay.user.profile_pic_url;
        }
        try {
          this.seoService.generateTags({
            title: `${this.essay.title} - ${this.essay.user.first_name} ${this.essay.user.last_name}`,
            description: this.essay.description,
            image: essayImageSeo,
            slug: `essay/${this.essay.user.username}/${this.essay.slug}`
          });
        } catch (err) {
        }

        if (!isNaN(this.userId)) {

          this.userProfileService.getById(this.userId).subscribe(
            resUser => {
              this.userProfile = resUser;
            }
          );

          this.userComment = new Comment(this.userId);
        }

      },
      err => {
        const snackBarRef = this.snackBar.open('Essay Not Found.', 'Try User\'s profile', {
          duration: 5000
        });

        // this.slugUsername keeps appearing as undefined
        snackBarRef.onAction().subscribe(
          () => {
            this.router.navigate(['profile', slugCopy.username]);
          });

        setTimeout(() => {
          this.router.navigate(['profile', slugCopy.username]);
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

  toTitleCase(str) {
    return toTitleCase(str);
  }

  getRelatedItems() {
    const queryString = `?type=essay&id=${this.essay.id}`;
    this.isLoadingRelatedItems = true;
    this.searchService.relatedItems(queryString)
      .subscribe(res => {
          this.relatedItems = res.items.map(item => {
            return genericItemTransform(item);
          });
          this.relatedItems = this.relatedItems.slice(0, 3);
        },
        err => {
          this.isLoadingRelatedItems = false;
        },
        () => {
          this.isLoadingRelatedItems = false;
        });
  }

}
