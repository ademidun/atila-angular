import {TestBed} from '@angular/core/testing';

import {NotificationsService} from './notifications.service';
import {AngularFireDatabase} from 'angularfire2/database';
import {SwPush} from '@angular/service-worker';
import {DatePipe} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {createTestScholarship, Scholarship} from '../_models/scholarship';
import {createTestUserProfile, UserProfile} from '../_models/user-profile';

let userProfile: UserProfile;
let scholarship: Scholarship;
let service: NotificationsService;

fdescribe('NotificationsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificationsService,
        {provide: AngularFireDatabase, useValue: AngularFireDatabase},
        {provide: DatePipe, useValue: DatePipe},
        {provide: SwPush, useValue: SwPush},
        {provide: HttpClient, useValue: HttpClient},
      ],
    });

    service = TestBed.get(NotificationsService);
    userProfile = createTestUserProfile();
    scholarship = createTestScholarship();
    service.datePipe = new DatePipe('en-US');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a notification with the scholarship name and deadline',
    () => {

        const deadline = service.datePipe.transform(scholarship.deadline, 'fullDate');
        const createdNotification = service.createScholarshipNotificationMessage(userProfile, scholarship);

        expect(createdNotification.title).toContain(scholarship.name, 'Scholarship name not in notification');
        expect(createdNotification.body).toContain(deadline, 'Scholarship deadline not in notification');
      });

  it('#customizeNotificationMessage() should create an email notification with the userProfile and scholarship details',
    () => {
        service.DEFAULT_NOTIFICATION_CONFIG.notificationType = 'email';
        const notificationOptions = {
          'email': [1, 7], // each array element represents the number of days before the scholarship deadline a notification should be sent
        };

        const createdNotifications = service.customizeNotificationMessage(notificationOptions,scholarship, userProfile);

        expect(createdNotifications.length).toBe(notificationOptions.email.length,
          'Notifications created should equal number of notificationOptions');

        const createdNotification = createdNotifications[0];

        expect(createdNotification.title).toContain(userProfile.first_name, 'User name not in notification title');
        expect(createdNotification.body).toContain(userProfile.first_name, 'User name not in notification body');
        expect(createdNotification.html).toContain(userProfile.first_name, 'User name not in notification html');

        const deadline = service.datePipe.transform(scholarship.deadline, 'fullDate');

        expect(createdNotification.title).toContain(scholarship.name, 'Scholarship name not in notification');
        expect(createdNotification.html).toContain(deadline, 'Scholarship deadline not in notification');

      });
  it('#customizeNotificationMessage() should contain correct correct due in N days',
    () => {
        service.DEFAULT_NOTIFICATION_CONFIG.notificationType = 'email';
        const notificationOptions = {
          'email': [1, 7], // each array element represents the number of days before the scholarship deadline a notification should be sent
        };

        const createdNotifications = service.customizeNotificationMessage(notificationOptions,scholarship, userProfile);

        expect(createdNotifications.length).toBe(notificationOptions.email.length,
          'Notifications created should equal number of notificationOptions');

        expect(createdNotifications[0].title).not.toContain(`${notificationOptions.email[1]} day`,
          'scholarship due in 1 day should noy say 7 days');
        expect(createdNotifications[0].title).toContain(`${notificationOptions.email[0]} day`,
          'scholarship due in 1 day should say 1 days');
        expect(createdNotifications[1].title).toContain(`${notificationOptions.email[1]} day`,
          'scholarship due in 7 day should say 7 days');

      });
});
