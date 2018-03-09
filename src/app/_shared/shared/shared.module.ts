import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import {SafeHtmlPipe} from '../../_pipes/safe-html.pipe';
import {TitleCasePipe} from '../../_pipes/title-case.pipe';
import {GooglePlaceDirective} from '../../_directives/google-place.directive';
import {SafeResourcePipe} from '../../_pipes/safe-resource.pipe';
import {TruncatePipe} from '../../_pipes/truncate.pipe';
import {CommentComponent} from '../../comment/comment.component';
import {CommentService} from '../../_services/comment.service';
import {MyFirebaseService} from '../../_services/myfirebase.service';
import {AuthService} from '../../_services/auth.service';
import {MaterializeModule} from 'angular2-materialize';
import {HttpClientModule} from '@angular/common/http';
import {
  MatAutocompleteModule, MatButtonModule, MatCardModule, MatCheckboxModule, MatDialogModule, MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatSnackBarModule
} from '@angular/material';
import {HttpModule} from '@angular/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppRoutingModule} from '../../app-routing/app-routing.module';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import {environment} from '../../../environments/environment';
import {AngularFireModule} from 'angularfire2';
import {RouterModule} from '@angular/router';
import {BrowserModule} from '@angular/platform-browser';

@NgModule({
  imports: [
    CommonModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HttpModule,
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
    MaterializeModule,
  ],
  declarations: [
    SafeHtmlPipe,
    TitleCasePipe,
    TruncatePipe,
    SafeResourcePipe,
    GooglePlaceDirective,
    CommentComponent],
  exports: [
    SafeHtmlPipe,
    TitleCasePipe,
    TruncatePipe,
    SafeResourcePipe,
    GooglePlaceDirective,
    CommentComponent,
    RouterModule],
  providers: [
    AuthService,
    MyFirebaseService,
    CommentService,
  ],
})
export class SharedModule { }
