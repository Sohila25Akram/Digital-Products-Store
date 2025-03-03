import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { TopTabComponent } from '../shared/top-tab/top-tab.component';
import { ProductsService } from '../shared/services/products.service';
import { ProductCardComponent } from '../shared/product-card/product-card.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { Product } from '../shared/models/product.model';
import { ActivatedRoute } from '@angular/router';
import { deviceCategory } from '../../assets/data/dummy-products';
import { WrapperComponent } from '../shared/wrapper/wrapper.component';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [
    TopTabComponent,
    ProductCardComponent,
    SidebarComponent,
    WrapperComponent,
  ],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss',
})
export class ShopComponent implements OnInit {
  private productsService = inject(ProductsService);

  allProducts = this.productsService.loadedProducts();
  productsByCategory!: Product[];
  products!: Product[];
  selectedCategoryBrands!: string[];
  checkedBrands: string[] = [];
  deviceCategory = deviceCategory;
  private activatedRoute = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  isOpen: boolean = false;

  onToggle() {
    this.isOpen = !this.isOpen;
  }

  ngOnInit(): void {
    const subscription = this.activatedRoute.paramMap.subscribe({
      next: (paramMap) => {
        const categoryVal = paramMap.get('categoryValue');
        if (categoryVal) {
          this.productsByCategory = this.allProducts.filter(
            (p) => p.category === categoryVal
          )!;
          this.products = [...this.productsByCategory];

          this.selectedCategoryBrands =
            this.deviceCategory.find((cat) => cat.value === categoryVal)
              ?.brands || [];
        }
      },
    });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  onFilter(event: Event) {
    const targetVal = event.target as HTMLSelectElement;
    this.products = this.productsService.getfilteredCurrentProducts(
      this.productsByCategory,
      targetVal.value
    );
  }

  filterProductsByBrand(selectedBrands: string[]) {
    this.products = this.productsByCategory.filter(
      (products) =>
        selectedBrands.length === 0 ||
        selectedBrands.some(
          (brand) => brand.toLowerCase() === products.brand?.toLowerCase()
        )
    );

    selectedBrands.forEach((brand) => {
      if (!this.checkedBrands.includes(brand)) {
        this.checkedBrands.push(brand);
      }
    });

    this.checkedBrands = this.checkedBrands.filter((brandA) =>
      selectedBrands.includes(brandA)
    );
  }

  handlePriceFilter(priceRange: { minPrice: number; maxPrice: number }) {
    console.log('Min Price:', priceRange.minPrice);
    console.log('Max Price:', priceRange.maxPrice);
    this.products = this.productsByCategory.filter((product) => {
      const currentPrice = product.newPrice
        ? product.newPrice
        : product.originPrice;

      return (
        currentPrice >= priceRange.minPrice &&
        currentPrice <= priceRange.maxPrice
      );
    });
  }
}
