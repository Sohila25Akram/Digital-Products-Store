import { PercentPipe } from '@angular/common';
import { inject, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'discountFormat',
  standalone: true,
  pure: true,
})
export class DiscountFormatPipe implements PipeTransform {
  private percentPipe = inject(PercentPipe);

  transform(value: number | null | undefined): string {
    if (!value) return '';
    const formatedDiscount = this.percentPipe.transform(value / 100, '1.0-0');
    return `-${formatedDiscount}`;
  }
}
