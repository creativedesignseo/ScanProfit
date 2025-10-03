import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ProductData {
  upc: string;
  name: string;
  amazonPrice: number | null;
  walmartPrice: number | null;
  image?: string;
}

async function searchUPCDatabase(upc: string): Promise<{ name: string; image?: string } | null> {
  try {
    // UPCItemDB API (free tier available)
    const response = await fetch(`https://api.upcitemdb.com/prod/trial/lookup?upc=${upc}`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    
    if (data.items && data.items.length > 0) {
      const item = data.items[0];
      return {
        name: item.title || item.brand || 'Producto sin nombre',
        image: item.images && item.images.length > 0 ? item.images[0] : undefined,
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching from UPCItemDB:', error);
    return null;
  }
}

async function searchAmazon(upc: string, productName?: string): Promise<number | null> {
  try {
    // Rainforest API (tiene free tier)
    // Para producción, necesitas registrarte en: https://www.rainforestapi.com/
    // Por ahora, simularemos precios basados en el UPC
    
    // Alternativa: usar web scraping o Amazon Product API oficial
    // Aquí usamos lógica de fallback con precios simulados realistas
    
    const basePrice = parseInt(upc.slice(-4)) / 100;
    const variance = Math.random() * 50 + 10;
    return parseFloat((basePrice + variance).toFixed(2));
  } catch (error) {
    console.error('Error fetching Amazon price:', error);
    return null;
  }
}

async function searchWalmart(upc: string): Promise<number | null> {
  try {
    // Walmart Open API requiere registro
    // Para producción: https://developer.walmart.com/
    
    // Fallback con precios simulados
    const basePrice = parseInt(upc.slice(-4)) / 100;
    const variance = Math.random() * 45 + 8;
    return parseFloat((basePrice + variance).toFixed(2));
  } catch (error) {
    console.error('Error fetching Walmart price:', error);
    return null;
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const url = new URL(req.url);
    const upc = url.searchParams.get('upc');

    if (!upc) {
      return new Response(
        JSON.stringify({ error: 'UPC parameter is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // 1. Buscar información del producto por UPC
    const productInfo = await searchUPCDatabase(upc);

    if (!productInfo) {
      return new Response(
        JSON.stringify({ error: 'Product not found' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // 2. Buscar precios en Amazon y Walmart en paralelo
    const [amazonPrice, walmartPrice] = await Promise.all([
      searchAmazon(upc, productInfo.name),
      searchWalmart(upc),
    ]);

    // 3. Calcular precio líder
    let averagePrice = 0;
    let priceCount = 0;

    if (amazonPrice !== null) {
      averagePrice += amazonPrice;
      priceCount++;
    }
    if (walmartPrice !== null) {
      averagePrice += walmartPrice;
      priceCount++;
    }

    if (priceCount === 0) {
      return new Response(
        JSON.stringify({ error: 'No prices found' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    averagePrice = averagePrice / priceCount;
    const leaderPrice = parseFloat((averagePrice * 1.15).toFixed(2));

    const result: ProductData & { averagePrice: number; leaderPrice: number } = {
      upc,
      name: productInfo.name,
      amazonPrice,
      walmartPrice,
      image: productInfo.image,
      averagePrice: parseFloat(averagePrice.toFixed(2)),
      leaderPrice,
    };

    return new Response(
      JSON.stringify(result),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in product-lookup:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});