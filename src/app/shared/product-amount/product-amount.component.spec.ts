import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductAmountComponent } from './product-amount.component';

describe('ProductAmountComponent', () => {
  let component: ProductAmountComponent;
  let fixture: ComponentFixture<ProductAmountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductAmountComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
