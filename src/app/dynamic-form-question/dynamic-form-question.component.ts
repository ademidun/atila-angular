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
  appData: any;
  
  ngOnInit() {
    this.appData = this.generalData.appData.responses;
    

    if(this.form){
      var results = document.getElementsByClassName("scholarship-document");
      
      this.generalData.documentUploads = { };
      for (var i = 0; i < results.length; i++) {
        let documentKey = results[i].getAttribute("name");
  
        let documentUrl = results[i].getAttribute("href"); 
        this.generalData.documentUploads[documentKey] = documentUrl;
  
    }
    }
  }

  get isValid() { 
    return this.form.controls[this.question.key].valid;
   }

   fileChangeEvent(fileInput: any) {
     //When a file is changed, call the function which uploaded is bound to from the parent component
     //i.e. call fileChangeEvent()in the dynamic-form.componenent.ts
    //  <app-dynamic-form-question  [question]="question" [form]="form" [profileForm]="profileForm"
    //  [generalData]="generalData" (uploaded)="fileChangeEvent($event)"></app-dynamic-form-question>

    this.uploaded.emit(fileInput);
    
  }
}
