import { Component, Input, OnInit }  from '@angular/core';
import { FormGroup, NgForm }                 from '@angular/forms';

import { QuestionBase }              from '../_models/question-base';
import { QuestionService }    from '../_services/question.service';
import { QuestionControlService }    from '../_services/question-control.service';

import { Observable } from "rxjs/Rx";
@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  providers: [ QuestionControlService ]
})
export class DynamicFormComponent implements OnInit {

  @Input() questions: QuestionBase<any>[] = [];
  @Input() form: FormGroup;
  @Input() profileForm: NgForm;
  @Input() generalData: any;
  appData: any;
  observable: Observable<any>;
  isFormReady: boolean;

  payLoad = '';

  uploadUrl: string;

  constructor(
    private qcs: QuestionControlService,
    private questionService: QuestionService,
  ) { 
    
   }

  ngOnInit() {
    if(this.questions){
      this.form = this.qcs.toFormGroup(this.questions);
    }

    this.appData = this.generalData.appData.responses;
    console.log('this.generalData.appData.responses', this.generalData.appData.responses);
    console.log('this.generalData', this.generalData);
    //this.isFormReady = (!!this.questions && !!this.form);
    console.log('this.isFormReady', this.isFormReady);
  }

  onSubmit() {
    console.log('(dynamic-form.component) this.form', this.form);
    console.log('this.form', this.form.value);
    console.log('JSON.stringify(this.form.value)', JSON.stringify(this.form.value));

     console.log('(dynamic-form.component) this.profileForm', this.profileForm);
    console.log('this.profileForm.value', this.profileForm.value);
    console.log('JSON.stringify(this.profileForm.value)', JSON.stringify(this.profileForm.value));

    this.payLoad = JSON.stringify(this.form.value);
    console.log('this.generalData', this.generalData);
    var sendData = {
      'generalData': this.generalData,
      'profileForm': this.profileForm.value,
      'appForm': this.form.value,
    }
    console.log('sendData:', sendData);
    var appId = this.generalData.appData.id;
    this.observable = this.questionService.saveResponse(appId,sendData);
    this.observable.subscribe(
      res => {
        console.log('Response succesful:' , res);
        this.uploadUrl = res.upload_url;
      },

      err =>console.log('Error DynamicFormComponent:' , err)
    )
  }
}