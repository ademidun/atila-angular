import {Component, OnDestroy, OnInit, AfterViewInit} from '@angular/core';

import {Scholarship} from '../../_models/scholarship';
import { Comment, upVoteComment, downVoteComment } from '../../_models/comment';
import {ActivatedRoute, ActivationEnd, Router} from '@angular/router';
import { ScholarshipService } from '../../_services/scholarship.service';
import { ApplicationService } from '../../_services/application.service';
import { Observable } from 'rxjs/Observable';
import { NgZone } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { MatSnackBar } from '@angular/material';
import { UserProfileService } from '../../_services/user-profile.service';

import {environment} from '../../../environments/environment';
import { CommentService } from '../../_services/comment.service';
import { AuthService } from '../../_services/auth.service';
import {Meta, Title} from '@angular/platform-browser';
import {MyFirebaseService} from '../../_services/myfirebase.service';
import {UserProfile, addToMyScholarshipHelper} from '../../_models/user-profile';
import {SeoService} from '../../_services/seo.service';
import {SearchService} from '../../_services/search.service';
import {genericItemTransform, IPDATA_KEY, prettifyKeys} from '../../_shared/utils';
import {SubscriberDialogComponent} from '../../subscriber-dialog/subscriber-dialog.component';
import {Subscription} from 'rxjs/Subscription';
import {AtilaPointsPromptDialogComponent} from '../../atila-points-prompt-dialog/atila-points-prompt-dialog.component';
import {AUTOCOMPLETE_DICT, AUTOCOMPLETE_KEY_LIST} from '../../_models/constants';
import {HttpErrorResponse} from '@angular/common/http';
import {notifySavedScholarship} from '../scholarship-notifications/scholarship-notifications';
import {NotificationsService} from '../../_services/notifications.service';


@Component({
  selector: 'app-scholarship-detail',
  templateUrl: './scholarship-detail.component.html',
  styleUrls: ['./scholarship-detail.component.scss']
})
export class ScholarshipDetailComponent implements OnInit, OnDestroy, AfterViewInit {

  scholarship: Scholarship;
  autoCompleteLists = AUTOCOMPLETE_KEY_LIST;
  prettifyKeys = prettifyKeys;
  scholarshipAdditionalCriteria = [];
  scholarshipComments: Comment[];
  userComment: Comment;
  scholarshipSlug: string;
  userId: number;
  appId: number;
  json = JSON;
  userProfile: UserProfile;
  Object = Object;
  routerChanges: Subscription;
  isLoadingRelatedItems: boolean;
  public reviews: any[];
  public reviewsLoaded = false;
  public scholarshipOwner;
  public keyGetter = Object.keys;
  public environment = environment;
  public alreadySaved: boolean;
  public relatedItems: Array<any>;
  public subscriber: any = {};
  public viewHistory: any;
  public isLoggedIn;
  public preventNgOnInitDoubleCount = false;
  constructor(
    route: ActivatedRoute,
    public router: Router,
    public scholarshipService: ScholarshipService,
    public applicationService: ApplicationService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public userProfileService: UserProfileService,
    public titleService: Title,
    public commentService: CommentService,
    public authService: AuthService,
    public firebaseService: MyFirebaseService,
    public seoService: SeoService,
    public searchService: SearchService,
    public notificationDialog: MatDialog,
    public notificationService: NotificationsService
  ) {
    // Get the id that was passed in the route
    this.userId = parseInt(this.authService.decryptLocalStorage('uid'), 10); // Current user, TODO: Should we use the request user ID?


    // reload the url if a new slug is clicked from related items
    this.routerChanges = router.events.subscribe(data=>{
      if(data instanceof ActivationEnd){

        if (this.userProfileService.viewHistoryChanges) {
          this.userProfileService.viewHistoryChanges.unsubscribe();
        }
        this.scholarshipSlug = route.snapshot.params['slug'];
        this.ngOnInitHelper();
      }
    });



  }

  ngOnInitHelper() {

    if (this.userProfileService.viewHistoryChanges) {
      this.userProfileService.viewHistoryChanges.unsubscribe();
    }
    if (!this.preventNgOnInitDoubleCount) {
      this.preventNgOnInitDoubleCount = true;
    }
    else{
      this.preventNgOnInitDoubleCount = false;
      return;
    }

    this.scholarshipService.getBySlug(this.scholarshipSlug)
      .subscribe(
        scholarship => {

          this.scholarship = scholarship;

          this.seoService.generateTags({
            title: this.scholarship.name,
            description: this.scholarship.description,
            image: this.scholarship.img_url,
            slug: `scholarship/${this.scholarship.slug}/`
          });

          this.scholarship.essay_set = this.scholarship.essay_set.map( item => genericItemTransform(item));

          if (this.scholarship.deadline.includes('2022-01-01')) {
            this.scholarship['metadata']['deadline_tbd'] = 'TBA';
          }
          else if (this.scholarship['metadata']['deadline_tbd']) {
            delete this.scholarship['metadata']['deadline_tbd'];
          }

          this.autoCompleteLists.forEach(key => {
            if (this.scholarship[key].length>0) {
              // https://stackoverflow.com/a/1374131/
              this.scholarshipAdditionalCriteria.push(...this.scholarship[key]);
            }
          })
          this.titleService.setTitle(this.scholarship.name + ' - Atila');

          this.getRelatedItems();

          // this.updateMeta();
          // Get the user profile of the scholarship owner
          if (this.scholarship.owner){
            this.userProfileService.getById(scholarship.owner)
              .subscribe(
                user => {
                  this.scholarshipOwner = user;

                },
                err => {

                }
              )
          }

          if (!isNaN(this.userId)) {
            this.userProfileService.getById(this.userId)
              .subscribe(
                res => {
                  this.userProfile = res;

                  setTimeout(()=>{
                    if(this.scholarship) {
                      const viewData = {
                        item_type: 'scholarship',
                        item_id: this.scholarship.id,
                        item_name: this.scholarship.name,
                        timestamp: Date.now(),
                      };
                      this.userProfileService.checkViewHistory(this.userProfile, viewData);
                    }
                  },3000);
                  if(this.userProfile && this.userProfile.saved_scholarships) {
                    if (this.userProfile.saved_scholarships.includes(this.scholarship.id)) {
                      this.alreadySaved = true;
                    }
                  }
                },
              )
          }

        },
        err => {
            console.log('err',err);
            console.log('err.toString()',err.toString());
            if (err instanceof HttpErrorResponse && err.status == 404) {
                this.scholarship = {name: 'Scholarship Not Found', metadata: {}};
            }
        },

        () => {
          this.getScholarshipComments();
        }
      );
  }

  ngOnInit() {

  }

  ngAfterViewInit() {


  }


  ngOnDestroy() {
    this.routerChanges.unsubscribe();
    if (this.userProfileService.viewHistoryChanges) {
      this.userProfileService.viewHistoryChanges.unsubscribe();
    }
  }

  getScholarshipComments() {
    // create an empty UserComment object
    this.userComment = new Comment(this.userId);


    // this.scholarshipComments = new Array<Comment>();

    const postOperation = this.commentService.getComments(this.scholarship.id,'Scholarship');

    postOperation.subscribe(
      res => {

        this.scholarshipComments = res.comments;
      }
    )

  }

  postComment() {

    // prevent ScholarshipComments from tracking the changes to UserComment;
    // TODO: Consider using deepcopy of comment
    const commentTemp:Comment = new Comment(this.userId);
    commentTemp['scholarship'] = this.scholarship.id;
    commentTemp.text = this.userComment.text;
    commentTemp.title = this.userComment.title;

    const postOperation = this.commentService.create(commentTemp);

    postOperation.subscribe(
      res => {

        this.scholarshipComments.unshift(res);
      },

      err =>{
        this.snackBar.open(err.error? JSON.stringify(err.error): JSON.stringify(err),'', {
          duration: 3000
        });
      }

    );

    this.userComment.text = '';
    this.userComment.title = '';
  }


  trackByFn(index: any, item: any) {
    return index;

  }

  getOrCreateApp() {

    if(!this.userId || isNaN(this.userId)) {
      const snackBarRef = this.snackBar.open('Account Required to Apply', 'Create Account', {
        duration: 3000
      });

      snackBarRef.onAction().subscribe(
        () => {

          this.router.navigate(['register']);
        },
        err =>  {}
      )

      return;
    }

    if(this.userId){
      const data = {
        scholarshipId: this.scholarship.id,
        userId: this.userId
      }
      let postOperation: Observable<any>;
      postOperation = this.applicationService.getOrCreateApp(data);

      postOperation
        .subscribe(
        application => {
          this.appId = application.id;
        },
        error => {

        },
        () => {


          this.router.navigate(['applications', this.appId])
        }
        )


    }
   }

  requestAutomation() {

    if(!this.userId || isNaN(this.userId)) {

      const snackBarRef = this.snackBar.open('Register to request Automation', 'Register', {
        duration: 4000
      });

      snackBarRef.onAction().subscribe(
        () => {
          this.router.navigate(['register']);
        },
      );

      return;
    }


    if(!this.scholarship.metadata['automation_requests']) {
      this.scholarship.metadata['automation_requests'] = [];
    }

    else {
      this.scholarship.metadata['automation_requests'].push(this.userId);
    }


    const sendData = {
      metadata: this.scholarship.metadata,
      id: this.scholarship.id,
    };

    const userAnalytics: any = {
      user_id: this.userId,
      scholarship_id: this.scholarship.id,
    };


    this.scholarshipService.patch(this.scholarship.id,sendData)
      .subscribe(
        res => {
          this.firebaseService.saveUserAnalytics(userAnalytics, 'automation_requests')
            .then(
              res => {
                this.snackBar.open('Request Saved', '', {
                  duration: 3000
                });

              },
              err => {
                this.snackBar.open('Error in request Automation', '', {
                  duration: 3000
                });},
            )

        }
      )


  }

  addToMyScholarships() {

    const userAnalytics:any = {};

    userAnalytics.share_type = 'save_scholarship';
    userAnalytics.share_source = 'scholarship_detail';
    userAnalytics.schoarship_id = this.scholarship.id;


    if(this.userProfile) {
      userAnalytics.user_id = this.userProfile.user;
    }
    this.firebaseService.saveUserAnalytics(userAnalytics,'scholarship_sharing');


    if (!this.userProfile) {
      const snackBarRef = this.snackBar.open('Register to Save', 'Register', {
        duration: 5000
      });

      snackBarRef.onAction().subscribe(
        () => {
          this.router.navigate(['register']);
        },
      )

      return;
    }

    if (this.alreadySaved) {
      this.snackBar.open('Already Saved', '', {
        duration: 5000
      });
      return;
    }

    const saveResult = addToMyScholarshipHelper(this.userProfile,this.scholarship);

    if(!saveResult[1]) {
      this.snackBar.open('Already Saved', '', {
        duration: 5000
      });
      return;
    }
    else {
      this.userProfile = saveResult[0];

      notifySavedScholarship(this.scholarship, this.userProfile, this.userProfileService,
        this.notificationService, this.notificationDialog);

      this.userProfileService.updateHelper(this.userProfile)
        .subscribe(
          res => {
            const snackBarRef = this.snackBar.open('Saved to My Scholarships', 'My Scholarships', {
              duration: 5000
            });

            snackBarRef.onAction().subscribe(
              () => {
                this.router.navigate(['profile',this.userProfile.username,'my-atila']);
              },
            )},
          err=> {},
        )

    }

  }

  logRelatedItemClick(item) {
    const itemCopy: any = {};
    itemCopy.item_type = item.type;
    itemCopy.title = item.title;
    itemCopy.item_id= item.id;
    itemCopy.share_source= 'scholarship_detail';
    this.firebaseService.saveUserAnalytics(itemCopy,'related_item_click');


  }

  getRelatedItems() {
    const queryString= `?type=scholarship&id=${this.scholarship.id}`;
    this.isLoadingRelatedItems = true;
    this.searchService.relatedItems(queryString)
      .subscribe( res => {

        this.relatedItems = res.items.map( item => {
          return genericItemTransform(item);
        });

        this.relatedItems = this.relatedItems.slice(0,3);
        this.isLoadingRelatedItems = false;


      },
        err => {
          this.isLoadingRelatedItems = false;
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

    this.subscriber.utm_source =       'scholarship_detail';
    this.subscriber.utm_type =       'scholarship';
    this.subscriber.utm_id =       this.scholarship.id;
    this.subscriber.utm_title =       this.scholarship.name;

    const dialogRef = this.dialog.open(SubscriberDialogComponent, {
      width: '500px',
      data: this.subscriber,
    });


    dialogRef.afterClosed().subscribe(
      result => {
        this.subscriber = result;
        if(this.subscriber) {

          this.subscriber.dialog_submit_event = result.dialog_submit_event || 'ButtonClick';

          $.getJSON(`https://api.ipdata.co?api-key=${IPDATA_KEY}`,
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

   // Make this an exported member function of comment
   upVoteComment(userId: number, comment: Comment): Comment{



    if(comment.up_votes_id.includes(userId)){


        return comment;
    }
    else {
        this['user_already_upvoted'] = true;
        comment.up_votes_count = comment.up_votes_id.push(userId);

        return comment.up_votes_count;
    }
  }
  /*
  updateMeta() {

    const fullUrl = document.location.href;

    this.metaService.updateTag({
        content: this.scholarship.name
      },
      "property='og:title'"
    );

    this.metaService.updateTag({
        content: this.scholarship.description
      },
      "property='og:description'"
    );

    this.metaService.updateTag({
        content: this.scholarship.description
      },
      "name='Description'"
    );

    this.metaService.updateTag({
        content: this.scholarship.scholarship_img_url
      },
      "property='og:image'"
    );

    this.metaService.updateTag({
        content: fullUrl
      },
      "property='og:url'"
    );


    this.metaService.updateTag({
        content: this.scholarship.name
      },
      "name='twitter:title'"
    );

    this.metaService.updateTag({
        content: this.scholarship.description
      },
      "name='twitter:description'"
    );

    this.metaService.updateTag({
        content: this.scholarship.img_url
      },
      "name='twitter:image'"
    );
    this.metaService.updateTag({
        content: fullUrl
      },
      "name='twitter:url'"
    );


    this.metaService.updateTag({
        content: this.scholarship.name
      },
      "itemprop='name'"
    );

    this.metaService.updateTag({
        content: this.scholarship.description
      },
      "itemprop='description'"
    );

    this.metaService.updateTag({
        content: this.scholarship.scholarship_img_url
      },
      "itemprop='image'"
    );

  }
  */
}
