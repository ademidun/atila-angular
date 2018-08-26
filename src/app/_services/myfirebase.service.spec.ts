import { TestBed, inject } from '@angular/core/testing';

import { MyFirebaseService } from './myfirebase.service';

describe('MyfirebaseService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MyFirebaseService]
    });
  });

  it('should be created', inject([MyFirebaseService], (service: MyFirebaseService) => {
    expect(service).toBeTruthy();
  }));
});
