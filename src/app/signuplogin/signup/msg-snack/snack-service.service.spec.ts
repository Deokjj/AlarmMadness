import { TestBed, inject } from '@angular/core/testing';

import { SnackServiceService } from './snack-service.service';

describe('SnackServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SnackServiceService]
    });
  });

  it('should be created', inject([SnackServiceService], (service: SnackServiceService) => {
    expect(service).toBeTruthy();
  }));
});
