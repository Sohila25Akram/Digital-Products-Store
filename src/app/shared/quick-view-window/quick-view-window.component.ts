import { CurrencyPipe } from '@angular/common';
import {
  Component,
  inject,
  Input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
  RouterLink,
} from '@angular/router';
import { Product } from '../models/product.model';
import { DummyProducts } from '../../../assets/data/dummy-products';

@Component({
  selector: 'app-quick-view-window',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './quick-view-window.component.html',
  styleUrl: './quick-view-window.component.scss',
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class QuickViewWindowComponent implements OnInit {
  @Input() isExpanded?: boolean = false;
  products: Product[] = DummyProducts;
  product!: Product;
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe({
      next: (paramMap) => {
        const productId = paramMap.get('productId');
        if (productId) {
          this.product = this.products.find((p) => p.id === productId)!;
        }
      },
    });
  }
  onSubmit() {
    this.router.navigate(['/cart-menu']);
  }
}
