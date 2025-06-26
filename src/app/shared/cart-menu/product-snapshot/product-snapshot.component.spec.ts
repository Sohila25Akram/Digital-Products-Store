import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { ProductSnapshotComponent } from './product-snapshot.component';
import { ProductsService } from '../../services/products.service';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

describe('ProductSnapshotComponent', () => {
  let component: ProductSnapshotComponent;
  let fixture: ComponentFixture<ProductSnapshotComponent>;
  let mockProductsService: jasmine.SpyObj<ProductsService>;
  

  beforeEach(async () => {
    mockProductsService = jasmine.createSpyObj('ProductsService', ['deleteProductFromCart', 'productsAddedToCart']);

    const mockData =  {product: {}, amount: 1}
    
    mockProductsService.productsAddedToCart.and.returnValue([mockData]);

    await TestBed.configureTestingModule({
      imports: [ProductSnapshotComponent],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService
        },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductSnapshotComponent);
    component = fixture.componentInstance;

    component.product =  {
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
    }

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should product data rendered', () => {
    const imgEl = fixture.debugElement.query(By.css('img')).nativeElement;

    const h3El = fixture.debugElement.query(By.css('h3')).nativeElement;

    const spanEl = fixture.debugElement.query(By.css('.price')).nativeElement;


    expect(imgEl.src).toContain('assets/images/products/pexels-sound-on-3394665.jpg');
    expect(h3El.textContent).toContain('AUE65 Crystal 4K UHD Smart TV')

    const expectedPrice = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(600);

    expect(spanEl.textContent).toContain(expectedPrice)
  });

  it('should deleteProductFromCart be called when click on delete-icon', () => {
    const deleteEl = fixture.debugElement.query(By.css('.delete-icon')).nativeElement;
    spyOn(component, 'deleteProductFromCart');

    deleteEl.click();
    fixture.detectChanges();

    expect(component.deleteProductFromCart).toHaveBeenCalled();
  })
  describe('isolated testing', () => {
    it('should computedPrice return the product price multiply product amount', () => {
      expect(component.product.newPrice).toBe(600);

      component.productAmount.set(2);
      fixture.detectChanges();

      const expected = (component.product.newPrice ?? component.product.originPrice) * component.productAmount();

      expect(component.computedPrice()).toBe(expected);
    });
    
    it('should onProductAmountChange() work', () => {
      component.onProductAmountChange(3);

      expect(component.productAmount()).toBe(3);
    });

    it('should deleteProductFromCart work correctly', fakeAsync(() => {
      component.deleteProductFromCart();

      expect(component.isLoading).toBeTrue();

      tick(3000);

      expect(mockProductsService.deleteProductFromCart).toHaveBeenCalledWith(component.product.id);

      expect(component.isLoading).toBeFalse();
    }));
  })
  
});
