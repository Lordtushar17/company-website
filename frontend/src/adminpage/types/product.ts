export interface Product {
  productid: string;
  title: string;
  shortDesc: string;
  longDesc: string;
  images: string[];
  orderId?: number; // optional, for ordering
}
