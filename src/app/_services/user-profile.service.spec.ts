import {TestBed, inject} from '@angular/core/testing';

import { UserProfileService } from './user-profile.service';
import {HttpClient} from '@angular/common/http';
import {MyFirebaseService, MyFirebaseServiceStub} from './myfirebase.service';
import {AuthService, AuthServiceStub} from './auth.service';
import {
  MatDialogModule,
  MatSnackBarModule
} from '@angular/material';
import {DynamodbService, DynamodbServiceStub} from './dynamodb.service';
import {createTestUserProfile} from '../_models/user-profile';
import {createTestScholarship} from '../_models/scholarship';
import {NotificationsService} from './notifications.service';

fdescribe('UserProfileService', () => {
  let service: UserProfileService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserProfileService,
        {provide: HttpClient, useValue: HttpClient},
        {provide: AuthService, useValue: AuthServiceStub },
        {provide: MyFirebaseService, useValue: MyFirebaseServiceStub },
        {provide: DynamodbService, useValue: DynamodbServiceStub },
        ],
      imports: [
        // todo: instead of importing all these modules manually, can we
        // just import shared module?
        MatSnackBarModule,
        MatDialogModule,
      ]
    });

    service = TestBed.get(NotificationsService);
  });

  it('should be created', inject([UserProfileService], (service: UserProfileService) => {
    expect(service).toBeTruthy();
  }));



  it('#transformViewData()', inject([UserProfileService], (service: UserProfileService) => {

    const userProfile = createTestUserProfile();
    const scholarship = createTestScholarship();

    expect(service.transformViewData(userProfile, scholarship)).toBeTruthy();
  }));
});
