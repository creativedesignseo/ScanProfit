import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ProductData {
  title: string;
  upc: string;
  amazonPrice: number;
  walmartPrice: number;
  averagePrice: number;
  leaderPrice: number;
  expirationDate?: string;
  scannedBy?: string;
  timestamp: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const GOOGLE_SHEETS_API_KEY = Deno.env.get('GOOGLE_SHEETS_API_KEY');
    const GOOGLE_SPREADSHEET_ID = Deno.env.get('GOOGLE_SPREADSHEET_ID');

    if (!GOOGLE_SHEETS_API_KEY || !GOOGLE_SPREADSHEET_ID) {
      return new Response(
        JSON.stringify({ 
          error: 'Google Sheets credentials not configured',
          message: 'Por favor configura GOOGLE_SHEETS_API_KEY y GOOGLE_SPREADSHEET_ID en las variables de entorno'
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const productData: ProductData = await req.json();

    const row = [
      new Date(productData.timestamp).toLocaleString('es-ES'),
      productData.title,
      productData.upc,
      productData.amazonPrice,
      productData.walmartPrice,
      productData.averagePrice,
      productData.leaderPrice,
      productData.expirationDate || '',
      productData.scannedBy || '',
    ];

    const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SPREADSHEET_ID}/values/A:I:append?valueInputOption=RAW&key=${GOOGLE_SHEETS_API_KEY}`;

    const response = await fetch(appendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [row],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Sheets API error:', errorText);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to sync to Google Sheets',
          details: errorText
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const result = await response.json();

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Product synced to Google Sheets',
        updatedRange: result.updates?.updatedRange
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error in sync-to-sheets function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error.message
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});