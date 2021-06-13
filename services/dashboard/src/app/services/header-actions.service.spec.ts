import { TestBed } from '@angular/core/testing';

import { HeaderActionsService } from './header-actions.service';

describe('HeaderActionsService', () => {
  let service: HeaderActionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeaderActionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
