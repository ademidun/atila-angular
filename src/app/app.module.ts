import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { PreviewComponent } from './preview/preview.component';
import { FooterComponent } from './footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

    
import { AppRoutingModule } from './app-routing/app-routing.module';
import { MaterialModule, MdDialogModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ScholarshipsListComponent } from './scholarships-list/scholarships-list.component';
import { ScholarshipCardComponent } from './scholarship-card/scholarship-card.component';
import { ScholarshipService } from './_services/scholarship.service';
import { UserProfileService } from './_services/user-profile.service';

import { TruncatePipe } from './_pipes/truncate.pipe';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CreateProfileComponent } from './create-profile/create-profile.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { AuthService } from './_services/auth.service';
import { ScholarshipDetailComponent } from './scholarship-detail/scholarship-detail.component';
import { ApplicationService } from './_services/application.service';
import { CreateScholarshipComponent } from './create-scholarship/create-scholarship.component';
import { EditScholarshipComponent } from './edit-scholarship/edit-scholarship.component';
import { QuestionControlService } from './_services/question-control.service';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { QuestionService } from './_services/question.service';
import { DynamicFormQuestionComponent } from './dynamic-form-question/dynamic-form-question.component';
import { AddQuestionModalComponent } from './add-question-modal/add-question-modal.component';
import { AppDetailComponent } from './app-detail/app-detail.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    PreviewComponent,
    FooterComponent,
    ScholarshipsListComponent,
    ScholarshipCardComponent,
    TruncatePipe,
    LoginComponent,
    RegisterComponent,
    CreateProfileComponent,
    EditProfileComponent,
    ScholarshipDetailComponent,
    CreateScholarshipComponent,
    EditScholarshipComponent,
    DynamicFormComponent,
    DynamicFormQuestionComponent,
    AddQuestionModalComponent,
    AppDetailComponent
  ],
  imports: [
    NgbModule.forRoot(),
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    BrowserAnimationsModule,
    HttpModule,
    MdDialogModule,
  ],
  providers: [ScholarshipService, UserProfileService, AuthService, ApplicationService, QuestionControlService, QuestionService],
  bootstrap: [AppComponent],
  entryComponents: [
    AddQuestionModalComponent,
  ]
})
export class AppModule { }
