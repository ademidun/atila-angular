import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, NgForm} from '@angular/forms';
import {QuestionBase} from '../_models/question-base';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss']
})
export class AutocompleteComponent implements OnInit {
  @Input() formControl: FormControl;
  @Input() filteredOptions: any;
  @Input() metadata: any;
  @Input() model: any;
  @Output() autoCompleteSelectedEmitter:EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  autoCompleteSelected (event, selectionType?) {

    let emitdata = {
      'event': event,
      'selectionType': selectionType,
      'childComponent': true
    };
    this.autoCompleteSelectedEmitter.emit(emitdata);

    if( (<KeyboardEvent>event).keyCode == 13 || selectionType) {

      if (event.hasOwnProperty('preventDefault')) {
        event.preventDefault();
      }

      this.formControl.setValue('');
    }
  }

}
