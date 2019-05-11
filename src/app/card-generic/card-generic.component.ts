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
    showEssayImage: false,
    hideDescription: boolean,
  };
  @Input() cardStyle: any = {};
  @Input() cardTitleStyle: any = {};
  @Input() imageStyle: any = {};
  @Input() titleMaxLength = 100;
  @Input() previewDescriptionLength = 280;

  previewDescription: boolean;
  constructor() {}

  ngOnInit() {

    const defaultTitleStyle = {'max-height': this.item.image && !this.previewDescription ? '280px' : null}

    this.cardTitleStyle = {...this.cardTitleStyle, ...defaultTitleStyle};
    console.log('this.item.title', this.item.title);
    console.log('this.previewDescriptionLength', this.previewDescriptionLength);
  }

  togglePreview() {
    this.previewDescription=!this.previewDescription;
    this.cardStyle['overflow-y'] = this.previewDescription ? 'scroll': 'hidden';

  }

  toTitleCase(str) {
    return toTitleCase(str);
  }



}
