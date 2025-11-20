import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => null);

    if (!body || !body.upc) {
      return new Response(JSON.stringify({ error: 'UPC is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const N8N_WEBHOOK_URL = Deno.env.get('N8N_WEBHOOK_URL');
    const N8N_SHARED_SECRET = Deno.env.get('N8N_SHARED_SECRET');

    if (!N8N_WEBHOOK_URL) {
      return new Response(JSON.stringify({ error: 'N8N_WEBHOOK_URL not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Forward to n8n and add secret header
    const forwardRes = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(N8N_SHARED_SECRET ? { 'X-Webhook-Token': N8N_SHARED_SECRET } : {}),
      },
      body: JSON.stringify(body),
    });

    const text = await forwardRes.text();

    return new Response(text, {
      status: forwardRes.status,
      headers: { ...corsHeaders, 'Content-Type': forwardRes.headers.get('content-type') || 'application/json' },
    });
  } catch (error) {
    console.error('forward-to-n8n error:', error);
    return new Response(JSON.stringify({ error: 'Internal error', details: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
