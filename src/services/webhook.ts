export async function sendScan(scannedCode: string) {
  const useProxy = (import.meta.env.VITE_USE_PROXY === 'true');
  const proxyUrl = '/api/scan';
  const n8nUrl = import.meta.env.VITE_N8N_WEBHOOK_URL as string;
  const payload = { code: scannedCode, timestamp: Date.now() };
  const url = useProxy ? proxyUrl : n8nUrl;
  if (!url) throw new Error('VITE_N8N_WEBHOOK_URL no está configurada y VITE_USE_PROXY no está activado');

  const headers: Record<string,string> = { 'Content-Type': 'application/json' };

  try {
    const resp = await fetch(url, { method: 'POST', headers, body: JSON.stringify(payload) });
    if (!resp.ok) {
      const txt = await resp.text();
      throw new Error(`Webhook responded ${resp.status}: ${txt}`);
    }
    try { return await resp.json(); } catch { return null; }
  } catch (err) {
    throw err;
  }
}
