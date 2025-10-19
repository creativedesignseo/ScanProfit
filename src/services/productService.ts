import { createClient } from '@supabase/supabase-js';
import type { Product } from '../types/product';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
      title: data.title,
      description: data.description,
      category: data.category,
      amazonPrice: data.amazonPrice,
      walmartPrice: data.walmartPrice,
      averagePrice: data.averagePrice,
      leaderPrice: data.leaderPrice || 0,
      expirationDate: undefined,
      image: data.image,
    };
  } catch (error) {
    console.error('Error fetching product data:', error);
    return null;
  }
}

export async function saveProduct(product: Product, userId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('products')
      .upsert({
        upc: product.upc,
        title: product.title,
        description: product.description,
        category: product.category,
        amazon_price: product.amazonPrice,
        walmart_price: product.walmartPrice,
        average_price: product.averagePrice,
        leader_price: product.leaderPrice,
        expiration_date: product.expirationDate || null,
        image_url: product.image,
        scanned_by: userId,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'upc'
      });

    if (error) {
      console.error('Error saving product:', error);
      return false;
    }

    // Sync to Google Sheets
    try {
      const syncUrl = `${SUPABASE_URL}/functions/v1/sync-to-sheets`;
      await fetch(syncUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: product.title,
          upc: product.upc,
          amazonPrice: product.amazonPrice,
          walmartPrice: product.walmartPrice,
          averagePrice: product.averagePrice,
          leaderPrice: product.leaderPrice,
          expirationDate: product.expirationDate,
          scannedBy: userId,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (syncError) {
      console.error('Error syncing to Google Sheets:', syncError);
    }

    return true;
  } catch (error) {
    console.error('Error saving product:', error);
    return false;
  }
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }

    return data.map(row => ({
      upc: row.upc,
      title: row.title,
      description: row.description,
      category: row.category,
      amazonPrice: row.amazon_price,
      walmartPrice: row.walmart_price,
      averagePrice: row.average_price,
      leaderPrice: row.leader_price || 0,
      expirationDate: row.expiration_date || undefined,
      image: row.image_url,
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function deleteProduct(upc: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('upc', upc);

    if (error) {
      console.error('Error deleting product:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
}
