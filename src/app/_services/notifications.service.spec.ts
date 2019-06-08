import {TestBed, inject} from '@angular/core/testing';

import {NotificationsService} from './notifications.service';
import {ScholarshipService, scholarshipServiceStub} from './scholarship.service';
import {AngularFireDatabase} from 'angularfire2/database';
import {SwPush} from '@angular/service-worker';
import {DatePipe} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {createTestScholarship} from '../_models/scholarship';
import {createTestUserProfile, UserProfile} from '../_models/user-profile';
import {ScholarshipCardComponent} from '../scholarship/scholarship-card/scholarship-card.component';

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
    service.userProfile = createTestUserProfile();
    service.scholarship = createTestScholarship();
    service.datePipe = new DatePipe('en-US');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a notification with the scholarship name and deadline',
    () => {

        const deadline = service.datePipe.transform(service.scholarship.deadline, 'fullDate');
        const createdNotification = service.createScholarshipNotificationMessage(service.userProfile, service.scholarship);

        expect(createdNotification.title).toContain(service.scholarship.name, 'Scholarship name not in notification');
        expect(createdNotification.body).toContain(deadline, 'Scholarship deadline not in notification');
      });

  it('should create a notification with the userProfile name and deadline',
    () => {

        const createdNotification = service.createScholarshipNotificationMessage(service.userProfile, service.scholarship);

        expect(createdNotification.title).toContain(service.first_name, 'User name not in notification title');
        expect(createdNotification.body).toContain(service.first_name, 'User name not in notification body');
      });

  it('should create an email notification with the userProfile name and deadline',
    () => {
        service.DEFAULT_NOTIFICATION_CONFIG.notificationType = 'email';
        const notificationOptions = {
          'email': [1], // each array element represents the number of days before the scholarship deadline a notification should be sent
        };

        const createdNotifications = service.customizeNotificationMessage(notificationOptions, service.userProfile, service.scholarship);
        const createdNotification = createdNotifications[0];

        expect(createdNotification.title).toContain(service.userProfile.first_name, 'User name not in notification title');
        expect(createdNotification.body).toContain(service.userProfile.first_name, 'User name not in notification body');
        expect(createdNotification.html).toContain(service.userProfile.first_name, 'User name not in notification html');
      });
});
