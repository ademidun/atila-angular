import {async, ComponentFixture, TestBed, tick} from '@angular/core/testing';

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
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import {mockSearchResponseIveyBusinessSchool} from '../_models/_tests/mock-search-response-ivey-business-school';
import {genericItemTransform} from '../_shared/utils';

fdescribe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  const iveyBusinessSchoolSearchString = 'ivey business school';

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

  it('should call Search', async(() => {

    const router = TestBed.get(Router);
    console.log({ router });

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

    console.log('component.searchResults', component.searchResults);

    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.scholarship-results').textContent.toLowerCase()).toContain(iveyBusinessSchoolSearchString);

  }));

  it('should render blog results', async(() => {

    console.log('component.searchResults', component.searchResults);

    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.blog-results').textContent.toLowerCase()).toContain(iveyBusinessSchoolSearchString);


  }));

  it('should render essay results', async(() => {

    console.log('component.searchResults', component.searchResults);

    component.essays = component.searchResults.essays.map(item => {
      return genericItemTransform(item);
    });

    fixture.detectChanges();

    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.essay-results').textContent.toLowerCase()).toContain(iveyBusinessSchoolSearchString);


  }));

  it('should NOT render forum results', async(() => {

    console.log('component.searchResults', component.searchResults);

    const compiled = fixture.debugElement.nativeElement;

    const resultSectionHeadings = compiled.querySelectorAll('h4'); // find all elements with id attribute ending in "-gif"

    for (let i = 0; i < resultSectionHeadings.length; i++) {
      expect(resultSectionHeadings.textContent.toLowerCase()).not.toContain('Forum');
    }


  }));
});
