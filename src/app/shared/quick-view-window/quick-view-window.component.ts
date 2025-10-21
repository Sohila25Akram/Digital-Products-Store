import { CurrencyPipe } from '@angular/common';
import {
  Component,
  DestroyRef,
  effect,
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
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-quick-view-window',
  standalone: true,
  imports: [
    CurrencyPipe,
    RouterLink,
    LoaderDirective,
    ProductAmountComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './quick-view-window.component.html',
  styleUrl: './quick-view-window.component.scss',
})
export class QuickViewWindowComponent implements OnInit {
  @Input() isExpanded: boolean = false;
  private productsService = inject(ProductsService);
  product!: Product;
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  isLoading: boolean = false;

  productId: string | null = null;

  form = new FormGroup({
    productId: new FormControl(),
    productAmount: new FormControl(),
  });

  constructor() {
    effect(() => {
      const products = this.productsService.loadedProducts();
      if (!products?.length || !this.productId) return;

      const found = products.find(p => p.id === this.productId);
      if (found) {
        this.product = found;
        this.form.patchValue({ productId: this.productId });
      }
    });
  }

  handleProductAmountChange(amount: number) {
    this.form.patchValue({ productAmount: amount });
  }

  ngOnInit(): void {
    const subscription = this.activatedRoute.paramMap.subscribe({
      next: (paramMap) => {
        this.productId = paramMap.get('productId');
      },
    });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  onSubmit() {
    const productId = this.form.value.productId;
    const amount = this.form.value.productAmount;

    if (!productId) {
      console.error('Product ID is missing!');
      return;
    }
    this.isLoading = true;
    setTimeout(() => {
      this.router.navigate(['/cart-menu']);
      this.productsService.addProductToCart(productId, amount);

      this.isLoading = false;
    }, 3000);
  }
  addToWishlist(){
    this.productsService.addProductToWishlist(this.product.id);
  }
}
