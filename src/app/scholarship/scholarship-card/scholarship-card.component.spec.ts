import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScholarshipCardComponent } from './scholarship-card.component';
import {ScholarshipService, ScholarshipServiceStub} from '../../_services/scholarship.service';
import {MyFirebaseService, MyFirebaseServiceStub} from '../../_services/myfirebase.service';
import {AuthService, AuthServiceStub} from '../../_services/auth.service';
import {UserProfileService, UserProfileServiceMock} from '../../_services/user-profile.service';
import {NotificationsService, NotificationsServiceStub} from '../../_services/notifications.service';
import {MatDialogModule, MatIconModule, MatSnackBarModule} from '@angular/material';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TruncatePipe} from '../../_pipes/truncate.pipe';
import {RouterTestingModule} from '@angular/router/testing';

fdescribe('ScholarshipCardComponent', () => {
  let component: ScholarshipCardComponent;
  let fixture: ComponentFixture<ScholarshipCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScholarshipCardComponent,  TruncatePipe],
      providers: [
        {provide: ScholarshipService, useValue: ScholarshipServiceStub },
        {provide: UserProfileService, useValue: UserProfileServiceMock },
        {provide: AuthService, useValue: AuthServiceStub },
        {provide: NotificationsService, useValue: NotificationsServiceStub },
        {provide: MyFirebaseService, useValue: MyFirebaseServiceStub },
      ],
      imports: [
        RouterTestingModule,
        MatIconModule,
        NgbModule,
        MatSnackBarModule,
        MatDialogModule,
        NgbModule.forRoot(),
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScholarshipCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
