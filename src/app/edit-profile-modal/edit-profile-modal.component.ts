import { Component, OnInit,Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {ScholarshipsListComponent} from '../scholarship/scholarships-list/scholarships-list.component';
import {UserProfile} from '../_models/user-profile';

import {SCHOOLS_LIST, MAJORS_LIST} from '../_models/constants';
@Component({
  selector: 'app-edit-profile-modal',
  templateUrl: './edit-profile-modal.component.html',
  styleUrls: ['./edit-profile-modal.component.scss']
})
export class EditProfileModalComponent implements OnInit {

  SCHOOLS_LIST = SCHOOLS_LIST;
  MAJORS_LIST = MAJORS_LIST;
  seeMore = false;
  constructor(
    public dialogRef: MatDialogRef<ScholarshipsListComponent>,
    @Inject(MAT_DIALOG_DATA) public userProfile: UserProfile) { }

  ngOnInit() {
  }


  typeaheadEvent(event) {
    this.userProfile[event.type] = event.event.item;
  }
}
