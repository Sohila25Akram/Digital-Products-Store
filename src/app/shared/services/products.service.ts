import { afterNextRender, Injectable, signal } from '@angular/core';
import { Product } from '../models/product.model';
import {
  deviceCategory,
  DummyProducts,
} from '../../../assets/data/dummy-products';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private products = signal<Product[]>(DummyProducts);

  loadedProducts = this.products.asReadonly();

  wishlistProducts = signal<Product[]>([]);

  deviceCategory = deviceCategory;
  selectedCategoryBrands = signal<string[]>([]);
  currentCategoryName = signal<string>('Digital Top Seller');

  filteredProductsByCategory = signal<Product[]>([]);

  productsAddedToCart = signal<
    { product: Product; amount: number; totalPriceOfAllProduct: number }[]
  >([]);

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

  filterByCategory(categoryVal: string) {
    const category = this.deviceCategory.find((p) => p.value === categoryVal);

    if (category) {
      this.filteredProductsByCategory.set(
        this.products().filter((p) => p.category === categoryVal)
      );

      this.selectedCategoryBrands.set(category?.brands);
      this.currentCategoryName.set(category?.name);
    } else {
      this.filteredProductsByCategory.set(this.loadedProducts());
      const allBrands = [
        ...new Set(this.deviceCategory.flatMap((cat) => cat.brands || [])),
      ];

      this.selectedCategoryBrands.set(allBrands);
      this.currentCategoryName.set('Digital Top Seller');
    }
  }

  getfilteredCurrentProducts(filter: string) {
    let currentProducts = [...this.filteredProductsByCategory()];
    switch (filter) {
      case 'best-selling':
        currentProducts = this.getBestSeller(this.filteredProductsByCategory());
        break;
      case 'alpha-asc':
        currentProducts = [...this.filteredProductsByCategory()].sort((a, b) =>
          a.title.localeCompare(b.title)
        );
        break;

      case 'alpha-desc':
        currentProducts = [
          ...this.filteredProductsByCategory().sort((a, b) =>
            b.title.localeCompare(a.title)
          ),
        ];
        break;

      case 'price-asc':
        currentProducts = [
          ...this.filteredProductsByCategory().sort((a, b) => {
            const priceA = a.newPrice ?? a.originPrice;
            const priceB = b.newPrice ?? b.originPrice;
            return priceA - priceB;
          }),
        ];
        break;

      case 'price-desc':
        currentProducts = [
          ...this.filteredProductsByCategory().sort((a, b) => {
            const priceA = a.newPrice ?? a.originPrice;
            const priceB = b.newPrice ?? b.originPrice;
            return priceB - priceA;
          }),
        ];
        break;

      case 'date-asc':
        currentProducts = [...this.filteredProductsByCategory()].sort(
          (a, b) => a.addedDate.getTime() - b.addedDate.getTime()
        );
        break;

      case 'date-desc':
        currentProducts = [...this.filteredProductsByCategory()].sort(
          (a, b) => b.addedDate.getTime() - a.addedDate.getTime()
        );
        break;

      default:
        currentProducts = this.filteredProductsByCategory();
        break;
    }
    return currentProducts;
  }

  filterProductsByBrand(selectedBrands: string[]): Product[] {
    const currentProducts = this.filteredProductsByCategory().filter(
      (products) =>
        selectedBrands.length === 0 ||
        selectedBrands.some(
          (brand) => brand.toLowerCase() === products.brand?.toLowerCase()
        )
    );

    return currentProducts;
  }

  filterProductsByPrice(priceRange: { minPrice: number; maxPrice: number }) {
    console.log('Min Price:', priceRange.minPrice);
    console.log('Max Price:', priceRange.maxPrice);
    return this.filteredProductsByCategory().filter((product) => {
      const currentPrice = product.newPrice
        ? product.newPrice
        : product.originPrice;

      return (
        currentPrice >= priceRange.minPrice &&
        currentPrice <= priceRange.maxPrice
      );
    });
  }

  searchProductsByName(searchTerm: string): Observable<Product[]> {
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

  private getBestSeller(productsToFilter?: Product[]): Product[] {
    return productsToFilter
      ? [...productsToFilter.filter((product) => product.customers > 5)]
      : [];
  }
}
