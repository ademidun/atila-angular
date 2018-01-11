// ng g s _services/question-control --module=app.module
//check to make sure the app.module.ts do not put the new service in the wrong provider
// git add . && git commit -m "refactored preview form. Fixed add scholarship and create scholarship." && git push && ng build --prod && firebase deploy
import { TestBed, inject } from '@angular/core/testing';

import { ApplicationService } from './application.service';

describe('ApplicationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApplicationService]
    });
  });

  it('should be created', inject([ApplicationService], (service: ApplicationService) => {
    expect(service).toBeTruthy();
  }));
});
