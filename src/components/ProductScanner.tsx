import { useState, FormEvent } from 'react';
import { Search, Barcode, Camera } from 'lucide-react';
import { CameraScanner } from './CameraScanner';

interface ProductScannerProps {
  onScan: (upc: string) => void;
  isLoading: boolean;
}

export function ProductScanner({ onScan, isLoading }: ProductScannerProps) {
  const [upc, setUpc] = useState('');
  const [showCamera, setShowCamera] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cleanUpc = upc.trim();

    if (!cleanUpc || (cleanUpc.length !== 12 && cleanUpc.length !== 13)) {
      alert('El código debe tener 12 o 13 dígitos (UPC/EAN).');
      return;
    }

    onScan(cleanUpc);
    setUpc('');
  };

  const handleInputChange = (value: string) => {
    setUpc(value);

    // Auto-búsqueda cuando se ingresan 12 o 13 dígitos
    const cleanValue = value.trim();
    if (cleanValue.length === 12 || cleanValue.length === 13) {
      if (!isLoading) {
        onScan(cleanValue);
        setTimeout(() => setUpc(''), 100);
      }
    }
  };

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8 border-4 border-baraki-black">
      <div className="flex items-center mb-3 sm:mb-4">
        <Barcode className="w-5 h-5 sm:w-6 sm:h-6 text-baraki-black mr-2" />
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-baraki-black">Escaneo Rápido</h2>
      </div>

      <p className="text-xs sm:text-sm text-baraki-black-light mb-4">
        La búsqueda es automática al ingresar 12 o 13 dígitos.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={upc}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="Ej: 854934004227"
          className="flex-grow px-4 py-3 sm:py-3.5 border-2 border-baraki-black rounded-lg focus:ring-2 focus:ring-baraki-yellow focus:border-baraki-yellow text-base sm:text-lg transition-all"
          pattern="[0-9]*"
          inputMode="numeric"
          maxLength={13}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-baraki-yellow hover:bg-baraki-yellow-dark text-baraki-black border-2 border-baraki-black px-6 py-3 sm:py-3.5 rounded-lg font-bold transition-all duration-200 w-full sm:w-auto flex items-center justify-center shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
        >
          <Search className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          <span className="text-sm sm:text-base">Buscar</span>
        </button>
      </form>

      <button
        type="button"
        className="mt-4 w-full flex items-center justify-center border-4 border-dashed border-baraki-black bg-baraki-yellow-light p-6 sm:p-7 rounded-2xl hover:bg-baraki-yellow cursor-pointer transition-all active:scale-98 shadow-lg"
        style={{ minHeight: '64px' }}
        onClick={() => setShowCamera(true)}
      >
        <Camera className="w-8 h-8 sm:w-10 sm:h-10 text-baraki-black mr-3" />
        <span className="text-baraki-black font-bold text-lg sm:text-xl">Escanear con Cámara</span>
      </button>

      {isLoading && (
        <div className="mt-4 text-baraki-black font-medium text-center flex items-center justify-center text-sm sm:text-base">
          <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-baraki-black mr-2"></div>
          Buscando producto...
        </div>
      )}

      {showCamera && (
        <CameraScanner
          onScan={(code) => {
            setShowCamera(false);
            onScan(code);
          }}
          onClose={() => setShowCamera(false)}
        />
      )}
    </div>
  );
}
