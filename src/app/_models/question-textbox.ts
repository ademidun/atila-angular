import { QuestionBase } from './question-base';

export class TextboxQuestion extends QuestionBase<string> {
  controlType = 'textfield';
  type = 'textfield';

  constructor(options: {} = {}) {
    super(options);
    this.value = options['value'] || '';
    this.type = options['type'] || 'textfield';
    this.controlType = options['controlType'] || this.type;
  }
}
