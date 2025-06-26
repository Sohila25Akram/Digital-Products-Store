import {
  ChangeDetectionStrategy,
  Component,
  Input,
  input,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'app-best-seller-card',
  standalone: true,
  imports: [],
  templateUrl: './best-seller-card.component.html',
  styleUrl: './best-seller-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BestSellerCardComponent {
  imgSrc = input.required();
  title = input.required<string>();
  desc = input.required<string>();
  isBig = input<boolean>(false)
}
