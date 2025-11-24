const N8N_WEBHOOK_URL = 'https://n8n.adspubli.com/webhook-test/scan';

export async function sendUpcToN8n(upc: string): Promise<boolean> {
  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        upc: upc.toString().trim(),
      }),
    });

    if (!response.ok) {
      console.error(`N8n error: ${response.status} ${response.statusText}`);
      return false;
    }

    console.log('UPC sent to n8n successfully');
    return true;
  } catch (error) {
    console.error('Error sending UPC to n8n:', error);
    return false;
  }
}
