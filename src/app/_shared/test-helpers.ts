import {Component, EventEmitter, Input, NgModule, Output} from '@angular/core';
import {UserProfile} from '../_models/user-profile';
import {Scholarship} from '../_models/scholarship';
import {ColumnSetting} from '../table-layout/models';
import {ShareItemComponent} from './share-item/share-item.component';


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
  selector: 'my-table',
  template: '<p>TableLayoutStubComponent</p>'
})
export class TableLayoutStubComponent {
  @Input() records: any[];
  @Input() caption: string;
  @Input() settings: ColumnSetting[];
  @Output() tableEditEvent:EventEmitter<any[]>  = new EventEmitter<any[]>();
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

@Component({
  selector: 'app-share-item',
  template: '<p>ShareItemStubComponent</p>'
})
export class ShareItemStubComponent {
  @Input() item:any = {};
  @Input() itemCopy:any = {};
  @Input() metadata:any = {};
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
