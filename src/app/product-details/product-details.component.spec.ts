import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailsComponent } from './product-details.component';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { ProductsService } from '../shared/services/products.service';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';


@Component({selector: 'app-banner', standalone: true, template: ''})
class QuickViewWindowStubComponent {}

describe('ProductDetailsComponent', () => {
  let component: ProductDetailsComponent;
  let fixture: ComponentFixture<ProductDetailsComponent>;
  let mockProductsService: jasmine.SpyObj<ProductsService>;
  let activatedRoute: ActivatedRoute;

  beforeEach(async () => {
    mockProductsService = jasmine.createSpyObj('ProductsService', ['loadedProducts', 'productsAddedToCart']);

    // const mockData =  {
    //   id: 'p1',
    //   title: 'AUE65 Crystal 4K UHD Smart TV',
    //   imgSrc: 'pexels-sound-on-3394665.jpg',
    //   originPrice: 900,
    //   newPrice: 600,
    //   discount: 33,
    //   brand: 'vogal',
    //   category: 'headphones',
    //   customers: 12,
    //   addedDate: new Date('2023-05-15T12:00:00Z'),
    // }
    // mockProductsService.loadedProducts.and.returnValue([mockData]);
   

    activatedRoute = {
      paramMap: of(convertToParamMap({ productId: 'p1' })),
    } as unknown as ActivatedRoute;


    await TestBed.configureTestingModule({
      imports: [ProductDetailsComponent, QuickViewWindowStubComponent ],
      providers: [
         {
          provide: ActivatedRoute,
          useValue: activatedRoute,
        },
        {provide: ProductsService, useValue: mockProductsService},

      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should subscribe to route param and update productName', () => {
  //   component.ngOnInit();

  //   //check paramMap contains the id

  //   //find product id with match ud form services

  //   //get the name of that id

  //   //productName set with the name

  //   // activatedRoute.paramMap.subscribe((res) => {
  //   //   resizeBy
  //   // })

  //   // expect(component.productName).toBe('Product One');
  // });

  // it('should set productName based on route param', () => {
  //   expect(component.productName).toBe('Ultra HD Smart TV 55')
  // })
  // **** how to test child component

  // **** how to test child component

  it('should products be equal the loadedProducts', () => {
    const mockData = [{
      id: 'p1',
      title: 'Ultra HD Smart TV 55',
      imgSrc: 'ultra-hd-tv.jpg',
      originPrice: 799.99,
      discount: 20,
      newPrice: 639.99,
      brand: 'Oliva',
      category: 'smart-tvs',
      customers: 845,
      addedDate: new Date('2025-04-01')
    },
    {
      id: 'p2',
      title: 'Ultra HD Smart TV 55',
      imgSrc: 'ultra-hd-tv.jpg',
      originPrice: 799.99,
      discount: 20,
      newPrice: 639.99,
      brand: 'Oliva',
      category: 'smart-tvs',
      customers: 845,
      addedDate: new Date('2025-04-01')
    }];

    // mockProductsService.loadedProducts.and.returnValue(mockData);

    expect(component.products()).toBe(mockData);
  })

  // ******* how we can make test for activated route

});
