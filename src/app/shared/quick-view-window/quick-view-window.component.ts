import { CurrencyPipe } from '@angular/common';
import {
  Component,
  DestroyRef,
  inject,
  Input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Product } from '../models/product.model';
import { ProductsService } from '../services/products.service';
import { LoaderDirective } from '../loader.directive';
import { ProductAmountComponent } from '../product-amount/product-amount.component';

@Component({
  selector: 'app-quick-view-window',
  standalone: true,
  imports: [CurrencyPipe, RouterLink, LoaderDirective, ProductAmountComponent],
  templateUrl: './quick-view-window.component.html',
  styleUrl: './quick-view-window.component.scss',
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class QuickViewWindowComponent implements OnInit {
  @Input() isExpanded?: boolean = false;
  private productsService = inject(ProductsService);
  products = this.productsService.loadedProducts();
  product!: Product;
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  // productId!: string;
  isLoading: boolean = false;
  productAmount: number = 1;

  handleProductAmountChange(amount: number) {
    this.productAmount = amount; // Store the new amount
    console.log('Updated product amount:', this.productAmount);
  }

  ngOnInit(): void {
    const subscription = this.activatedRoute.paramMap.subscribe({
      next: (paramMap) => {
        const productId = paramMap.get('productId');
        if (productId) {
          this.product = this.products.find((p) => p.id === productId)!;
          // this.productId = productId;
        }
      },
    });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  onSubmit(productId: string, amount: number, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (!productId) {
      console.error('Product ID is missing!');
      return;
    }
    this.isLoading = true;
    setTimeout(() => {
      this.router.navigate(['/cart-menu']);

      this.addToCart(productId, amount);
      this.isLoading = false;
    }, 3000);
  }

  addToCart(productId: string, amount: number) {
    this.productsService.addProductToCart(productId, amount);
  }

  get amountCurrent() {
    return this.productsService
      .productsAddedToCart()
      .map((item) => item.amount);
  }
  // incrementAmount() {
  //   this.productsService.productsAddedToCart.update((cart) =>
  //     cart.map((item) =>
  //       item.product?.id === this.product.id
  //         ? { ...item, amount: item.amount + 1 }
  //         : item
  //     )
  //   );
  // }
  // decrementAmount() {
  //   this.productsService.productsAddedToCart.update((cart) =>
  //     cart.map((item) =>
  //       item.product?.id === this.product.id && item.amount > 1
  //         ? { ...item, amount: item.amount + 1 }
  //         : item
  //     )
  //   );
  // }
}
