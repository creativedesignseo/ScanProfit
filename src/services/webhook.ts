export async function sendScan(scannedCode: string) {
  const N8N_WEBHOOK_URL = 'https://n8n.adspubli.com/webhook/scan';
  const payload = { upc: scannedCode.toString().trim(), timestamp: Date.now() };

  const headers: Record<string,string> = { 'Content-Type': 'application/json' };

  try {
    console.log('Sending to webhook:', N8N_WEBHOOK_URL, payload);
    const resp = await fetch(N8N_WEBHOOK_URL, { method: 'POST', headers, body: JSON.stringify(payload) });
    if (!resp.ok) {
      const txt = await resp.text();
      console.error(`Webhook error ${resp.status}:`, txt);
      throw new Error(`Webhook responded ${resp.status}: ${txt}`);
    }
    console.log('Webhook response received successfully');
    try { return await resp.json(); } catch { return null; }
  } catch (err) {
    console.error('Error sending to webhook:', err);
    throw err;
  }
}
