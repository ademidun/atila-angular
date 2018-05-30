import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {EssayCreateComponent} from './essay-create/essay-create.component';
import {EssayDetailComponent} from './essay-detail/essay-detail.component';
import {EssayListComponent} from './essay-list/essay-list.component';

const routes: Routes = [
  { path: 'add' , component: EssayCreateComponent, data: {title: 'Create Blog Post - Atila'}},
  { path: 'edit/:id' , component: EssayCreateComponent, data: {title: 'Edit Blog Post - Atila'}},
  { path: ':username/:slug' , component: EssayDetailComponent, data: {title: 'Blog Post - Atila'}},
  { path: '' , component: EssayListComponent, data: {title: 'Blogs List - Atila'}},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EssayRoutingModule { }
