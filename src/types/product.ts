export interface Product {
  upc: string;
  name: string;
  amazonPrice: number;
  walmartPrice: number;
  averagePrice: number;
  leaderPrice: number;
  image?: string;
}
