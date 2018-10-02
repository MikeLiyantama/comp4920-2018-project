import { TestBed, inject } from '@angular/core/testing';

import { RightPaneService } from './rightpane.service';

describe('RightPaneService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RightPaneService]
    });
  });

  it('should be created', inject([RightPaneService], (service: RightPaneService) => {
    expect(service).toBeTruthy();
  }));
});
