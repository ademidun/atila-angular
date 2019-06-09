import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, AfterViewInit, OnDestroy} from '@angular/core';
import {MatDialog, MatSnackBar} from '@angular/material';
import {Router} from '@angular/router';
import {addToMyScholarshipHelper, UserProfile, updateScholarshipMatchScore} from '../../_models/user-profile';
import {MyFirebaseService} from '../../_services/myfirebase.service';
import {UserProfileService} from '../../_services/user-profile.service';
import {trigger, state, animate, transition, style} from '@angular/animations';
import {ScholarshipService} from '../../_services/scholarship.service';
import {AuthService} from '../../_services/auth.service';
import {environment} from '../../../environments/environment';
import {Scholarship} from '../../_models/scholarship';
import {NotificationDialogComponent} from '../../notification-dialog/notification-dialog.component';
import {NotificationsService} from '../../_services/notifications.service';
import * as $ from 'jquery';
import {prettifyKeys} from '../../_shared/utils';
import {AUTOCOMPLETE_KEY_LIST} from '../../_models/constants';
import {notifySavedScholarship} from '../scholarship-notifications/scholarship-notifications';

@Component({
  selector: 'app-scholarship-card',
  templateUrl: './scholarship-card.component.html',
  styleUrls: ['./scholarship-card.component.scss'],
  animations: [
    trigger('hideCard', [
      state('true', style({opacity: 0, transform: 'scale(0.0)'})),
      state('false', style({opacity: 1, transform: 'scale(1.0)'})),
      transition('* => *', animate('.5s ease-in'))
    ])
  ],
})
export class ScholarshipCardComponent implements OnInit, AfterViewInit, OnDestroy {

  // todo change to only handle one scholarship
  @Input() scholarship: Scholarship | any;
  @Input() userProfile: UserProfile;
  @Input() metadata: any = {
    viewAsUser: '',
    page_no: '',
    form_data: '',
  };
  @Output() handleClick: EventEmitter<any> = new EventEmitter();
  alreadySaved: boolean;
  userAnalytics: any = {};
  hideCard: boolean;
  handler: any;
  userId: any;
  isFirstView = true;
  showMore = false;
  prettifyKeys = prettifyKeys;
  autoCompleteLists = AUTOCOMPLETE_KEY_LIST;

  old_visible: boolean;
  userScholarship: any;
  environment = environment;
  readonly VAPID_PUBLIC_KEY = 'BAjiETJuDgtXH6aRXgeCZgK8vurMT7AbFmPPhz1ybyfcDmfGFFydSXkYDC359HIXUmWw8w79-miI6NtmbfodiVI';
  @ViewChild('scholarshipCard') scholarshipCardRef: ElementRef;

  constructor(
    public snackBar: MatSnackBar,
    public router: Router,
    public firebaseService: MyFirebaseService,
    public userProfileService: UserProfileService,
    public scholarshipService: ScholarshipService,
    public authService: AuthService,
    public notificationDialog: MatDialog,
    public notificationService: NotificationsService) {
  }

  ngOnInit() {

    this.userId = this.authService.decryptLocalStorage('uid');

    if (this.userProfile && this.userProfile.saved_scholarships) {

      if (this.userProfile.saved_scholarships.includes(this.scholarship.id)) {
        this.alreadySaved = true;
      }

      if (!environment.production || this.userProfile.is_atila_admin) {
        let userScholarshipUserId = this.userId;

        if (this.metadata.viewAsUser) {
          userScholarshipUserId = this.metadata.viewAsUser.user;
        }
        this.scholarshipService.getUserScholarship(userScholarshipUserId, this.scholarship.id)
          .subscribe(
            res => {
              this.userScholarship = res.results[0];
            }
          )
      }

    }

    if (!this.scholarship.metadata) {
      this.scholarship.metadata = {};
    }

    if (this.scholarship.deadline.includes('2022-01-01')) {
      this.scholarship['metadata']['deadline_tbd'] = 'TBA';
    } else if (this.scholarship['metadata']['deadline_tbd']) {
      delete this.scholarship['metadata']['deadline_tbd'];
    }

    let today: Date | String = new Date();
    today = today.toISOString();
    if (this.scholarship.open_date < today) {
      this.scholarship['metadata']['open_date_tbd'] = 'TBA';
    } else if (this.scholarship['metadata']['open_date_tbd']) {
      delete this.scholarship['metadata']['open_date_tbd'];
    }

    if (this.scholarshipService.preventViewDoubleCount) {
      this.scholarshipService.preventViewDoubleCount = false;
    }


  }

  ngAfterViewInit() {
    if (typeof jQuery !== 'undefined') {
      // https://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport/7557433#7557433
      this.handler = this.onVisibilityChange(this.scholarshipCardRef.nativeElement, () => {
      });
      $(window).on('DOMContentLoaded load resize scroll', this.handler);
      // $(window).on('resize scroll', this.handler);
    }

  }

  ngOnDestroy() {
    if (typeof jQuery !== 'undefined') {
      $(window).off('DOMContentLoaded load resize scroll')
    }
  }

  addToMyScholarship(item) {

    this.logShareType('save_my_scholarships');
    if (this.userProfile) {

      const saveResult = addToMyScholarshipHelper(this.userProfile, this.scholarship);

      if (!saveResult[1]) { // saveResult[1] returns false if this item already exists
        this.alreadySaved = true;
        if (this.userProfile.is_atila_admin || this.userProfile.is_debug_mode) { // todo: remove this before-merge-master
          notifySavedScholarship(this.scholarship, this.userProfile, this.userProfileService,
            this.notificationService, this.notificationDialog);
          this.snackBar.open('Already Saved but allow it for admin mandem again doe', '', {
            duration: 3000
          });
        }
        else {
          this.snackBar.open('Already Saved', '', {
            duration: 3000
          });
        }
        return;
      } else {
        this.userProfile = saveResult[0];

        this.userProfileService.updateHelper(this.userProfile).subscribe(
          res => {

            notifySavedScholarship(this.scholarship, this.userProfile, this.userProfileService,
              this.notificationService, this.notificationDialog);
            const snackBarRef = this.snackBar.open('Saved to My Scholarships', 'My Scholarships', {
              duration: 5000
            });
            snackBarRef.onAction().subscribe(
              () => {
                this.router.navigate(['profile', this.userProfile.username, 'my-atila']);
              },
            );
          },
          err => {
          },
        );
      }

    } else {
      const snackBarRef = this.snackBar.open('Register to Save', 'Register', {
        duration: 5000
      });


      snackBarRef.onAction().subscribe(
        () => {
          this.router.navigate(['register']);
        },
      )
    }


  }

  logShareType(sharingType) {

    this.userAnalytics.share_type = sharingType;
    this.userAnalytics.schoarship_id = this.scholarship.id;


    if (this.userProfile) {
      this.userAnalytics.user_id = this.userProfile.user;

    }
    this.firebaseService.saveUserAnalytics(this.userAnalytics, 'scholarship_sharing');
  }

  webShare() {
    // if(this.userProfile && (this.userProfile.user == 4 || this.userProfile.user == 1)) {

    if ((<any>navigator).share) {
      (<any>navigator).share({
        title: 'Scholarship From Atila - ' + this.scholarship.name,
        text: 'Have you seen this scholarship from Atila: https://atila.ca/scholarship/' + this.scholarship.slug,
        url: 'https://atila.ca/scholarship/' + this.scholarship.slug,
      })
        .then(() => {
        })
        .catch((error) => {
        });
    }

  }

  logNotInterested() {

    setTimeout((args) => {
      $('#scholarship-card-' + this.scholarship.id).css('display', 'none');
    }, 700);

    this.userAnalytics.schoarship_id = this.scholarship.id;
    this.userAnalytics.schoarship_name = this.scholarship.name;
    this.userAnalytics.user_id = this.userProfile ? this.userProfile.user : 0;

    if (this.metadata['form_data']) {
      this.userAnalytics.form_data = this.metadata['form_data'];
    }
    this.firebaseService.saveUserAnalytics(this.userAnalytics, 'scholarships/not_interested/' + this.scholarship.id);

    if (this.userProfile) {

      this.userProfile.scholarships_not_interested.push(this.scholarship.id);

      this.userProfile.metadata['stale_cache'] = true;

      this.userProfile = updateScholarshipMatchScore(this.userProfile, {'not_interested': true});

      const scholarships_not_interested = {
        scholarships_not_interested: this.userProfile.scholarships_not_interested,
        scholarships_match_score: this.userProfile.scholarships_match_score,
      };
      this.userProfileService.patch(this.userProfile.user, scholarships_not_interested).subscribe(
        res => {
          this.snackBar.open('Changes Saved.', '', {
            duration: 5000
          });

        }
      )
    }
  }

  clickHandler(event) {

    if (this.metadata['form_data'] && this.metadata['form_data']['view_as_user']) {
      console.log('Skipping click in view_as_user mode, this.metadata[\'form_data\']', this.metadata['form_data']);
    }
    const userAnalyticsData = {
      scholarship: this.scholarship.id,
      form_data: this.metadata['form_data'] || null,
      page_no: this.metadata['page_no'] || null
    };
    this.firebaseService.saveUserAnalytics(userAnalyticsData, 'scholarships_list_click');
    this.sendScholarshipInteraction('click');

    const emitData = {
      event: event,
      type: 'scholarship',
      action: 'click',
      scholarship: this.scholarship,
      userProfile: this.userProfile,
    };
    this.scholarshipService.preventViewDoubleCount = true;
    this.handleClick.emit(emitData);
  }

  onVisibilityChange(el, callback) {
    return () => {

      // console.log('skipping onVisibilityChange');
      // console.log({el});
      // console.log({callback});
      // return null;
      //
      // const visible = this.isElementInViewport(el);
      // if (visible != this.old_visible) {
      //
      //   if (visible && this.isFirstView && !this.scholarshipService.preventViewDoubleCount) {
      //
      //       this.sendScholarshipInteraction = this.sendScholarshipInteraction.bind(this);
      //       this.sendScholarshipInteraction('view');
      //   }
      //
      //   this.old_visible = visible;
      //   if (typeof callback == 'function') {
      //     callback();
      //   }
      // }
    }
  }

  isElementInViewport(el) {

    // special bonus for those using jQuery
    if (typeof jQuery === 'function' && el instanceof jQuery) {
      el = el[0];
    }

    const rect = el.getBoundingClientRect();

    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
      rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
    );
  }

  sendScholarshipInteraction(actionType) {

    if (isNaN(Number.parseInt(this.userId))) {
      return;
    }

    if (this.metadata['form_data'] && this.metadata['form_data']['view_as_user']) {
      console.log('Skipping sendScholarshipInteraction in view_as_user mode, this.metadata[\'form_data\']',
        this.metadata['form_data'], 'actionType', actionType);
      return;
    }

    if (this.scholarshipService.preventSortByDoubleCount) {
      return;
    }


    this.isFirstView = false;
    const actionData = {
      'key': 'type',
      'value': actionType,
    };

    this.scholarshipService.sendUserScholarshipInteraction(this.userId, this.scholarship.id, actionData)
      .subscribe(
        res => {

          this.userProfileService.userProfileRPC(this.userId + '/refresh-scholarship-cache')
            .subscribe(
              res2 => {
              }
            )
        }
      );

  }


}



