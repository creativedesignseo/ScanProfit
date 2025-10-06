import type { Product } from '../types/product';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || import.meta.env.SUPABASE_DATABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY;

export async function fetchProductData(upc: string): Promise<Product | null> {
  try {
    const apiUrl = `${SUPABASE_URL}/functions/v1/product-lookup?upc=${upc}`;

    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      upc: data.upc,
      nombre: data.nombre,
      name: data.nombre,
      precioAmazon: data.precioAmazon,
      amazonPrice: data.precioAmazon,
      precioWalmart: data.precioWalmart,
      walmartPrice: data.precioWalmart,
      precioPromedio: data.precioPromedio,
      averagePrice: data.precioPromedio,
      leaderPrice: data.leaderPrice,
      descripcion: data.descripcion,
      fichaTecnica: data.fichaTecnica,
      image: data.image,
      priceMeta: data.priceMeta,
    };
  } catch (error) {
    console.error('Error fetching product data:', error);
    return null;
  }
}
