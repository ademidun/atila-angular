import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ScholarshipsListComponent} from './scholarships-list.component';
import {UserProfileService, UserProfileServiceStub} from '../../_services/user-profile.service';
import {MyFirebaseService, MyFirebaseServiceStub} from '../../_services/myfirebase.service';
import {
  MatDialogModule,
  MatFormFieldModule,
  MatIcon,
  MatIconModule, MatInputModule,
  MatOptionModule,
  MatProgressBarModule,
  MatSelectModule,
  MatSnackBarModule
} from '@angular/material';
import {NotificationsService, NotificationsServiceStub} from '../../_services/notifications.service';
import {AuthService, AuthServiceStub} from '../../_services/auth.service';
import {ScholarshipService, ScholarshipServiceStub} from '../../_services/scholarship.service';
import {RouterTestingModule} from '@angular/router/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatIconStubComponent, ScholarshipCardStubComponent, TypeaheadStubComponent} from '../../_shared/test-helpers';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {APP_BASE_HREF} from '@angular/common';
import {SeoService, seoServiceStub} from '../../_services/seo.service';
import {Router} from '@angular/router';
import {createTestUserProfile} from '../../_models/user-profile';
import {createTestScholarship} from '../../_models/scholarship';

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
        {provide: ScholarshipService, useValue: ScholarshipServiceStub},
        {provide: UserProfileService, useValue: UserProfileServiceStub},
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
        MatInputModule,
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

    component.userProfile = createTestUserProfile();
    component.contentFetched = true;
    component.form_data = {};
    component.scholarships = [createTestScholarship('Due Tomorrow Foundation'),
      createTestScholarship('Due Next Week Fund'),
      createTestScholarship('Upper Echelon Lil Baby')];
    fixture.detectChanges();
  });

  it('should be created', () => {

    expect(component).toBeTruthy();
  });

  it('should NOT show incomplete information when not logged in', () => {

    const compiled = fixture.debugElement.nativeElement;
    component.isLoggedIn = null;

    const incompleteProfileDiv = compiled.querySelector('.scholarships-list');
    expect(incompleteProfileDiv.textContent.toLowerCase()).toContain('your account is incomplete');
  });

  it('should NOT show incomplete information when major is null', () => {

    const compiled = fixture.debugElement.nativeElement;
    component.userProfile.major = null;

    const incompleteProfileDiv = compiled.querySelector('.scholarships-list');
    expect(incompleteProfileDiv.textContent.toLowerCase()).toContain('your account is incomplete');
  });

  it('should show incomplete information when data is missing', () => {

    component.isLoggedIn = true;
    const compiled = fixture.debugElement.nativeElement;

    const incompleteProfileDiv = compiled.querySelector('.scholarships-list');

    expect(incompleteProfileDiv.textContent.toLowerCase()).toContain('your account is incomplete',
      "Expect 'your account is incomplete' text to be in div when profile is complete");
  });
});
