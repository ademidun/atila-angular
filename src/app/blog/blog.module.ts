import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {BlogRoutingModule} from './blog-routing.module';
import {BlogPostDetailComponent} from './blog-post-detail/blog-post-detail.component';
import {BlogsListComponent} from './blogs-list/blogs-list.component';
import {BlogPostCreateComponent} from './blog-post-create/blog-post-create.component';

import {MaterializeModule} from 'angular2-materialize';
import 'materialize-css';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatSnackBarModule
} from '@angular/material';

import {HttpClientModule} from '@angular/common/http';

import {AngularFireModule} from 'angularfire2';
import {environment} from '../../environments/environment';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import {SharedModule} from '../_shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    BlogRoutingModule,
    NgbModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatIconModule,
    MatSnackBarModule,
    MatSelectModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatCardModule,
    HttpClientModule,
    CommonModule,
    MaterializeModule,
  ],

  providers: [],
  declarations: [
    BlogPostCreateComponent,
    BlogsListComponent,
    BlogPostDetailComponent]
})
export class BlogModule {
}
