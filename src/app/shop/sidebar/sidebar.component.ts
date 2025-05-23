import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  Input,
  Output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  @Output() closeEvent = new EventEmitter();
  @Input() brandsList!: string[];
  @Output() filterByBrand = new EventEmitter<string[]>();
  selectedBrands: string[] = [];
  numOfSelectedBrands: number = 0;
  minPrice: number = 0;
  maxPrice: number = 1200;
  @Output() filterByPrice = new EventEmitter<{
    minPrice: number;
    maxPrice: number;
  }>();

  closeMenu() {
    this.closeEvent.emit();
  }

  onBrandFilter(event: Event, brand: string) {
    const checkBox = event.target as HTMLInputElement;
    if (checkBox.checked) {
      this.selectedBrands.push(checkBox.value);
      this.numOfSelectedBrands++;
    } else {
      this.selectedBrands = this.selectedBrands.filter((b) => b !== brand);
      this.numOfSelectedBrands--;
    }
    this.filterByBrand.emit(this.selectedBrands);
  }

  onPriceFilter(event: Event) {
    const target = event.target as HTMLInputElement;
    const name = target.name;
    const value = target.value;

    if (name === 'min-price') {
      this.minPrice = Number(value);
    } else if (name === 'max-price') {
      this.maxPrice = Number(value);
    }

    this.filterByPrice.emit({
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
    });
  }

  rangeValueStart = signal<number>(0);
  rangeValueEnd = signal<number>(1200);

  rangeValueStartWidth = computed(() => (this.rangeValueStart() / 600) * 150);
  rangeValueEndWidth = computed(
    () => ((1200 - this.rangeValueEnd()) / 600) * 150
  );

  onRangeChange(event: Event, isStart: boolean) {
    const value = (event.target as HTMLInputElement).valueAsNumber;
    if (isStart) {
      this.rangeValueStart.set(value);
      this.minPrice = value;
    } else {
      this.rangeValueEnd.set(value);
      this.maxPrice = value;
    }
    this.filterByPrice.emit({
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
    });
  }
}
