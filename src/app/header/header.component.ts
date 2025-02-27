import { Component, computed, inject } from '@angular/core';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import { RouterLink } from '@angular/router';
import { ProductsService } from '../shared/services/products.service';
import { MenuComponent } from './menu/menu.component';
import { WrapperComponent } from '../shared/wrapper/wrapper.component';
import { SearchedProductComponent } from './searched-product/searched-product.component';
import { Product } from '../shared/models/product.model';
import { debounceTime, Observable, switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    NavigationBarComponent,
    MenuComponent,
    WrapperComponent,
    SearchedProductComponent,
    AsyncPipe,
    ReactiveFormsModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private productsService = inject(ProductsService);
  isOpen: boolean = false;

  searchedTerm = new FormControl('');
  searchedProducts!: Observable<Product[]>;

  openSearchBox: boolean = false;

  onOpenMenu() {
    this.isOpen = true;
  }
  onCloseMenu(isClosed: boolean) {
    this.isOpen = isClosed;
  }

  numOfProducts = computed(
    () => this.productsService.productsAddedToCart().length
  );

  constructor() {
    this.searchedProducts = this.searchedTerm.valueChanges.pipe(
      debounceTime(300),
      switchMap((searchTerm) =>
        this.productsService.searchProductsByName(searchTerm || '')
      )
    );
  }
}
