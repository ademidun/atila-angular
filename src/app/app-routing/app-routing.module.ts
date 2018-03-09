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
import { ForumsListComponent } from '../forums-list/forums-list.component';
import { ForumDetailComponent } from '../forum-detail/forum-detail.component';

import { BlogsListComponent } from '../blogs-list/blogs-list.component';
import { BlogPostCreateComponent } from '../blog-post-create/blog-post-create.component';
import { BlogPostDetailComponent } from "../blog-post-detail/blog-post-detail.component";

import { AuthGuard } from '../_guards/auth.guard';
import {TeamComponent} from '../team/team.component';
import {VerifyComponent} from '../verify/verify.component';
import {TermsConditionsComponent} from '../terms-conditions/terms-conditions.component';
import {SearchComponent} from '../search/search.component';

const routes: Routes = [
  { path: '' , component: PreviewComponent, data: {title: 'Atila | Automated Scholarships. The Right Way'}},
  { path: 'applications/demo' , component: AppDetailComponent, data: {title: 'Automation Demo'}},
  { path: 'applications/:id' , component: AppDetailComponent, data: {title: 'Application Detail'}, canActivate:[AuthGuard]},
  { path: 'scholarship/add' , component: AddScholarshipComponent, data: {title: 'Add Scholarship - Atila'}},
  { path: 'scholarship' , component: ScholarshipsListComponent, data: {title: 'Atila | Automated Scholarships. The Right Way'}},
  { path: 'scholarship/:slug' , component: ScholarshipDetailComponent, data: {title: 'Atila - Scholarship Detail'}},
  { path: 'scholarship/edit/:slug' , component: AddScholarshipComponent, data: {title: 'Edit Scholarship - Atila'}},
  { path: 'search' , component: SearchComponent, data: {title: 'Atila - Search'}},
  { path: 'profile/:username' , component: ProfileViewComponent, data: {title: 'Profile - Atila'}},
  { path: 'profile/:username/my-atila' , component: ProfileViewComponent, data: {title: 'Profile - Atila'}},
  { path: 'profile/edit' , component: EditProfileComponent, data: {title: 'Atila - Edit Profile'}},
  { path: 'profile/my-scholarships' , component: ProfileViewComponent, data: {title: 'Atila - My Scholarships'}},
  { path: 'blog' , component: BlogsListComponent, data: {title: 'Atila - Blogs List'}},
  { path: 'blog/add' , component: BlogPostCreateComponent, data: {title: 'Create Blog Post - Atila'}},
  { path: 'blog/edit/:id' , component: BlogPostCreateComponent, data: {title: 'Edit Blog Post - Atila'}},
  { path: 'blog/:username' , component: ProfileViewComponent, data: {title: 'Profile - Atila'}},
  { path: 'blog/:username/:slug' , component: BlogPostDetailComponent, data: {title: 'Blog Post - Atila'}},
  { path: 'forum' , component: ForumsListComponent, data: {title: 'Forums - Atila'}},
  { path: 'forum/:slug' , component: ForumDetailComponent, data: {title: 'Forums - Atila'}},
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
