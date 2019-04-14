import {Component, Input} from '@angular/core';


@Component({
  selector: 'mat-icon',
  template: '<span></span>'
})
export class MockMatIconComponent {
  @Input() svgIcon: any;
  @Input() fontSet: any;
  @Input() fontIcon: any;

  selector: 'mat-icon';
  template: '<span></span>'
}
