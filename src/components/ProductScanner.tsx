import { useState, useEffect, useRef } from 'react';
import { Scan, Keyboard, Loader2, Camera } from 'lucide-react';

interface ProductScannerProps {
  onScan: (upc: string) => void;
  isLoading: boolean;
}

export function ProductScanner({ onScan, isLoading }: ProductScannerProps) {
  const [upc, setUpc] = useState('');
  const [inputMode, setInputMode] = useState<'manual' | 'scanner'>('manual');
  const [validationError, setValidationError] = useState('');
  const [isAutoSearching, setIsAutoSearching] = useState(false);
  const autoSearchTriggered = useRef(false);

  // Auto-search effect when UPC is 12 or 13 digits
  useEffect(() => {
    const trimmedUpc = upc.trim();
    
    // Only trigger auto-search for valid UPC/EAN lengths (12 or 13 digits)
    if ((trimmedUpc.length === 12 || trimmedUpc.length === 13) && !isLoading && !autoSearchTriggered.current) {
      autoSearchTriggered.current = true;
      setIsAutoSearching(true);
      setValidationError('');
      
      // Trigger the scan
      onScan(trimmedUpc);
      
      // Clear the input and reset after a short delay
      setTimeout(() => {
        setUpc('');
        setIsAutoSearching(false);
        autoSearchTriggered.current = false;
      }, 300);
    }
    
    // Reset the auto-search flag if user modifies the input
    if (trimmedUpc.length !== 12 && trimmedUpc.length !== 13) {
      autoSearchTriggered.current = false;
      setIsAutoSearching(false);
    }
  }, [upc, isLoading, onScan]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Only allow numbers
    const numericValue = value.replace(/[^0-9]/g, '');
    
    // Limit to 13 characters
    const limitedValue = numericValue.slice(0, 13);
    
    setUpc(limitedValue);
    
    // Validation feedback
    if (limitedValue.length > 0 && limitedValue.length < 12) {
      setValidationError('El código debe tener 12 o 13 dígitos');
    } else if (limitedValue.length > 13) {
      setValidationError('Máximo 13 dígitos');
    } else {
      setValidationError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedUpc = upc.trim();
    
    if (!trimmedUpc) {
      setValidationError('Por favor ingresa un código');
      return;
    }
    
    if (trimmedUpc.length < 12) {
      setValidationError('El código debe tener al menos 12 dígitos');
      return;
    }
    
    if (trimmedUpc.length > 13) {
      setValidationError('El código no puede tener más de 13 dígitos');
      return;
    }
    
    if (!isLoading) {
      setValidationError('');
      onScan(trimmedUpc);
      setUpc('');
    }
  };

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-6 border border-slate-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-slate-800">Escanear Producto</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            type="button"
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
            type="button"
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
          <button
            type="button"
            onClick={() => {
              alert('Funcionalidad de cámara próximamente disponible');
            }}
            className="flex-1 sm:flex-none flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all bg-slate-100 text-slate-600 hover:bg-slate-200 opacity-75"
            title="Próximamente: Escaneo por cámara"
          >
            <Camera className="w-4 h-4" />
            <span className="text-sm">Cámara</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="upc" className="block text-sm font-medium text-slate-700 mb-2">
            {inputMode === 'manual' ? 'Ingresa el código' : 'Escanea el código de barras'}
          </label>
          <div className="relative">
            <input
              id="upc"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={upc}
              onChange={handleInputChange}
              placeholder={inputMode === 'manual' ? 'Ej: 7501055363278' : 'Escanea aquí...'}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-orange-500 text-slate-900 placeholder-slate-400 ${
                validationError 
                  ? 'border-red-300 focus:border-red-500' 
                  : isAutoSearching 
                    ? 'border-green-300 focus:border-green-500'
                    : 'border-slate-300 focus:border-orange-500'
              }`}
              disabled={isLoading}
              autoFocus
              autoComplete="off"
              maxLength={13}
            />
            {(isLoading || isAutoSearching) && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Loader2 className="w-5 h-5 text-orange-500 animate-spin" />
              </div>
            )}
            {upc.length > 0 && !isLoading && !isAutoSearching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-slate-500 font-medium">
                {upc.length}/13
              </div>
            )}
          </div>
          {validationError && (
            <p className="mt-1 text-sm text-red-600">{validationError}</p>
          )}
          {isAutoSearching && (
            <p className="mt-1 text-sm text-green-600">✓ Búsqueda automática activada</p>
          )}
        </div>

        <button
          type="submit"
          disabled={!upc.trim() || isLoading}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-amber-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-95"
        >
          <Scan className="w-5 h-5" />
          <span>{isLoading ? 'Buscando...' : 'Buscar Producto'}</span>
        </button>
      </form>
    </div>
  );
}
