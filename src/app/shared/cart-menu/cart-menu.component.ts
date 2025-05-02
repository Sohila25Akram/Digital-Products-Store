import { Component, computed, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ShippingComponent } from '../shipping/shipping.component';
import { ProductSnapshotComponent } from './product-snapshot/product-snapshot.component';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { ProductsService } from '../services/products.service';
import { Product } from '../models/product.model';
import { WrapperComponent } from '../wrapper/wrapper.component';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-cart-menu',
  standalone: true,
  imports: [
    RouterLink,
    ShippingComponent,
    ProductSnapshotComponent,
    CurrencyPipe,
    WrapperComponent,
    AsyncPipe,
  ],
  templateUrl: './cart-menu.component.html',
  styleUrl: './cart-menu.component.scss',
})
export class CartMenuComponent {
  private productsService = inject(ProductsService);

  totalPriceOfAllProducts = computed(() => {
    return this.productsService.productsAddedToCart().reduce((total, item) => {
      const product = item.product;
      const price = product.newPrice ?? product.originPrice;
      return total + price * item.amount;
    }, 0);
  });
  

  productsInCart = computed(() =>
    this.productsService.productsAddedToCart().map((item) => item.product)
  );
}
