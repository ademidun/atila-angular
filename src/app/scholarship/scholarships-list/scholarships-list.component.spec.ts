import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ScholarshipsListComponent} from './scholarships-list.component';
import {UserProfileService, userProfileServiceStub} from '../../_services/user-profile.service';
import {MyFirebaseService, MyFirebaseServiceStub} from '../../_services/myfirebase.service';
import {
  MatDialogModule,
  MatFormFieldModule,
  MatIcon,
  MatIconModule,
  MatOptionModule,
  MatProgressBarModule,
  MatSelectModule,
  MatSnackBarModule
} from '@angular/material';
import {NotificationsService, NotificationsServiceStub} from '../../_services/notifications.service';
import {AuthService, AuthServiceStub} from '../../_services/auth.service';
import {ScholarshipService, scholarshipServiceStub} from '../../_services/scholarship.service';
import {RouterTestingModule} from '@angular/router/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatIconStubComponent, ScholarshipCardStubComponent, TypeaheadStubComponent} from '../../_shared/test-helpers';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {APP_BASE_HREF} from '@angular/common';
import {SeoService, seoServiceStub} from '../../_services/seo.service';
import {Router} from '@angular/router';

fdescribe('ScholarshipsListComponent', () => {
  let component: ScholarshipsListComponent;
  let fixture: ComponentFixture<ScholarshipsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ScholarshipsListComponent,
        ScholarshipCardStubComponent,
        TypeaheadStubComponent],
      providers: [
        {provide: ScholarshipService, useValue: scholarshipServiceStub},
        {provide: UserProfileService, useValue: userProfileServiceStub},
        {provide: AuthService, useValue: AuthServiceStub},
        {provide: NotificationsService, useValue: NotificationsServiceStub},
        {provide: MyFirebaseService, useValue: MyFirebaseServiceStub},
        {provide: SeoService, useValue: seoServiceStub},
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
    fixture = TestBed.createComponent(ScholarshipsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {

    expect(component).toBeTruthy();
  });
});
