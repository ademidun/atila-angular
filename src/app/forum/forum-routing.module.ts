import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ForumDetailComponent} from './forum-detail/forum-detail.component';
import {ForumsListComponent} from './forums-list/forums-list.component';

const routes: Routes = [

  { path: '' , component: ForumsListComponent, data: {title: 'Forums - Atila'}},
  { path: ':slug' , component: ForumDetailComponent, data: {title: 'Forums - Atila'}},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ForumRoutingModule { }
