export interface Product {
  upc: string;
  title: string;
  description: string;
  category: string;
  amazonPrice: number;
  walmartPrice: number;
  averagePrice: number;
  leaderPrice: number;
  expirationDate?: string;
  image?: string;
}

export interface ProductDB {
  id: string;
  upc: string;
  title: string;
  description: string;
  category: string;
  amazon_price: number;
  walmart_price: number;
  average_price: number;
  leader_price: number;
  expiration_date?: string;
  image_url?: string;
  scanned_by: string;
  created_at: string;
  updated_at: string;
}
