import { Component } from '@angular/core';
import { deviceCategory } from '../../../assets/data/dummy-products';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navigation-bar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navigation-bar.component.html',
  styleUrl: './navigation-bar.component.scss',
})
export class NavigationBarComponent {
  allCategories = deviceCategory;
}
