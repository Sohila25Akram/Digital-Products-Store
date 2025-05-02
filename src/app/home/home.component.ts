import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { BestSellerCardComponent } from './best-seller-card/best-seller-card.component';
import { ProductCardComponent } from '../shared/product-card/product-card.component';
import { QuickViewWindowComponent } from '../shared/quick-view-window/quick-view-window.component';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ProductsService } from '../shared/services/products.service';
import { CategorySwiperComponent } from './category-swiper/category-swiper.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    BestSellerCardComponent,
    ProductCardComponent,
    QuickViewWindowComponent,
    RouterLink,
    RouterOutlet,
    CategorySwiperComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  private productsService = inject(ProductsService);

  products = signal(this.productsService.loadedProducts());

  currentSlide = signal<number>(1);

  onToggleSlide() {
    this.currentSlide.update((prev) => (prev === 1 ? 2 : 1));
  }
}
