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
  precioAmazon?: number;
  precioWalmart?: number;
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
  priceMeta: {
    amazon: 'upcitemdb_offer' | 'missing';
    walmart: 'upcitemdb_offer' | 'missing';
  };
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

async function fetchExternalPrices(upc: string): Promise<{
  precioAmazon?: number;
  precioWalmart?: number;
  priceMeta: {
    amazon: 'upcitemdb_offer' | 'missing';
    walmart: 'upcitemdb_offer' | 'missing';
  };
}> {
  console.log('Fetching external prices from UPCItemDB...');
  
  const priceMeta = {
    amazon: 'missing' as const,
    walmart: 'missing' as const,
  };
  
  let precioAmazon: number | undefined;
  let precioWalmart: number | undefined;
  
  try {
    const response = await fetch(`https://api.upcitemdb.com/prod/trial/lookup?upc=${upc}`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      
      if (data.items && data.items.length > 0) {
        const item = data.items[0];
        
        if (item.offers && Array.isArray(item.offers)) {
          console.log(`Found ${item.offers.length} offers in UPCItemDB`);
          
          for (const offer of item.offers) {
            if (offer.merchant && offer.price) {
              const merchant = offer.merchant.toLowerCase();
              const price = parseFloat(offer.price);
              
              if (!isNaN(price) && price > 0) {
                if (merchant.includes('amazon') && !precioAmazon) {
                  precioAmazon = parseFloat(price.toFixed(2));
                  priceMeta.amazon = 'upcitemdb_offer';
                  console.log(`Found Amazon price: $${precioAmazon}`);
                }
                
                if (merchant.includes('walmart') && !precioWalmart) {
                  precioWalmart = parseFloat(price.toFixed(2));
                  priceMeta.walmart = 'upcitemdb_offer';
                  console.log(`Found Walmart price: $${precioWalmart}`);
                }
              }
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('Error fetching prices from UPCItemDB:', error);
  }
  
  return { precioAmazon, precioWalmart, priceMeta };
}

async function generarFichaProducto(
  nombre: string,
  categoria: string,
  marca: string,
  precioAmazon: number | undefined,
  precioWalmart: number | undefined,
  precioPromedio: number,
  upc: string
): Promise<{
  nombre: string;
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

    const pricesInfo = [];
    if (precioAmazon !== undefined) {
      pricesInfo.push(`Precio Amazon: $${precioAmazon}`);
    }
    if (precioWalmart !== undefined) {
      pricesInfo.push(`Precio Walmart: $${precioWalmart}`);
    }
    pricesInfo.push(`Precio Promedio: $${precioPromedio}`);

    const prompt = `Eres un asistente experto en productos de consumo. Dado el siguiente producto, genera una ficha completa en formato JSON.

Producto:
- Nombre: ${nombre}
- Categoría: ${categoria}
- Marca: ${marca}
${pricesInfo.join('\n')}
- Código de barras: ${upc}

Genera un JSON con la siguiente estructura exacta:
{
  "nombre": "<nombre mejorado del producto>",
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
- NO incluyas campos de precios en tu respuesta - serán agregados automáticamente
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

    return {
      nombre: fichaProducto.nombre || nombre,
      descripcion: fichaProducto.descripcion || `${nombre} - Producto disponible para análisis de precios.`,
      fichaTecnica: fichaProducto.fichaTecnica || {
        marca: marca || 'Desconocida',
        categoria: categoria || 'General',
        peso: 'N/A',
        origen: 'Internacional',
        codigo_barras: upc,
      },
    };
  } catch (error) {
    console.error('Error generating product data with OpenAI:', error);
    
    return {
      nombre,
      descripcion: `${nombre} - Producto generado automáticamente con ficha técnica básica.`,
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

    // Fetch real external prices
    const { precioAmazon, precioWalmart, priceMeta } = await fetchExternalPrices(upc);

    // Return 404 if no prices found
    if (precioAmazon === undefined && precioWalmart === undefined) {
      console.log('No external prices found for UPC');
      return new Response(
        JSON.stringify({ error: 'No se encontraron precios para este UPC' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Calculate precioPromedio from available prices
    let precioPromedio: number;
    if (precioAmazon !== undefined && precioWalmart !== undefined) {
      precioPromedio = parseFloat(((precioAmazon + precioWalmart) / 2).toFixed(2));
    } else if (precioAmazon !== undefined) {
      precioPromedio = precioAmazon;
    } else {
      precioPromedio = precioWalmart!;
    }

    console.log(`Amazon price: ${precioAmazon ? '$' + precioAmazon : 'N/A'}, Walmart price: ${precioWalmart ? '$' + precioWalmart : 'N/A'}, Average: $${precioPromedio}`);

    // Enrich product data with OpenAI (description and fichaTecnica only)
    const fichaEnriquecida = await generarFichaProducto(
      productInfo.name,
      productInfo.category || 'General',
      productInfo.brand || 'Desconocida',
      precioAmazon,
      precioWalmart,
      precioPromedio,
      upc
    );

    const leaderPrice = parseFloat((precioPromedio * 1.15).toFixed(2));

    const result: ProductData = {
      upc,
      nombre: fichaEnriquecida.nombre,
      precioAmazon,
      precioWalmart,
      precioPromedio,
      descripcion: fichaEnriquecida.descripcion,
      fichaTecnica: fichaEnriquecida.fichaTecnica,
      image: productInfo.image,
      leaderPrice,
      priceMeta,
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