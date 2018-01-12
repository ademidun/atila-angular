import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicQuestionGeneralComponent } from './dynamic-question-general.component';

describe('DynamicQuestionGeneralComponent', () => {
  let component: DynamicQuestionGeneralComponent;
  let fixture: ComponentFixture<DynamicQuestionGeneralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicQuestionGeneralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicQuestionGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
