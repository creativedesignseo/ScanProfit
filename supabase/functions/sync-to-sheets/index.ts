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

async function getAccessToken(serviceAccountEmail: string, privateKey: string): Promise<string> {
  const header = {
    alg: "RS256",
    typ: "JWT",
  };

  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: serviceAccountEmail,
    scope: "https://www.googleapis.com/auth/spreadsheets",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  };

  const encodedHeader = btoa(JSON.stringify(header));
  const encodedClaim = btoa(JSON.stringify(claim));
  const unsignedToken = `${encodedHeader}.${encodedClaim}`;

  const encoder = new TextEncoder();
  const data = encoder.encode(unsignedToken);

  const pemKey = privateKey
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\s/g, "");

  const binaryKey = Uint8Array.from(atob(pemKey), c => c.charCodeAt(0));

  const key = await crypto.subtle.importKey(
    "pkcs8",
    binaryKey,
    {
      name: "RSASSA-PKCS1-v1_5",
      hash: "SHA-256",
    },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, data);
  const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature)));

  const jwt = `${unsignedToken}.${encodedSignature}`;

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });

  if (!tokenResponse.ok) {
    throw new Error(`Failed to get access token: ${await tokenResponse.text()}`);
  }

  const tokenData = await tokenResponse.json();
  return tokenData.access_token;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const GOOGLE_SERVICE_ACCOUNT_EMAIL = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_EMAIL');
    const GOOGLE_PRIVATE_KEY = Deno.env.get('GOOGLE_PRIVATE_KEY');
    const GOOGLE_SPREADSHEET_ID = Deno.env.get('GOOGLE_SPREADSHEET_ID');

    if (!GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY || !GOOGLE_SPREADSHEET_ID) {
      return new Response(
        JSON.stringify({
          error: 'Google Sheets credentials not configured',
          message: 'Por favor configura GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY y GOOGLE_SPREADSHEET_ID en las variables de entorno'
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

    const accessToken = await getAccessToken(GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY);

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

    const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SPREADSHEET_ID}/values/A:I:append?valueInputOption=RAW`;

    const response = await fetch(appendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
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