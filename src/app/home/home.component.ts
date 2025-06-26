import {
  ChangeDetectionStrategy,
  Component,
  computed,
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

  bestSellerSmallCards = [
    {
      "imgSrc" : "pexels-maria-mileta-3563033-15394136.jpg",
      "title": "Projectors",
      "desc": "4K Ultra HD with 8 million pixels"
    },
    {
      "imgSrc" : "pexels-martin_poland-1175242-15684881.jpg",
      "title": "Soundbars",
      "desc": "With Wireless Subwoofer for Extra Deep Bass"
    },
    {
      "imgSrc" : "pexels-paulseling-20385203.jpg",
      "title": "video game",
      "desc": "Flat 25% Off On Children's Day"
    },
    {
      "imgSrc" : "pexels-samed-bayrak-2518016-9546248.jpg",
      "title": "Bluetooth Speaker",
      "desc": "Feather light, ultra-portable grab-and-go design"
    },
  ]

  products = computed(() => this.productsService.loadedProducts() );

  currentSlide = signal<number>(1);

  onToggleSlide() {
    this.currentSlide.update((prev) => (prev === 1 ? 2 : 1));
  }
}
