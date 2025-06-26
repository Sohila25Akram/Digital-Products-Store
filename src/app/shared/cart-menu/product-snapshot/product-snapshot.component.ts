import { CurrencyPipe } from '@angular/common';
import {
  Component,
  computed,
  inject,
  Input,
  NgZone,
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
  private ngZone = inject(NgZone);

  isLoading: boolean = false;

  productAmount = signal<number>(1);

  computedPrice = computed(() => {
    return (this.product.newPrice ?? this.product.originPrice) * this.productAmount()
  })

  onProductAmountChange(amount: number) {
    this.productAmount.set(amount);
  }

  deleteProductFromCart() {
    this.isLoading = true;

    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        this.productsService.deleteProductFromCart(this.product.id);

        this.ngZone.run(() => (this.isLoading = false));
      }, 3000);
    });
  }
}
