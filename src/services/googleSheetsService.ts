const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export async function syncToGoogleSheets(
  title: string,
  upc: string,
  amazonPrice: number,
  walmartPrice: number,
  averagePrice: number,
  leaderPrice: number,
  expirationDate?: string,
  scannedBy?: string
): Promise<boolean> {
  try {
    const apiUrl = `${SUPABASE_URL}/functions/v1/sync-to-sheets`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        upc,
        amazonPrice,
        walmartPrice,
        averagePrice,
        leaderPrice,
        expirationDate,
        scannedBy,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      console.error('Error syncing to Google Sheets:', response.statusText);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error syncing to Google Sheets:', error);
    return false;
  }
}
