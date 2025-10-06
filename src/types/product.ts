export interface Product {
  upc: string;
  nombre: string;
  name?: string;
  precioAmazon?: number;
  amazonPrice?: number;
  precioWalmart?: number;
  walmartPrice?: number;
  precioPromedio: number;
  averagePrice?: number;
  leaderPrice: number;
  descripcion: string;
  fichaTecnica: {
    marca: string;
    categoria: string;
    peso: string;
    origen: string;
    codigo_barras: string;
  };
  image?: string;
  priceMeta?: {
    amazon: 'upcitemdb_offer' | 'missing';
    walmart: 'upcitemdb_offer' | 'missing';
  };
}
