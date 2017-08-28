import { Component, OnInit } from '@angular/core';
import { UserProfile } from '../_models/user-profile'

@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.scss']
})
export class CreateProfileComponent implements OnInit {

  model = new UserProfile();

  constructor() { }

  ngOnInit() {
  }

}
