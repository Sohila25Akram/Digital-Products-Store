import { Product } from '../../app/shared/models/product.model';

export const DummyProducts: Product[] = [
  {
    id: 'p1',
    title: 'AUE65 Crystal 4K UHD Smart TV',
    imgSrc: 'pexels-sound-on-3394665.jpg',
    originPrice: 900,
    newPrice: 600,
    discount: 33,
    brand: 'Vogal',
  },
  {
    id: 'p2',
    title: 'MSI Modern 15 Laptop',
    imgSrc: 'pexels-sound-on-3394648.jpg',
    originPrice: 1000,
    newPrice: 800,
    discount: 20,
    brand: 'Sumsung',
  },
  {
    id: 'p3',
    title: 'MSI Modern 15 Laptop',
    imgSrc: 'pexels-sound-on-3394652.jpg',
    originPrice: 1000,
    brand: 'Wavefast',
  },
];
