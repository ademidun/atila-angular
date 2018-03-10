import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ForumRoutingModule} from './forum-routing.module';
import {ForumDetailComponent} from './forum-detail/forum-detail.component';
import {ForumsListComponent} from './forums-list/forums-list.component';
import {MaterializeModule} from 'angular2-materialize';
import "materialize-css";
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
import {GoogleAnalyticsEventsService} from '../_services/google-analytics-events.service';
import {ForumService} from '../_services/forum.service';
import {CommentService} from '../_services/comment.service';
import {MyFirebaseService} from '../_services/myfirebase.service';
import {AuthService} from '../_services/auth.service';
import {UserProfileService} from '../_services/user-profile.service';
import {SharedModule} from '../_shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ForumRoutingModule,
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
    ForumDetailComponent,
    ForumsListComponent]
})
export class ForumModule {
}
