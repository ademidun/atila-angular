import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ProfileViewComponent} from './profile-view/profile-view.component';
import {EditProfileComponent} from './edit-profile/edit-profile.component';

const routes: Routes = [
  { path: 'edit' , component: EditProfileComponent, data: {title: 'Atila - Edit Profile'}},
  { path: 'my-scholarships' , component: ProfileViewComponent, data: {title: 'Atila - My Scholarships'}},
  { path: ':username' , component: ProfileViewComponent, data: {title: 'Profile - Atila'}},
  { path: ':username/my-atila' , component: ProfileViewComponent, data: {title: 'Profile - Atila'}},];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
