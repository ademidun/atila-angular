import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PreviewComponent } from "../preview/preview.component";
import { ScholarshipsListComponent } from "../scholarships-list/scholarships-list.component";

const routes: Routes = [
  { path: '' , component: PreviewComponent, data: {title: 'Dante'}},
  { path: 'preview' , component: PreviewComponent, data: {title: 'Dante - Preview'}},
  { path: 'scholarships-list' , component: ScholarshipsListComponent, data: {title: 'Dante -Scholarships List'}},
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }