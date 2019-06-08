import {NotificationDialogComponent} from '../../notification-dialog/notification-dialog.component';
import {UserProfile} from '../../_models/user-profile';
import {Scholarship} from '../../_models/scholarship';

// todo: refactor to remove duplication in scholarships list
export function notifySavedScholarship(scholarship: Scholarship, userProfile: UserProfile,
                                       userProfileService, notificationService, notificationDialog) {
  // todo: add test for notifySaved Scholarship
  // Ask user for permission to notify them if:
  // 1.We have not asked them before
  // OR
  // 2.user has not allowed us to notify them
  // AND
  // 3.user has not told us to stop asking them

  if (!userProfile.is_debug_mode && !userProfile.is_atila_admin) {
    // todo: remove before merge-master allow non admin or debug users to test notifications
    return;
  }

  if (!userProfile.metadata['haveAskedIfNotifySavedScholarship'] ||
    !userProfile.metadata['allowNotifySavedScholarships']
    && !userProfile.metadata['dontAskAgainNotifySavedScholarship']
    || userProfile.is_atila_admin) { // todo: remove before merge-master-branch
    // Ask user if we can notify them when their saved scholarships are due
    const dialogRef = notificationDialog.open(NotificationDialogComponent, {
      width: '350px',
      height: '350px',
      data: {
        notificationText: 'Remind me before my saved scholarships are due',
        userProfile: userProfile
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      userProfile.metadata.haveAskedIfNotifySavedScholarship = !!result;
      if (result) {
        userProfile.metadata.dontAskAgainNotifySavedScholarship = result.dontAskAgain;
        userProfile.metadata.allowNotifySavedScholarships = result.notifyUser;
      }

      userProfileService.updateHelper(userProfile).subscribe(userProfileResponse => {
        if (userProfile.metadata['allowNotifySavedScholarships']) {
          createScholarshipNotificationsHandler(scholarship, userProfile, notificationService);
        }
      });

    });

  } else if (userProfile.metadata['allowNotifySavedScholarships']) {
    createScholarshipNotificationsHandler(scholarship, userProfile, notificationService);
  }

}

function createScholarshipNotificationsHandler(scholarship, userProfile, notificationService) {
  notificationService.createScholarshipNotifications(userProfile, scholarship)
    .then(observableResult => {
        observableResult.subscribe(
          res => {
            console.log({res})
          },
          err => {
            console.log({err})
          },
          () => {
            console.log('finished')
          })
      }
    )
}
