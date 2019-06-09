import {Component, EventEmitter, Input, NgModule, Output} from '@angular/core';
import {UserProfile} from '../_models/user-profile';
import {Scholarship} from '../_models/scholarship';


@Component({
  selector: 'mat-icon',
  template: '<span></span>'
})
export class MatIconStubComponent {
  @Input() svgIcon: any;
  @Input() fontSet: any;
  @Input() fontIcon: any;

  selector: 'mat-icon';
  template: '<span></span>'
}

@Component({
  selector: 'app-scholarship-card',
  template: '<p>ScholarshipCardStubComponent</p>'
})
export class ScholarshipCardStubComponent {
  @Input() scholarship: Scholarship | any;
  @Input() userProfile: UserProfile;
  @Input() showExtraCriteria = true;
  @Input() metadata: any = {};
  @Output() handleClick: EventEmitter<any> = new EventEmitter();
}

@Component({
  selector: 'app-typeahead',
  template: '<p>TypeaheadStubComponent</p>'
})
export class TypeaheadStubComponent {
  @Input() dataset: any[];
  @Input() metadata = {};
  @Input() model: any;
  @Output() modelChange: EventEmitter<any> = new EventEmitter();
  @Input() inputStyles: any = {};
  @Input() labelStyles: any = {};
  @Output() typeaheadSelectedEvent: EventEmitter<any> = new EventEmitter();
}

@Component({
  selector: 'app-navbar',
  template: '<p>Mock Navbar Component</p>'
})
export class NavbarStubComponent {
}

@NgModule({
  declarations: [
    MatIconStubComponent,
    ScholarshipCardStubComponent,
    TypeaheadStubComponent,
    NavbarStubComponent,
  ],
})
export class MockTestingModule {
  constructor() {
  }
}
