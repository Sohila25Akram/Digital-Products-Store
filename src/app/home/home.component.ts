import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  Renderer2,
} from '@angular/core';
import { BestSellerCardComponent } from './best-seller-card/best-seller-card.component';
import { ProductCardComponent } from '../shared/product-card/product-card.component';
import { QuickViewWindowComponent } from '../shared/quick-view-window/quick-view-window.component';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ProductsService } from '../shared/services/products.service';
import { deviceCategory } from '../../assets/data/dummy-products';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    BestSellerCardComponent,
    ProductCardComponent,
    QuickViewWindowComponent,
    RouterLink,
    RouterOutlet,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements AfterViewInit {
  private productsService = inject(ProductsService);

  products = this.productsService.loadedProducts();

  currentSlide: number = 1;

  allCategories = deviceCategory;

  private renderer = inject(Renderer2);
  private el = inject(ElementRef);

  onToggleSlide() {
    if (this.currentSlide === 1) {
      this.currentSlide = 2;
    } else {
      this.currentSlide = 1;
    }
  }

  ngAfterViewInit(): void {
    const swiperContainer = this.el.nativeElement.querySelector(
      '.swiper'
    ) as HTMLElement;
    if (!swiperContainer) {
      console.error('Swiper container not found');
      return;
    }

    const firstCard = this.el.nativeElement.querySelector(
      '.category-card'
    ) as HTMLElement;
    const firstCardWidth = firstCard ? firstCard.offsetWidth : 0;
    if (firstCardWidth === 0) {
      console.error('Category card width is 0, check if .category-card exists');
      return;
    }

    const scrollBtns = Array.from(
      this.el.nativeElement.querySelectorAll('.btn')
    ) as HTMLElement[];
    if (scrollBtns.length === 0) {
      console.error('No scroll buttons found');
      return;
    }

    scrollBtns.forEach((btn) => {
      this.renderer.listen(btn, 'click', () => {
        if (!btn.id) {
          console.error('Button missing ID:', btn);
          return;
        }

        const scrollAmount =
          btn.id === 'prev' ? -firstCardWidth : firstCardWidth;
        const newScrollLeft = swiperContainer.scrollLeft + scrollAmount;

        this.renderer.setProperty(swiperContainer, 'scrollLeft', newScrollLeft);
      });
    });
  }
}
