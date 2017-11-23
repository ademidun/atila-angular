import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { UserProfile } from '../_models/user-profile';
import { ApplicationService } from '../_services/application.service';
import { UserProfileService } from '../_services/user-profile.service';
import { QuestionService } from '../_services/question.service';
import { QuestionControlService } from '../_services/question-control.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Scholarship } from '../_models/scholarship';
import { AuthService } from "../_services/auth.service";
@Component({
  selector: 'app-app-detail',
  templateUrl: './app-detail.component.html',
  styleUrls: ['./app-detail.component.scss'],
  providers: [ApplicationService, QuestionService]
})
export class AppDetailComponent implements OnInit {

  // http://jsoneditoronline.org/?id=8d09e72ec5d46b9df58e23def50233a0


  scholarship: Scholarship;
  userProfile: UserProfile;
  application: any;
  appId: number;
  applicationData: any[];
  /**
   * Share scholarship, application and UserProfile data with children components. e.g. Dynamic Form component
   */
  generalData: any;
  profileForm: NgForm;
  userId;

  PROVINCE_CHOICES = [
    { 'value': 'ON', 'name': 'Ontario' },
    { 'value': 'BC', 'name': 'British Columbia' },
    { 'value': 'QC', 'name': 'Quebec' },
    { 'value': 'AB', 'name': 'Alberta' },
    { 'value': 'NS', 'name': 'Nova Scotia' },
    { 'value': 'SK', 'name': 'Saskatchewan' },
    { 'value': 'MB', 'name': 'Manitoba' },
    { 'value': 'NL', 'name': 'Newfoundland & Labrador' },
    { 'value': 'NB', 'name': 'New Brunswick' },
    { 'value': 'PE', 'name': 'Prince Edward Island' },
    { 'value': 'NT', 'name': 'Northwest Territories' },
    { 'value': 'YT', 'name': 'Yukon' },
    { 'value': 'NU', 'name': 'Nunavut' },
  ];

  questions: any[];
  observable: Observable<any>;
  dynamicForm: FormGroup;


  locationData = {
    'city': '',
    'province': '',
    'country': '',
  }

  constructor(
    public applicationService: ApplicationService,
    route: ActivatedRoute,
    public qService: QuestionService,
    public qcs: QuestionControlService,
    public userProfileService: UserProfileService,
    public authService: AuthService,
    public router: Router,
  ) {
    this.appId = parseInt(route.snapshot.params['id']);

  }


  ngOnInit() {
    this.getAppData();
    this.observable = this.qService.getQuestions2(this.appId);
    this.observable.subscribe(
      res => {
        res = res.scholarshipQuestions;
          this.questions = Object.keys(res).map(function (k) { return res[k] }); //similiar to python or LISP's lambda

      },
      err => console.error('error! in AppDetailComponent QuestionService', this.profileForm),
      () => {


        if (this.questions) {
          this.dynamicForm = this.qcs.toFormGroup(this.questions);
        }

      }
    )

  }

  getAppData() {
    var data: any;
    let postOperation: Observable<any>;
    this.userId = this.authService.decryptLocalStorage('uid');
    postOperation = this.applicationService.getAppData(this.appId);

    postOperation
      .subscribe(
      res => {
        data = res;

      },
      error => console.error('AppDetailComponent getAppData', error),

      () => {
        this.generalData = data;
        this.generalData.documentUploads = data.appData.document_urls? data.appData.document_urls : {};
        this.application = data.appData;

        this.userProfile = data.userProfile;
        this.scholarship = data.scholarship;

        this.applicationData = Object.keys(this.application.responses);

        this.initializeLocations(this.userProfile.city);

        //to create dynamic forms:
        // https://angular.io/guide/dynamic-form
        // https://toddmotto.com/angular-dynamic-components-forms

      }
      )

  }

  initializeLocations(cities: Array<any>){
    if(cities.length>0){
      this.locationData.city= cities[0].name;
      this.locationData.country=cities[0].country;
      this.locationData.province=cities[0].province;
    }

    this.generalData.locationData = this.locationData;

  }
  onSubmit(form: NgForm) {
    this.profileForm = form;
  }

  saveUserProfile(form: NgForm){


    var sendData = {
      userProfile: this.userProfile,
      locationData: this.locationData,
    }


    let saveProfileObservable = this.userProfileService.updateAny(sendData);

    saveProfileObservable.subscribe(
      res => {
      },
      err =>{
        console.error('app-detail saveUserProfile() err', err)
      }
    );

  }

}
