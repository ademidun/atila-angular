import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {PreviewComponent} from '../preview/preview.component';

@Component({
  selector: 'app-subscriber-dialog',
  templateUrl: './subscriber-dialog.component.html',
  styleUrls: ['./subscriber-dialog.component.scss']
})
export class SubscriberDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<PreviewComponent>,
    @Inject(MAT_DIALOG_DATA) public subscriber: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onEnter(event? : KeyboardEvent) {
    if(event) {
      this.subscriber.dialog_submit_event = event.key;
    }
    else {
      this.subscriber.dialog_submit_event = 'ButtonClick';
    }

    this.dialogRef.close(this.subscriber);
  }

  ngOnInit() {
  }

}
