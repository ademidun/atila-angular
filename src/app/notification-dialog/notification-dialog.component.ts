import {AfterViewInit, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import * as $ from 'jquery';

@Component({
  selector: 'app-notification-dialog',
  templateUrl: './notification-dialog.component.html',
  styleUrls: ['./notification-dialog.component.scss']
})
export class NotificationDialogComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(
    public dialogRef: MatDialogRef<NotificationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {

    setTimeout(() => {
      console.log('setTimeout() NotificationDialogComponent ngAfterViewInit()');
      $('#dimScreen').css('display', 'block');
    }, 500);
  }

  ngOnDestroy() {
    console.log('NotificationDialogComponent ngOnDestroy()');
    $('#dimScreen').css('display', 'none');
  }

}
