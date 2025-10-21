import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, computed, inject } from '@angular/core';
import { StripeInstance } from 'ngx-stripe';
import { ProductsService } from '../shared/services/products.service';
import { Product } from '../shared/models/product.model';
import { CurrencyPipe } from '@angular/common';
import { AuthService } from '../shared/services/auth.service';
import { STRIPE_SECRET_KEY } from '../../assets/data/stripe-secret';
import { TopTabComponent } from '../shared/top-tab/top-tab.component';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CurrencyPipe, TopTabComponent],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent {
  httpService = inject(HttpClient);
  productsService = inject(ProductsService);
  authService = inject(AuthService);

  public stripe!: StripeInstance;
  public stripeAmount!: number;

  stripePublicKey = 'pk_test_51RglGFR2Iag7akPrA7rzA2h5ZEdLfYllWWWL5AFUqDluaP92HAAvneVEamcumSSsUOK95198GSIRp7HzQlJkKnG100wvWG3ouw';
  stripeSecretKey = STRIPE_SECRET_KEY;

  orders: any[] = [];

  currentEmail: string | null = null;

  
  getOrdersByCustomerEmail(email: string) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.stripeSecretKey}`
    });

    this.httpService.get<any>('https://api.stripe.com/v1/payment_intents', { headers })
      .subscribe({
        next: (res) => {
          this.orders = (res.data || [])
            .filter((pi: any) => pi.metadata?.email === email)
            .map((pi: any) => ({
              created: new Date(Number(pi.created) * 1000).toLocaleString(),
              products: pi.metadata?.products ? JSON.parse(pi.metadata.products) : [],
              totalAmount: pi.amount / 100, // convert cents to dollars,
              orderId: pi.id
            }
          ));
          
          console.log('Orders:', this.orders);
        },
        error: (err) => {
          console.error('Failed to load orders:', err);
        }
      });
  }

  constructor() {
    this.authService.getCurrentUser().subscribe(user => {
      this.currentEmail = user?.email ?? null;
    });

    this.getOrdersByCustomerEmail(this.currentEmail!)
  }

  getProductById(productId: string): Product | undefined {
    return this.productsService.loadedProducts()
      .find(product => product.id === productId);
  }
}
