import { serve } from 'std/server';

serve(async (req) => {
  // Allow CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });
  }

  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  try {
    const body = await req.json();
    const N8N_URL = Deno.env.get('N8N_WEBHOOK_URL');
    if (!N8N_URL) return new Response('N8N_WEBHOOK_URL not configured', { status: 500 });

    const r = await fetch(N8N_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const text = await r.text();
    const headers = { 'Access-Control-Allow-Origin': '*' };
    return new Response(text, { status: r.status, headers });
  } catch (e) {
    return new Response(String(e), { status: 500 });
  }
});
