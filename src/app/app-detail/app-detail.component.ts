import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { UserProfile } from '../_models/user-profile';
import { ApplicationService } from '../_services/application.service';
import { QuestionService } from '../_services/question.service';
import { QuestionControlService } from '../_services/question-control.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from "rxjs/Rx";
import { Scholarship } from '../_models/scholarship';

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
  generalData: any; //scholarship, application and UserProfile data
  profileForm: NgForm;

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

    

  constructor(
    private applicationService: ApplicationService,
    route: ActivatedRoute,
    private qService: QuestionService,
    private qcs: QuestionControlService,
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
      },
      error => console.log('AppDetailComponent getAppData', error),

      () => {
        this.generalData = data;
        this.application = data.appData;
        this.userProfile = data.userProfile;
        this.scholarship = data.scholarship;
        console.log('AppDetailComponent data', data);
        console.log('AppDetailComponent data.userProfile', data.userProfile);
        console.log('AppDetailComponent this.userProfile', this.userProfile);
        console.log(' this.application.responses', this.application.responses);

        this.applicationData = Object.keys(this.application.responses);
        console.log('(2)this.applicationData', this.applicationData);

        //to create dynamic forms:
        // https://angular.io/guide/dynamic-form
        // https://toddmotto.com/angular-dynamic-components-forms

      }
      )

  }

  onSubmit(form: NgForm) {
    this.profileForm = form;
    console.log('this.profileForm', this.profileForm);
  }
}
