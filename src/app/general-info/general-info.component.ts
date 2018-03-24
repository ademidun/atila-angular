import { Component, OnInit } from '@angular/core';
import {MyFirebaseService} from '../_services/myfirebase.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-general-info',
  templateUrl: './general-info.component.html',
  styleUrls: ['./general-info.component.scss']
})
export class GeneralInfoComponent implements OnInit {

  model: any = {};
  sendMessageResponse: any;
  internalReferral: any;
  constructor(
    public firebaseService: MyFirebaseService,
    public route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.internalReferral = this.route.snapshot.queryParams['atila_ref'];
  }

  sendMessage() {
    this.firebaseService.saveAny('contact_form',this.model)
      .then(res=> {
        this.sendMessageResponse = 'Thank you. You will receive a response within 1 day.'
      } );
  }
}
