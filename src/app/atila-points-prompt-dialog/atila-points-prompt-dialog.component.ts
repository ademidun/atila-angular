import {Component, Inject, OnInit, OnDestroy} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {ScholarshipDetailComponent} from '../scholarship/scholarship-detail/scholarship-detail.component';
import {Router} from '@angular/router';
import {UserProfile} from '../_models/user-profile';

@Component({
  selector: 'app-atila-points-prompt-dialog',
  templateUrl: './atila-points-prompt-dialog.component.html',
  styleUrls: ['./atila-points-prompt-dialog.component.scss']
})
export class AtilaPointsPromptDialogComponent implements OnInit, OnDestroy {

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
    this.dialogRef.close();
  }

}
