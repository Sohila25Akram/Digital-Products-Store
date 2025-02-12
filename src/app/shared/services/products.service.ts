import { afterNextRender, Injectable, signal } from '@angular/core';
import { Product } from '../models/product.model';
import { DummyProducts } from '../../../assets/data/dummy-products';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  products = signal<Product[]>(DummyProducts);

  loadedProducts = this.products.asReadonly();

  wishlistProducts = signal<Product[]>([]);

  constructor() {
    afterNextRender(() => {
      this.wishlistProducts.set(
        JSON.parse(localStorage.getItem('wishlist') || '[]')
      );
    });
  }

  addProductToWishlist(productId: string) {
    const product = this.products().find((p) => p.id === productId);

    if (product && !this.wishlistProducts().some((p) => p.id === productId)) {
      this.wishlistProducts.update((wishlist) => [...wishlist, product]);
      localStorage.setItem('wishlist', JSON.stringify(this.wishlistProducts()));
    }
  }

  deleteProductFromWishlist(productId: string) {
    this.wishlistProducts.update((wishlist) =>
      wishlist.filter((product) => product.id !== productId)
    );
    localStorage.setItem('wishlist', JSON.stringify(this.wishlistProducts()));
  }
}
