import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AppComponent} from './app.component';
import {FooterComponent} from './footer/footer.component';
import {RouterTestingModule} from '@angular/router/testing';
import {
  MatFormFieldModule,
  MatIcon,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatProgressBarModule,
  MatSnackBarModule
} from '@angular/material';
import {FormsModule} from '@angular/forms';
import {SwPush, SwUpdate} from '@angular/service-worker';
import {UserProfileService, userProfileServiceStub} from './_services/user-profile.service';
import {MyFirebaseService, MyFirebaseServiceStub} from './_services/myfirebase.service';
import {AuthService, AuthServiceStub} from './_services/auth.service';
import {environment} from '../environments/environment';
import {NavbarStubComponent, MatIconStubComponent} from './_shared/test-helpers';

// https://stackoverflow.com/a/43941412/

fdescribe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let SwUpdateMock: Partial<SwUpdate> = {isEnabled: false};
  let SwPushMock: Partial<SwPush> = {isEnabled: false};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        NavbarStubComponent,
        FooterComponent
      ],
      imports: [
        RouterTestingModule,
        MatProgressBarModule,
        MatMenuModule,
        MatIconModule,
        FormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatSnackBarModule,
      ],
      providers: [
        {provide: SwUpdate, useValue: SwUpdateMock},
        {provide: SwPush, useValue: SwPushMock},
        {provide: UserProfileService, useValue: userProfileServiceStub},
        {provide: MyFirebaseService, useValue: MyFirebaseServiceStub},
        {provide: AuthService, useValue: AuthServiceStub},
      ]
      // schemas: [NO_ERRORS_SCHEMA]
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
      }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should use the correct environment.apiUrl based on the current environment', () => {

    switch (environment.name) {
      case 'dev':
        expect(environment.apiUrl).toEqual('http://127.0.0.1:8000/api/');
        break;
      case 'staging':
        expect(environment.apiUrl).toEqual('https://atila-7-staging.herokuapp.com/api/');
        break;
      case 'prod':
        expect(environment.apiUrl).toEqual('https://atila-7.herokuapp.com/api/');
        break;
      default:
        expect(environment.name).toBeTruthy('Environment variable should have a name');
    }

  });

  // it(`should have as title 'app'`, async(() => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   const app = fixture.debugElement.componentInstance;
  //   expect(app.title).toEqual('app');
  // }));
  //
  // it('should render title in a h1 tag', async(() => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();
  //   const compiled = fixture.debugElement.nativeElement;
  //   expect(compiled.querySelector('h1').textContent).toContain('Welcome to app!!');
  // }));
});



