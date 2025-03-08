import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
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

  productsByCategory!: Product[];
  products: Product[] = [];

  checkedBrands: string[] = [];

  deviceCategory = deviceCategory;

  private activatedRoute = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  selectedCategoryBrands = signal<string[]>([]);
  currentCategoryName = signal<string>('Digital Top Seller');

  isOpen: boolean = false;

  onToggle() {
    this.isOpen = !this.isOpen;
  }

  ngOnInit(): void {
    const subscription = this.activatedRoute.paramMap.subscribe({
      next: (paramMap) => {
        const categoryVal = paramMap.get('categoryValue');
        if (categoryVal) {
          this.productsService.filterByCategory(categoryVal);

          this.productsByCategory =
            this.productsService.filteredProductsByCategory();
          this.products = this.productsByCategory;
        }
      },
    });

    this.currentCategoryName = this.productsService.currentCategoryName;
    this.selectedCategoryBrands = this.productsService.selectedCategoryBrands;

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  onFilter(event: Event) {
    const targetVal = event.target as HTMLSelectElement;
    this.products = this.productsService.getfilteredCurrentProducts(
      targetVal.value
    );
  }

  filterProductsByBrand(selectedBrands: string[]) {
    this.products = this.productsService.filterProductsByBrand(selectedBrands);

    selectedBrands.forEach((brand) => {
      if (!this.checkedBrands.includes(brand)) {
        this.checkedBrands.push(brand);
      }
    });

    this.checkedBrands = selectedBrands;
  }

  handlePriceFilter(priceRange: { minPrice: number; maxPrice: number }) {
    this.products = this.productsService.filterProductsByPrice(priceRange);
  }
}
