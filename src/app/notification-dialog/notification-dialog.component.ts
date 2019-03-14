import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import * as $ from 'jquery';

@Component({
  selector: 'app-notification-dialog',
  templateUrl: './notification-dialog.component.html',
  styleUrls: ['./notification-dialog.component.scss']
})
export class NotificationDialogComponent implements OnInit, OnDestroy {

  constructor(
    public dialogRef: MatDialogRef<NotificationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    console.log('NotificationDialogComponent ngOnInit()');
    $('#dimScreen').css('display', 'block');
  }

  ngOnDestroy() {
    console.log('NotificationDialogComponent ngOnDestroy()');
    $('#dimScreen').css('display', 'none');
  }

}
