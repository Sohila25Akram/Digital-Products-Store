import { CurrencyPipe } from '@angular/common';
import {
  Component,
  computed,
  inject,
  Input,
  OnInit,
  signal,
} from '@angular/core';
import { Product } from '../../models/product.model';
import { ProductsService } from '../../services/products.service';
import { LoaderDirective } from '../../loader.directive';
import { ProductAmountComponent } from '../../product-amount/product-amount.component';

@Component({
  selector: 'app-product-snapshot',
  standalone: true,
  imports: [CurrencyPipe, LoaderDirective, ProductAmountComponent],
  templateUrl: './product-snapshot.component.html',
  styleUrl: './product-snapshot.component.scss',
})
export class ProductSnapshotComponent {
  @Input() product!: Product;
  private productsService = inject(ProductsService);

  isLoading: boolean = false;

  productAmount = signal<number>(1); // Default value

  onProductAmountChange(amount: number) {
    this.productAmount.set(amount);
  }

  // ngOnInit(): void {
  //   const cartProduct = this.productsService
  //     .productsAddedToCart()
  //     .find((p) => p.product?.id === this.product.id);

  //   this.productAmount = cartProduct ? cartProduct.amount : 1;
  // }

  // productAmount = computed(
  //   () =>
  //     this.productsService
  //       .productsAddedToCart()
  //       .find((p) => p.product?.id === this.product.id)?.amount || 1
  // );

  deleteProductFromCart() {
    this.isLoading = true;
    setTimeout(() => {
      this.productsService.deleteProductFromCart(this.product.id);
      this.isLoading = false;
    }, 3000);
  }
}
