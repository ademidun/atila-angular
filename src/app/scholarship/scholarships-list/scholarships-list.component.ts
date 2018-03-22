import {Component, OnInit, ViewChild} from '@angular/core';
import { ScholarshipService } from "../../_services/scholarship.service";
import { UserProfileService } from '../../_services/user-profile.service';

import { Scholarship } from '../../_models/scholarship';

import {ActivatedRoute, Router,} from '@angular/router';
import { AuthService } from "../../_services/auth.service";
import {UserProfile} from '../../_models/user-profile';
import {SubscriberDialogComponent} from '../../subscriber-dialog/subscriber-dialog.component';
import {MatDialog, MatSnackBar} from '@angular/material';
import {MyFirebaseService} from '../../_services/myfirebase.service';
import {prettifyKeys, toTitleCase} from '../../_shared/utils';
import { EditProfileModalComponent } from '../../edit-profile-modal/edit-profile-modal.component';
import {NgbModal, NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import {environment} from '../../../environments/environment';
import {AutoCompleteForm, initializeAutoCompleteOptions} from '../../_shared/scholarship-form';
import {FormGroup} from '@angular/forms';

import {SCHOOLS_LIST, MAJORS_LIST, EDUCATION_FIELDS, EDUCATION_LEVEL} from '../../_models/constants';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
@Component({
  selector: 'app-scholarships-list',
  templateUrl: './scholarships-list.component.html',
  styleUrls: ['./scholarships-list.component.scss'],
  providers: [Location, {provide: LocationStrategy, useClass: PathLocationStrategy}]
})
export class ScholarshipsListComponent implements OnInit {

  form_data: any;
  isLoggedIn: boolean;
  userId: string;
  contentFetched: boolean = false;
  inCompleteProfile: boolean = false;
  isLoading = true;
  userProfile: UserProfile;

  scholarships: Scholarship[]; //TODO: If i use scholarship[] I can't access property members, why?
  scholarship_count: number = 0;
  total_funding: any = 0;
  show_scholarship_funding: boolean = false;

  pageNo: number = 1;
  paginationLen: number = 12;
  pageLen: number;
  pages = [1];
  subscriber: any = {};
  autoCompleteFormGroup: FormGroup;
  autoCompleteOptions: any;

  locationData = {
    'city': '',
    'province': '',
    'country': '',
  };
  EDUCATION_LEVEL = EDUCATION_LEVEL;

  EDUCATION_FIELD = EDUCATION_FIELDS;
  MAJORS_LIST = MAJORS_LIST;
  SCHOOLS_LIST = SCHOOLS_LIST;

  @ViewChild('trySearch') public popover: NgbPopover;
  constructor(
    public scholarshipService: ScholarshipService,
    public userProfileService: UserProfileService,
    public authService: AuthService,
    public dialog: MatDialog,
    public firebaseService: MyFirebaseService,
    public snackBar: MatSnackBar,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    public location: Location,
  ) { }




  ngOnInit() {
    this.userId = this.authService.decryptLocalStorage('uid');

    if (this.userId && !isNaN(parseInt(this.userId))) {
      this.isLoggedIn = true;
      this.userProfileService.getById(parseInt(this.userId))
      .subscribe(
        data => {
          let tempCity = [];
          this.userProfile = data;

          if (this.userProfile.metadata['incomplete_profile']) {

            this.inCompleteProfile = true;
            this.isLoading = false;
            this.initCompleteProfileForm();

            return;
          }
          tempCity.push(data.city);
          this.form_data = {
            'city': data.city,
            'education_level': data.education_level,
            'education_field': data.education_field,
            'sort_by': 'relevance',
            'filter_by_user_show_eligible_only': true,
          };

          this.pageNo = this.activatedRoute.snapshot.params['page'] || this.pageNo;
          this.getScholarshipPreview(this.pageNo);
        }
      )}

    else {
      this.isLoggedIn = false;

      // setTimeout(() => {
      //
      //   this.toggleSearchModal();
      //
      // }, 1000);

      this.scholarshipService.getScholarshipPreviewForm()
      .then(
        res => {
          this.form_data = res;
          this.form_data['filter_by_user_show_eligible_only']=true;
        },

      )
      .then(
        res => this.getScholarshipPreview(),
      )
    }


  }

  getScholarshipPreview(page: number = 1){

    if (this.form_data ) {

      if(this.form_data.filter_by_user) {
        this.form_data.filter_by_user_data = [{filter_type: this.form_data.filter_by_user, filter_value: [this.transformFilterDisplay(this.form_data.filter_by_user)]}]
      }

      if(this.isLoggedIn) {
        const url = this
          .router
          .createUrlTree([{page: page}], {relativeTo: this.activatedRoute})
          .toString();

        this.location.go(url);
      }

      else {
        page = 1;
      }


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

    if(this.form_data.filter_by_user) {

      let resultsPreview = [];

      for (let i = 0; i < Math.min(5,this.scholarships.length); i++) {
        resultsPreview.push({id: this.scholarships[i]['id'], name: this.scholarships[i]['name']})
      }
      let filterByUserResult = {
        form_data: this.form_data,
        scholarship_count: this.scholarship_count,
        total_funding: this.total_funding,
        results_preview: resultsPreview
      };
      this.firebaseService.saveUserAnalytics(filterByUserResult,'filter_by_user_results')
    }

    this.pageLen = Math.ceil(this.scholarship_count / this.paginationLen);

    this.pages = [];
    for (let i = 1; i <= this.pageLen; i++) {
      this.pages.push(i);
    }
  }

  prettifyKeys(str) {
    if (str == 'only_automated'){
      return 'Is Automated';
    }
    return toTitleCase(prettifyKeys(str));
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

  goToPage(pageNo = 1) {
    this.getScholarshipPreview(pageNo);
    // todo, why isn't window.scrollTo(0, 0); working?
    window.scrollTo(0, 0);
    $("html, body").animate({scrollTop: $('.nav-wrapper').offset().top}, 500);

  }


  // todo move this to a seperate function as it will rarely be called
  saveUser(userForm){


    if (userForm.valid) {
      if (!this.userProfile.major || this.userProfile.eligible_schools.length < 1) {
        this.snackBar.open("Enter school or program information.",'', {duration: 3000});
      }

      if (!this.userProfile.post_secondary_school) {
        this.userProfile.post_secondary_school = this.userProfile.eligible_schools[0];
      }
      delete this.userProfile.metadata['incomplete_profile'];
      this.userProfile.metadata['stale_cache'] =  true;


      let sendData = {
        userProfile: this.userProfile,
        locationData: this.locationData,
      };

      this.userProfileService.updateAny(sendData)
        .subscribe(
          data => {

            this.snackBar.open("Successfully Updated Your Profile.",'', {duration: 3000});
            this.inCompleteProfile = false;
            this.isLoading = false;
            this.form_data = {
              'city': data.city,
              'education_level': data.education_level,
              'education_field': data.education_field,
              'sort_by': 'relevance',
              'filter_by_user_show_eligible_only': true,
            };

            this.getScholarshipPreview(this.pageNo);
            },
            err => {
              this.snackBar.open('Profile updated unsuccessfully - ' + err.error? err.error: err,'', {duration: 3000});
            }
          )
    } else {
      this.snackBar.open("Form is not valid",'', {duration: 3000});
    }
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

    if(this){
      return;
    }
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

  saveUserAnalytics(path, userData) {
    this.firebaseService.saveUserAnalytics(userData,path);
  }


  initCompleteProfileForm() {

    this.autoCompleteFormGroup = AutoCompleteForm();
    this.autoCompleteOptions = initializeAutoCompleteOptions(this.autoCompleteFormGroup);

    if(this.userProfile.city.length>0){
      this.locationData.city= this.userProfile.city[0].name;
      this.locationData.country=this.userProfile.city[0].country;
      this.locationData.province=this.userProfile.city[0].province;
    }
  }


  typeaheadEvent(event) {
    if (event.type == 'major') {
      this.userProfile.major = event.event.item;
    }
  }

  /**
   * Adding Google Places API Autocomplete for User Location:
   * @param {google.maps.places.PlaceResult} placeResult
   * https://developers.google.com/maps/documentation/javascript/reference#PlaceResult
   * https://developers.google.com/maps/documentation/javascript/places-autocomplete#address_forms
   * https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete-addressform
   * https://stackoverflow.com/questions/42341930/google-places-autocomplete-angular2
   */
  placeAutoComplete(placeResult:any, autoCompleteOptions?: any){ //Assign types to the parameters place result is a PlaceResult Type, see documentation

    this.predictLocation(this.locationData, placeResult, autoCompleteOptions);

  }

  /**
   * Translate the PlaceResult object into an Atila location object, containing only the city, province/state and country.
   * @param location
   * @param placeResult
   */
  predictLocation(location, placeResult, autoCompleteOptions?: any){

    var addressComponents = placeResult.address_components ;

    var keys = ['city', 'province', 'country'];

    //TODO: Find a more elegant solution for this.

    addressComponents.forEach((element, i, arr) => {

      if(element.types[0]=='locality' || element.types[0]=='administrative_area_level_3' ||  element.types[0]=='postal_town'||  element.types[0]=='sublocality_level_1'){
        this.locationData.city = element.long_name;
      }

      if(element.types[0]=='administrative_area_level_1'){
        this.locationData.province = element.long_name;
      }

      if(element.types[0]=='country'){
        this.locationData['country'] = element.long_name;
      }
    });
  }

  /**
   * If user presses enter on location button, don't allow the form to submit because we still need to pull the location Data from Google Maps.
   */
  keyDownHandler(event: Event) {

    if((<KeyboardEvent>event).keyCode == 13) {

      event.preventDefault();
    }
    //TODO! Change this, allow user to submit with enterButton.
  }

  transformFilterDisplay(filter_type) {

    if (this.userProfile) {
      if (['city','province','country'].indexOf(filter_type) > -1) {
        return this.userProfile[filter_type][0]['name']
      }
      return this.userProfile[filter_type];
    }
    else {
      if (['city','province','country'].indexOf(filter_type) > -1) {
        if (!this.form_data.location[filter_type]) {
          switch (filter_type) {
            case 'city':
              return 'Toronto';

            case 'province':
              return 'Ontario';

            case 'country':
              return 'Canada';
          }
        }
        return this.form_data.location[filter_type];
      }
      if (filter_type == 'post_secondary_school') {
        return 'University of Western Ontario';
      }
      if (filter_type == 'major') {
        return 'Engineering';
      }
    }

  }



}
