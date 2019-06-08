import {TestBed, inject} from '@angular/core/testing';

import {NotificationsService} from './notifications.service';
import {ScholarshipService, scholarshipServiceStub} from './scholarship.service';
import {AngularFireDatabase} from 'angularfire2/database';
import {SwPush} from '@angular/service-worker';
import {DatePipe} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {createTestScholarship} from '../_models/scholarship';
import {UserProfile} from '../_models/user-profile';

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
// const datePipe = new DatePipe();
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
  });

  it('should be created', inject([NotificationsService], (service: NotificationsService) => {
    expect(service).toBeTruthy();
  }));

  it('should create a notification with the scholarship name and deadline',
    inject([NotificationsService],
      (service: NotificationsService) => {
        service.datePipe = new DatePipe('en-US');
        const userProfile = new UserProfile();
        const scholarship = createTestScholarship();

        const deadline = service.datePipe.transform(scholarship.deadline, 'fullDate');
        const createdNotification = service.createScholarshipNotificationMessage(userProfile, scholarship);

        expect(createdNotification.title).toContain(scholarship.name, 'Scholarship name not in notification');
        expect(createdNotification.body).toContain(deadline, 'Scholarship deadline not in notification');
      }));

  it('should create a notification with the scholarship name and deadline',
    inject([NotificationsService],
      (service: NotificationsService) => {
        service.datePipe = new DatePipe('en-US');
        const userProfile = new UserProfile();
        const scholarship = createTestScholarship();

        const createdNotification = service.createScholarshipNotificationMessage(userProfile, scholarship);

        expect(createdNotification.title).toContain(userProfile.first_name, 'User name not in notification title');
        expect(createdNotification.body).toContain(userProfile.first_name, 'User name not in notification body');
      }));
});
