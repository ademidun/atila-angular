import {Component, OnInit, ViewChild} from '@angular/core';
import { ScholarshipService } from "../_services/scholarship.service";
import { UserProfileService } from '../_services/user-profile.service';

import { Scholarship } from '../_models/scholarship';

import { Router } from '@angular/router';
import { AuthService } from "../_services/auth.service";
import {UserProfile} from '../_models/user-profile';
import {SubscriberDialogComponent} from '../subscriber-dialog/subscriber-dialog.component';
import {MatDialog, MatSnackBar} from '@angular/material';
import {MyFirebaseService} from '../_services/myfirebase.service';
import {prettifyKeys, toTitleCase} from '../_models/utils';
import { EditProfileModalComponent } from '../edit-profile-modal/edit-profile-modal.component';
import {NgbModal, NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-scholarships-list',
  templateUrl: './scholarships-list.component.html',
  styleUrls: ['./scholarships-list.component.scss']
})
export class ScholarshipsListComponent implements OnInit {

  form_data: Object;
  isLoggedIn: boolean;
  userId: string;
  contentFetched: boolean = false;
  isLoading = true;
  userProfile: UserProfile;

  scholarships: Scholarship[]; //TODO: If i use scholarship[] I can't access property members, why?
  scholarship_count: number = 0;
  total_funding: any = 0;
  show_scholarship_funding: boolean = false;

  pageNo: number = 1;
  paginationLen: number = 12;
  pageLen: number;
  subscriber: any = {};
  @ViewChild('trySearch') public popover: NgbPopover;
  constructor(
    public scholarshipService: ScholarshipService,
    public userProfileService: UserProfileService,
    public router: Router,
    public authService: AuthService,
    public dialog: MatDialog,
    public firebaseService: MyFirebaseService,
    public snackBar: MatSnackBar,
  ) { }




  ngOnInit() {
    this.userId = this.authService.decryptLocalStorage('uid');

    if (this.userId && !isNaN(parseInt(this.userId))) {
      this.isLoggedIn = true;
      this.userProfileService.getById(parseInt(this.userId))
      .subscribe(
        data => {
          var tempCity = [];
          this.userProfile = data;
          tempCity.push(data.city);
          this.form_data = {
            'city': data.city,
            'education_level': data.education_level,
            'education_field': data.education_field,
            'sort_by': 'relevance',
          };

          setTimeout(() => {
            this.editProfileModal();
          }, 5000);

          setTimeout(() => {

            this.toggleSearchModal();

          }, 1000);

          this.getScholarshipPreview(this.pageNo);
        }
      )}

    else {
      this.isLoggedIn = false;

      setTimeout(() => {

        this.toggleSearchModal();

      }, 1000);

      this.scholarshipService.getScholarshipPreviewForm()
      .then(
        res => {
          this.form_data = res;
        },

      )
      .then(
        res => this.getScholarshipPreview(),
      )
    }


  }



  getScholarshipPreview(page: number = 1){

    if (this.form_data ) {

      if (!this.form_data['sort_by']) {
        this.form_data['sort_by'] = 'relevance';
      }

      this.scholarshipService.getPaginatedscholarships(this.form_data, page)
      .subscribe(
        res => {
          this.saveScholarships(res);
          this.contentFetched = true;
          this.isLoading = false;
        },
        error => {

          this.contentFetched = false;
          this.isLoading = false;
        },
        () => {},
      );
    }
  }

  saveScholarships(res: any){


    this.scholarships = res['data'];
    this.scholarship_count = res['length'];
    this.total_funding = res['funding'];

    if (this.total_funding){
      this.show_scholarship_funding = true;
    }

    this.pageLen = Math.ceil(this.scholarship_count / this.paginationLen);
  }

  prettifyKeys(str) {
    if (str == 'only_automated'){
      return 'Is Automated';
    }
    return prettifyKeys(str);
  }
  nextPage() {
    this.pageNo++;
    this.getScholarshipPreview(this.pageNo);
    window.scrollTo(0, 0);
  }

  previousPage() {
    this.pageNo--;
    this.getScholarshipPreview(this.pageNo);
    window.scrollTo(0, 0);
  }


  editProfileModal(data?) {

    if (!data || !data['forceOpen']) {
      if (this.userProfile.major && this.userProfile.post_secondary_school) {
        return;
      }

      if (!this.userProfile.preferences['edit_profile_reminder']) {
        this.userProfile.preferences['edit_profile_reminder'] = {};
        let reminderTime = new Date().getTime();
        this.userProfile.preferences['edit_profile_reminder']['last_reminder'] = 	reminderTime;
        this.userProfile.preferences['edit_profile_reminder']['reminders'] = [];
        this.userProfile.preferences['edit_profile_reminder']['reminders'].push(reminderTime);
      }


      else if (this.userProfile.preferences['edit_profile_reminder']['last_reminder']){

        let lastReminder = parseInt(this.userProfile.preferences['edit_profile_reminder']['last_reminder']);

        let difference = new Date().getTime() - lastReminder;
        let daysDifference = Math.floor(difference/1000/60/60/24);
        if ( daysDifference < 3) {
          return
        }

      }


      let reminderTime = new Date().getTime();
      this.userProfile.preferences['edit_profile_reminder']['last_reminder'] = 	reminderTime;

      if (!Array.isArray(this.userProfile.preferences['edit_profile_reminder']['reminders'])){
        this.userProfile.preferences['edit_profile_reminder']['reminders'] = [];
      }

      this.userProfile.preferences['edit_profile_reminder']['reminders'].push(reminderTime);

      this.userProfileService.updateHelper(this.userProfile)
        .subscribe(res => {
        });
    }


    let dialogRef = this.dialog.open(EditProfileModalComponent, {
      width: '500px',
      height: '500px',
      data: this.userProfile,
    });

    dialogRef.afterClosed().subscribe(result => {
      this.userProfile.metadata['stale_cache'] = true;
      this.userProfileService.updateHelper(this.userProfile)
        .subscribe(res => {
        });
    });
  }

  toggleSearchModal(data?:any){

    if(data && data['toggle']) {
      const isOpen = this.popover.isOpen();
      if(isOpen){
        this.popover.close()
      }
      else{
        this.popover.open()
      }
      return;
    }
    if(this.userProfile) {
      if (!this.userProfile.preferences['try_search_reminder']) {
        this.userProfile.preferences['try_search_reminder'] = new Date().getTime();
        this.userProfileService.updateHelper(this.userProfile).subscribe();
      }
      else {
        return;
      }
    }

    const isOpen = this.popover.isOpen();
    if(isOpen){
      this.popover.close()
    }
    else{
      this.popover.open()
    }
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

    this.subscriber.utm_source =       'scholarships_list';

    let dialogRef = this.dialog.open(SubscriberDialogComponent, {
      width: '300px',
      data: this.subscriber,
    });


    dialogRef.afterClosed().subscribe(
      result => {
        this.subscriber = result;
        if(this.subscriber) {

          this.subscriber.dialog_submit_event = result.dialog_event || 'ButtonClick';

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

  saveUserAnalytics(path, userData) {
    this.firebaseService.saveUserAnalytics(userData,path);
  }

}
