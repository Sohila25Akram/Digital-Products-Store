import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { TopTabComponent } from '../shared/top-tab/top-tab.component';
import { ProductsService } from '../shared/services/products.service';
import { ProductCardComponent } from '../shared/product-card/product-card.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { Product } from '../shared/models/product.model';
import { ActivatedRoute } from '@angular/router';
import { deviceCategory } from '../../assets/data/dummy-products';
import { WrapperComponent } from '../shared/wrapper/wrapper.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';


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
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopComponent {
  private productsService = inject(ProductsService);

  productsByCategory = signal<Product[]>([]);
  products = signal<Product[]>([]);
  productsLength = computed(() => this.products().length);

  checkedBrands = signal<string | string[]>([]);

  deviceCategory = deviceCategory;

  private activatedRoute = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  selectedCategoryBrands = signal<string[]>([]);
  currentCategoryName = signal<string>('Digital Top Seller');

  isOpen: boolean = false;

  onToggle() {
    this.isOpen = !this.isOpen;
  }

  categoryParam = toSignal(this.activatedRoute.paramMap.pipe(
    map(params => params.get('categoryValue'))
  ));

  constructor(){
    effect(() => {
      const category = this.categoryParam();

      if (category) {
        this.productsService.filterByCategory(category);

        this.productsByCategory.set(this.productsService.filteredProductsByCategory());
        this.products.set(this.productsByCategory());

        this.currentCategoryName.set(this.productsService.currentCategoryName());
        this.selectedCategoryBrands.set(this.productsService.selectedCategoryBrands());
      }
    }, { allowSignalWrites: true });
  }
 

  onFilter(event: Event) {
    const targetVal = event.target as HTMLSelectElement;
    this.products.set(
      this.productsService.getfilteredCurrentProducts(targetVal.value)
    );
  }

  filterProductsByBrand(selectedBrands: string[]) {
    this.products.set(
      this.productsService.filterProductsByBrand(selectedBrands)
    );

    selectedBrands.forEach((brand) => {
      if (!this.checkedBrands().includes(brand)) {
        this.checkedBrands.set(brand);
      }
    });

    this.checkedBrands.set(selectedBrands);
  }

  handlePriceFilter(priceRange: { minPrice: number; maxPrice: number }) {
    this.products.set(this.productsService.filterProductsByPrice(priceRange));
  }
}
