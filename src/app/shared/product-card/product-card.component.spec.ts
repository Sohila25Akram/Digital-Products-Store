import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCardComponent } from './product-card.component';
import { ProductsService } from '../services/products.service';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;
  let mockProductsService: jasmine.SpyObj<ProductsService>;

  beforeEach(async () => {
    mockProductsService = jasmine.createSpyObj('productsService', ['addProductToWishlist', 'deleteProductFromWishlist', 'addProductToCart']);

    const mockProduct = {
      id: 'p1',
      title: 'AUE65 Crystal 4K UHD Smart TV',
      imgSrc: 'pexels-sound-on-3394665.jpg',
      originPrice: 900,
      newPrice: 600,
      discount: 33,
      brand: 'vogal',
      category: 'headphones',
      customers: 12,
      addedDate: new Date('2023-05-15T12:00:00Z'),
    };

    await TestBed.configureTestingModule({
      imports: [ProductCardComponent],
      providers: [
        {
          provide: ProductsService, useValue: mockProductsService
        },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
            queryParams: of({}),
            snapshot: { paramMap: new Map() },
          },
        },
      
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;

    component.product = mockProduct;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('rendered-based testing', () => {
    describe('style binding', ()=> {
      it('should show delete-from-wishlist when inWishlist true', () => { 
        component.inWishlist = true;
        fixture.detectChanges();

        const deletBtnEl = fixture.debugElement.query(By.css('.delete-from-wishlist')).nativeElement;
  
        // expect(deletBtnEl.style.display).toBe('block');
        expect(deletBtnEl).toBeTruthy();
      });
      // it('should hide add-wishlist-btn when inWishlist true', () => {

      //   component.inWishlist = true;
      //   fixture.detectChanges();

      //   const addToWishlistBtnEl = fixture.debugElement.query(By.css('.add-wishlist-btn')).nativeElement;

    
      //   // expect(addToWishlistBtnEl.style.display).toBe('none');
      //   // expect(addToWishlistBtnEl).toBeFalsy();
      //   expect(getComputedStyle(addToWishlistBtnEl).display).toBe('none');

      // });
    });

    describe('render component', () => {
      it('should figure rendered when product found', () => {
        const figureEl = fixture.debugElement.query(By.css('figure')).nativeElement;

        expect(figureEl).toBeTruthy();
      });
      it('should product data rendered when product found', () => {
        const imgEl = fixture.debugElement.query(By.css('img'))?.nativeElement;
        const titleEl = fixture.debugElement.query(By.css('figcaption a'))?.nativeElement;
        const originPriceEl = fixture.debugElement.query(By.css('figcaption .origin-price'))?.nativeElement;
  
        const expectedOriginPrice = Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(900);
  
        expect(imgEl.src).toContain('assets/images/products/pexels-sound-on-3394665.jpg');
        expect(titleEl.textContent).toContain('AUE65 Crystal 4K UHD Smart TV');
        expect(originPriceEl.textContent).toContain(expectedOriginPrice);
      });
      it('should return newPrice when it found', () => {
        expect(component.product.newPrice).toBeTruthy();
  
        const newPriceEl = fixture.debugElement.query(By.css('figcaption .new-price')).nativeElement;
        expect(newPriceEl).toBeTruthy();
        
        const newPrice = 600;
  
        const expectedNewPrice = Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(newPrice);
  
        expect(newPriceEl.textContent).toBe(expectedNewPrice);
      });
      it('should return discount when it found', () => {
        expect(component.product.discount).toBeTruthy();
  
        const discountEl = fixture.debugElement.query(By.css('figcaption .discount')).nativeElement;
        expect(discountEl).toBeTruthy();
        
  
        // const expectedNewPrice = Intl.NumberFormat('en-US', {
        //   style: 'perc',
        //   currency: 'USA'
        // }).format(newPrice);
  
        // expect(discountEl.textContent).toBe(expectedNewPrice);
  
        // ===========================
        // make testing Custom Pipe***********
        //--==========================
      });
    })
    
    describe('should methods be called', () => {
      it('should deleteFromWishlist() be called when click on delete-from-wishlist button', () => {
        const deletBtnEl = fixture.debugElement.query(By.css('.delete-from-wishlist')).nativeElement;

        spyOn(component, 'deleteFromWishlist');

        deletBtnEl.click();
        fixture.detectChanges();

        expect(component.deleteFromWishlist).toHaveBeenCalled();
      });

      it('should addToWishlist() be called when click on add-wishlist-btn button', () => {
        const addToWishlistBtnEl = fixture.debugElement.query(By.css('.add-wishlist-btn')).nativeElement;

        spyOn(component, 'addToWishlist');

        addToWishlistBtnEl.click();
        fixture.detectChanges();

        expect(component.addToWishlist).toHaveBeenCalled();
      });

      it('should addProductToCart() be called when click on add-to-cart-btn button', () => {
        const addToCartBtnEl = fixture.debugElement.query(By.css('.add-to-cart-btn')).nativeElement;

        spyOn(component, 'addProductToCart');

        addToCartBtnEl.click();
        fixture.detectChanges();

        expect(component.addProductToCart).toHaveBeenCalledWith(1);
      });
    })


    it('should old class added when there is a newPrice found', () => {
      expect(component.product.newPrice).toBeTruthy();

      const originPriceEl = fixture.debugElement.query(By.css('figcaption .origin-price')).nativeElement;

      expect(originPriceEl.classList.contains('old')).toBeTrue();
    })
  });

  describe('isolated testing', () => {
    it('should addToWishlist work', () => {
      component.addToWishlist();
      expect(mockProductsService.addProductToWishlist).toHaveBeenCalledWith('p1')
    });

    it('should deleteFromWishlist work', () => {
      component.deleteFromWishlist();
      expect(mockProductsService.deleteProductFromWishlist).toHaveBeenCalledWith('p1')
    });

    it('should addProductToCart work', () => {
      const amount  = 3;
      component.addProductToCart(amount);
      expect(mockProductsService.addProductToCart).toHaveBeenCalledWith('p1', 3)
    });
  })
});
