import {
  Component,
  computed,
  effect,
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
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-amount',
  standalone: true,
  imports: [LoaderDirective, FormsModule],
  templateUrl: './product-amount.component.html',
  styleUrl: './product-amount.component.scss',
})
export class ProductAmountComponent implements OnInit {
  private productsService = inject(ProductsService);
  @Input() product!: Product;
  @Input() isSmall: boolean = false;
  @Output() productAmountChange = new EventEmitter<number>();
  manualAmount: number = 1;

  productAmount = signal(1);

  // constructor() {
  //   effect(() => {
  //     this.productAmountChange.emit(this.productAmount());
  //   });
  // }

  ngOnInit(): void {
    const amount =
      this.productsService
        .productsAddedToCart()
        .find((p) => p.product?.id === this.product.id)?.amount || 1;

    this.productAmount.set(amount);
    this.productAmountChange.emit(amount);
  }

  // constructor() {
  //   effect(() => {
  //     const amount =
  //       this.productsService
  //         .productsAddedToCart()
  //         .find((p) => p.product?.id === this.product.id)?.amount || 1;

  //     this.productAmount.set(amount);
  //     this.productAmountChange.emit(amount);
  //   });
  // }

  // productAmount = computed(() => {
  //   const amount =
  //     this.productsService
  //       .productsAddedToCart()
  //       .find((p) => p.product?.id === this.product.id)?.amount || 1;

  //   this.manualAmount = amount;
  //   return amount;
  // });

  incrementAmount() {
    console.log('Before:', this.productAmount());
    this.updateCartAmount(this.productAmount() + 1);
    console.log('After:', this.productAmount());
  }
  decrementAmount() {
    if (this.productAmount() > 1) {
      this.updateCartAmount(this.productAmount() - 1);
    }
  }

  onManualInput(event: Event) {
    const inputVal = (event.target as HTMLInputElement).value;
    let newAmount = parseInt(inputVal, 10);

    if (!isNaN(newAmount) && newAmount > 0) {
      this.updateCartAmount(newAmount);
    } else {
      this.manualAmount = this.productAmount(); // Reset invalid input
    }
  }

  private updateCartAmount(newAmount: number) {
    this.productsService.productsAddedToCart.update((cart) =>
      cart.map((item) =>
        item.product?.id === this.product.id
          ? { ...item, amount: newAmount }
          : item
      )
    );

    this.productAmount.set(newAmount); // Ensure signal updates immediately
    this.manualAmount = newAmount;
    this.productAmountChange.emit(newAmount); // Emit updated amount to parent
  }
}
