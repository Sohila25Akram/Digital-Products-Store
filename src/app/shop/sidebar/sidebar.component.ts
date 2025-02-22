import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  @Output() closeEvent = new EventEmitter();
  @Input() brandsList!: string[];
  @Output() filterByBrand = new EventEmitter<string[]>();
  selectedBrands: string[] = [];
  numOfSelectedBrands: number = 0;
  minPrice: number = 0;
  maxPrice: number = 0;
  @Output() filterByPrice = new EventEmitter<{
    minPrice: number;
    maxPrice: number;
  }>();

  closeMenu() {
    this.closeEvent.emit(); // Notify parent to close the sidebar
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
}
