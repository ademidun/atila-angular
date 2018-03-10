import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AddScholarshipComponent } from "../add-scholarship/add-scholarship.component";
import { PreviewComponent } from "../preview/preview.component";
import { ScholarshipsListComponent } from "../scholarships-list/scholarships-list.component";
import { ScholarshipDetailComponent } from "../scholarship-detail/scholarship-detail.component";
import { LoginComponent } from "../login/login.component";
import { RegisterComponent } from '../register/register.component'
import { EditProfileComponent } from '../edit-profile/edit-profile.component'

import { AppDetailComponent } from '../app-detail/app-detail.component';

import { ProfileViewComponent } from '../profile-view/profile-view.component';
import { MessagesComponent } from '../messages/messages.component';

import { AuthGuard } from '../_guards/auth.guard';
import {TeamComponent} from '../team/team.component';
import {VerifyComponent} from '../verify/verify.component';
import {TermsConditionsComponent} from '../terms-conditions/terms-conditions.component';
import {SearchComponent} from '../search/search.component';
import {BlogModule} from '../blog/blog.module';
import {ForumModule} from '../forum/forum.module';

const routes: Routes = [
  { path: '' , component: PreviewComponent, data: {title: 'Atila | Automated Scholarships. The Right Way'}},
  { path: 'applications/demo' , component: AppDetailComponent, data: {title: 'Automation Demo'}},
  { path: 'applications/:id' , component: AppDetailComponent, data: {title: 'Application Detail'}, canActivate:[AuthGuard]},
  { path: 'scholarship' , component: ScholarshipsListComponent, data: {title: 'Atila | Automated Scholarships. The Right Way'}},
  { path: 'scholarships' , component: ScholarshipsListComponent, data: {title: 'Atila | Automated Scholarships. The Right Way'}},
  { path: 'scholarship/add' , component: AddScholarshipComponent, data: {title: 'Add Scholarship - Atila'}},
  { path: 'scholarship/edit/:slug' , component: AddScholarshipComponent, data: {title: 'Edit Scholarship - Atila'}},
  { path: 'scholarship/:slug' , component: ScholarshipDetailComponent, data: {title: 'Atila - Scholarship Detail'}},
  { path: 'search' , component: SearchComponent, data: {title: 'Atila - Search'}},
  {
    path: 'blog',
    loadChildren: '../blog/blog.module#BlogModule'
  },
  {
    path: 'forum',
    loadChildren: '../forum/forum.module#ForumModule'
  },
  {
    path: 'profile',
    loadChildren: '../profile/profile.module#ProfileModule'
  },
  { path: 'messages' , component: MessagesComponent, data: {title: 'My Messages - Atila'}},
  { path: 'preview' , component: PreviewComponent, data: {title: 'Atila - Preview'}},
  { path: 'login' , component: LoginComponent, data: {title: 'Login - Atila'}},
  { path: 'register' , component: RegisterComponent, data: {title: 'Atila - Register'}},
  { path: 'verify' , component: VerifyComponent, data: {title: 'Verify - Atila'}},
  { path: 'team' , component: TeamComponent, data: {title: 'Team - Atila'}},
  { path: 'terms-and-conditions' , component: TermsConditionsComponent, data: {title: 'Terms and Conditions - Atila'}},
  { path: '**', component: PreviewComponent, data: {title: 'Atila | Automated Scholarships. The Right Way'} }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
