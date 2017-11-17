import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { UserProfile } from '../_models/user-profile';
import { ApplicationService } from '../_services/application.service';
import { UserProfileService } from '../_services/user-profile.service';
import { QuestionService } from '../_services/question.service';
import { QuestionControlService } from '../_services/question-control.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from "rxjs/Rx";
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
    private applicationService: ApplicationService,
    route: ActivatedRoute,
    private qService: QuestionService,
    private qcs: QuestionControlService,
    private userProfileService: UserProfileService,
    authService: AuthService,
    private router: Router,
  ) {
    this.appId = parseInt(route.snapshot.params['id']);
    console.log("route.snapshot.params['id']", route.snapshot.params['id']);

  }


  ngOnInit() {
    this.getAppData();
    console.log("AppDetailComponent, this.questions", this.questions);
    this.observable = this.qService.getQuestions2(this.appId);
    this.observable.subscribe(
      res => {
        console.log('in AppDetailComponent.subscribe, res:', res)
        res = res.scholarshipQuestions;
          this.questions = Object.keys(res).map(function (k) { return res[k] }); //similiar to python or LISP's lambda

          console.log('in AppDetailComponent.subscribe, questions:', this.questions);

      },
      err => console.log('error! in AppDetailComponent QuestionService', this.profileForm),
      () => {

        console.log('in AppDetailComponent.subscribe onComplete, questions:', this.questions);

        if (this.questions) {
          this.dynamicForm = this.qcs.toFormGroup(this.questions);
          console.log('in AppDetailComponent.subscribe onComplete, inside if, this.dynamicForm:', this.dynamicForm);
        }
        console.log('in AppDetailComponent.subscribe onComplete, this.dynamicForm:', this.dynamicForm);

      }
    )

  }

  getAppData() {
    var data: any;
    let postOperation: Observable<any>;
    postOperation = this.applicationService.getAppData(this.appId);

    postOperation
      .subscribe(
      res => {
        data = res;
        console.log('AppDetailComponent res', res); 

        if (this.userId!=res.appData.user) {
          this.router.navigate(['/login']);
        }
      },
      error => console.log('AppDetailComponent getAppData', error),

      () => {
        this.generalData = data;
        this.generalData.documentUploads = data.appData.document_urls? data.appData.document_urls : {};
        this.application = data.appData;

        this.userProfile = data.userProfile;
        this.scholarship = data.scholarship;

        console.log('AppDetailComponent data.appData.document_urls', data.appData.document_urls);
        console.log('AppDetailComponent this.generalData.documentUploads', this.generalData.documentUploads);
        console.log(' this.application.responses', this.application.responses);

        this.applicationData = Object.keys(this.application.responses);
        console.log('(2)this.applicationData', this.applicationData);
        
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
    console.log('this.profileForm', this.profileForm);
  }

  saveUserProfile(form: NgForm){
    console.log('app-detail saveProfile() form: NgForm:', form);
    console.log('app-detail saveProfile() this.profileForm:', this.profileForm);
    console.log('app-detail saveProfile() this.userProfile', this.userProfile);


    var sendData = {
      userProfile: this.userProfile,
      locationData: this.locationData,
    }


    console.log('app-detail saveProfile() sendData: ', sendData);

    let saveProfileObservable = this.userProfileService.updateAny(sendData);

    saveProfileObservable.subscribe(
      res => {
        console.log('app-detail saveUserProfile() succesful res', res);
      },
      err =>{
        console.log('app-detail saveUserProfile() err', err)
      }
    );

  }

}
