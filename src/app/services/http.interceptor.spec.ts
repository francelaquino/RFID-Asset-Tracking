import { TestBed } from '@angular/core/testing';

import { Http } from './http.interceptor';

describe('HttpinterceptorInterceptor', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [Http],
    })
  );

  it('should be created', () => {
    const interceptor: Http = TestBed.inject(Http);
    expect(interceptor).toBeTruthy();
  });
});
