import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-shipping',
  standalone: true,
  imports: [],
  templateUrl: './shipping.component.html',
  styleUrl: './shipping.component.scss',
})
export class ShippingComponent {
  @Input() addEstimatedDelivery?: boolean = true;
}
