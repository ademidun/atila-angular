import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScholarshipsListComponent } from './scholarships-list.component';
import {UserProfileService, UserProfileServiceMock} from '../../_services/user-profile.service';
import {MyFirebaseService, MyFirebaseServiceStub} from '../../_services/myfirebase.service';
import {MatDialogModule, MatIcon, MatIconModule, MatSnackBarModule} from '@angular/material';
import {NotificationsService, NotificationsServiceStub} from '../../_services/notifications.service';
import {AuthService, AuthServiceStub} from '../../_services/auth.service';
import {ScholarshipService, ScholarshipServiceStub} from '../../_services/scholarship.service';
import {RouterTestingModule} from '@angular/router/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MockMatIconComponent} from '../../_shared/test-helpers';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

fdescribe('ScholarshipsListComponent', () => {
  let component: ScholarshipsListComponent;
  let fixture: ComponentFixture<ScholarshipsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScholarshipsListComponent ],
      providers: [
        {provide: ScholarshipService, useValue: ScholarshipServiceStub},
        {provide: UserProfileService, useValue: UserProfileServiceMock},
        {provide: AuthService, useValue: AuthServiceStub},
        {provide: NotificationsService, useValue: NotificationsServiceStub},
        {provide: MyFirebaseService, useValue: MyFirebaseServiceStub},
      ],
      imports: [
        RouterTestingModule,
        MatIconModule,
        MatSnackBarModule,
        MatDialogModule,
        NgbModule.forRoot(),
        BrowserAnimationsModule
      ]
    })
    // todo make override module into a helper method for all configureTestingModule
      .overrideModule(MatIconModule, {
        remove: {
          declarations: [MatIcon],
          exports: [MatIcon]
        },
        add: {
          declarations: [MockMatIconComponent],
          exports: [MockMatIconComponent]
        }
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScholarshipsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
