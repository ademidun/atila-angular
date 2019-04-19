import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewComponent } from './preview.component';
import {AppModule} from '../app.module';
import {TypeaheadComponent} from '../_shared/typeahead/typeahead.component';
import {
  MatDialogModule,
  MatFormFieldModule, MatIcon, MatIconModule, MatInputModule, MatOptionModule, MatSelectModule,
  MatSlideToggleModule
} from '@angular/material';
import {RouterModule} from '@angular/router';
import {NgbModule, NgbPopoverConfig, NgbPopoverModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {ShareItemComponent} from '../_shared/share-item/share-item.component';
import {TruncatePipe} from '../_pipes/truncate.pipe';
import {ScholarshipService, scholarshipServiceStub} from '../_services/scholarship.service';
import {MyFirebaseService, MyFirebaseServiceStub} from '../_services/myfirebase.service';
import {AuthService, AuthServiceStub} from '../_services/auth.service';
import {
  GoogleAnalyticsEventsService,
  GoogleAnalyticsEventsServiceStub
} from '../_services/google-analytics-events.service';
import {RouterTestingModule} from '@angular/router/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatIconStubComponent} from '../_shared/test-helpers';

fdescribe('PreviewComponent', () => {
  let component: PreviewComponent;
  let fixture: ComponentFixture<PreviewComponent>;



  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PreviewComponent,
        TypeaheadComponent,
        ShareItemComponent,
        TruncatePipe,
      ],
      imports: [
        MatFormFieldModule,
        MatOptionModule,
        MatSlideToggleModule,
        RouterTestingModule,
        NgbModule.forRoot(),
        FormsModule,
        MatSelectModule,
        MatIconModule,
        MatDialogModule,
        MatInputModule,
        BrowserAnimationsModule,
      ],
      providers: [
        {provide: ScholarshipService, useValue: scholarshipServiceStub },
        {provide: MyFirebaseService, useValue: MyFirebaseServiceStub },
        {provide: AuthService, useValue: AuthServiceStub },
        {provide: GoogleAnalyticsEventsService, useValue: GoogleAnalyticsEventsServiceStub },
      ]
    })
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
    fixture = TestBed.createComponent(PreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
