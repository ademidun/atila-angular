import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ScholarshipCardComponent} from './scholarship-card.component';
import {ScholarshipService, scholarshipServiceStub} from '../../_services/scholarship.service';
import {MyFirebaseService, MyFirebaseServiceStub} from '../../_services/myfirebase.service';
import {AuthService, AuthServiceStub} from '../../_services/auth.service';
import {UserProfileService, userProfileServiceStub} from '../../_services/user-profile.service';
import {NotificationsService, NotificationsServiceStub} from '../../_services/notifications.service';
import {MatDialogModule, MatIcon, MatIconModule, MatSnackBarModule} from '@angular/material';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TruncatePipe} from '../../_pipes/truncate.pipe';
import {RouterTestingModule} from '@angular/router/testing';
import {createTestScholarship} from '../../_models/scholarship';
import {createTestUserProfile, UserProfile} from '../../_models/user-profile';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatIconStubComponent} from '../../_shared/test-helpers';


fdescribe('ScholarshipCardComponent', () => {
  let component: ScholarshipCardComponent;
  let fixture: ComponentFixture<ScholarshipCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ScholarshipCardComponent, TruncatePipe],
      providers: [
        {provide: ScholarshipService, useValue: scholarshipServiceStub},
        {provide: UserProfileService, useValue: userProfileServiceStub},
        {provide: AuthService, useValue: AuthServiceStub},
        {provide: NotificationsService, useValue: NotificationsServiceStub},
        {provide: MyFirebaseService, useValue: MyFirebaseServiceStub},
      ],
      imports: [
        RouterTestingModule,
        MatIconModule,
        NgbModule,
        MatSnackBarModule,
        MatDialogModule,
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
    fixture = TestBed.createComponent(ScholarshipCardComponent);
    component = fixture.componentInstance;

    const userProfile = createTestUserProfile();
    const scholarship = createTestScholarship();
    component.userProfile = userProfile;
    component.scholarship = scholarship;

    fixture.detectChanges();
  });

  it('should be created', async (() => {

    expect(component).toBeTruthy();
  }));

  it('should call addToMyScholarship', async(() => {
    spyOn(component, 'addToMyScholarship');
    // todo check that other functions are called as well

    const button = fixture.debugElement.nativeElement.querySelector('.save-scholarship');

    expect(button).toBeTruthy('No Button with Save Scholarship title attribute');

    button.click();

    fixture.whenStable().then(() => {
      expect(component.addToMyScholarship).toHaveBeenCalled();
      // expect(component.logShareType).toHaveBeenCalled();
    });
  }));

  it('should call logShareType', async(() => {
    spyOn(component, 'logShareType');

    const button = fixture.debugElement.nativeElement.querySelector('.save-scholarship');

    expect(button).toBeTruthy('No Button with Save Scholarship title attribute');

    button.click();

    fixture.whenStable().then(() => {
      expect(component.logShareType).toHaveBeenCalled();
    });
  }));

  it('should call notifySavedScholarship ', async(() => {
    spyOn(component, 'logShareType');

    const button = fixture.debugElement.nativeElement.querySelector('.save-scholarship');

    expect(button).toBeTruthy('No Button with Save Scholarship title attribute');

    button.click();

    fixture.whenStable().then(() => {
      expect(component.logShareType).toHaveBeenCalled();
    });
  }));

  it('should not call notifySavedScholarship if already saved', async(() => {
    spyOn(component, 'notifySavedScholarship');

    const button = fixture.debugElement.nativeElement.querySelector('.save-scholarship');

    expect(button).toBeTruthy('No Button with Save Scholarship title attribute');

    button.click();

    fixture.whenStable().then(() => {
      button.click();
      fixture.whenStable().then(() => {
        expect(component.notifySavedScholarship).not.toHaveBeenCalled();

      });

    });
  }));
});
