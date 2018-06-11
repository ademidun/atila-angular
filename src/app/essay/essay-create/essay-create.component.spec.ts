import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EssayCreateComponent } from './essay-create.component';

describe('EssayCreateComponent', () => {
  let component: EssayCreateComponent;
  let fixture: ComponentFixture<EssayCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EssayCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EssayCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
