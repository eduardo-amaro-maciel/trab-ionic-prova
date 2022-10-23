import { TestBed } from '@angular/core/testing';

import { GetCepService } from './get-cep.service';

describe('GetCepService', () => {
  let service: GetCepService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetCepService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
