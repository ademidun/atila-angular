import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriberDialogComponent } from './subscriber-dialog.component';

describe('SubscriberDialogComponent', () => {
  let component: SubscriberDialogComponent;
  let fixture: ComponentFixture<SubscriberDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscriberDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriberDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
