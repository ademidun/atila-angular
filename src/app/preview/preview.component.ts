import {Component, OnInit, OnDestroy, HostListener, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';

import { ScholarshipService } from "../_services/scholarship.service";

import { Router, ActivatedRoute } from '@angular/router';

import {NgModel} from '@angular/forms';
import { GooglePlaceDirective } from "../_directives/google-place.directive";
import {GoogleAnalyticsEventsService} from '../_services/google-analytics-events.service';
import {MatDialog} from '@angular/material';
import {SubscriberDialogComponent} from '../subscriber-dialog/subscriber-dialog.component';
import {UserProfileService} from '../_services/user-profile.service';
import {MyFirebaseService} from '../_services/myfirebase.service';
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import {AuthService} from '../_services/auth.service';
//import {GeocoderAddressComponent} from '@types/googlemaps'

//import 'googlemaps';
export class PreviewResponse {


  constructor(
  public location = {
  city: '',
  province: '',
  country: '',
  name: '',
  },
  public education_level :string[],
  public education_field :string[],
  public errors :string,
    ) { }
}


@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
})
export class PreviewComponent implements OnInit, OnDestroy {

    EDUCATION_LEVEL = [
    'Secondary School',
    'University',
    'College',
    'Workplace or Apprenticeship',
  ];

    blogs = [
    {
      "id": 9,
      "title": "How I got interviews at Google, Facebook and Bridgewater",
      "slug": "how-i-got-interviews-at-google-facebook-and-bridgewater",
      "alternate_slugs": [
        "got-interviews-google-facebook-bridgewater"
      ],
      "dummy_field_detect_migrations_heroku": null,
      "date_created": "2018-03-27T13:17:20Z",
      "description": "Last summer, I decided that I wanted to work at a top tech company such as Google or Bridgewater. Problem. I didn't go to a target school, my grades were just okay and I had little work experience. If I wanted to get a chance at these companies I would have to get creative.",
      "header_image_url": "https://lh6.googleusercontent.com/U1oHmeuzUcMbPLHFhpDHc_8KsFWq7IX_jE6kUBl1svTSnffIukAjJ0QDgfXJCdZ_rONXiZzhtNnz3CrFMDEnrIrMc5MpnWcSuUfEURbNRFM9lxYPN6qDMSMHPqC02h9o0pO9UlUP",
      "published": true,
      "up_votes_count": 0,
      "down_votes_count": 0,
      "up_votes_id": [],
      "down_votes_id": [],
      "user": {
        "first_name": "Tomiwa",
        "last_name": "Ademidun",
        "username": "tomiwa",
        "profile_pic_url": "https://firebasestorage.googleapis.com/v0/b/atila-7-dev/o/user-profiles%2F4%2Fprofile-pictures%2Fgithub-profile-picture.jpeg?alt=media&token=4d2ba5a2-e4d8-46e3-8323-e63a65b356cb",
        "title": "Software Engineering Student",
        "post_secondary_school": "",
        "secondary-school": "",
        "id": 4
      },
      "contributors": [],
      "metadata": {
        "comments_count":1
      }
    },
    {
        "id": 9,
        "title": "Starting A Dating Company While in University",
        "slug": "starting-a-dating-company-while-in-university",
        "alternate_slugs": [],
        "dummy_field_detect_migrations_heroku": null,
        "date_created": "2018-03-27T00:29:11Z",
        "description": "While my friends were getting ready for graduation and trying to find full time jobs I decided to start a dating company, while overloading a full-time dual degree in computer science and business. Hectic would be an understatement.",
        "header_image_url": "https://lh6.googleusercontent.com/Je3UMTLTs4y_fDcbk9iZIT9sDReM7hagbKHUz5PevY4erS_CKFWSdsws5HII7SuFvloWCAxSyteRmlyEiwRpoz7fa7IAXmyn5SXOIPMJwMra9WdQ1VbbL3WIC7UHKG8ZRYUqdleY",
        "published": true,
        "up_votes_count": 0,
        "down_votes_count": 0,
        "up_votes_id": [],
        "down_votes_id": [],
        "metadata": {
          "comments_count": 0,
        },
        "user": {
          "first_name": "Michael",
          "last_name": "Ding",
          "username": "mding5692",
          "profile_pic_url": "https://firebasestorage.googleapis.com/v0/b/atila-7.appspot.com/o/user-profiles%2F17%2Fprofile-pictures%2Fmding-profile-pic.jpg?alt=media&token=11da0398-d23b-4090-9b59-fda1dfbd35cd",
          "title": "",
          "post_secondary_school": "",
          "secondary-school": "",
          "id": 17
        },
        "contributors": []
      },
    {
        "id": 7,
        "title": "How to Get a Research Internship and What I Learned Through Research",
        "slug": "how-to-get-a-research-internship-and-what-i-learned-through-research",
        "alternate_slugs": [],
        "dummy_field_detect_migrations_heroku": null,
        "date_created": "2018-03-25T04:40:37.235094Z",
        "description": "Last Summer I did a research project with the Electrical and Computer Engineering department on smart building energy consumption. This article will explain how I was able to get a research internship despite my limited initial knowledge and some advice on how you can do the same and a few important lessons I learnt.",
        "header_image_url": "https://lh4.googleusercontent.com/KNwXlOrE-ehxIfBBi0Dii71VSOdJ44DNZq9z5inZ5LOGIOeXnwNrnkXlom6BL2I0MiUMp1uK0MYp1Ao1PpyGxOyJhVEHhtXITM6hSQxIf5v5FrJXZfXR6MFz_zl5qiwRDOTRq4XE",
        "published": true,
        "up_votes_count": 0,
        "down_votes_count": 0,
        "up_votes_id": [],
        "down_votes_id": [],
        "metadata": {
          "comments_count": 0,
        },
        "user": {
          "first_name": "Rahim",
          "last_name": "Shamsy",
          "username": "rshamsy",
          "profile_pic_url": "https://firebasestorage.googleapis.com/v0/b/atila-7.appspot.com/o/user-profiles%2F116%2Fprofile-pictures%2Frahim-profile-pic.jpg?alt=media&token=f4970d20-c0e2-4728-aa0f-3fea9ba6a656",
          "title": "",
          "post_secondary_school": "",
          "secondary-school": "",
          "id": 116
        },
      "contributors": [],
      },
  ]

  forums = [

  ]

    EDUCATION_FIELD = [
       'Arts (Undergrad)',
       'STEM (Undergrad)',
       'Trade School',
       'Visual + Performing Arts',
       'Law School',
       'Medical School',
       'MBA',
       'Arts (Grad School)',
       'STEM (Grad School)',
       'Other'
   ];


    model = new PreviewResponse({
    city: '',
    province: '',
    country: '',
    name: '',
    },[],[],'');

    /**
    * If the Google Places API is not working, only ask for city.
    */
    public locationPlaceHolder = 'City, Province or Country';
    public subscriber: any = {};
    @ViewChild('trySearch') public popover: NgbPopover;
    constructor(
    public scholarshipService: ScholarshipService,
    public firebaseService: MyFirebaseService,
    public router: Router,
    public googleAnalyticsEventService: GoogleAnalyticsEventsService,
    public dialog: MatDialog,
    public authService: AuthService,
    ) {

    }

  ngOnInit() {

    $(function(){
      $('iframe.lazy-load-element').attr('src', '//www.youtube.com/embed/c_K4342WMwQ?cc_load_policy=1');
    });

  }

  ngOnDestroy() {
    document.body.style.backgroundColor = null;
  }
  /**
   * Adding Google Places API Autocomplete for User Location:
   * @param {google.maps.places.PlaceResult} placeResult
   * https://developers.google.com/maps/documentation/javascript/reference#PlaceResult
   * https://developers.google.com/maps/documentation/javascript/places-autocomplete#address_forms
   * https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete-addressform
   * https://stackoverflow.com/questions/42341930/google-places-autocomplete-angular2
   */
  placeAutoComplete(placeResult:any, locationModel: NgModel){ //Assign types to the parameters place result is a PlaceResult Type, see documentation


    this.predictLocation(this.model.location, placeResult);

  }

  /**
   * Translate the PlaceResult object into an Atila location object, containing only the city, province/state and country.
   * @param location
   * @param placeResult
   */
  predictLocation(location, placeResult){
    var addressComponents = placeResult.address_components ;

    var keys = ['city', 'province', 'country'];

    //TODO: Find a more elegant solution for this.


    addressComponents.forEach((element, i, arr) => {
      if (i == 0) {
        this.model.location.name = element.long_name;
      }
      if(element.types[0]=='locality' || element.types[0]=='administrative_area_level_3' ||  element.types[0]=='postal_town'||  element.types[0]=='sublocality_level_1'){
        this.model.location.city = element.long_name;
      }

      if(element.types[0]=='administrative_area_level_1'){
        this.model.location.province = element.long_name;
      }

      if(element.types[0]=='country'){
        this.model.location[element.types[0]] = element.long_name;
      }
    });



  }
/**
 * If the Google Place API did not load, then change the placeholder message to only ask for a city (or country?).
 */
  googlePlaceNoLoad(){
    this.locationPlaceHolder = 'City'
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

  onSubmit(form: NgForm){


    if (form.value['education_field'].length==0 && form.value['education_level'].length==0 && form.value['location'] == '') {
      this.model.errors = 'Please enter at least one field.';

      return;
    }

    else {
      delete this.model.errors;
    }

    this.subscriber.action = 'preview_scholarship';
    this.subscriber.preview_choices = this.model;

    this.firebaseService.saveUserAnalytics(this.subscriber,'preview_scholarship')
      .then(res => {
        },
        err => {});

    // TODO What's the proper way of saving form values with Google Analytics

    this.googleAnalyticsEventService.emitEvent("userCategory", "previewAction", JSON.stringify(this.model.location), 1)


    this.scholarshipService.setScholarshipPreviewForm(this.model)
      .then(
      res => this.router.navigate(['scholarship']))  //use promise to ensure that form is saved to Service before navigating away

}

  addSubscriber(event?: KeyboardEvent) {

    if(!this.subscriber.email) {
      this.subscriber.response ='Please enter email.';
      return;
    }

    if(event){
      event.preventDefault();
      this.subscriber.dialog_open_event = event.key;
    }
    else {
      this.subscriber.dialog_open_event = 'ButtonClick';
    }



    this.subscriber.utm_source =       'preview_scholarships';
    let dialogRef = this.dialog.open(SubscriberDialogComponent, {
      width: '300px',
      data: this.subscriber,
    });

    dialogRef.afterClosed().subscribe(
      result => {
              this.subscriber = result;

              if (this.subscriber) {
              this.subscriber.dialog_submit_event = result.dialog_submit_event || 'ButtonClick';

                this.firebaseService.addSubscriber(this.subscriber)
                  .then(res => {
                      this.subscriber.response ='Successfully subscribed to Atila 😄.';
                    },
                    err => this.subscriber.response ='Add Subscriber error, try again.')
              }
              else {
                this.subscriber = {};
                this.subscriber.response ='Please enter subscription information 😄.';
              }

            });




  }


  toggleSearchModal(data?:any){

    // disable search Modal until we figure out how to make it less annoying

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

    // TODO check to see if we have already asked user to prevent repetitve asking
    // if(this.userProfile) {
    //   if (!this.userProfile.preferences['try_search_reminder']) {
    //     this.userProfile.preferences['try_search_reminder'] = new Date().getTime();
    //     this.userProfileService.updateHelper(this.userProfile).subscribe();
    //   }
    //   else {
    //     return;
    //   }
    // }

    const isOpen = this.popover.isOpen();
    if(isOpen){
      this.popover.close()
    }
    else{
      this.popover.open()
    }
  }


}
