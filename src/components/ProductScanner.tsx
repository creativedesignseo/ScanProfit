import { useState, useEffect, useRef } from 'react';
import { Scan, Keyboard, Loader2, Camera } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';

interface ProductScannerProps {
  onScan: (upc: string) => void;
  isLoading: boolean;
}

export function ProductScanner({ onScan, isLoading }: ProductScannerProps) {
  const [upc, setUpc] = useState('');
  const [inputMode, setInputMode] = useState<'manual' | 'scanner'>('manual');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const scannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Cleanup scanner when component unmounts or mode changes
    return () => {
      if (html5QrCodeRef.current?.isScanning) {
        html5QrCodeRef.current.stop().catch((err) => {
          console.error('Error stopping scanner:', err);
        });
      }
    };
  }, []);

  useEffect(() => {
    if (inputMode === 'scanner' && !isCameraActive && !html5QrCodeRef.current?.isScanning) {
      startCamera();
    } else if (inputMode === 'manual' && html5QrCodeRef.current?.isScanning) {
      stopCamera();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputMode]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode('qr-reader');
      }

      const qrCodeSuccessCallback = (decodedText: string) => {
        console.log('QR Code scanned:', decodedText);
        // Automatically submit when a code is scanned
        onScan(decodedText);
        setUpc(decodedText);
        // Optionally stop camera after successful scan
        stopCamera();
      };

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      };

      await html5QrCodeRef.current.start(
        { facingMode: "environment" },
        config,
        qrCodeSuccessCallback,
        (errorMessage) => {
          // Ignore frequent errors from scanning attempts
          if (!errorMessage.includes('NotFoundException')) {
            console.log('QR Code scan error:', errorMessage);
          }
        }
      );

      setIsCameraActive(true);
    } catch (err) {
      console.error('Error starting camera:', err);
      setCameraError('No se pudo acceder a la cámara. Verifica los permisos.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = async () => {
    try {
      if (html5QrCodeRef.current?.isScanning) {
        await html5QrCodeRef.current.stop();
      }
      setIsCameraActive(false);
    } catch (err) {
      console.error('Error stopping camera:', err);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (upc.trim() && !isLoading) {
      onScan(upc.trim());
      setUpc('');
    }
  };

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-6 border border-slate-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-slate-800">Escanear Producto</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => setInputMode('manual')}
            className={`flex-1 sm:flex-none flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              inputMode === 'manual'
                ? 'bg-orange-500 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Keyboard className="w-4 h-4" />
            <span className="text-sm">Manual</span>
          </button>
          <button
            onClick={() => setInputMode('scanner')}
            className={`flex-1 sm:flex-none flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              inputMode === 'scanner'
                ? 'bg-orange-500 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Scan className="w-4 h-4" />
            <span className="text-sm">Escáner</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {inputMode === 'scanner' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
              <Camera className="w-4 h-4" />
              <span>Coloca el código de barras frente a la cámara</span>
            </div>
            <div
              id="qr-reader"
              ref={scannerRef}
              className="w-full rounded-lg overflow-hidden border-2 border-orange-500 bg-slate-900"
              style={{ minHeight: '300px' }}
            />
            {cameraError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {cameraError}
              </div>
            )}
            {isCameraActive && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                <Camera className="w-4 h-4" />
                <span>Cámara activa - Escanea el código de barras</span>
              </div>
            )}
          </div>
        )}

        <div>
          <label htmlFor="upc" className="block text-sm font-medium text-slate-700 mb-2">
            {inputMode === 'manual' ? 'Ingresa el código' : 'Código escaneado / Manual'}
          </label>
          <div className="relative">
            <input
              id="upc"
              type="text"
              value={upc}
              onChange={(e) => setUpc(e.target.value)}
              placeholder={inputMode === 'manual' ? 'Ej: 7501055363278' : 'Escanea o ingresa manualmente...'}
              className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-slate-900 placeholder-slate-400"
              disabled={isLoading}
              autoFocus={inputMode === 'manual'}
              autoComplete="off"
            />
            {isLoading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Loader2 className="w-5 h-5 text-orange-500 animate-spin" />
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={!upc.trim() || isLoading}
          className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white px-8 py-5 rounded-xl font-bold text-lg hover:from-orange-600 hover:to-amber-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl active:scale-95"
        >
          <Scan className="w-7 h-7" />
          <span>{isLoading ? 'Buscando...' : 'Buscar Producto'}</span>
        </button>
      </form>
    </div>
  );
}
