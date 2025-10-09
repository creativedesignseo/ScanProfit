import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import OpenAI from "npm:openai@4.47.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ProductData {
  upc: string;
  nombre: string;
  precioAmazon: number;
  precioWalmart: number;
  precioPromedio: number;
  descripcion: string;
  fichaTecnica: {
    marca: string;
    categoria: string;
    peso: string;
    origen: string;
    codigo_barras: string;
  };
  image?: string;
  leaderPrice: number;
}

interface AmazonProduct {
  product_title?: string;
  product_price?: string;
  product_original_price?: string;
  product_photo?: string;
  product_description?: string;
  brand?: string;
  category?: string;
}

async function searchAmazonRealPrice(query: string, asin?: string): Promise<{ price: number; title?: string; image?: string; brand?: string } | null> {
  try {
    const rapidApiKey = Deno.env.get('RAPIDAPI_KEY');
    if (!rapidApiKey) {
      console.error('RAPIDAPI_KEY not found in environment');
      return null;
    }

    let url = '';
    if (asin) {
      url = `https://real-time-amazon-data.p.rapidapi.com/product-details?asin=${asin}&country=US`;
    } else {
      url = `https://real-time-amazon-data.p.rapidapi.com/search?query=${encodeURIComponent(query)}&page=1&country=US&sort_by=RELEVANCE&product_condition=ALL`;
    }

    console.log('Fetching Amazon data from RapidAPI...');
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': rapidApiKey,
        'X-RapidAPI-Host': 'real-time-amazon-data.p.rapidapi.com'
      }
    });

    if (!response.ok) {
      console.error('RapidAPI response error:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    console.log('RapidAPI response received');

    let product: AmazonProduct | null = null;

    if (data.data && data.data.products && data.data.products.length > 0) {
      product = data.data.products[0];
    } else if (data.data && data.data.product_title) {
      product = data.data;
    }

    if (!product) {
      console.log('No product found in RapidAPI response');
      return null;
    }

    let price = 0;
    const priceStr = product.product_price || product.product_original_price || '';
    const priceMatch = priceStr.match(/[\d,]+\.?\d*/);
    if (priceMatch) {
      price = parseFloat(priceMatch[0].replace(',', ''));
    }

    if (price === 0) {
      console.log('Could not extract valid price from Amazon data');
      return null;
    }

    return {
      price,
      title: product.product_title,
      image: product.product_photo,
      brand: product.brand
    };
  } catch (error) {
    console.error('Error fetching Amazon price from RapidAPI:', error);
    return null;
  }
}

async function searchWalmartRealPrice(query: string): Promise<{ price: number; title?: string; image?: string } | null> {
  try {
    const rapidApiKey = Deno.env.get('RAPIDAPI_KEY');
    if (!rapidApiKey) {
      return null;
    }

    console.log('Fetching Walmart data from RapidAPI...');
    const response = await fetch(
      `https://walmart-api4.p.rapidapi.com/products/search?query=${encodeURIComponent(query)}&page=1&sortBy=best_seller`,
      {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': rapidApiKey,
          'X-RapidAPI-Host': 'walmart-api4.p.rapidapi.com'
        }
      }
    );

    if (!response.ok) {
      console.error('Walmart RapidAPI response error:', response.status);
      return null;
    }

    const data = await response.json();

    if (data.products && data.products.length > 0) {
      const product = data.products[0];
      const price = parseFloat(product.price || product.currentPrice || 0);

      if (price > 0) {
        return {
          price,
          title: product.title || product.name,
          image: product.thumbnail || product.image
        };
      }
    }

    console.log('No valid Walmart product found');
    return null;
  } catch (error) {
    console.error('Error fetching Walmart price from RapidAPI:', error);
    return null;
  }
}

async function searchUPCDatabase(upc: string): Promise<{ name: string; category?: string; brand?: string; image?: string } | null> {
  console.log(`Searching for UPC: ${upc}`);
  
  try {
    console.log('Trying OpenFoodFacts...');
    const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${upc}.json`);
    
    if (response.ok) {
      const data = await response.json();
      if (data.status === 1 && data.product) {
        console.log('Found in OpenFoodFacts:', data.product.product_name);
        return {
          name: data.product.product_name || data.product.generic_name || 'Producto',
          category: data.product.categories || '',
          brand: data.product.brands || '',
          image: data.product.image_url || data.product.image_front_url,
        };
      }
    }
  } catch (error) {
    console.error('OpenFoodFacts error:', error);
  }

  try {
    console.log('Trying UPCItemDB...');
    const response = await fetch(`https://api.upcitemdb.com/prod/trial/lookup?upc=${upc}`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      
      if (data.items && data.items.length > 0) {
        const item = data.items[0];
        console.log('Found in UPCItemDB:', item.title);
        return {
          name: item.title || item.brand || 'Producto sin nombre',
          category: item.category || '',
          brand: item.brand || '',
          image: item.images && item.images.length > 0 ? item.images[0] : undefined,
        };
      }
    }
  } catch (error) {
    console.error('UPCItemDB error:', error);
  }

  console.log('Product not found in databases, generating generic product');
  return {
    name: `Producto ${upc.slice(-6)}`,
    category: 'General',
    brand: 'Desconocida',
    image: 'https://images.pexels.com/photos/264547/pexels-photo-264547.jpeg?auto=compress&cs=tinysrgb&w=400',
  };
}


async function generarFichaProducto(
  nombre: string,
  categoria: string,
  marca: string,
  precioAmazon: number,
  precioWalmart: number,
  upc: string
): Promise<{
  nombre: string;
  precioAmazon: number;
  precioWalmart: number;
  precioPromedio: number;
  descripcion: string;
  fichaTecnica: {
    marca: string;
    categoria: string;
    peso: string;
    origen: string;
    codigo_barras: string;
  };
}> {
  try {
    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    });

    const precioPromedio = parseFloat(((precioAmazon + precioWalmart) / 2).toFixed(2));

    const prompt = `Eres un asistente experto en productos de consumo. Dado el siguiente producto, genera una ficha completa en formato JSON.

Producto:
- Nombre: ${nombre}
- Categoría: ${categoria}
- Marca: ${marca}
- Precio Amazon: $${precioAmazon}
- Precio Walmart: $${precioWalmart}
- Precio Promedio: $${precioPromedio}
- Código de barras: ${upc}

Genera un JSON con la siguiente estructura exacta:
{
  "nombre": "<nombre mejorado del producto>",
  "precioAmazon": ${precioAmazon},
  "precioWalmart": ${precioWalmart},
  "precioPromedio": ${precioPromedio},
  "descripcion": "<descripción detallada de 2-3 oraciones del producto, sus características y beneficios>",
  "fichaTecnica": {
    "marca": "<marca del producto>",
    "categoria": "<categoría específica>",
    "peso": "<peso estimado realista con unidad, ej: 500g, 1.2kg, N/A si no aplica>",
    "origen": "<país de origen probable o 'Internacional' si no se sabe>",
    "codigo_barras": "${upc}"
  }
}

IMPORTANTE:
- Responde SOLO con el JSON, sin texto adicional
- Los precios deben ser números, no strings
- La descripción debe ser profesional y útil
- El peso debe incluir unidad (g, kg, ml, L, oz, lb, etc.)
- Si es un producto digital o servicio, peso puede ser "N/A"`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const responseText = completion.choices[0]?.message?.content || '{}';
    console.log('OpenAI Response:', responseText);

    const cleanedResponse = responseText.replace(/```json\n?|```\n?/g, '').trim();
    const fichaProducto = JSON.parse(cleanedResponse);

    return fichaProducto;
  } catch (error) {
    console.error('Error generating product data with OpenAI:', error);
    
    const precioPromedio = parseFloat(((precioAmazon + precioWalmart) / 2).toFixed(2));
    
    return {
      nombre,
      precioAmazon,
      precioWalmart,
      precioPromedio,
      descripcion: `${nombre} es un producto de calidad disponible en Amazon y Walmart a precios competitivos.`,
      fichaTecnica: {
        marca: marca || 'Desconocida',
        categoria: categoria || 'General',
        peso: 'N/A',
        origen: 'Internacional',
        codigo_barras: upc,
      },
    };
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

    console.log(`Looking up product with UPC: ${upc}`);

    const productInfo = await searchUPCDatabase(upc);
    console.log(`Product found: ${productInfo.name}`);

    let amazonPrice = 0;
    let walmartPrice = 0;
    let realProductName = productInfo.name;
    let realProductImage = productInfo.image;
    let realBrand = productInfo.brand;

    console.log('Fetching real prices from Amazon via RapidAPI...');
    const amazonData = await searchAmazonRealPrice(productInfo.name);

    if (amazonData && amazonData.price > 0) {
      amazonPrice = amazonData.price;
      if (amazonData.title) realProductName = amazonData.title;
      if (amazonData.image) realProductImage = amazonData.image;
      if (amazonData.brand) realBrand = amazonData.brand;
      console.log(`Real Amazon price found: $${amazonPrice}`);
    } else {
      console.log('Amazon price not found via RapidAPI');
    }

    console.log('Fetching real prices from Walmart via RapidAPI...');
    const walmartData = await searchWalmartRealPrice(productInfo.name);

    if (walmartData && walmartData.price > 0) {
      walmartPrice = walmartData.price;
      console.log(`Real Walmart price found: $${walmartPrice}`);
    } else {
      console.log('Walmart price not found via RapidAPI');
    }

    if (amazonPrice === 0 && walmartPrice === 0) {
      return new Response(
        JSON.stringify({
          error: 'No se encontraron precios reales para este producto',
          message: 'No pudimos encontrar precios en Amazon ni Walmart para este producto. Intenta con otro código de barras.'
        }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (amazonPrice === 0) amazonPrice = walmartPrice;
    if (walmartPrice === 0) walmartPrice = amazonPrice;

    console.log(`Final real prices - Amazon: $${amazonPrice}, Walmart: $${walmartPrice}`);

    const fichaEnriquecida = await generarFichaProducto(
      realProductName,
      productInfo.category || 'General',
      realBrand || productInfo.brand || 'Desconocida',
      amazonPrice,
      walmartPrice,
      upc
    );

    const leaderPrice = parseFloat((fichaEnriquecida.precioPromedio * 1.15).toFixed(2));

    const result: ProductData = {
      upc,
      nombre: fichaEnriquecida.nombre,
      precioAmazon: fichaEnriquecida.precioAmazon,
      precioWalmart: fichaEnriquecida.precioWalmart,
      precioPromedio: fichaEnriquecida.precioPromedio,
      descripcion: fichaEnriquecida.descripcion,
      fichaTecnica: fichaEnriquecida.fichaTecnica,
      image: realProductImage,
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
      JSON.stringify({ error: 'Internal server error', details: String(error) }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});