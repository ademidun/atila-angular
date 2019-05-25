import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchComponent } from './search.component';
import {UserProfileService, userProfileServiceStub} from '../_services/user-profile.service';
import {MyFirebaseService, MyFirebaseServiceStub} from '../_services/myfirebase.service';
import {AuthService, AuthServiceStub} from '../_services/auth.service';
import {MatIconStubComponent, TypeaheadStubComponent} from '../_shared/test-helpers';
import {SeoService, seoServiceStub} from '../_services/seo.service';
import {
  MatDialogModule,
  MatFormFieldModule,
  MatIcon,
  MatIconModule,
  MatOptionModule,
  MatProgressBarModule, MatSelectModule,
  MatSnackBarModule
} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {FormsModule} from '@angular/forms';
import {APP_BASE_HREF} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {CardGenericComponent} from '../card-generic/card-generic.component';
import {TruncatePipe} from '../_pipes/truncate.pipe';
import {SearchService, SearchServiceStub} from '../_services/search.service';

fdescribe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SearchComponent,
        CardGenericComponent,
        TypeaheadStubComponent,
        TruncatePipe],
      providers: [
        {provide: UserProfileService, useValue: userProfileServiceStub},
        {provide: AuthService, useValue: AuthServiceStub},
        {provide: MyFirebaseService, useValue: MyFirebaseServiceStub},
        {provide: SeoService, useValue: seoServiceStub},
        {provide: SearchService, useValue: SearchServiceStub},
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
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

