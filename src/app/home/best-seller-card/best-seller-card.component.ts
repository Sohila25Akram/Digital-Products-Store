import { Component, Input, input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-best-seller-card',
  standalone: true,
  imports: [],
  templateUrl: './best-seller-card.component.html',
  styleUrl: './best-seller-card.component.scss',
})
export class BestSellerCardComponent {
  imgSrc = input.required();
  title = input.required<string>();
  desc = input.required<string>();
  @Input() isBig: boolean = false;
}
