import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartMenuComponent } from './cart-menu.component';
import { By } from '@angular/platform-browser';
import { ProductsService } from '../services/products.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('CartMenuComponent', () => {
  let component: CartMenuComponent;
  let fixture: ComponentFixture<CartMenuComponent>;
  let mockProductsService: jasmine.SpyObj<ProductsService>;

  beforeEach(async () => {
    mockProductsService = jasmine.createSpyObj('ProductsService', ['productsAddedToCart']);
    
    // mockProductsService.productsAddedToCart.and.returnValue([]);
    const mockProductsWithAmount = [
      { product: { id: 'p1' }, amount: 1 },
      { product: { id: 'p2' }, amount: 1 },
    ];
    mockProductsService.productsAddedToCart.and.returnValue(mockProductsWithAmount);

    
    await TestBed.configureTestingModule({
      imports: [CartMenuComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
            queryParams: of({}),
            snapshot: { paramMap: new Map() },
          },
        },
        {
          provide: ProductsService,
          useValue: mockProductsService
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should grid template applied to header', () => {
    const headerEl = fixture.debugElement.query(By.css('header')).nativeElement;

    expect(component.productsInCart().length).toBe(2);

    expect(headerEl.style.justifyContent).toBe('space-between')
  })

  it('should h2 and productCart length rendered when productCard length greater than 0', () => {
    expect(component.productsInCart().length).toBe(2);

    const h2El = fixture.debugElement.query(By.css('h2')).nativeElement;
    const spanEl = h2El.querySelector('span');

    expect(h2El).toBeTruthy();
    expect(spanEl.textContent).toContain(2);

  });

  it('should cart-content returned when num of product greater than 0', () => {
    const cartContentEL = fixture.debugElement.query(By.css('.cart-content')).nativeElement;

    expect(cartContentEL).toBeTruthy();
  })
  it('should cart-empty-container returned when num of products not greater than 0', () => {
    mockProductsService.productsAddedToCart.and.returnValue([]);
    fixture.detectChanges();

    const cartEmptyContainerEl = fixture.debugElement.query(By.css('.empty-cart-container')).nativeElement;
    
    expect(cartEmptyContainerEl).toBeTruthy();

  })
  
  it('should return list of products', () => {
    const ulEl = fixture.debugElement.query(By.css('ul'));
    const items = ulEl.queryAll(By.css('li'));

    expect(items.length).toBe(2);
  })

  it('should total amount of products rendered', () => {
    const mockTotalPrice = 1200;
    spyOn(component, 'totalPriceOfAllProducts').and.returnValue(mockTotalPrice);

    fixture.detectChanges();

    const cartTotalEl = fixture.debugElement.query(By.css('.cart-total')).nativeElement;
    const spanEl = cartTotalEl.querySelector('span');

    const expected = new Intl.NumberFormat('en-Us', {
      style: 'currency',
      currency: 'USD'
    }).format(mockTotalPrice)

    expect(spanEl.textContent).toContain(expected);
  })

  
  describe('isolated testing', () => {
    it('should totalPriceOfAllProducts return 0 when no products' , () => {
      mockProductsService.productsAddedToCart.and.returnValue([]);
      fixture.detectChanges();
      
      expect(component.totalPriceOfAllProducts()).toBe(0);
    });
    //---------------------------------

    // it('should calculate total price correctly when products exist in cart', () => {
    //   const mockProductsWithAmount = [
    //     { product: { id: 'p1', newPrice: 100, originPrice: 80 }, amount: 2 },
    //     { product: { id: 'p2', newPrice: 200, originPrice: 180 }, amount: 1 },
    //   ];
  
    //   mockProductsService.productsAddedToCart.and.returnValue(mockProductsWithAmount);
    //   fixture.detectChanges();
  
    //   const expectedTotalPrice = (100 * 2) + (200 * 1); // 200 + 200 = 400
  
    //   expect(component.totalPriceOfAllProducts()).toBe(expectedTotalPrice);
    // });
  })
});
