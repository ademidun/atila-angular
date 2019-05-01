import {Component, OnInit, ViewChild} from '@angular/core';
import {ScholarshipService} from '../../_services/scholarship.service';
import {UserProfileService} from '../../_services/user-profile.service';

import {Scholarship} from '../../_models/scholarship';

import {ActivatedRoute, Router,} from '@angular/router';
import {AuthService} from '../../_services/auth.service';
import {UserProfile} from '../../_models/user-profile';
import {SubscriberDialogComponent} from '../../subscriber-dialog/subscriber-dialog.component';
import {MatDialog, MatSnackBar} from '@angular/material';
import {MyFirebaseService} from '../../_services/myfirebase.service';
import {IPDATA_KEY, prettifyKeys, toTitleCase} from '../../_shared/utils';
import {EditProfileModalComponent} from '../../edit-profile-modal/edit-profile-modal.component';
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import {environment} from '../../../environments/environment';
import {AutoCompleteForm, initializeAutoCompleteOptions} from '../../_shared/scholarship-form';
import {FormGroup} from '@angular/forms';

import {EDUCATION_FIELDS, EDUCATION_LEVEL, FILTER_TYPES, GRADE_LEVELS, MAJORS_LIST, SCHOOLS_LIST} from '../../_models/constants';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import {SeoService} from '../../_services/seo.service';
import {Title} from '@angular/platform-browser';

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

  scholarships: Scholarship[] = []; //TODO: If i use scholarship[] I can't access property members, why?
  total_scholarship_count: number = 0;
  scholarshipError: any = null;
  total_funding: any = 0;
  show_scholarship_funding: boolean = false;
  viewAsMode: boolean;
  environment = environment;

  pageNo: number = 1;
  paginationLen: number = 8; // number of items the API returns in a single result
  pageLen: number; // the total number of pages (total results)/(results per API call)
  pages = [1];
  subscriber: any = {};
  autoCompleteFormGroup: FormGroup;
  autoCompleteOptions: any;

  locationData = {
    'city': '',
    'province': '',
    'country': '',
  };
  scholarshipQuery: string;
  EDUCATION_LEVEL = EDUCATION_LEVEL;
  GRADE_LEVELS = GRADE_LEVELS;
  filterTypes = FILTER_TYPES;
  EDUCATION_FIELD = EDUCATION_FIELDS;
  MAJORS_LIST = MAJORS_LIST;
  SCHOOLS_LIST = SCHOOLS_LIST;
  viewAsUser: any;
  extraLocationInput: any = {
    country: '',
  };

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
    public seoService: SeoService,
    public titleService: Title
  ) {
  }


  ngOnInit() {
    this.userId = this.authService.decryptLocalStorage('uid');

    let seoConfig = {
      title: 'Atila Scholarships',
      description: 'Easily find and apply to scholarships. Learn and share information about education, career and life..',
      image: 'https://firebasestorage.googleapis.com/v0/b/atila-7.appspot.com/o/public%2Fatila-gradient-banner-march-14.png?alt=media&token=9d791ba9-18d0-4750-ace8-b390a4e90fdc',
      slug: `scholarship/`
    }
    this.scholarshipQuery = this.activatedRoute.snapshot.queryParams['q']
    if (this.scholarshipQuery) {
      this.titleService.setTitle(`Atila Scholarships for ${this.prettifyKeys(this.scholarshipQuery)}`);
      seoConfig.title += ` for ${this.prettifyKeys(this.scholarshipQuery)}`;
      seoConfig.slug += `?q=${this.scholarshipQuery}`; // todo think of a better slug?
      seoConfig.description = seoConfig.description.replace('scholarships', `scholarships for ${this.prettifyKeys(this.scholarshipQuery)}`);
      this.seoService.generateTags(seoConfig);
    }

    else {
      this.seoService.generateTags(seoConfig);
    }


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
              'sort_by': 'relevance_new',
              'filter_by_user_show_eligible_only': true,
            };

            // this.pageNo = this.activatedRoute.snapshot.params['page'] || this.pageNo;
            this.getScholarshipPreview(this.pageNo);
          }
        )
    }

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
            if (this.form_data) {
              this.form_data['filter_by_user_show_eligible_only'] = true;
            }
            else {
              if (this.activatedRoute.snapshot.queryParams['q']) {
                this.form_data = {
                  previewMode: 'universalSearch',
                  searchString: this.activatedRoute.snapshot.queryParams['q'],
                  previewFormFromUrl: true,
                }
              }
              else {
                this.form_data = {featuredScholarshipsMode: true};
              }
            }
          },
        )
        .then(
          res => this.getScholarshipPreview(),
        )
    }


  }

  getScholarshipPreview(page: number = 1, options: any = {}) {
    if (page == 1) {
      // clear scholarships list if on first page
      this.scholarships = [];
    }

    if (options['view_as_user']) {
      this.form_data.view_as_user = options['view_as_user'] == '' ? null : options['view_as_user'];
    }
    if (this.form_data) {

      if (this.form_data.filter_by_user) {

        const filterValue = this.transformFilterDisplay(this.form_data.filter_by_user);

        this.form_data.filter_by_user_data = [{
          filter_type: this.form_data.filter_by_user,
          filter_value: Array.isArray(filterValue) ? filterValue : [filterValue]
        }]
      }

      if (this.isLoggedIn) {
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
        this.form_data['sort_by'] = this.isLoggedIn ? 'relevance_new' : 'relevance';
      }
      if (options['view_as_user']) {
      }
      this.isLoading = true;
      this.scholarshipService.getPaginatedscholarships(this.form_data, page)
        .subscribe(
          res => {

            if (options['change_sort_by']) {
              this.scholarshipService.preventSortByDoubleCount = true;
            }
            this.saveScholarships(res);
            this.contentFetched = true;
            this.isLoading = false;


          },
          err => {

            this.contentFetched = false;
            this.isLoading = false;
            this.scholarshipError = {
              error: err
            }
          },
          () => {
            this.isLoading = false;
          },
        );
    }
  }

  saveScholarships(res: any) {

    this.scholarships.push(...res['data']);
    this.total_scholarship_count = res['length'];
    this.total_funding = res['funding'];


    this.pageLen = Math.ceil(this.total_scholarship_count / this.paginationLen);

    this.pages = [];
    for (let i = 1; i <= this.pageLen; i++) {
      this.pages.push(i);
    }

    if (this.total_funding) {
      this.show_scholarship_funding = true;
    }

    if (this.form_data.filter_by_user) {

      let resultsPreview = [];

      for (let i = 0; i < Math.min(5, this.scholarships.length); i++) {
        resultsPreview.push({id: this.scholarships[i]['id'], name: this.scholarships[i]['name']})
      }
      let filterByUserResult = {
        form_data: this.form_data,
        scholarship_count: this.total_scholarship_count,
        total_funding: this.total_funding,
        results_preview: resultsPreview
      };
      this.firebaseService.saveUserAnalytics(filterByUserResult, 'filter_by_user_results')
    }

    this.viewAsUser = res['view_as_user'];


    if (this.viewAsUser) {
      console.log('this.viewAsUser', this.viewAsUser);
    }

    if (res['view_as_user_error']) {
      this.snackBar.open(res['view_as_user_error'], '', {duration: 3000})
    }

  }

  prettifyKeys(str) {
    if (str == 'only_automated') {
      return 'Is Automated';
    }
    if (str == 'relevance_new') {
      return 'Relevance + New';
    }

    return toTitleCase(prettifyKeys(str));
  }

  nextPage() {
    this.pageNo++;
    this.getScholarshipPreview(this.pageNo);
    // window.scrollTo(0, 0);
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
    $('html, body').animate({scrollTop: $('.nav-wrapper').offset().top}, 500);

  }


  // todo move this to a seperate function as it will rarely be called
  saveUser(userForm, options = {}) {


    if (userForm.valid) {
      if (!this.userProfile.major || this.userProfile.eligible_schools.length < 1) {
        this.snackBar.open('Enter school or program information.', '', {duration: 3000});
      }

      if (!this.userProfile.post_secondary_school) {
        this.userProfile.post_secondary_school = this.userProfile.eligible_schools[0];
      }
      delete this.userProfile.metadata['incomplete_profile'];
      this.userProfile.metadata['stale_cache'] = true;


      let sendData = {
        userProfile: this.userProfile,
        locationData: this.locationData,
      };
      this.userProfileService.updateAny(sendData)
        .subscribe(
          data => {

            this.snackBar.open('Successfully Updated Your Profile.', '', {duration: 3000});

            if (options['updateUser']) {
              this.userProfile = data;
            }

            this.inCompleteProfile = false;
            this.isLoading = false;
            this.form_data = {
              'city': data.city,
              'education_level': data.education_level,
              'education_field': data.education_field,
              'sort_by': 'relevance_new',
              'filter_by_user_show_eligible_only': true,
            };

            this.getScholarshipPreview(this.pageNo);
          },
          err => {
            this.snackBar.open('Profile updated unsuccessfully - ' + err.error ? err.error : err, '', {duration: 3000});
          }
        )
    } else {
      this.snackBar.open('Form is not valid', '', {duration: 3000});
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
        this.userProfile.preferences['edit_profile_reminder']['last_reminder'] = reminderTime;
        this.userProfile.preferences['edit_profile_reminder']['reminders'] = [];
        this.userProfile.preferences['edit_profile_reminder']['reminders'].push(reminderTime);
      }


      else if (this.userProfile.preferences['edit_profile_reminder']['last_reminder']) {

        let lastReminder = parseInt(this.userProfile.preferences['edit_profile_reminder']['last_reminder']);

        let difference = new Date().getTime() - lastReminder;
        let daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);
        if (daysDifference < 3) {
          return
        }

      }


      let reminderTime = new Date().getTime();
      this.userProfile.preferences['edit_profile_reminder']['last_reminder'] = reminderTime;

      if (!Array.isArray(this.userProfile.preferences['edit_profile_reminder']['reminders'])) {
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
          // this.getScholarshipPreview();
        });
    });
  }

  toggleSearchModal(data?: any) {

    if (this) {
      return;
    }
    if (data && data['toggle']) {
      const isOpen = this.popover.isOpen();
      if (isOpen) {
        this.popover.close()
      }
      else {
        this.popover.open()
      }
      return;
    }
    if (this.userProfile) {
      if (!this.userProfile.preferences['try_search_reminder']) {
        this.userProfile.preferences['try_search_reminder'] = new Date().getTime();
        this.userProfileService.updateHelper(this.userProfile).subscribe();
      }
      else {
        return;
      }
    }

    const isOpen = this.popover.isOpen();
    if (isOpen) {
      this.popover.close()
    }
    else {
      this.popover.open()
    }
  }


  addSubscriber(event?: KeyboardEvent) {


    if (!this.subscriber.email) {
      this.subscriber.response = 'Please enter email.';
      return;
    }
    // In case we want to see if people are more likely to submit by typing Enter or clicking.
    if (event) {
      this.subscriber.dialog_open_event = event.key;
    }
    else {
      this.subscriber.dialog_open_event = 'ButtonClick';
    }

    this.subscriber.utm_source = 'scholarships_list';

    let dialogRef = this.dialog.open(SubscriberDialogComponent, {
      width: '300px',
      data: this.subscriber,
    });


    dialogRef.afterClosed().subscribe(
      result => {
        this.subscriber = result;
        if (this.subscriber) {

          this.subscriber.dialog_submit_event = result.dialog_submit_event || 'ButtonClick';

          $.getJSON(`https://api.ipdata.co?api-key=${IPDATA_KEY}`,
            data => {
              this.subscriber.geo_ip = data;

              this.firebaseService.addSubscriber(this.subscriber)
                .then(res => {
                    this.subscriber.response = 'Successfully subscribed to Atila 😄.';
                  },
                  err => this.subscriber.response = 'Subscription error.');
            });
        }
        else {
          this.subscriber = {};
          this.subscriber.response = 'Please enter subscription information 😄.';
        }


      });
  }

  saveUserAnalytics(path, userData) {
    this.firebaseService.saveUserAnalytics(userData, path);
  }


  initCompleteProfileForm() {

    this.autoCompleteFormGroup = AutoCompleteForm();
    this.autoCompleteOptions = initializeAutoCompleteOptions(this.autoCompleteFormGroup);

    if (this.userProfile.city.length > 0) {
      this.locationData.city = this.userProfile.city[0].name;
      this.locationData.country = this.userProfile.city[0].country;
      this.locationData.province = this.userProfile.city[0].province;
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
  placeAutoComplete(placeResult: any, autoCompleteOptions?: any) { //Assign types to the parameters place result is a PlaceResult Type, see documentation
    this.predictLocation(placeResult, autoCompleteOptions);

  }

  /**
   * Translate the PlaceResult object into an Atila location object, containing only the city, province/state and country.
   * @param location
   * @param placeResult
   * @param options
   */
  predictLocation(placeResult, options = {}) {

    options['object_key'] = options['object_key'] || 'locationData';

    var addressComponents = placeResult.address_components;

    var keys = ['city', 'province', 'country'];

    //TODO: Find a more elegant solution for this.


    addressComponents.forEach((element, i, arr) => {
      if (element.types[0] == 'locality' || element.types[0] == 'administrative_area_level_3' || element.types[0] == 'postal_town' || element.types[0] == 'sublocality_level_1') {
        this[options['object_key']].city = element.long_name;
      }

      if (element.types[0] == 'administrative_area_level_1') {
        this[options['object_key']].province = element.long_name;
      }

      if (element.types[0] == 'country') {
        this[options['object_key']][element.types[0]] = element.long_name;
      }
    });

    if (options['object_key'] == 'extraLocationInput' && this[options['object_key']]['country']) {
      //prevent changes in locationInput to be tracked in LocationList
      this.userProfile.country_extra.push(this[options['object_key']]['country']);

    }

  }

  /**
   * If user presses enter on location button, don't allow the form to submit because we still need to pull the location Data from Google Maps.
   */
  keyDownHandler(event: Event) {

    if ((<KeyboardEvent>event).keyCode == 13) {

      event.preventDefault();
    }
    //TODO! Change this, allow user to submit with enterButton.
  }

  transformFilterDisplay(filter_type) {
    let filterValue;

    if (this.userProfile) {

      let filterProfile = this.userProfile;
      if (this.viewAsUser) {
        filterProfile = this.viewAsUser;
      }

      if (['city', 'province', 'country'].indexOf(filter_type) > -1) {
        filterValue = filterProfile[filter_type][0]['name']
      } else {
        filterValue = filterProfile[filter_type];
      }


    }
    else {
      if (['city', 'province', 'country'].indexOf(filter_type) > -1) {
        if (!this.form_data.location[filter_type]) {
          switch (filter_type) {
            case 'city':
              filterValue = 'Toronto';
              break;

            case 'province':
              filterValue = 'Ontario';
              break

            case 'country':
              filterValue = 'Canada';
              break;
          }
        }
        filterValue = this.form_data.location[filter_type];
      }

      switch(filter_type) {

        // todo: pick default categories based on what is most popular
        // amongst students or has the most scholarships
        case 'major':
          filterValue =  'Engineering';
          break;
        case 'post_secondary_school':
          filterValue =  'University of Western Ontario';
          break;
        case 'ethnicity':
          filterValue =  'Asian/East-Asian';
          break;
        case 'heritage':
          filterValue =  'India';
          break;
        case 'citizenship':
          filterValue =  'Canada';
          break;
        case 'religion':
          filterValue =  'Christianity';
          break;
        case 'activities':
          filterValue =  'Drawing';
          break;
        case 'sports':
          filterValue =  'Soccer';
          break;
        case 'disability':
          filterValue =  'Autism';
          break;
        case 'language':
          filterValue =  'French';
          break;
        case 'eligible_schools':
          filterValue =  [
            'Ivey Business School',
            'University of Waterloo',
            'DeGroote School of Medicine'
          ];
          break;
        case 'eligible_programs':
          filterValue =  [
            'Health Sciences',
            'Computer Engineering',
            'Biomedical Engineering'
          ];
          break;
        default:
          filterValue = null;
          break;
      }

    }

      return filterValue
  }

  handleScholarshipClick(event: any) {


  }

  refreshScholarshipCache() {

    console.log('refreshScholarshipCache() this.viewAsUser', this.viewAsUser);
    this.userProfileService.userProfileRPC(`${this.viewAsUser.user || this.userId}/refresh-scholarship-cache`)
      .subscribe(
        res2 => {
          console.log({res2});
        }
      )
  }
}
