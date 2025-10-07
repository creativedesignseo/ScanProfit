import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, Camera } from 'lucide-react';

interface CameraScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
}

export function CameraScanner({ onScan, onClose }: CameraScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const scanner = new Html5Qrcode('reader');
    scannerRef.current = scanner;

    const startScanner = async () => {
      try {
        setIsScanning(true);
        await scanner.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
          },
          (decodedText) => {
            const cleanCode = decodedText.trim();
            if (cleanCode.length === 12 || cleanCode.length === 13) {
              onScan(cleanCode);
              stopScanner();
            }
          },
          (errorMessage) => {
            // Error de escaneo continuo, se ignora
          }
        );
      } catch (err) {
        setError('No se pudo acceder a la cámara. Verifica los permisos.');
        console.error('Error al iniciar el escáner:', err);
      }
    };

    const stopScanner = async () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        try {
          await scannerRef.current.stop();
          setIsScanning(false);
        } catch (err) {
          console.error('Error al detener el escáner:', err);
        }
      }
    };

    startScanner();

    return () => {
      stopScanner();
    };
  }, [onScan]);

  const handleClose = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
      } catch (err) {
        console.error('Error al detener el escáner:', err);
      }
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Camera className="w-6 h-6 text-blue-600 mr-2" />
            <h3 className="text-xl font-bold text-slate-800">Escanear Código de Barras</h3>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-500 hover:text-slate-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {error ? (
          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 text-center">
            <p className="text-red-700 font-medium">{error}</p>
            <button
              onClick={handleClose}
              className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-all"
            >
              Cerrar
            </button>
          </div>
        ) : (
          <>
            <div
              id="reader"
              className="rounded-lg overflow-hidden border-2 border-slate-300 mb-4"
            ></div>

            <div className="text-center">
              <p className="text-sm text-slate-600 mb-2">
                Coloca el código de barras frente a la cámara
              </p>
              <p className="text-xs text-slate-500">
                El escaneo se realizará automáticamente
              </p>
            </div>

            <button
              onClick={handleClose}
              className="mt-4 w-full bg-slate-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-700 transition-all"
            >
              Cancelar
            </button>
          </>
        )}
      </div>
    </div>
  );
}
