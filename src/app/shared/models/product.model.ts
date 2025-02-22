export interface Product {
  id: string;
  title: string;
  imgSrc: string;
  originPrice: number;
  newPrice?: number;
  discount?: number;
  brand: string;
  category: string;
  customers: number;
  addedDate: Date;
}
