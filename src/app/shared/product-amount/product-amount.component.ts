import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { ProductsService } from '../services/products.service';
import { Product } from '../models/product.model';
import { LoaderDirective } from '../loader.directive';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-amount',
  standalone: true,
  imports: [LoaderDirective, ReactiveFormsModule],
  templateUrl: './product-amount.component.html',
  styleUrl: './product-amount.component.scss',
})
export class ProductAmountComponent implements OnInit {
  private productsService = inject(ProductsService);
  @Input() product!: Product;
  @Input() isSmall: boolean = false;
  @Output() productAmountChange = new EventEmitter<number>();
  manualAmount = new FormControl<number>(1);

  productAmount = signal(1);

  @Input() numQuantity: number = 1;

  ngOnInit(): void {
    const amount =
      this.productsService
        .productsAddedToCart()
        .find((p) => p.product?.id === this.product.id)?.amount || 1;

    this.productAmount.set(amount);
    this.productAmountChange.emit(amount);

    this.manualAmount.valueChanges.subscribe((value) => {
      if (value && value >= 1) {
        this.updateCartAmount(value);
      } else {
        this.manualAmount.setValue(this.productAmount(), { emitEvent: false });
      }
    });
  }

  incrementAmount() {
    console.log('Before:', this.productAmount());
    this.updateCartAmount(Number(this.productAmount()) + 1);
    console.log('After:', this.productAmount());
  }
  decrementAmount() {
    if (this.productAmount() > 1) {
      this.updateCartAmount(Number(this.productAmount()) - 1);
    }
  }

  private updateCartAmount(newAmount: number) {
    this.productsService.productsAddedToCart.update((cart) =>
      cart.map((item) =>
        item.product?.id === this.product.id
          ? {
              ...item,
              amount: newAmount,
              totalPriceOfAllProduct:
                newAmount *
                (item.product?.newPrice ?? item.product?.originPrice ?? 0),
            }
          : item
      )
    );

    this.productAmount.set(newAmount);
    if (this.manualAmount.value !== newAmount) {
      this.manualAmount.setValue(newAmount, { emitEvent: false });
    }

    this.productAmountChange.emit(newAmount);
  }
}
