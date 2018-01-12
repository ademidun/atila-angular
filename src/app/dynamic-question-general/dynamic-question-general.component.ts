import {Component, Input, OnInit} from '@angular/core';
import {QuestionBase} from '../_models/question-base';

@Component({
  selector: 'app-dynamic-question-general',
  templateUrl: './dynamic-question-general.component.html',
  styleUrls: ['./dynamic-question-general.component.scss']
})
export class DynamicQuestionGeneralComponent implements OnInit {

  @Input() question: QuestionBase<any>;
  @Input() responses: any;
  constructor() { }

  ngOnInit() {

    console.log('question:', this.question, 'responses: ', this.responses );
  }

}
