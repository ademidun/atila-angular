import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {ScholarshipsListComponent} from '../scholarship/scholarships-list/scholarships-list.component';
import {ScholarshipDetailComponent} from '../scholarship/scholarship-detail/scholarship-detail.component';

@Component({
  selector: 'app-atila-points-prompt-dialog',
  templateUrl: './atila-points-prompt-dialog.component.html',
  styleUrls: ['./atila-points-prompt-dialog.component.scss']
})
export class AtilaPointsPromptDialogComponent implements OnInit {

  title: any;

  constructor(public dialogRef: MatDialogRef<ScholarshipDetailComponent>,
              @Inject(MAT_DIALOG_DATA) public promptData: any) {

    this.title =  promptData['title'];
  }

  ngOnInit() {
  }

}
