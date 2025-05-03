import { TestBed } from '@angular/core/testing';

import { ApiService } from './api.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController)
  });
  
  afterEach(() => {
    httpMock.verify();
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('perform CRUD operations', () => {
    it('should perform GET request', () => {
      const mockResponse = {data: 'test'};

      service.request('GET', '/api/test').subscribe((response) => {
        expect(response).toEqual(mockResponse);
      })

      const req = httpMock.expectOne('/api/test');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse)
    });

    it('should perform POST request', () => {
      const payload = {name: 'test'}
      const mockResponse = {success: true};

      service.request('POST', '/api/create', {body: payload}).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      })

      const req = httpMock.expectOne('/api/create');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(payload);
      req.flush(mockResponse);
    });

    it('should perform DELETE request', () => {
      const id = 'p1';
      const mockResponse = {success: true};

      service.request('DELETE', `/api/delete/${id}`,).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      })

      const req = httpMock.expectOne(`/api/delete/${id}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResponse);
    });
  });

  it('should handle HTTP error response', () => {
    const errorMsg = 'Request failed';

    service.request('GET', '/api/error').subscribe({
      next: () => fail('Should have failed with an error'),
      error: (error) => {
        expect(error.status).toBe(500);
        expect(error.statusText).toBe('Internal Server Error');
      }
    })


    const req = httpMock.expectOne('/api/error');
    req.flush(errorMsg, {
      status: 500,
      statusText: 'Internal Server Error'
    })

  })

})
