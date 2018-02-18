import { TestBed, inject } from '@angular/core/testing';

import { SubdashboardsService } from './subdashboards.service';

describe('SubdashboardsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SubdashboardsService]
    });
  });

  it('should be created', inject([SubdashboardsService], (service: SubdashboardsService) => {
    expect(service).toBeTruthy();
  }));
});
