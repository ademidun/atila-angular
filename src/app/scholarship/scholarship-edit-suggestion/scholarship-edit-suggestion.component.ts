import {Component, Input, OnInit} from '@angular/core';
import {Scholarship, ScholarshipEdit} from '../../_models/scholarship';

@Component({
  selector: 'app-scholarship-edit-suggestion',
  templateUrl: './scholarship-edit-suggestion.component.html',
  styleUrls: ['./scholarship-edit-suggestion.component.scss']
})
export class ScholarshipEditSuggestionComponent implements OnInit {

  @Input() edit: ScholarshipEdit;
  Object = Object;

  constructor() {
    console.log('constructor() edit',this.edit);
  }
  ngOnInit() {
    console.log('ngOnInit() edit',this.edit);
  }

}
