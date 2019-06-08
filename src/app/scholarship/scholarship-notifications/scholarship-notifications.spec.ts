import {createTestUserProfile} from '../../_models/user-profile';
import {createTestScholarship} from '../../_models/scholarship';
import {notifySavedScholarship} from './scholarship-notifications'
import {userProfileServiceStub} from '../../_services/user-profile.service';
import {NotificationsServiceStub} from '../../_services/notifications.service';
import {TestBed} from '@angular/core/testing';
import {NotificationDialogComponent} from '../../notification-dialog/notification-dialog.component';

fdescribe('notifySavedScholarship', function() {
  it('#notifySavedScholarship(): Should make sure not sent if user is not admin or testing', function() {


    const userProfile = createTestUserProfile();
    userProfile.is_debug_mode = false;
    userProfile.is_atila_admin = false;
    const scholarship = createTestScholarship();
    const dialogComponent = TestBed.createComponent(NotificationDialogComponent);

    const result = notifySavedScholarship(scholarship, userProfile, userProfileServiceStub, NotificationsServiceStub, dialogComponent);

    expect(result).toBeFalsy('notifySavedScholarship Result should be false for non admin or test_mode user');

  });
});
