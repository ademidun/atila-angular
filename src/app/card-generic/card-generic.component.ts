import {Component, Input, OnInit} from '@angular/core';
import {toTitleCase} from '../_shared/utils';
@Component({
  selector: 'app-card-generic',
  templateUrl: './card-generic.component.html',
  styleUrls: ['./card-generic.component.scss']
})
export class CardGenericComponent implements OnInit {

  @Input() item: any;
  @Input() metadata: {
    showImageInPreviewMode: false,
    hideDescription: boolean,
  };
  @Input() cardStyle: any = {};
  @Input() imageStyle: any = {};
  @Input() titleMaxLength = 100;

  previewDescription: boolean;
  constructor() {}

  ngOnInit() {
  }

  togglePreview() {
    this.previewDescription=!this.previewDescription;
    this.cardStyle['overflow-y'] = this.previewDescription ? 'scroll': 'hidden';

  }

  toTitleCase(str) {
    return toTitleCase(str);
  }



}
