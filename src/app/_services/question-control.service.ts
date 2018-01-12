import { Injectable } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import { QuestionBase } from '../_models/question-base';

@Injectable()
export class QuestionControlService {
  constructor() { }

  toFormGroup(questions: QuestionBase<any>[] ) {
    let group: any = {};

    questions.forEach(question => {
      group[question.key] = question.required ? new FormControl(question.value || '', Validators.required)
        : new FormControl(question.value || '');
    });
    return new FormGroup(group);
  }


  // If you use the validator, some forms will always show invalid, see dynamic form component and dynamic form component
  toFormGroupNoValidator(questions: QuestionBase<any>[] ) {
    let group: any = {};

    questions.forEach(question => {
      group[question.key] = new FormControl(question.value || '');
    });
    return new FormGroup(group);
  }
}
