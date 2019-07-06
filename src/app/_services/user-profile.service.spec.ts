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
import {createTestEssay} from '../_models/essay';
import {createTestBlogPost} from '../_models/blog-post';

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



  it('#transformViewData() should return coorect viewData', inject([UserProfileService], (service: UserProfileService) => {

    const userProfile = createTestUserProfile();
    const scholarship = createTestScholarship();
    const essay = createTestEssay();

    const transformedViewData = service.transformViewData(userProfile, scholarship);

    expect(transformedViewData).toBeTruthy();
    expect(transformedViewData).toContain(scholarship.name);

    transformedViewData = service.transformViewData(essay, scholarship);

    expect(transformedViewData.item_type).toMatch('essay');
    expect(transformedViewData.is_owner).toBeFalsy();


    const blog = createTestBlogPost();

    blog.user.id = userProfile.user;
    expect(transformedViewData.is_owner).toBeTruthy();


  }));
});
