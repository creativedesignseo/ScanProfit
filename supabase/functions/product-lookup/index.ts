import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import OpenAI from "npm:openai@4.47.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ProductData {
  upc: string;
  title: string;
  description: string;
  category: string;
  amazonPrice: number;
  walmartPrice: number;
  averagePrice: number;
  leaderPrice: number;
  image?: string;
}

async function lookupProductWithOpenAI(upc: string): Promise<ProductData> {
  try {
    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    });

    const prompt = `Busca el producto con código de barras UPC: ${upc}

Necesito que me proporciones la siguiente información en formato JSON:

1. Consulta en Amazon y Walmart el producto correspondiente a este código de barras
2. Obtén el título completo del producto
3. Proporciona una descripción corta (2-3 oraciones) del producto
4. Indica la categoría del producto
5. Proporciona el precio actual en Amazon (en USD)
6. Proporciona el precio actual en Walmart (en USD)

IMPORTANTE:
- Si no encuentras precios exactos, proporciona precios estimados realistas basados en productos similares
- Los precios deben ser números positivos mayores a 0
- Si el producto no existe, genera información realista basada en el UPC

Responde SOLO con un JSON en este formato exacto:
{
  "title": "nombre completo del producto",
  "description": "descripción corta del producto",
  "category": "categoría del producto",
  "amazonPrice": 29.99,
  "walmartPrice": 27.99,
  "imageUrl": "URL de imagen del producto si está disponible o null"
}`;

    console.log('Consultando OpenAI para UPC:', upc);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const responseText = completion.choices[0]?.message?.content || '{}';
    console.log('Respuesta de OpenAI:', responseText);

    const cleanedResponse = responseText.replace(/```json\n?|```\n?/g, '').trim();
    const productInfo = JSON.parse(cleanedResponse);

    const amazonPrice = parseFloat(productInfo.amazonPrice) || 0;
    const walmartPrice = parseFloat(productInfo.walmartPrice) || 0;

    if (amazonPrice === 0 && walmartPrice === 0) {
      throw new Error('No se pudieron obtener precios válidos');
    }

    const averagePrice = parseFloat(((amazonPrice + walmartPrice) / 2).toFixed(2));

    const result: ProductData = {
      upc,
      title: productInfo.title || 'Producto sin nombre',
      description: productInfo.description || 'Descripción no disponible',
      category: productInfo.category || 'General',
      amazonPrice,
      walmartPrice,
      averagePrice,
      leaderPrice: 0,
      image: productInfo.imageUrl || null,
    };

    return result;
  } catch (error) {
    console.error('Error consultando OpenAI:', error);
    throw error;
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

    console.log(`Buscando producto con UPC: ${upc}`);

    const productData = await lookupProductWithOpenAI(upc);

    return new Response(
      JSON.stringify(productData),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error en product-lookup:', error);
    return new Response(
      JSON.stringify({
        error: 'No se pudo obtener información del producto',
        details: String(error)
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});