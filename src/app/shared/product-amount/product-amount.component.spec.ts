import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductAmountComponent } from './product-amount.component';
import { By } from '@angular/platform-browser';
import { ProductsService } from '../services/products.service';

describe('ProductAmountComponent', () => {
  let component: ProductAmountComponent;
  let fixture: ComponentFixture<ProductAmountComponent>;
  let mockProductsService: jasmine.SpyObj<ProductsService>

  beforeEach(async () => {
    mockProductsService = jasmine.createSpyObj('productsServices', ['productsAddedToCart']);

    mockProductsService.productsAddedToCart.and.returnValue([]);


    await TestBed.configureTestingModule({
      imports: [ProductAmountComponent],
      providers: [{provide: ProductsService, useValue: mockProductsService}]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('rendered-based testing', () => {
 
    it('shuild small class be added when isSmall true', () => {
      const amountContainerEl = fixture.debugElement.query(By.css('.amount')).nativeElement;

      component.isSmall = true;
      fixture.detectChanges();

      expect(amountContainerEl.classList.contains('small')).toBeTrue();
    })
    
    it('should decrementAmount called when click on decrement-btn', () => {
      const decrementBtnEl = fixture.debugElement.query(By.css('.decrement-btn')).nativeElement;

      spyOn(component, 'decrementAmount');

      decrementBtnEl.click();
      fixture.detectChanges();

      expect(component.decrementAmount).toHaveBeenCalled();
    });

    it('should incrementAmount called when click on increment-btn', () => {
      const incrementBtnEl = fixture.debugElement.query(By.css('.increment-btn')).nativeElement;

      spyOn(component, 'incrementAmount');

      incrementBtnEl.click();
      fixture.detectChanges();

      expect(component.incrementAmount).toHaveBeenCalled();
    })

    // it('testing input', () => {
    
  // })

  })

  describe('isolated testing', () => {
    // it('')


    it('should updatedAmount work', () => {
      const mockProductsWithAmount = [
        { product: { id: 'p1', newPrice: 100, originPrice: 80 }, amount: 2 },
        { product: { id: 'p2', newPrice: 200, originPrice: 180 }, amount: 1 },
      ];

      mockProductsService.productsAddedToCart.and.returnValue(mockProductsWithAmount);

      fixture.detectChanges();

      

    })

    // it('should incrementAmount update updateCartAmount', () => {
    //   component.incrementAmount();

    //   expect(component.update)
    // })
  })

});
