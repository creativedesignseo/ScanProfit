import { useState } from 'react';
import { Scan, Keyboard, Loader2 } from 'lucide-react';

interface ProductScannerProps {
  onScan: (upc: string) => void;
  isLoading: boolean;
}

export function ProductScanner({ onScan, isLoading }: ProductScannerProps) {
  const [upc, setUpc] = useState('');
  const [inputMode, setInputMode] = useState<'manual' | 'scanner'>('manual');

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
        <div>
          <label htmlFor="upc" className="block text-sm font-medium text-slate-700 mb-2">
            {inputMode === 'manual' ? 'Ingresa el código' : 'Escanea el código de barras'}
          </label>
          <div className="relative">
            <input
              id="upc"
              type="text"
              value={upc}
              onChange={(e) => setUpc(e.target.value)}
              placeholder={inputMode === 'manual' ? 'Ej: 7501055363278' : 'Escanea aquí...'}
              className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-slate-900 placeholder-slate-400"
              disabled={isLoading}
              autoFocus
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
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-amber-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-95"
        >
          <Scan className="w-5 h-5" />
          <span>{isLoading ? 'Buscando...' : 'Buscar Producto'}</span>
        </button>
      </form>
    </div>
  );
}
