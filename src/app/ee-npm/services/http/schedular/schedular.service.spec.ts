import { TestBed, inject } from '@angular/core/testing';

import { SchedularService } from './schedular.service';

describe('SchedularService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SchedularService]
    });
  });

  it('should ...', inject([SchedularService], (service: SchedularService) => {
    expect(service).toBeTruthy();
  }));
});
