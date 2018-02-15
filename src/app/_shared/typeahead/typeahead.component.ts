import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {NgbTypeaheadConfig} from '@ng-bootstrap/ng-bootstrap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
  selector: 'app-typeahead',
  templateUrl: './typeahead.component.html',
  styleUrls: ['./typeahead.component.scss'],
  providers: [NgbTypeaheadConfig] // add NgbTypeaheadConfig to the component providers
})
export class TypeaheadComponent implements OnInit {

   states = ['Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado',
    'Connecticut', 'Delaware', 'District Of Columbia', 'Federated States Of Micronesia', 'Florida', 'Georgia',
    'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine',
    'Marshall Islands', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana',
    'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
    'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico', 'Rhode Island',
    'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Islands', 'Virginia',
    'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
   search: any;
   model: any;
   results = [];
  constructor(config: NgbTypeaheadConfig) {
    config.showHint = true;
  }

  ngOnInit() {
    this.search = (text$: Observable<string>) =>
      text$
        .debounceTime(200)
        .distinctUntilChanged()
        .map(term => term.length < 2 ? []
          : this.filterUserInput(term, this.states));
  }

  filterUserInput(val: string, dataSet, keepUserInput=true): string[] {
    //Allow user input to be used if no other choices available;
    let customOptions = dataSet.filter(option =>
      option.toLowerCase().indexOf(val.toLowerCase()) !== -1);

    if (keepUserInput){
      customOptions.push(val);
    }
    return customOptions;

  }

  optionSelected(event) {
    this.results.push(this.model);
    console.log('event, this.results', event, this.results);
  }
}
