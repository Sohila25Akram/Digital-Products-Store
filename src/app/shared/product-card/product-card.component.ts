import { CurrencyPipe, PercentPipe } from '@angular/common';
import { Component, inject, Input, input } from '@angular/core';
import { Product } from '../models/product.model';
import { RouterLink } from '@angular/router';
import { ProductsService } from '../services/products.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CurrencyPipe, PercentPipe, RouterLink],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Input() inWishlist: boolean = false;

  private productsService = inject(ProductsService);

  isLoading: boolean = false;

  addToWishlist() {
    this.productsService.addProductToWishlist(this.product.id);
  }
  deleteFromWishlist() {
    this.productsService.deleteProductFromWishlist(this.product.id);
  }

  addProductToCart(amount: number) {
    this.productsService.addProductToCart(this.product.id, amount);
  }
}
