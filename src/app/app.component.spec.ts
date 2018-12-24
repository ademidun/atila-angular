import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AppComponent} from './app.component';
import {FooterComponent} from './footer/footer.component';
import {RouterTestingModule} from '@angular/router/testing';
import {
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatProgressBarModule,
  MatSnackBarModule
} from '@angular/material';
import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {SwUpdate} from '@angular/service-worker';
import {UserProfileService, UserProfileServiceMock} from './_services/user-profile.service';
import {MyFirebaseService, MyFirebaseServiceStub} from './_services/myfirebase.service';
import {AuthService, AuthServiceStub} from './_services/auth.service';
import {environment} from '../environments/environment';

// https://stackoverflow.com/a/43941412/

@Component({
  selector: 'app-navbar',
  template: '<p>Mock Navbar Component</p>'
})
class NavbarMockComponent {
}

fdescribe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let SwUpdateMock: Partial<SwUpdate> = {isEnabled: false};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        NavbarMockComponent,
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
        {provide: UserProfileService, useValue: UserProfileServiceMock},
        {provide: MyFirebaseService, useValue: MyFirebaseServiceStub},
        {provide: AuthService, useValue: AuthServiceStub},
      ]
      // schemas: [NO_ERRORS_SCHEMA]
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

      console.log('environment.name', environment.name);

      switch (environment.name) {
        case 'dev':
          expect(environment.apiUrl).toEqual('http://127.0.0.1:8000/api/');
          break;
        case 'staging':
          console.log('This is Staging');
          expect(environment.apiUrl).toEqual('https://atila-7-staging.herokuapp.com/api/');
          break;
        case 'prod':
          console.log('This is dev');
          expect(environment.apiUrl).toEqual('https://atila-7.herokuapp.com/api/');
          break;
        default:
          console.log('No Environment found');
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



