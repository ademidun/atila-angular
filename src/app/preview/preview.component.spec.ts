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
import {ScholarshipService, ScholarshipServiceStub} from '../_services/scholarship.service';
import {MyFirebaseService, MyFirebaseServiceStub} from '../_services/myfirebase.service';
import {AuthService, AuthServiceStub} from '../_services/auth.service';
import {
  GoogleAnalyticsEventsService,
  GoogleAnalyticsEventsServiceStub
} from '../_services/google-analytics-events.service';
import {RouterTestingModule} from '@angular/router/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatIconStubComponent} from '../_shared/test-helpers';
import {CardGenericComponent} from '../card-generic/card-generic.component';
import {By} from 'protractor';

fdescribe('PreviewComponent', () => {
  let component: PreviewComponent;
  let fixture: ComponentFixture<PreviewComponent>;



  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PreviewComponent,
        TypeaheadComponent,
        ShareItemComponent,
        CardGenericComponent,
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
        {provide: ScholarshipService, useValue: ScholarshipServiceStub },
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

  it('should render title in a h1 tag', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Find Your Scholarships');
  }));

  it('should have all gif images stored in PreviewComponent.lazyLoadGifIds', () => {

    const compiled = fixture.debugElement.nativeElement;
    const lazyLoadedGifComponents = compiled.querySelectorAll('[id$="-gif"]'); // find all elements with id attribute ending in "-gif"

    for (let i = 0; i < lazyLoadedGifComponents.length; i++) {
      expect(component.lazyLoadGifIds).toContain('#'+lazyLoadedGifComponents[i].id)
    }

  });

  it('should have the gif ids for each gif image', () => {

    const lazyLoadGifIds = ['#registration-gif', '#create-profile-gif', '#view-scholarships-gif',
      '#scholarship-notifications-gif','#view-essays-gif', '#application-automation-gif'];

    for (let i = 0; i < lazyLoadGifIds.length; i++) {

      const compiled = fixture.debugElement.nativeElement;
      const lazyLoadedGifComponent = compiled.querySelector(lazyLoadGifIds[i]);

      expect(lazyLoadedGifComponent).toBeTruthy()
    }

  });


  /*
  it('should have each gif image existing in file directory', done => {

    const lazyLoadGifIds = ['#registration-gif', '#create-profile-gif', '#view-scholarships-gif',
      '#scholarship-notifications-gif','#view-essays-gif', '#application-automation-gif'];


    // wait for a short time to make sure image is requested
    setTimeout(() => {
      for (let i = 0; i < lazyLoadGifIds.length; i++) {

        const compiled = fixture.debugElement.nativeElement;
        const lazyLoadedGifImage = compiled.querySelector(lazyLoadGifIds[i]);

        expect(lazyLoadedGifImage.onerror).toBeNull('Expected onerror for this image to be null');

      }
      done();
    }, 2000);


  });

  */

});
