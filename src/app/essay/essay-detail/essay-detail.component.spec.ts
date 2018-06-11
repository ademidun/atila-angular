import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EssayDetailComponent } from './essay-detail.component';

describe('EssayDetailComponent', () => {
  let component: EssayDetailComponent;
  let fixture: ComponentFixture<EssayDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EssayDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EssayDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
