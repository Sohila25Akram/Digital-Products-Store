import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ShippingComponent } from '../shipping/shipping.component';
import { ProductSnapshotComponent } from './product-snapshot/product-snapshot.component';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-cart-menu',
  standalone: true,
  imports: [
    RouterLink,
    ShippingComponent,
    ProductSnapshotComponent,
    CurrencyPipe,
  ],
  templateUrl: './cart-menu.component.html',
  styleUrl: './cart-menu.component.scss',
})
export class CartMenuComponent {}
