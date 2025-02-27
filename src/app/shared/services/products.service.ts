import { afterNextRender, Injectable, signal } from '@angular/core';
import { Product } from '../models/product.model';
import { DummyProducts } from '../../../assets/data/dummy-products';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  products = signal<Product[]>(DummyProducts);

  loadedProducts = this.products.asReadonly();

  wishlistProducts = signal<Product[]>([]);

  filteredProductsByCategory = signal<Product[]>([]);

  productsAddedToCart = signal<
    { product: Product; amount: number; totalPriceOfAllProduct: number }[]
  >([]);

  // searchedProducts = signal<Product[]>([]);

  constructor() {
    afterNextRender(() => {
      this.wishlistProducts.set(
        JSON.parse(localStorage.getItem('wishlist') || '[]')
      );
      this.productsAddedToCart.set(
        JSON.parse(localStorage.getItem('cartItems') || '[]')
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

  addProductToCart(productId: string, amount: number) {
    const product = this.products().find((p) => p.id === productId);

    if (
      product &&
      !this.productsAddedToCart().some((p) => p.product?.id === productId)
    ) {
      this.productsAddedToCart.update((cart) => [
        ...cart,
        {
          product: product,
          amount: amount,
          totalPriceOfAllProduct:
            (product.newPrice ?? product.originPrice) * amount,
        },
      ]);
    }
    localStorage.setItem(
      'cartItems',
      JSON.stringify(this.productsAddedToCart())
    );

    console.log(`product id: ${productId}, amount: ${amount}`);
  }

  deleteProductFromCart(productId: string) {
    this.productsAddedToCart.update((cart) =>
      cart.filter((item) => item.product?.id !== productId)
    );
    localStorage.setItem(
      'cartItems',
      JSON.stringify(this.productsAddedToCart())
    );
  }

  getfilteredCurrentProducts(productsToFilter: Product[], filter: string) {
    let currentProducts = [...productsToFilter];
    switch (filter) {
      case 'best-selling':
        currentProducts = this.getBestSeller(productsToFilter);
        break;
      case 'alpha-asc':
        currentProducts = [...productsToFilter].sort((a, b) =>
          a.title.localeCompare(b.title)
        );
        break;

      case 'alpha-desc':
        currentProducts = [
          ...productsToFilter.sort((a, b) => b.title.localeCompare(a.title)),
        ];
        break;

      case 'price-asc':
        currentProducts = [
          ...productsToFilter.sort((a, b) => {
            const priceA = a.newPrice ?? a.originPrice;
            const priceB = b.newPrice ?? b.originPrice;
            return priceA - priceB;
          }),
        ];
        break;

      case 'price-desc':
        currentProducts = [
          ...productsToFilter.sort((a, b) => {
            const priceA = a.newPrice ?? a.originPrice;
            const priceB = b.newPrice ?? b.originPrice;
            return priceB - priceA;
          }),
        ];
        break;

      case 'date-asc':
        currentProducts = [...productsToFilter].sort(
          (a, b) => a.addedDate.getTime() - b.addedDate.getTime()
        );
        break;

      case 'date-desc':
        currentProducts = [...productsToFilter].sort(
          (a, b) => b.addedDate.getTime() - a.addedDate.getTime()
        );
        break;

      default:
        break;
    }
    return currentProducts;
  }

  searchProductsByName(searchTerm: string): Observable<Product[]> {
    // this.searchedProducts.update(() =>
    //   this.products().filter((product) => product.title === ProductName)
    // );
    if (searchTerm) {
      return of(
        this.products().filter((p) =>
          p.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      return of([]);
    }
  }

  private filterProductsByCategory(category: string) {
    const data = this.products().filter(
      (product) => product.category === category
    );

    this.filteredProductsByCategory.set(data);
  }

  private getBestSeller(productsToFilter?: Product[]): Product[] {
    return productsToFilter
      ? [...productsToFilter.filter((product) => product.customers > 5)]
      : [];
  }
}
