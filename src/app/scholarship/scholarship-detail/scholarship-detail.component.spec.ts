import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScholarshipDetailComponent } from './scholarship-detail.component';
import {
  MatCardContent,
  MatCardModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIcon,
  MatIconModule,
  MatOptionModule,
  MatProgressBarModule, MatProgressSpinnerModule, MatSelectModule,
  MatSnackBarModule, MatSpinner
} from '@angular/material';
import {NotificationsService, NotificationsServiceStub} from '../../_services/notifications.service';
import {AddScholarshipComponent} from '../add-scholarship/add-scholarship.component';
import {AuthService, AuthServiceStub} from '../../_services/auth.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {
  MatIconStubComponent,
  ScholarshipCardStubComponent,
  ShareItemStubComponent,
  TypeaheadStubComponent
} from '../../_shared/test-helpers';
import {MyFirebaseService, MyFirebaseServiceStub} from '../../_services/myfirebase.service';
import {UserProfileService, UserProfileServiceStub} from '../../_services/user-profile.service';
import {ScholarshipService, ScholarshipServiceStub} from '../../_services/scholarship.service';
import {FormsModule} from '@angular/forms';
import {APP_BASE_HREF} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {SafeHtmlPipe} from '../../_pipes/safe-html.pipe';
import {CommentComponent} from '../../comment/comment.component';
import {CardGenericComponent} from '../../card-generic/card-generic.component';
import {TruncatePipe} from '../../_pipes/truncate.pipe';
import {ApplicationService, ApplicationServiceStub} from '../../_services/application.service';
import {CommentService, CommentServiceStub} from '../../_services/comment.service';
import {SeoService, seoServiceStub} from '../../_services/seo.service';
import {SearchService, SearchServiceStub} from '../../_services/search.service';

fdescribe('ScholarshipDetailComponent', () => {
  let component: ScholarshipDetailComponent;
  let fixture: ComponentFixture<ScholarshipDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ScholarshipDetailComponent,
        TypeaheadStubComponent,
        SafeHtmlPipe,
        ShareItemStubComponent,
        CardGenericComponent,
        TruncatePipe,
      CommentComponent],
      providers: [
        {provide: ScholarshipService, useValue: ScholarshipServiceStub},
        {provide: UserProfileService, useValue: UserProfileServiceStub},
        {provide: ApplicationService, useValue: ApplicationServiceStub},
        {provide: CommentService, useValue: CommentServiceStub},
        {provide: CommentService, useValue: CommentServiceStub},
        {provide: SeoService, useValue: seoServiceStub},
        {provide: AuthService, useValue: AuthServiceStub},
        {provide: NotificationsService, useValue: NotificationsServiceStub},
        {provide: SearchService, useValue: SearchServiceStub},
        {provide: MyFirebaseService, useValue: MyFirebaseServiceStub},
        {provide: APP_BASE_HREF, useValue : '/' }
      ],
      imports: [
        // todo: instead of importing all these modules manually, can we
        // just import shared module?
        RouterTestingModule,
        MatIconModule,
        MatSnackBarModule,
        MatOptionModule,
        MatSelectModule,
        MatFormFieldModule,
        MatDialogModule,
        MatCardModule,
        MatProgressSpinnerModule,
        FormsModule,
        MatProgressBarModule,
        NgbModule.forRoot(),
        BrowserAnimationsModule
      ]
    })
    // todo make override module into a helper method for all configureTestingModule
      .overrideModule(MatIconModule, {
        remove: {
          declarations: [MatIcon],
          exports: [MatIcon]
        },
        add: {
          declarations: [MatIconStubComponent],
          exports: [MatIconStubComponent]
        }
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScholarshipDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
