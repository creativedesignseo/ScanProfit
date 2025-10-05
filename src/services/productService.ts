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

    // Asegurar que los precios existan
    const amazonPrice = data.amazonPrice ?? 0;
    const walmartPrice = data.walmartPrice ?? 0;

    return {
      upc: data.upc,
      name: data.name,
      amazonPrice,
      walmartPrice,
      averagePrice: data.averagePrice,
      leaderPrice: data.leaderPrice,
      image: data.image,
    };
  } catch (error) {
    console.error('Error fetching product data:', error);
    return null;
  }
}
