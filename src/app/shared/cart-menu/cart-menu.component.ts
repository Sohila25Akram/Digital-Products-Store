import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ShippingComponent } from '../shipping/shipping.component';
import { ProductSnapshotComponent } from './product-snapshot/product-snapshot.component';
import { CurrencyPipe } from '@angular/common';
import { ProductsService } from '../services/products.service';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-cart-menu',
  standalone: true,
  imports: [
    RouterLink,
    ShippingComponent,
    ProductSnapshotComponent,
    CurrencyPipe,
  ],
  templateUrl: './cart-menu.component.html',
  styleUrl: './cart-menu.component.scss',
})
export class CartMenuComponent {
  private productsService = inject(ProductsService);

  totalPriceOfAllProducts(): number {
    return (
      this.productsService
        .productsAddedToCart()
        ?.reduce(
          (total, item) => total + (item.totalPriceOfAllProduct ?? 0),
          0
        ) ?? 0
    );
  }

  productsInCart = computed(() =>
    this.productsService.productsAddedToCart().map((item) => item.product)
  );
}
