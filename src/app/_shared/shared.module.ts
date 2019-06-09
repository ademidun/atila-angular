import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SafeHtmlPipe} from '../_pipes/safe-html.pipe';
import {TitleCasePipe} from '../_pipes/title-case.pipe';
import {GooglePlaceDirective} from '../_directives/google-place.directive';
import {SafeResourcePipe} from '../_pipes/safe-resource.pipe';
import {TruncatePipe} from '../_pipes/truncate.pipe';
import {CommentComponent} from '../comment/comment.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
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
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import {environment} from '../../environments/environment';
import {AngularFireModule} from 'angularfire2';
import {RouterModule} from '@angular/router';
import {TokenInterceptor} from '../_services/token.interceptor';
import {UnAuthorizedInterceptor} from '../_services/unauthorized.interceptor';
import {TypeaheadComponent} from './typeahead/typeahead.component';

import {NgbTypeaheadModule} from '@ng-bootstrap/ng-bootstrap';
import {AddQuestionModalComponent} from '../add-question-modal/add-question-modal.component';
import {SubscriberDialogComponent} from '../subscriber-dialog/subscriber-dialog.component';
import {EditProfileModalComponent} from '../edit-profile-modal/edit-profile-modal.component';
import {TableLayoutModule} from '../table-layout/table-layout.module';
import {CardGenericComponent} from '../card-generic/card-generic.component';
import { ShareItemComponent } from './share-item/share-item.component';
import {AtilaPointsPromptDialogComponent} from '../atila-points-prompt-dialog/atila-points-prompt-dialog.component';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {ScholarshipCardComponent} from '../scholarship/scholarship-card/scholarship-card.component';
@NgModule({
  imports: [
    CommonModule,
    NgbModule,
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
    TableLayoutModule,
    AngularFireAuthModule
  ],
  declarations: [
    SafeHtmlPipe,
    TitleCasePipe,
    TruncatePipe,
    SafeResourcePipe,
    GooglePlaceDirective,
    CommentComponent,
    TypeaheadComponent,
    AddQuestionModalComponent,
    SubscriberDialogComponent,
    EditProfileModalComponent,
    CardGenericComponent,
    AtilaPointsPromptDialogComponent,
    ScholarshipCardComponent,
    ShareItemComponent],
  exports: [
    SafeHtmlPipe,
    TitleCasePipe,
    TruncatePipe,
    SafeResourcePipe,
    GooglePlaceDirective,
    CommentComponent,
    RouterModule,
    NgbTypeaheadModule,
    AngularFirestoreModule,
    TypeaheadComponent,
    AddQuestionModalComponent,
    SubscriberDialogComponent,
    EditProfileModalComponent,
    TableLayoutModule,
    CardGenericComponent,
    ShareItemComponent,
    AtilaPointsPromptDialogComponent,
    MatIconModule,
    ScholarshipCardComponent,
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
