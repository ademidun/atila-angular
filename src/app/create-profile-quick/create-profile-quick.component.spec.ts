import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProfileQuickComponent } from './create-profile-quick.component';

describe('CreateProfileQuickComponent', () => {
  let component: CreateProfileQuickComponent;
  let fixture: ComponentFixture<CreateProfileQuickComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateProfileQuickComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProfileQuickComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
