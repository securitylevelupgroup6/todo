import { TestBed } from '@angular/core/testing';

import { FormStateService } from './state.service';

describe('StateService', () => {
  let service: FormStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
