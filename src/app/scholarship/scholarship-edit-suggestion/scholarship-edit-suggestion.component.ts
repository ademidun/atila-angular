import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-scholarship-edit-suggestion',
  templateUrl: './scholarship-edit-suggestion.component.html',
  styleUrls: ['./scholarship-edit-suggestion.component.scss']
})
export class ScholarshipEditSuggestionComponent implements OnInit {

  @Input() edit: any;
  Object = Object;

  constructor() { }
  ngOnInit() {

  }

}
