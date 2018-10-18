import { TestBed, inject } from '@angular/core/testing';

import { TeamTasksService } from './team-tasks.service';

describe('TeamTasksService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TeamTasksService]
    });
  });

  it('should be created', inject([TeamTasksService], (service: TeamTasksService) => {
    expect(service).toBeTruthy();
  }));
});
