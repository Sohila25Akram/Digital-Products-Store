import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { deviceCategory } from '../../../assets/data/dummy-products';

@Component({
  selector: 'app-category-swiper',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './category-swiper.component.html',
  styleUrl: './category-swiper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategorySwiperComponent implements AfterViewInit {
  allCategories = deviceCategory;
  firstCardWidth: number = 0;

  @ViewChild('swiper', { static: true }) swiperContainer!: ElementRef;

  private renderer = inject(Renderer2);
  private el = inject(ElementRef);

  ngAfterViewInit(): void {
    const firstCard = this.el.nativeElement.querySelector(
      '.category-card'
    ) as HTMLElement;

    if (firstCard) {
      this.firstCardWidth = firstCard.offsetWidth;
    } else {
      console.error('Category card width is 0, check if .category-card exists');
    }
  }

  scroll(direction: 'prev' | 'next') {
    if (!this.swiperContainer?.nativeElement) {
      console.error('Swiper container not found');
      return;
    }

    const scrollAmount: number =
      direction === 'prev' ? -this.firstCardWidth : this.firstCardWidth;
    const newScrollLeft: number =
      this.swiperContainer.nativeElement.scrollLeft + scrollAmount;

    this.renderer.setProperty(
      this.swiperContainer.nativeElement,
      'scrollLeft',
      newScrollLeft
    );
  }
}
