import { TestBed, inject } from '@angular/core/testing';

import { DynamodbService } from './dynamodb.service';

describe('DynamodbService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DynamodbService]
    });
  });

  it('should be created', inject([DynamodbService], (service: DynamodbService) => {
    expect(service).toBeTruthy();
  }));
});
