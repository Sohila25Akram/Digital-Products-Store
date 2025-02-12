import { Component, inject } from '@angular/core';
import { TopTabComponent } from '../shared/top-tab/top-tab.component';
import { ProductsService } from '../shared/services/products.service';
import { ProductCardComponent } from '../shared/product-card/product-card.component';
import { SidebarComponent } from './sidebar/sidebar.component';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [TopTabComponent, ProductCardComponent, SidebarComponent],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss',
})
export class ShopComponent {
  private productsService = inject(ProductsService);

  products = this.productsService.loadedProducts();

  isOpen: boolean = false;

  onToggle() {
    this.isOpen = !this.isOpen;
  }
}
