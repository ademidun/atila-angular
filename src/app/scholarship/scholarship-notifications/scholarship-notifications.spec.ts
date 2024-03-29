/*
import {createTestUserProfile, UserProfile} from '../../_models/user-profile';
import {createTestScholarship, Scholarship} from '../../_models/scholarship';
import {notifySavedScholarship} from './scholarship-notifications'
import {UserProfileService, userProfileServiceStub} from '../../_services/user-profile.service';
import {NotificationsService, NotificationsServiceStub} from '../../_services/notifications.service';
import {async, TestBed} from '@angular/core/testing';
import {NotificationDialogComponent} from '../../notification-dialog/notification-dialog.component';
import {MatIconStubComponent} from '../../_shared/test-helpers';
import {MatDialogModule, MatIcon, MatIconModule, MatSnackBarModule} from '@angular/material';
import {ScholarshipCardComponent} from '../scholarship-card/scholarship-card.component';
import {TruncatePipe} from '../../_pipes/truncate.pipe';

describe('scholarship-notification', () => {

  const userProfileServiceStub = userProfileServiceStub;
  const NotificationsServiceStub = NotificationsServiceStub;

  const ScholarshipNotification = {
    userProfile: createTestUserProfile(),
    scholarship: createTestScholarship(),
    userProfileService: userProfileServiceStub,
    notificationsService: NotificationsServiceStub,
    dialogComponent: {},
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ScholarshipCardComponent, TruncatePipe],
      providers: [
        {provide: UserProfileService, useValue: userProfileServiceStub},
        {provide: NotificationsService, useValue: NotificationsServiceStub},
      ],
      imports: [
        MatSnackBarModule,
        MatDialogModule,
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

    ScholarshipNotification.dialogComponent = TestBed.createComponent(NotificationDialogComponent);

  }));

  it('#notifySavedScholarship(): Should make sure not sent if user is not admin or testing', function() {

    ScholarshipNotification.userProfile.is_atila_admin = false;
    ScholarshipNotification.userProfile.is_debug_mode = false;

    const result = notifySavedScholarship(ScholarshipNotification.scholarship, ScholarshipNotification.userProfile,
      ScholarshipNotification.userProfileService, ScholarshipNotification.notificationsService, ScholarshipNotification.dialogComponent);

    expect(result).toBeFalsy('notifySavedScholarship Result should be false for non admin or test_mode user');

  });
});

*/
