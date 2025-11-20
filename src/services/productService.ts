import { createClient } from '@supabase/supabase-js';
import type { Product } from '../types/product';
import { sendUpcToN8n } from './n8nService';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || 'https://n8n.adspubli.com/webhook-test/scan';
const N8N_WEBHOOK_TOKEN = import.meta.env.VITE_N8N_WEBHOOK_TOKEN || '';

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

// New: fetch product data via n8n webhook
export async function fetchProductDataViaN8n(upc: string): Promise<Product | null> {
  try {
    if (!N8N_WEBHOOK_URL) {
      console.error('N8N webhook URL not configured.');
      return null;
    }

    const headers: Record<string,string> = { 'Content-Type': 'application/json' };
    if (N8N_WEBHOOK_TOKEN) headers['X-Webhook-Token'] = N8N_WEBHOOK_TOKEN;

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({ upc }),
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`n8n responded ${response.status}`);
    }

    const data = await response.json();

    // Normalize response to your Product type. Adjust fields if your n8n flow returns different keys.
    return {
      upc: data.upc || upc,
      title: data.title || data.titulo || '',
      description: data.description || '',
      category: data.category || '',
      amazonPrice: data.amazonPrice || 0,
      walmartPrice: data.walmartPrice || 0,
      averagePrice: data.averagePrice || 0,
      leaderPrice: data.leaderPrice || 0,
      expirationDate: data.expirationDate || undefined,
      image: data.image || data.images?.[0] || '',
    };
  } catch (err) {
    console.error('Error fetching from n8n:', err);
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

    // Send UPC to n8n (which will sync to Google Sheets)
    try {
      await sendUpcToN8n(product.upc);
    } catch (syncError) {
      console.error('Error sending to n8n:', syncError);
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
