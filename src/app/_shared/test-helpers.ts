import {Component, Input, NgModule} from '@angular/core';
import {DynamicFormQuestionComponent} from '../dynamic-form-question/dynamic-form-question.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {
  MatAutocompleteModule, MatButtonModule, MatCardModule, MatCheckboxModule, MatDialogModule,
  MatFormFieldModule, MatIconModule, MatIconRegistry,
  MatInputModule,
  MatMenuModule, MatProgressBarModule,
  MatProgressSpinnerModule, MatSelectModule, MatSlideToggleModule,
  MatSnackBarModule
} from '@angular/material';
import {TokenInterceptor} from '../_services/token.interceptor';
import {AppComponent} from '../app.component';
import {QuestionControlService} from '../_services/question-control.service';
import {SearchComponent} from '../search/search.component';
import {ForumService} from '../_services/forum.service';
import {environment} from '../../environments/environment';
import {QuestionService} from '../_services/question.service';
import {ScholarshipService} from '../_services/scholarship.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule, DatePipe} from '@angular/common';
import {MaterializeModule} from 'angular2-materialize';
import {EditProfileModalComponent} from '../edit-profile-modal/edit-profile-modal.component';
import {RegisterComponent} from '../register/register.component';
import {TermsConditionsComponent} from '../terms-conditions/terms-conditions.component';
import {MyFirebaseService} from '../_services/myfirebase.service';
import {AuthGuard} from '../_guards/auth.guard';
import {MessagesComponent} from '../messages/messages.component';
import {FroalaEditorModule, FroalaViewModule} from 'angular-froala-wysiwyg';
import {UserProfileService} from '../_services/user-profile.service';
import {ApplicationService} from '../_services/application.service';
import {GoogleAnalyticsEventsService} from '../_services/google-analytics-events.service';
import {AuthService} from '../_services/auth.service';
import {FooterComponent} from '../footer/footer.component';
import {AngularFireModule} from 'angularfire2';
import {HttpModule} from '@angular/http';
import {SubscriberDialogComponent} from '../subscriber-dialog/subscriber-dialog.component';
import {SeoService} from '../_services/seo.service';
import {NotificationsService} from '../_services/notifications.service';
import {DynamicQuestionGeneralComponent} from '../dynamic-question-general/dynamic-question-general.component';
import {SearchService} from '../_services/search.service';
import {TeamComponent} from '../team/team.component';
import {BrowserModule, DomSanitizer} from '@angular/platform-browser';
import {AppRoutingModule} from '../app-routing/app-routing.module';
import {SharedModule} from './shared.module';
import {MessagingService} from '../_services/messaging.service';
import {ServiceWorkerModule} from '@angular/service-worker';
import {LoginComponent} from '../login/login.component';
import {DynamicFormComponent} from '../dynamic-form/dynamic-form.component';
import {MarkdownModule} from 'ngx-markdown';
import {BlogPostService} from '../_services/blog-post.service';
import {UnAuthorizedInterceptor} from '../_services/unauthorized.interceptor';
import {VerifyComponent} from '../verify/verify.component';
import {AddQuestionModalComponent} from '../add-question-modal/add-question-modal.component';
import {PreviewComponent} from '../preview/preview.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import {AppDetailComponent} from '../app-detail/app-detail.component';
import {NavbarComponent} from '../navbar/navbar.component';
import {CommentService} from '../_services/comment.service';
import {HtmlEditorComponent} from '../html-editor/html-editor.component';
import {GeneralInfoComponent} from '../general-info/general-info.component';
import {AtilaPointsPromptDialogComponent} from '../atila-points-prompt-dialog/atila-points-prompt-dialog.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';


@Component({
  selector: 'mat-icon',
  template: '<span></span>'
})
export class MockMatIconComponent {
  @Input() svgIcon: any;
  @Input() fontSet: any;
  @Input() fontIcon: any;

  selector: 'mat-icon';
  template: '<span></span>'
}

@NgModule({
  declarations: [
    MockMatIconComponent,
  ],
})
export class MockTestingnModule {
  constructor() {
  }
}
