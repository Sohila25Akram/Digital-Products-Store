import { Component, computed, inject, OnInit, viewChild, ViewChild } from '@angular/core';
import { TopTabComponent } from '../shared/top-tab/top-tab.component';
import { FormGroup, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { NgxStripeModule, StripeCardCvcComponent, StripeCardExpiryComponent, StripeCardNumberComponent, StripeInstance, StripeFactoryService, StripeService, StripeCardComponent } from 'ngx-stripe';
import { StripeCardElementOptions, StripeElementsOptions } from '@stripe/stripe-js';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ProductsFirebaseService } from '../shared/services/products-firebase.service';
import { ProductsService } from '../shared/services/products.service';
import { STRIPE_SECRET_KEY } from '../../assets/data/stripe-secret';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [
    TopTabComponent, 
    ReactiveFormsModule, 
    CurrencyPipe,
    StripeCardNumberComponent,
    StripeCardExpiryComponent,
    StripeCardCvcComponent,
    NgxStripeModule,
  ],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})



export class PaymentComponent implements OnInit{
  private http = inject(HttpClient);
  private stripeFactory =inject(StripeFactoryService);
  private stripeService = inject(StripeService)
  private productsFirebaseService = inject(ProductsFirebaseService) // ✅ add this

  private productsService = inject(ProductsService);
  productsMetadata = computed(() => { 
    return this.productsService.productsAddedToCart().map(item => ({
      id: item.product.id,
      qty: item.amount
    }));
  })



  public stripe!: StripeInstance;
  public stripeAmount!: number;

  stripePublicKey = 'pk_test_51RglGFR2Iag7akPrA7rzA2h5ZEdLfYllWWWL5AFUqDluaP92HAAvneVEamcumSSsUOK95198GSIRp7HzQlJkKnG100wvWG3ouw';
  stripeSecretKey = STRIPE_SECRET_KEY;


  totalPriceOfAllProducts = computed(() => {
    return this.productsService.productsAddedToCart().reduce((total, item) => {
      const product = item.product;
      const price = product.newPrice ?? product.originPrice;
      return total + price * item.amount;
    }, 0);
  });

  form = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  cardOptions : StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        fontWeight: '300',
        fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
        fontSize: '16px',
        '::placeholder': {
          color: '#CFD7E0'
        }
      }
    }
  };

  elementsOptions: StripeElementsOptions = {
    locale: 'en'
  };
  @ViewChild(StripeCardNumberComponent) cardNumber!: StripeCardNumberComponent;
// @ViewChild('cardGroupDiv') cardGroup!: StripeCardComponent;


  ngOnInit(): void {
    this.stripe = this.stripeFactory.create(this.stripePublicKey);
    this.stripeAmount = 100;
  }

 
checkout() {
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${this.stripeSecretKey}`,
    'Content-Type': 'application/x-www-form-urlencoded'
  });

  const body = new HttpParams()
    .set('amount', (this.totalPriceOfAllProducts() * 100).toString())
    .set('currency', 'usd')
    .set('payment_method', 'pm_card_visa')
    // .set('automatic_payment_methods[enabled]', 'true')
    .set('metadata[products]', JSON.stringify(this.productsMetadata()))
    .set('metadata[name]', this.form.value.name!)
    .set('metadata[email]', this.form.value.email!)
    .append('payment_method_types[]', 'card');


  this.http.post<any>('https://api.stripe.com/v1/payment_intents', body, { headers })
    .subscribe({
      next: (paymentIntent) => {
        console.log('PaymentIntent created:', paymentIntent);

        if (!this.cardNumber?.element) {
          console.error('Card element not found');
          return;
        }


        this.stripeService.confirmCardPayment(paymentIntent.client_secret, {
          payment_method: {
            card: this.cardNumber.element,
            billing_details: {
              name: this.form.value.name,
              email: this.form.value.email
            }
          }
        }).subscribe((result) => {
          if (result.error) {
            console.error('Payment failed:', result.error.message);
          } else if (result.paymentIntent?.status === 'succeeded') {
            console.log('Payment succeeded:', result.paymentIntent);
          }
        });


      },
      error: (err) => {
        console.error('Error creating PaymentIntent:', err);
        alert('Failed to create payment intent');
      }
    });
}



  onSubmit(){
    if(!this.form.valid){
      return;
    }

    this.checkout();
    console.log('data submitted')
    console.log('card number is: ', this.cardNumber)
  }
}


