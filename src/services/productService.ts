import type { Product } from '../types/product';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export async function fetchProductData(upc: string): Promise<Product | null> {
  try {
    const apiUrl = `${SUPABASE_URL}/functions/v1/product-lookup`;

    const headers = {
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({ upc })
    });

    if (!response.ok) {
      throw new Error('Error al buscar el producto');
    }

    const data = await response.json();

    if (!data || !data.upc) {
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
}
