import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {Router} from '@angular/router';
import {addToMyScholarshipHelper, UserProfile, updateScholarshipMatchScore} from '../../_models/user-profile';
import {MyFirebaseService} from '../../_services/myfirebase.service';
import {UserProfileService} from '../../_services/user-profile.service';
import { trigger, state, animate, transition, style } from '@angular/animations';

@Component({
  selector: 'app-scholarship-card',
  templateUrl: './scholarship-card.component.html',
  styleUrls: ['./scholarship-card.component.scss'],
  animations: [
    trigger('hideCard', [
      state('true', style({ opacity: 0, transform: 'scale(0.0)'  })),
      state('false' , style({ opacity: 1, transform: 'scale(1.0)' })),
      transition('* => *', animate('.5s ease-in'))
    ])
  ],
})
export class ScholarshipCardComponent implements OnInit {

  //todo change to only handle one scholarship
  @Input() scholarship: any;
  @Input() userProfile: UserProfile;
  @Input() metadata: any = {};
  @Output() handleClick:EventEmitter<any> = new EventEmitter();
  alreadySaved: boolean;
  userAnalytics: any = {};
  hideCard: boolean;
  handler: any;
  isFirstView= false;

  old_visible: boolean;
  @ViewChild('scholarshipCard') scholarshipCardRef: ElementRef;
  constructor(
    public snackBar: MatSnackBar,
    public router: Router,
    public firebaseService: MyFirebaseService,
    public userProfileService: UserProfileService) { }

  ngOnInit() {
    if(this.userProfile && this.userProfile.saved_scholarships) {

      for (let i =0; i<this.userProfile.saved_scholarships.length; i++) {
        if (this.userProfile.saved_scholarships[i] == this.scholarship.id) {
          this.alreadySaved = true;
          break;
        }
      }
    }

    if ('2019-01-01T00:00:00Z' == this.scholarship.deadline) {
      this.scholarship['metadata']['deadline_tbd'] = 'TBA';
    }

    if( typeof jQuery !== 'undefined' ) {
      // https://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport/7557433#7557433
      this.handler = this.onVisibilityChange(this.scholarshipCardRef.nativeElement, () => {});
      $(window).on('DOMContentLoaded load resize scroll', this.handler);
    }
  }


  addToMyScholarship(item) {

    if (this.alreadySaved) {
      this.snackBar.open("Already Saved", '', {
        duration: 5000
      });
      return;
    }
    this.logShareType('save_my_scholarships');
    if (this.userProfile) {

      let saveResult = addToMyScholarshipHelper(this.userProfile,this.scholarship);

      if(!saveResult[1]) {
        this.snackBar.open("Already Saved", '', {
          duration: 3000
        });

        this.alreadySaved = true;
        return;
      }
      else {
        this.userProfile = saveResult[0];
        this.userProfileService.updateHelper(this.userProfile).subscribe(
            res => {
              let snackBarRef = this.snackBar.open("Saved to My Scholarships", 'My Scholarships', {
                duration: 5000
              });
              snackBarRef.onAction().subscribe(
                () => {
                  this.router.navigate(['profile',this.userProfile.username,'my-atila']);
                },
              )},
            err=> {},
          );
      }

    }

    else {
      let snackBarRef = this.snackBar.open("Register to Save", 'Register', {
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


    if(this.userProfile) {
      this.userAnalytics.user_id = this.userProfile.user;

    }
    this.firebaseService.saveUserAnalytics(this.userAnalytics,'scholarship_sharing');
  }

  webShare() {
    // if(this.userProfile && (this.userProfile.user == 4 || this.userProfile.user == 1)) {

      if ((<any>navigator).share) {
        (<any>navigator).share({
          title: 'Scholarship From Atila - '+ this.scholarship.name,
          text: 'Have you seen this scholarship from Atila: https://atila.ca/scholarship/'+this.scholarship.slug,
          url: 'https://atila.ca/scholarship/'+this.scholarship.slug,
        })
          .then(() => {})
          .catch((error) => {});
      }

  }

  logNotInterested() {

    setTimeout( (args) => {
      $('#scholarship-card-'+this.scholarship.id).css('display', 'none');
    }, 700);

    this.userAnalytics.schoarship_id = this.scholarship.id;
    this.userAnalytics.schoarship_name = this.scholarship.name;
    this.userAnalytics.user_id = this.userProfile ? this.userProfile.user : 0;

    if (this.metadata['form_data']) {
      this.userAnalytics.form_data = this.metadata['form_data'];
    }
    this.firebaseService.saveUserAnalytics(this.userAnalytics,'scholarships/not_interested/'+this.scholarship.id);

    if (this.userProfile) {

      this.userProfile.scholarships_not_interested.push(this.scholarship.id);

      this.userProfile.metadata['stale_cache'] = true;

      this.userProfile = updateScholarshipMatchScore(this.userProfile,{'not_interested': true});

      let scholarships_not_interested = {
        scholarships_not_interested: this.userProfile.scholarships_not_interested,
        scholarships_match_score: this.userProfile.scholarships_match_score,
      };
      this.userProfileService.patch(this.userProfile.user, scholarships_not_interested).subscribe(
        res => {
          this.snackBar.open("Changes Saved.", '', {
            duration: 5000
          });

        }
      )
    }
  }

  clickHandler(event) {

    let emitData = {
      event: event,
      type: 'scholarship',
      action: 'click',
      scholarship: this.scholarship,
      userProfile: this.userProfile,
    };

    console.log('clickHandler() emitData', emitData);

    this.handleClick.emit(emitData);
  }

  onVisibilityChange(el, callback) {
    return () => {
      let visible = this.isElementInViewport(el);
      if (visible != this.old_visible) {


        if (visible && !this.isFirstView) {

          console.log('onVisibilityChange',this.scholarship.name);
          console.log('this.scholarshipCardRef.nativeElement',this.scholarshipCardRef.nativeElement);
          console.log('firstView',this.scholarship.name);
          this.isFirstView = true;
        }

        this.old_visible = visible;
        if (typeof callback == 'function') {
          callback();
        }
      }
    }
  }

  isElementInViewport (el) {

    //special bonus for those using jQuery
    if (typeof jQuery === "function" && el instanceof jQuery) {
      el = el[0];
    }

    var rect = el.getBoundingClientRect();

    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
      rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
    );
  }



  }



