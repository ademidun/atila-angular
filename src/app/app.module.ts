import {BrowserModule, DomSanitizer} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {AppComponent} from './app.component';
import {NavbarComponent} from './navbar/navbar.component';
import {PreviewComponent} from './preview/preview.component';
import {FooterComponent} from './footer/footer.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TableLayoutModule} from './table-layout/table-layout.module';

import {AppRoutingModule} from './app-routing/app-routing.module';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatIconRegistry,
  MatInputModule,
  MatMenuModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatSnackBarModule
} from '@angular/material';
import {ScholarshipsListComponent} from './scholarships-list/scholarships-list.component';
import {ScholarshipCardComponent} from './scholarship-card/scholarship-card.component';
import {ScholarshipService} from './_services/scholarship.service';
import {UserProfileService} from './_services/user-profile.service';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {EditProfileComponent} from './edit-profile/edit-profile.component';
import {AuthService} from './_services/auth.service';
import {ScholarshipDetailComponent} from './scholarship-detail/scholarship-detail.component';
import {AddScholarshipComponent} from './add-scholarship/add-scholarship.component';
import {ApplicationService} from './_services/application.service';
import {QuestionControlService} from './_services/question-control.service';
import {DynamicFormComponent} from './dynamic-form/dynamic-form.component';
import {QuestionService} from './_services/question.service';
import {DynamicFormQuestionComponent} from './dynamic-form-question/dynamic-form-question.component';
import {AddQuestionModalComponent} from './add-question-modal/add-question-modal.component';
import {AppDetailComponent} from './app-detail/app-detail.component';
import {MyFirebaseService} from './_services/myfirebase.service';
import {CommentService} from './_services/comment.service';
import {ProfileViewComponent} from './profile-view/profile-view.component';
import {MessagesComponent} from './messages/messages.component';
import {MessagingService} from './_services/messaging.service';
import {ForumService} from './_services/forum.service';
import {HtmlEditorComponent} from './html-editor/html-editor.component';
import {BlogPostService} from './_services/blog-post.service';
import {AuthGuard} from './_guards/auth.guard';

import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {TokenInterceptor} from './_services/token.interceptor';

import {UnAuthorizedInterceptor} from './_services/unauthorized.interceptor';
import {AngularFireModule} from 'angularfire2';
import {environment} from '../environments/environment';
import {GoogleAnalyticsEventsService} from './_services/google-analytics-events.service';
import {TeamComponent} from './team/team.component';
import {VerifyComponent} from './verify/verify.component';
import {SubscriberDialogComponent} from './subscriber-dialog/subscriber-dialog.component';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import {TermsConditionsComponent} from './terms-conditions/terms-conditions.component';
import {SearchComponent} from './search/search.component';
import {SearchService} from './_services/search.service';
import {DynamicQuestionGeneralComponent} from './dynamic-question-general/dynamic-question-general.component';
import {CommonModule} from '@angular/common';
import {MaterializeModule} from 'angular2-materialize';
import "materialize-css";
import {CardGenericComponent} from './card-generic/card-generic.component';
import {MarkdownModule} from 'ngx-markdown';
import {TypeaheadComponent} from './_shared/typeahead/typeahead.component';
import {EditProfileModalComponent} from './edit-profile-modal/edit-profile-modal.component';
import {FroalaEditorModule, FroalaViewModule} from 'angular-froala-wysiwyg';
import {SeoService} from './_services/seo.service';
import {SharedModule} from './_shared/shared.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    PreviewComponent,
    FooterComponent,
    ScholarshipsListComponent,
    ScholarshipCardComponent,
    LoginComponent,
    RegisterComponent,
    EditProfileComponent,
    ScholarshipDetailComponent,
    AddScholarshipComponent,
    DynamicFormComponent,
    DynamicFormQuestionComponent,
    AddQuestionModalComponent,
    AppDetailComponent,
    ProfileViewComponent,
    MessagesComponent,
    HtmlEditorComponent,
    TeamComponent,
    VerifyComponent,
    SubscriberDialogComponent,
    TermsConditionsComponent,
    SearchComponent,
    DynamicQuestionGeneralComponent,
    CardGenericComponent,
    TypeaheadComponent,
    EditProfileModalComponent
  ],
  imports: [
    NgbModule.forRoot(),
    SharedModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
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
    TableLayoutModule,
    HttpClientModule,
    CommonModule,
    MaterializeModule,
    BrowserModule,
    BrowserAnimationsModule,
    MarkdownModule.forRoot(),
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot()
  ],
  providers: [
    ScholarshipService,
    UserProfileService,
    AuthService,
    ApplicationService,
    QuestionControlService,
    QuestionService,
    MyFirebaseService,
    CommentService,
    MessagingService,
    ForumService,
    BlogPostService,
    AuthGuard,
    GoogleAnalyticsEventsService,
    SearchService,
    SeoService,
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
  bootstrap: [AppComponent],
  entryComponents: [
    AddQuestionModalComponent,
    SubscriberDialogComponent,
    EditProfileModalComponent,
  ]
})
export class AppModule {
  constructor(matIconRegistry: MatIconRegistry, domSanitizer: DomSanitizer) {
    matIconRegistry.addSvgIconSet(domSanitizer.bypassSecurityTrustResourceUrl('../assets/mdi.svg')); // Or whatever path you placed mdi.svg at
  }
}
