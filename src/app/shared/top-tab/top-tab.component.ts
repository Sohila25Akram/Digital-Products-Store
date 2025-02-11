import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../models/product.model';
import { DummyProducts } from '../../../assets/data/dummy-products';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-top-tab',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './top-tab.component.html',
  styleUrl: './top-tab.component.scss',
})
export class TopTabComponent implements OnInit {
  @Input() itemRecieved!: string;
  item!: string;

  ngOnInit(): void {
    this.item = this.itemRecieved;
  }
}
