import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SafeHtmlPipe} from '../_pipes/safe-html.pipe';
import {TitleCasePipe} from '../_pipes/title-case.pipe';
import {GooglePlaceDirective} from '../_directives/google-place.directive';
import {SafeResourcePipe} from '../_pipes/safe-resource.pipe';
import {TruncatePipe} from '../_pipes/truncate.pipe';
import {CommentComponent} from '../comment/comment.component';
import {MaterializeModule} from 'angular2-materialize';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
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
import {HttpModule} from '@angular/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import {environment} from '../../environments/environment';
import {AngularFireModule} from 'angularfire2';
import {RouterModule} from '@angular/router';
import {BrowserModule} from '@angular/platform-browser';
import {TokenInterceptor} from '../_services/token.interceptor';
import {UnAuthorizedInterceptor} from '../_services/unauthorized.interceptor';
import {TypeaheadComponent} from './typeahead/typeahead.component';

import {NgbTypeaheadModule} from '@ng-bootstrap/ng-bootstrap';
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
    NgbTypeaheadModule,
  ],
  declarations: [
    SafeHtmlPipe,
    TitleCasePipe,
    TruncatePipe,
    SafeResourcePipe,
    GooglePlaceDirective,
    CommentComponent,
    TypeaheadComponent,],
  exports: [
    SafeHtmlPipe,
    TitleCasePipe,
    TruncatePipe,
    SafeResourcePipe,
    GooglePlaceDirective,
    CommentComponent,
    RouterModule,
    NgbTypeaheadModule,
    TypeaheadComponent,
    ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UnAuthorizedInterceptor,
      multi: true,
    },
  ],
})
export class SharedModule {
}
