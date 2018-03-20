import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-card-generic',
  templateUrl: './card-generic.component.html',
  styleUrls: ['./card-generic.component.scss']
})
export class CardGenericComponent implements OnInit {

  @Input() item: any;
  @Input() metadata: any = {};
  @Input() cardStyle: any = {};
  constructor() {}

  ngOnInit() {}

}
