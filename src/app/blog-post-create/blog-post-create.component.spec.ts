import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogPostCreateComponent } from './blog-post-create.component';

describe('BlogPostCreateComponent', () => {
  let component: BlogPostCreateComponent;
  let fixture: ComponentFixture<BlogPostCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlogPostCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogPostCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
