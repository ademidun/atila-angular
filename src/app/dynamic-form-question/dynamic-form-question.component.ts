//https://angular.io/guide/dynamic-form#questionnaire-data
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, NgForm }        from '@angular/forms';

import { QuestionBase }     from '../_models/question-base';

@Component({
  selector: 'app-dynamic-form-question',
  templateUrl: './dynamic-form-question.component.html',
  styleUrls: ['./dynamic-form-question.component.scss']
})
export class DynamicFormQuestionComponent implements OnInit {

  //todo: should we add onInit stuff? and constructor?

  @Input() question: QuestionBase<any>;
  @Input() form: FormGroup;
  @Input()profileForm: NgForm;
  @Input() generalData: any;
  @Output() uploaded:EventEmitter<any> = new EventEmitter();

  ngOnInit() {


    if(this.form){
      var results = document.getElementsByClassName("scholarship-document");

      for (var i = 0; i < results.length; i++) {
        let documentKey = results[i].getAttribute("name");

        this.generalData.application.document_urls[documentKey] = results[i].getAttribute("href");
    }

    }
  }

  get isValid() {
    return this.form.controls[this.question.key].valid;
   }


   debugForm() {
    console.log('debug form(), this.question, this.form, this.generalData.application.responses',
      this.question, this.form, this.generalData.application.responses);
   }
   fileChangeEvent(fileInput: any) {
     //When a file is changed, call the function which uploaded is bound to from the parent component
     //i.e. call fileChangeEvent()in the dynamic-form.componenent.ts
    //  <app-dynamic-form-question  [question]="question" [form]="form" [profileForm]="profileForm"
    //  [generalData]="generalData" (uploaded)="fileChangeEvent($event)"></app-dynamic-form-question>

    this.uploaded.emit(fileInput);

  }
}
