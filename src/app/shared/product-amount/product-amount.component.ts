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

    this.manualAmount.valueChanges.subscribe((value) => {
      if (value && value >= 1) {
        this.updateCartAmount(value);
      } else {
        this.manualAmount.setValue(this.productAmount(), { emitEvent: false });
      }
    });
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
    this.updateCartAmount(Number(this.productAmount()) + 1);
    console.log('After:', this.productAmount());
  }
  decrementAmount() {
    if (this.productAmount() > 1) {
      this.updateCartAmount(Number(this.productAmount()) - 1);
    }
  }

  // onManualInput(event: Event) {
  //   const inputVal = (event.target as HTMLInputElement).value;
  //   let newAmount = parseInt(inputVal, 10);

  //   if (!isNaN(newAmount) && newAmount > 0) {
  //     this.updateCartAmount(newAmount);
  //   } else {
  //     this.manualAmount.setValue(this.productAmount()); // Reset invalid input
  //   }
  // }

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

    this.productAmount.set(newAmount); // Ensure signal updates immediately
    if (this.manualAmount.value !== newAmount) {
      this.manualAmount.setValue(newAmount, { emitEvent: false });
    }
    // this.manualAmount.setValue(newAmount, { emitEvent: false });
    this.productAmountChange.emit(newAmount); // Emit updated amount to parent
  }
}
