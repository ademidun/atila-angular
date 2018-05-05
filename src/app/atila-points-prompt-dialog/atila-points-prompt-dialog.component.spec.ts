import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AtilaPointsPromptDialogComponent } from './atila-points-prompt-dialog.component';

describe('AtilaPointsPromptDialogComponent', () => {
  let component: AtilaPointsPromptDialogComponent;
  let fixture: ComponentFixture<AtilaPointsPromptDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AtilaPointsPromptDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtilaPointsPromptDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
