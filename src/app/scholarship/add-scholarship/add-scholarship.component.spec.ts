import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddScholarshipComponent } from './add-scholarship.component';
import {
  MatDialogModule,
  MatFormFieldModule,
  MatIcon,
  MatIconModule, MatInputModule,
  MatOptionModule,
  MatProgressBarModule, MatSelectModule,
  MatSnackBarModule
} from '@angular/material';
import {NotificationsService, NotificationsServiceStub} from '../../_services/notifications.service';
import {ScholarshipsListComponent} from '../scholarships-list/scholarships-list.component';
import {AuthService, AuthServiceStub} from '../../_services/auth.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {
  MatIconStubComponent,
  ScholarshipCardStubComponent,
  TableLayoutStubComponent,
  TypeaheadStubComponent
} from '../../_shared/test-helpers';
import {MyFirebaseService, MyFirebaseServiceStub} from '../../_services/myfirebase.service';
import {UserProfileService, UserProfileServiceStub} from '../../_services/user-profile.service';
import {ScholarshipService, ScholarshipServiceStub} from '../../_services/scholarship.service';
import {FormsModule} from '@angular/forms';
import {APP_BASE_HREF} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {SafeHtmlPipe} from '../../_pipes/safe-html.pipe';

fdescribe('AddScholarshipComponent', () => {
  let component: AddScholarshipComponent;
  let fixture: ComponentFixture<AddScholarshipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AddScholarshipComponent,
        ScholarshipCardStubComponent,
        TypeaheadStubComponent,
        TableLayoutStubComponent,
      SafeHtmlPipe],
      providers: [
        {provide: ScholarshipService, useValue: ScholarshipServiceStub},
        {provide: UserProfileService, useValue: UserProfileServiceStub},
        {provide: AuthService, useValue: AuthServiceStub},
        {provide: NotificationsService, useValue: NotificationsServiceStub},
        {provide: MyFirebaseService, useValue: MyFirebaseServiceStub},
        {provide: APP_BASE_HREF, useValue : '/' }
      ],
      imports: [
        // todo: instead of importing all these modules manually, can we
        // just import shared module?
        RouterTestingModule,
        MatIconModule,
        MatSnackBarModule,
        MatOptionModule,
        MatSelectModule,
        MatInputModule,
        MatFormFieldModule,
        MatDialogModule,
        FormsModule,
        MatProgressBarModule,
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
          declarations: [MatIconStubComponent],
          exports: [MatIconStubComponent]
        }
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddScholarshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
