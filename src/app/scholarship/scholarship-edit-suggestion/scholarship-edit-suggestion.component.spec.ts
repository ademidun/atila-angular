import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScholarshipEditSuggestionComponent } from './scholarship-edit-suggestion.component';

describe('ScholarshipEditSuggestionComponent', () => {
  let component: ScholarshipEditSuggestionComponent;
  let fixture: ComponentFixture<ScholarshipEditSuggestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScholarshipEditSuggestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScholarshipEditSuggestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
