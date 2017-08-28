import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PreviewComponent } from "../preview/preview.component";
import { ScholarshipsListComponent } from "../scholarships-list/scholarships-list.component";
import { LoginComponent } from "../login/login.component";
import { RegisterComponent } from '../register/register.component'
import { CreateProfileComponent } from '../create-profile/create-profile.component'
import { EditProfileComponent } from '../edit-profile/edit-profile.component'


const routes: Routes = [
  { path: '' , component: PreviewComponent, data: {title: 'Dante'}},
  { path: 'create-profile' , component: CreateProfileComponent, data: {title: 'Dante - Create Profile'}},
  { path: 'edit-profile' , component: EditProfileComponent, data: {title: 'Dante - Edit Profile'}},
  { path: 'login' , component: LoginComponent, data: {title: 'Dante - Login'}},
  { path: 'preview' , component: PreviewComponent, data: {title: 'Dante - Preview'}},
  { path: 'register' , component: RegisterComponent, data: {title: 'Dante - Register'}},
  { path: 'scholarships-list' , component: ScholarshipsListComponent, data: {title: 'Dante - Scholarships List'}},
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }