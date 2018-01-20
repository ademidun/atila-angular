import {Component, OnInit, OnDestroy, HostListener} from '@angular/core';
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

  CITY_CHOICES = [
    'Milton',
    'Oakville',
    'Burlington',
    'Toronto',
    'Mississauga',
    'Brampton',
    'Other',
   ]

  EDUCATION_LEVEL = [
    'Secondary School',
    'University',
    'College',
    'Workplace or Apprenticeship',
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
   ]


   model = new PreviewResponse({
    city: '',
    province: '',
    country: '',
    name: '',
    },[],[],'');

   /**
    * If the Google Places API is not working, only ask for city.
    */
    public locationPlaceHolder = 'City, Province/State or Country';
    public subscriber: any = {};
   constructor(
    public scholarshipService: ScholarshipService,
    public firebaseService: MyFirebaseService,
    public router: Router,
    public googleAnalyticsEventService: GoogleAnalyticsEventsService,
    public dialog: MatDialog,
    ) {

    }

  ngOnInit() {

    document.body.style.backgroundColor = '#194F87';
    // https://stackoverflow.com/questions/391979/how-to-get-clients-ip-address-using-javascript-only


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

    this.subscriber.action = 'preview_scholarship';
    this.subscriber.preview_choices = this.model;


    if (form.value['education_field'].length==0 && form.value['education_level'].length==0 && form.value['location'] == '') {
      this.model.errors = 'Please enter at least one field.';

      return;
    }

    else {
      delete this.model.errors;
    }

    this.firebaseService.saveUserAnalytics(this.subscriber,'preview_scholarship')
      .then(res => {
        },
        err => {});

    // TODO What's the proper way of saving form values with Google Analytics

    this.googleAnalyticsEventService.emitEvent("userCategory", "previewAction", JSON.stringify(this.model.location), 1)


    this.scholarshipService.setScholarshipPreviewForm(this.model).then(
      res => this.router.navigate(['scholarships-list']))  //use promise to ensure that form is saved to Service before navigating away


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
              this.subscriber.dialog_submit_event = result.dialog_event || 'ButtonClick';

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




}
