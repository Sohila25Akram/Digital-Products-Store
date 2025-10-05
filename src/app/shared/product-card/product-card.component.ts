import { CurrencyPipe, PercentPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  input,
} from '@angular/core';
import { Product } from '../models/product.model';
import { Router, RouterLink } from '@angular/router';
import { ProductsService } from '../services/products.service';
import { DiscountFormatPipe } from '../pipes/discount-format.pipe';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CurrencyPipe, PercentPipe, RouterLink, DiscountFormatPipe],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Input() inWishlist: boolean = false;

  private productsService = inject(ProductsService);
  private router = inject(Router)

  addToWishlist() {
    this.productsService.addProductToWishlist(this.product.id);
  }
  deleteFromWishlist() {
    this.productsService.deleteProductFromWishlist(this.product.id);
  }

  addProductToCart(amount: number) {
    this.productsService.addProductToCart(this.product.id, amount);
    this.router.navigateByUrl('/cart-menu');
  }
}
