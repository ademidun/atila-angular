import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditScholarshipComponent } from './edit-scholarship.component';

describe('EditScholarshipComponent', () => {
  let component: EditScholarshipComponent;
  let fixture: ComponentFixture<EditScholarshipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditScholarshipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditScholarshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
