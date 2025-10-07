// @ts-nocheck - Este archivo usa APIs de Deno disponibles en Supabase Edge Functions
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

function generateRealisticPrice(productName: string | undefined, upc: string, variance: number = 0): number {
  const name = (productName || '').toLowerCase();
  let basePrice = 20;

  if (name.includes('auricular') || name.includes('headphone') || name.includes('bluetooth')) {
    basePrice = 50 + Math.random() * 100;
  } else if (name.includes('laptop') || name.includes('computador')) {
    basePrice = 400 + Math.random() * 800;
  } else if (name.includes('phone') || name.includes('móvil') || name.includes('celular')) {
    basePrice = 200 + Math.random() * 600;
  } else if (name.includes('tv') || name.includes('television')) {
    basePrice = 300 + Math.random() * 700;
  } else if (name.includes('cuchillo') || name.includes('knife') || name.includes('sartén') || name.includes('pan')) {
    basePrice = 30 + Math.random() * 70;
  } else if (name.includes('café') || name.includes('coffee') || name.includes('cafetera')) {
    basePrice = 25 + Math.random() * 50;
  } else if (name.includes('juego') || name.includes('set') || name.includes('kit')) {
    basePrice = 35 + Math.random() * 80;
  } else if (name.includes('libro') || name.includes('book')) {
    basePrice = 10 + Math.random() * 30;
  } else if (name.includes('ropa') || name.includes('shirt') || name.includes('pant')) {
    basePrice = 15 + Math.random() * 50;
  } else if (name.includes('juguete') || name.includes('toy')) {
    basePrice = 15 + Math.random() * 60;
  } else if (name.includes('herramienta') || name.includes('tool')) {
    basePrice = 25 + Math.random() * 100;
  } else {
    const seed = parseInt(upc.slice(-4)) || 1000;
    basePrice = (seed / 100) + Math.random() * 30 + 10;
  }

  const finalPrice = basePrice * (1 + variance);
  return parseFloat(finalPrice.toFixed(2));
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
    
    if (!productInfo) {
      return new Response(
        JSON.stringify({ error: 'Product not found' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    console.log(`Product found: ${productInfo.name}`);

    const amazonPrice = generateRealisticPrice(productInfo.name, upc, 0.05);
    const walmartPrice = generateRealisticPrice(productInfo.name, upc, -0.03);

    console.log(`Amazon price: $${amazonPrice}, Walmart price: $${walmartPrice}`);

    const fichaEnriquecida = await generarFichaProducto(
      productInfo.name,
      productInfo.category || 'General',
      productInfo.brand || 'Desconocida',
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
      image: productInfo.image,
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