import { Component, OnInit } from '@angular/core';
import { UserProfile } from '../_models/user-profile'

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {

  model = new UserProfile();

  constructor() { }

  ngOnInit() {
  }

}
