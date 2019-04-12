import {TestBed, inject} from '@angular/core/testing';

import {NotificationsService} from './notifications.service';
import {ScholarshipService, ScholarshipServiceStub} from './scholarship.service';
import {AngularFireDatabase} from 'angularfire2/database';
import {SwPush} from '@angular/service-worker';
import {DatePipe} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {createTestScholarship} from '../_models/scholarship';
import {UserProfile} from '../_models/user-profile';

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
fdescribe('NotificationsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificationsService,
        {provide: AngularFireDatabase, useValue: AngularFireDatabase},
        {provide: DatePipe, useValue: DatePipe},
        {provide: SwPush, useValue: SwPush},
        {provide: HttpClient, useValue: HttpClient},
      ]
    });
  });

  it('should be created', inject([NotificationsService], (service: NotificationsService) => {
    expect(service).toBeTruthy();
  }));

  it('should create a notification with the scholarship name and deadline',
    inject([NotificationsService, DatePipe],
      (service: NotificationsService, datePipe: DatePipe) => {
        const userProfile = new UserProfile();
        const scholarship = createTestScholarship();
        const datePipe2 = new DatePipe('en-US');
        // 'getting Datepipe error', 'TypeError: datePipe.transform is not a function'
        console.log(datePipe);
        console.log(datePipe2);

        const deadline = datePipe2.transform(scholarship.deadline, 'fullDate');
        const createdNotification = service.createScholarshipNotificationMessage(userProfile, scholarship);

        expect(createdNotification.title).toContain(scholarship.name, 'Scholarship name not in notification');
        expect(createdNotification.body).toContain(deadline, 'Scholarship deadline not in notification');
      }));
});
