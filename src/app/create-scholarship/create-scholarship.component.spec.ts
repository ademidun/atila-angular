import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateScholarshipComponent } from './create-scholarship.component';

describe('CreateScholarshipComponent', () => {
  let component: CreateScholarshipComponent;
  let fixture: ComponentFixture<CreateScholarshipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateScholarshipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateScholarshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
