import { afterNextRender, inject, Injectable, signal } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { deviceCategory } from '../../../assets/data/dummy-products';
import { Product } from '../models/product.model';
import { ApiService } from './api.service';
import { ProductsFirebaseService } from './products-firebase.service';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  // private apiService = inject(ApiService);
  // api = 'http://localhost:5000';

  private productsFirebaseService = inject(ProductsFirebaseService)

  loadedProducts = signal<Product[]>([]);
  wishlistProducts = signal<{product: Product}[]>([]);
  productsAddedToCart = signal<{ product: any; amount: number }[]>([]);
  deviceCategory = deviceCategory;
  filteredProductsByCategory = signal<any>([]);
  selectedCategoryBrands = signal<string[]>([]);
  currentCategoryName = signal<string>('Digital Top Seller');

  getProducts() {
    // this.apiService
    //   .request<Product[]>('GET', `${this.api}/products`)
    this.productsFirebaseService.getProducts()
      .subscribe((products) => this.loadedProducts.set(products));
  }

  constructor() {
    afterNextRender(() => {
      this.getItemsInCart();
    });
    this.getWishlistItems();
    this.getProducts();
  }

  addProductToWishlist(productId: string) {
    // this.apiService
    //   .request<Product>('POST', `${this.api}/wishlist`, {
    //     body: { productId },
    //   })

    this.productsFirebaseService.addProductToWishlist(productId)
      .subscribe(
        (responseProduct) => {
          // const current = this.wishlistProducts();
          // this.wishlistProducts.set([...current, responseProduct]);
          console.log(
            responseProduct,
            ' product added to wishlist successfully'
          );
        },
        (error) => {
          console.error('Failed to add product to wishlist:', error);
        }
      );
  }

  getWishlistItems() {
    // this.apiService
    //   .request<Product>('GET', `${this.api}/wishlist`)
    this.productsFirebaseService.getProductsWishlist()
      .subscribe((items) => {
        this.wishlistProducts.set(items);
      });
  }

  deleteProductFromWishlist(productId: string) {
    // this.apiService
    //   .request<Product>('DELETE', `${this.api}/wishlist/${productId}`)
    this.productsFirebaseService.deleteFromWishlist(productId)
      .subscribe({
        next: (product) => {
          // const updatedWishlist = this.wishlistProducts().filter(
          //   (p: { id: string }) => p.id !== productId
          // );
          // this.wishlistProducts.set(updatedWishlist);
          console.log(product, ' deleted form wishlist Successfully');
        },
        error: (error) => {
          console.error('Failed to delete product form wishlist:', error);
        }
    });
  }

  // saveInCart(items: {product: Product, amount: number}[]){
  //   localStorage.setItem('cartItems', JSON.stringify(items));
  // }

  addProductToCart(productId: string, amount: number) {
    // this.apiService
    //   .request<{ product: any; amount: number }[]>('POST', `${this.api}/cart`, {
    //     body: {
    //       productId: productId,
    //       amount: amount,
    //     },
    //   })
    // const foundproduct = this.productsFirebaseService.getProductsInCart().pipe(
    //   map(products => {
    //     return products.find(p => p.product.id === productId)
    //   })
    // )

    // if(foundproduct){
    //   console.log('product is alraedy in the cart')
    //   return;
    // }
    this.productsFirebaseService.addProducttoCart(productId, amount)
      .subscribe((response) => {
        // const currentCartItems = JSON.parse(
        //   localStorage.getItem('cartItems') || '[]'
        // );
        // currentCartItems.push(response);
        // this.saveInCart(currentCartItems)

        // this.productsAddedToCart.set(currentCartItems);
          if (!response) {
          console.log('Product already exists in the cart or add was skipped.');
          return;
        }
        const currentId = response?.product.id;

        console.log(`product: ${currentId}, amount: ${amount}`);
      });
  }

  getItemsInCart() {
    // this.apiService
    //   .request<{ product: any; amount: number }[]>('GET', `${this.api}/cart`)
    this.productsFirebaseService.getProductsInCart()
      .subscribe((response) => {
        // this.saveInCart(response);
        this.productsAddedToCart.set(response);
      });
  }

  deleteProductFromCart(productId: string) {
    // this.apiService
    //   .request<Product>('DELETE', `${this.api}/cart/${productId}`)
    this.productsFirebaseService.deleteProductFromCart(productId)
      .subscribe({
        next: (response) => {
          // const updatedCart = this.productsAddedToCart().filter(
          //   (p) => p.product.id !== productId
          // );
          // this.productsAddedToCart.set(updatedCart);
          // this.saveInCart(updatedCart);
          console.log(response, ' deleted form cart Successfully');
        },
        error: (error) => {
          console.error('Failed to delete product form cart:', error);
        }
      });
  }

  filterByCategory(categoryVal: string) {
    const category = this.deviceCategory.find((p) => p.value === categoryVal);

    if (category) {
      this.filteredProductsByCategory.set(
        this.loadedProducts().filter(
          (p: { category: string }) => p.category === categoryVal
        )
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
          ...this.filteredProductsByCategory().sort(
            (a: { title: any }, b: { title: string }) =>
              b.title.localeCompare(a.title)
          ),
        ];
        break;

      case 'price-asc':
        currentProducts = [
          ...this.filteredProductsByCategory().sort(
            (
              a: { newPrice: any; originPrice: any },
              b: { newPrice: any; originPrice: any }
            ) => {
              const priceA = a.newPrice ?? a.originPrice;
              const priceB = b.newPrice ?? b.originPrice;
              return priceA - priceB;
            }
          ),
        ];
        break;

      case 'price-desc':
        currentProducts = [
          ...this.filteredProductsByCategory().sort(
            (
              a: { newPrice: any; originPrice: any },
              b: { newPrice: any; originPrice: any }
            ) => {
              const priceA = a.newPrice ?? a.originPrice;
              const priceB = b.newPrice ?? b.originPrice;
              return priceB - priceA;
            }
          ),
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

  filterProductsByBrand(selectedBrands: string[]): any {
    const currentProducts = this.filteredProductsByCategory().filter(
      (products: { brand: string }) =>
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
    return this.filteredProductsByCategory().filter(
      (product: { newPrice: any; originPrice: any }) => {
        const currentPrice = product.newPrice
          ? product.newPrice
          : product.originPrice;

        return (
          currentPrice >= priceRange.minPrice &&
          currentPrice <= priceRange.maxPrice
        );
      }
    );
  }

  searchProductsByName(searchTerm: string): Observable<any> {
    if (searchTerm) {
      return of(
        this.loadedProducts().filter((p: { title: string }) =>
          p.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      return of([]);
    }
  }

  private getBestSeller(productsToFilter?: any): any {
    return productsToFilter
      ? [
          ...productsToFilter.filter(
            (product: { customers: number }) => product.customers > 5
          ),
        ]
      : [];
  }
}
