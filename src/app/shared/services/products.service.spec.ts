import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { ProductsService } from './products.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Product } from '../models/product.model';
import { ApiService } from './api.service';
import { of } from 'rxjs';

describe('ProductsService', () => {
  let service: ProductsService;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  const api = 'http://localhost:5000';
  const fixedDate = new Date('2025-05-03T08:11:11.000Z');

  const dummyProducts: Product[] = [
    {
      id: '1', title: 'Product 1', newPrice: 100,
      imgSrc: '',
      originPrice: 0,
      brand: '',
      category: '',
      customers: 0,
      addedDate: fixedDate
    },
    {
      id: '2', title: 'Product 2', newPrice: 200,
      imgSrc: '',
      originPrice: 0,
      brand: '',
      category: '',
      customers: 0,
      addedDate: fixedDate
    },
  ];

  const dummySingleProduct: Product = dummyProducts[0];

  function mockRequestAndCall<T>(returnValue: T, method: () => void) {
    apiServiceSpy.request.and.returnValue(of(returnValue));
    method();
  }


  beforeEach(() => {
    const spy = jasmine.createSpyObj('ApiService', ['request']);
    spy.request.and.returnValue(of([]));

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ProductsService, 
        {provide: ApiService, useValue: spy}
      ]
    });
    service = TestBed.inject(ProductsService);
    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Product loading', () => {
    it('should fetch products and update loadedProducts', () => {
      mockRequestAndCall(dummyProducts, () => service.getProducts());

      expect(apiServiceSpy.request).toHaveBeenCalledWith('GET', `${api}/products`);
      expect(service.loadedProducts()).toEqual(dummyProducts);
    });
  });

  describe('wishlist operations', () => {
    
    const productId  = '1';

    beforeEach(() => {
      service['wishlistProducts'].set(dummyProducts);
    });

    it('should wishlistProducts be updated when addToWishlist called', () => {
      mockRequestAndCall(dummySingleProduct, () => service.addProductToWishlist(productId));

      expect(apiServiceSpy.request).toHaveBeenCalledWith('POST', `${api}/wishlist`, {body: {productId: productId}});
      expect(service.wishlistProducts()).toContain(dummySingleProduct);
    });

    it('should wishlistProducts be updated when getWishlistItems called', () => {
      mockRequestAndCall(dummyProducts, () => service.getWishlistItems());

      expect(apiServiceSpy.request).toHaveBeenCalledWith('GET', `${api}/wishlist`);
      expect(service.wishlistProducts()).toBe(dummyProducts);
    });

    it('should wishlistProducts be updated when deleteProductFromWishlist called', () => {
      mockRequestAndCall(dummyProducts, () => service.deleteProductFromWishlist(productId));
    
      expect(apiServiceSpy.request).toHaveBeenCalledWith('DELETE', `${api}/wishlist/${productId}`);
      expect(service.wishlistProducts()).toEqual(dummyProducts.filter(p => p.id !== productId));
    });
  })


  describe('Cart operations', () => { 
    const productId  = '1';
    const amount = 10;
    const response = { product: dummySingleProduct, amount };

    beforeEach(() => {
      service['productsAddedToCart'].set([response]);
    })

    it('should productsAddedToCart be updated when addProductToCart called', () => {
      mockRequestAndCall(response, () => service.addProductToCart(productId, amount));

      expect(apiServiceSpy.request).toHaveBeenCalledWith('POST', `${api}/cart`, {body: {productId: productId, amount: amount}});
      expect(service.productsAddedToCart()).toContain(response);
    });

    it('should productsAddedToCart be updated when getItemsInCart called', () => {
      mockRequestAndCall([response], () => service.getItemsInCart());

      expect(apiServiceSpy.request).toHaveBeenCalledWith('GET', `${api}/cart`);
      expect(service.productsAddedToCart()).toEqual([response]);
    });

    it('should productsAddedToCart be updated when deleteProductFromCart called', () => {
      apiServiceSpy.request.and.returnValue(of([response]));
      mockRequestAndCall([response], () => service.deleteProductFromCart(productId));

      expect(apiServiceSpy.request).toHaveBeenCalledWith('DELETE', `${api}/cart/${productId}`);
      expect(service.productsAddedToCart()).toEqual([]);
    });
  })
  
});
