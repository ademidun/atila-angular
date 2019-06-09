import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import { SearchComponent } from './search.component';
import {UserProfileService, UserProfileServiceStub} from '../_services/user-profile.service';
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
import {ActivatedRoute} from '@angular/router';
import {mockSearchResponseIveyBusinessSchool} from '../_models/_tests/mock-search-response-ivey-business-school';

import {ScholarshipCardComponent} from '../scholarship/scholarship-card/scholarship-card.component';
import {ScholarshipService, ScholarshipServiceStub} from '../_services/scholarship.service';
import {NotificationsService, NotificationsServiceStub} from '../_services/notifications.service';

fdescribe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  const iveyBusinessSchoolSearchString = 'ivey business school';

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [
        SearchComponent,
        CardGenericComponent,
        ScholarshipCardComponent,
        TypeaheadStubComponent,
        TruncatePipe],
      providers: [
        {provide: ScholarshipService, useValue: ScholarshipServiceStub},
        {provide: UserProfileService, useValue: UserProfileServiceStub},
        {provide: NotificationsService, useValue: NotificationsServiceStub},
        {provide: AuthService, useValue: AuthServiceStub},
        {provide: MyFirebaseService, useValue: MyFirebaseServiceStub},
        {provide: SeoService, useValue: seoServiceStub},
        {provide: SearchService, useValue: SearchServiceStub},
        {provide: APP_BASE_HREF, useValue : '/' },
        { provide: ActivatedRoute,
          useValue: {
            snapshot: {
              // queryParams: Observable.of({q: iveyBusinessSchoolSearchString})
              queryParams: {q: iveyBusinessSchoolSearchString}
            }
          } },
      ],
      imports: [
        // todo: instead of importing all these modules manually, can we
        // just import shared module?
        RouterTestingModule.withRoutes([]),
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
    component.searchResults = mockSearchResponseIveyBusinessSchool;

    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('should call Search', async(() => {

    spyOn(component, 'search');

    expect(component.search).toHaveBeenCalled();

  }));

  it('should render title', async(() => {

    component.query = iveyBusinessSchoolSearchString;
    fixture.detectChanges();

    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain(iveyBusinessSchoolSearchString);

  }));

  it('should render scholarship results', async(() => {

    const compiled = fixture.debugElement.nativeElement;

    const subStrings = iveyBusinessSchoolSearchString.split(' ');
    for (let i = 0; i < subStrings.length; i++) {
      expect(compiled.querySelector('.scholarship-results').textContent.toLowerCase()).toContain(subStrings[i]);
    }

  }));

  it('should render blog results', async(() => {

    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.blog-results').textContent.toLowerCase()).toContain(iveyBusinessSchoolSearchString);


  }));

  it('should render essay results', async(() => {

    fixture.detectChanges();

    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.essay-results').textContent.toLowerCase()).toContain(iveyBusinessSchoolSearchString);

  }));

  it('should NOT render forum results', async(() => {

    const compiled = fixture.debugElement.nativeElement;

    const resultSectionHeadings = compiled.querySelectorAll('h4'); // find all elements with id attribute ending in "-gif"

    for (let i = 0; i < resultSectionHeadings.length; i++) {
      expect(resultSectionHeadings[i].textContent.toLowerCase()).not.toContain('forum');
    }


  }));

  it('A Save Scholarship button should exist', async(() => {

    const button = fixture.debugElement.nativeElement.querySelector('[title="Save Scholarship"]');

    expect(button).toBeTruthy('No Button with Save Scholarship title attribute');

  }));

});
