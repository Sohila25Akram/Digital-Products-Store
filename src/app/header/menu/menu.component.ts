import { Component } from '@angular/core';
import { deviceCategory } from '../../../assets/data/dummy-products';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent {
  allCategories = deviceCategory;
  selectedItem: 'menu' | 'categories' = 'categories';

  onSelectItem(item: string) {
    this.selectedItem = item === 'menu' ? 'menu' : 'categories';
  }
}
