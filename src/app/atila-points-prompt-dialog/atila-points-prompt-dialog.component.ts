import {Component, Inject, OnInit, OnDestroy, AfterViewInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {ScholarshipDetailComponent} from '../scholarship/scholarship-detail/scholarship-detail.component';
import {Router} from '@angular/router';
import {UserProfile} from '../_models/user-profile';
import * as $ from "jquery";

@Component({
  selector: 'app-atila-points-prompt-dialog',
  templateUrl: './atila-points-prompt-dialog.component.html',
  styleUrls: ['./atila-points-prompt-dialog.component.scss'],
})
export class AtilaPointsPromptDialogComponent implements OnInit, AfterViewInit, OnDestroy {

  viewCount: any;
  userProfile: UserProfile;

  constructor(public dialogRef: MatDialogRef<ScholarshipDetailComponent>,
              @Inject(MAT_DIALOG_DATA) public promptData: any,
              public router: Router,) {

    this.viewCount =  promptData['viewCount'];
    this.userProfile =  promptData['userProfile'];
  }

  ngOnInit() {
  }

  ngAfterViewInit() {

    setTimeout(() => {
      console.log('setTimeout() NotificationDialogComponent ngAfterViewInit()');
      $('#dimScreen').css('display', 'block');
    }, 500);
  }

  linkHandler(event, path,opts={}) {

    try {
      event.preventDefault();
    }
    catch(e){
      // console.log('catch  event.preventDefault() e:', e);
    }
    this.router.navigate([path], opts);
    this.dialogRef.close();
  }

  ngOnDestroy (){
    console.log('NotificationDialogComponent ngOnDestroy()');
    $('#dimScreen').css('display', 'none');
    this.dialogRef.close();
  }

}
