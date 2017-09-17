import { Component, Input, OnInit } from '@angular/core';
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
  appData: any;
  
  ngOnInit() {
    this.appData = this.generalData.appData.responses;
    console.log('this.generalData.appData.responses', this.generalData.appData.responses);
  }

  get isValid() { 
    return this.form.controls[this.question.key].valid;
   }
}
