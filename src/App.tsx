import React, { useState } from 'react';
import { sendScan } from './services/webhook';

function App() {
  const [lastResult, setLastResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleScanComplete(scannedCode: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await sendScan(scannedCode);
      setLastResult(res ? JSON.stringify(res) : 'ok');
    } catch (err: any) {
      console.error('Error enviando a n8n:', err);
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>ScanProfit</h1>
      {/* Reemplaza el botón por tu componente de escaneo que llame handleScanComplete */}
      <button onClick={() => handleScanComplete('TEST-CODE-123')} disabled={loading}>
        Simular escaneo
      </button>
      {loading && <p>Enviando...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {lastResult && <pre>{lastResult}</pre>}
    </div>
  );
}

export default App;