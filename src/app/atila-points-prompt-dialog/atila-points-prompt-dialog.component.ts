import {Component, Inject, OnInit, OnDestroy} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {ScholarshipDetailComponent} from '../scholarship/scholarship-detail/scholarship-detail.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-atila-points-prompt-dialog',
  templateUrl: './atila-points-prompt-dialog.component.html',
  styleUrls: ['./atila-points-prompt-dialog.component.scss']
})
export class AtilaPointsPromptDialogComponent implements OnInit, OnDestroy {

  viewCount: any;

  constructor(public dialogRef: MatDialogRef<ScholarshipDetailComponent>,
              @Inject(MAT_DIALOG_DATA) public promptData: any,
              public router: Router,) {

    this.viewCount =  promptData['viewCount'];
  }

  ngOnInit() {
  }

  linkHandler(event, path) {
    console.log('linkHandler  event', event);

    try {
      event.preventDefault();
    }
    catch(e){
      console.log('catch  event.preventDefault() e:', e);
    }
    console.log('linkHandler  this.dialogRef', this.dialogRef);
    this.router.navigate([path]);
    this.dialogRef.close();
  }

  ngOnDestroy (){
    console.log('ngOnDestroy  this.dialogRef', this.dialogRef);
    this.dialogRef.close();
  }

}
