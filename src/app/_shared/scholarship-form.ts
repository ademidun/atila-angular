import {FormControl, FormGroup} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {startWith} from 'rxjs/operators/startWith';
import {map} from 'rxjs/operators/map';
import {MAJORS_LIST, SCHOOLS_DICT, SCHOOLS_LIST} from '../_models/constants';


export let scholarshipForm = new FormGroup ({
  eligible_programs: new FormControl(),
  eligible_schools: new FormControl(),
  major: new FormControl(),
  ethnicity: new FormControl(),
});


let filteredMajors: Observable<string[]>;



export  function AutoCompleteForm() {

  let formGroup = new FormGroup ({
    eligible_programs: new FormControl(),
    eligible_schools: new FormControl(),
    major: new FormControl(),
    ethnicity: new FormControl(),
  });

  console.log('formGroup',formGroup);

  return formGroup;

}


export function initializeAutoCompleteOptions(formGroup: FormGroup) {

  let optionsDict = {};

  optionsDict['eligible_programs'] = formGroup.controls['eligible_programs'].valueChanges
    .pipe(
      startWith(''),
      map(val => filterUserInput(val,'program'))
    );


  optionsDict['major'] = formGroup.controls['major'].valueChanges
    .pipe(
      startWith(''),
      map(val => filterUserInput(val,'program'))
    );


  optionsDict['eligible_schools'] = formGroup.controls['eligible_schools'].valueChanges
    .pipe(
      startWith(''),
      map(val => filterUserInput(val,'school'))
    );

  return optionsDict;
}


export function filterUserInput(val: string, type: string): string[] {

  //Allow user input to be used if no other choices available;

  if(type =='school') {
    let customOptions = SCHOOLS_LIST.filter(option =>
      option.toLowerCase().indexOf(val.toLowerCase()) !== -1);

    customOptions.push(val);
    return customOptions;
  }
  if (type == 'program') {

    let customOptions = MAJORS_LIST.filter(option =>
      option.toLowerCase().indexOf(val.toLowerCase()) !== -1);

    customOptions.push(val);
    return customOptions;
  }

}
