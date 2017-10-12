import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AddScholarshipComponent } from "../add-scholarship/add-scholarship.component";
import { PreviewComponent } from "../preview/preview.component";
import { ScholarshipsListComponent } from "../scholarships-list/scholarships-list.component";
import { ScholarshipDetailComponent } from "../scholarship-detail/scholarship-detail.component";
import { LoginComponent } from "../login/login.component";
import { RegisterComponent } from '../register/register.component'
import { CreateProfileComponent } from '../create-profile/create-profile.component'
import { EditProfileComponent } from '../edit-profile/edit-profile.component'

import { EditScholarshipComponent } from '../edit-scholarship/edit-scholarship.component';
import { AppDetailComponent } from '../app-detail/app-detail.component';


const routes: Routes = [
  { path: '' , component: PreviewComponent, data: {title: 'Atila'}},
  { path: 'applications/:id' , component: AppDetailComponent, data: {title: 'Application Detail'}},  
  { path: 'add-scholarship' , component: AddScholarshipComponent, data: {title: 'Atila - Add Scholarship'}},
  { path: 'create-profile' , component: CreateProfileComponent, data: {title: 'Atila - Create Profile'}},
  { path: 'profile/:username' , component: EditProfileComponent, data: {title: 'Atila - Profile'}},
  { path: 'edit-profile' , component: EditProfileComponent, data: {title: 'Atila - Edit Profile'}},
  { path: 'edit-scholarship/:slug' , component: EditScholarshipComponent, data: {title: 'Atila - Edit Scholarship'}},
  { path: 'login' , component: LoginComponent, data: {title: 'Atila - Login'}},
  { path: 'preview' , component: PreviewComponent, data: {title: 'Atila - Preview'}},
  { path: 'register' , component: RegisterComponent, data: {title: 'Atila - Register'}},
  { path: 'scholarships-list' , component: ScholarshipsListComponent, data: {title: 'Atila - Scholarships List'}},
  //{ path: 'scholarship-detail/:id' , component: ScholarshipDetailComponent, data: {title: 'Atila - Scholarship Detail'}},
  { path: 'scholarship-detail/:slug' , component: ScholarshipDetailComponent, data: {title: 'Atila - Scholarship Detail'}}
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }