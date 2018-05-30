import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EssayListComponent } from './essay-list.component';

describe('EssayListComponent', () => {
  let component: EssayListComponent;
  let fixture: ComponentFixture<EssayListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EssayListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EssayListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
