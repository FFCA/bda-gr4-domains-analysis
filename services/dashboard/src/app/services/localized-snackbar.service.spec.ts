import { TestBed } from '@angular/core/testing';

import { LocalizedSnackbarService } from './localized-snackbar.service';

describe('LocalizedSnackbarService', () => {
  let service: LocalizedSnackbarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalizedSnackbarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
