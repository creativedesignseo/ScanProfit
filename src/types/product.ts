export interface Product {
  upc: string;
  nombre: string;
  name?: string;
  precio: number;
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
}
