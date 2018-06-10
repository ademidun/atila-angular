import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {EssayCreateComponent} from './essay-create/essay-create.component';
import {EssayDetailComponent} from './essay-detail/essay-detail.component';
import {EssayListComponent} from './essay-list/essay-list.component';

const routes: Routes = [
  { path: 'add' , component: EssayCreateComponent, data: {title: 'Create Essay - Atila'}},
  { path: 'edit/:id' , component: EssayCreateComponent, data: {title: 'Edit Essay - Atila'}},
  { path: ':username/:slug' , component: EssayDetailComponent, data: {title: 'Essay - Atila'}},
  { path: '' , component: EssayListComponent, data: {title: 'Essays List - Atila'}},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EssayRoutingModule { }
