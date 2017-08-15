import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PreviewComponent } from "../preview/preview.component";

const routes: Routes = [
  { path: '' , component: PreviewComponent, data: {title: 'Welcome to Grantstarter - Preview'}},
  { path: 'preview' , component: PreviewComponent, data: {title: 'Welcome to Grantstarter - Preview'}},
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }