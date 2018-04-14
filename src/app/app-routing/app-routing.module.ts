import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PreviewComponent} from "../preview/preview.component";
import {ScholarshipsListComponent} from "../scholarship/scholarships-list/scholarships-list.component";
import {LoginComponent} from "../login/login.component";
import {RegisterComponent} from '../register/register.component'

import {AppDetailComponent} from '../app-detail/app-detail.component';

import {MessagesComponent} from '../messages/messages.component';

import {AuthGuard} from '../_guards/auth.guard';
import {TeamComponent} from '../team/team.component';
import {VerifyComponent} from '../verify/verify.component';
import {TermsConditionsComponent} from '../terms-conditions/terms-conditions.component';
import {SearchComponent} from '../search/search.component';
import {GeneralInfoComponent} from '../general-info/general-info.component';

const routes: Routes = [
  {
    path: '',
    component: PreviewComponent,
    data: {title: 'Atila | Scholarships Automated. The Right Way'},
    canActivate: [AuthGuard]
  },
  {path: 'applications/demo', component: AppDetailComponent, data: {title: 'Automation Demo'}},
  {
    path: 'applications/:id',
    component: AppDetailComponent,
    data: {title: 'Application Detail'},
    canActivate: [AuthGuard]
  },
  //todo redirect scholarships/** to scholarship/**
  // { path: 'scholarships' , component: ScholarshipsListComponent, data: {title: 'Atila | Scholarships Automated. The Right Way'}},
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
  { path: 'scholarships',   redirectTo: '/scholarship', pathMatch: 'prefix' },
  {
    path: 'scholarship',
    loadChildren: '../scholarship/scholarship.module#ScholarshipModule'
  },
  {path: 'search', component: SearchComponent, data: {title: 'Atila - Search'}},
  {path: 'messages', component: MessagesComponent, data: {title: 'My Messages - Atila'}},
  {path: 'preview', component: PreviewComponent, data: {title: 'Atila - Preview'}},
  {path: 'login', component: LoginComponent, data: {title: 'Login - Atila'}},
  {path: 'register', component: RegisterComponent, data: {title: 'Atila - Register'}},
  {path: 'verify', component: VerifyComponent, data: {title: 'Verify - Atila'}},
  {path: 'team', component: TeamComponent, data: {title: 'Team - Atila'}},
  {path: 'contact', component: GeneralInfoComponent, data: {title: 'Team - Atila'}},
  {path: 'sitemap', component: GeneralInfoComponent, data: {title: 'SiteMap - Atila'}},
  {path: 'terms-and-conditions', component: TermsConditionsComponent, data: {title: 'Terms and Conditions - Atila'}},
  {path: '**', component: PreviewComponent, data: {title: 'Atila | Scholarships Automated. The Right Way'}}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
