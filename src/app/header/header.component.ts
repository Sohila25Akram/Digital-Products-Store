import { Component, computed, inject, ViewEncapsulation } from '@angular/core';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import { RouterLink } from '@angular/router';
import { ProductsService } from '../shared/services/products.service';
import { MenuComponent } from './menu/menu.component';
import { WrapperComponent } from '../shared/wrapper/wrapper.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    NavigationBarComponent,
    MenuComponent,
    WrapperComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private productsService = inject(ProductsService);
  isOpen: boolean = false;

  onOpenMenu() {
    this.isOpen = true;
  }
  onCloseMenu(isClosed: boolean) {
    this.isOpen = isClosed;
  }

  numOfProducts = computed(
    () => this.productsService.productsAddedToCart().length
  );
}
