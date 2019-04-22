import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BlogPostCreateComponent} from './blog-post-create/blog-post-create.component';
import {BlogsListComponent} from './blogs-list/blogs-list.component';
import {BlogPostDetailComponent} from './blog-post-detail/blog-post-detail.component';

const routes: Routes = [
  { path: '' , component: BlogsListComponent, data: {title: 'Blogs List - Atila'}},
  { path: 'add' , component: BlogPostCreateComponent, data: {title: 'Create Blog Post - Atila'}},
  { path: 'edit/:id' , component: BlogPostCreateComponent, data: {title: 'Edit Blog Post - Atila'}},
  {path: ':username', redirectTo: '/profile/:username', pathMatch: 'full'},
  { path: ':username/:slug' , component: BlogPostDetailComponent, data: {title: 'Blog Post - Atila'}},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogRoutingModule { }
