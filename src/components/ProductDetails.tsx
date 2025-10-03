import { CheckCircle2, DollarSign } from 'lucide-react';
import type { Product } from '../types/product';

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8 border border-slate-200">
      <div className="flex items-center mb-4">
        <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mr-2" />
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800">Producto Encontrado</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 col-span-1 md:col-span-2">
          <img
            src={product.image || 'https://placehold.co/100x100/6b7280/ffffff?text=Sin+Imagen'}
            alt={product.name}
            className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border-2 border-slate-200 shadow-sm flex-shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://placehold.co/100x100/6b7280/ffffff?text=Sin+Imagen';
            }}
          />
          <div className="flex-1 min-w-0">
            <p className="text-base sm:text-lg md:text-xl font-bold text-slate-800 break-words">{product.name}</p>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">UPC: {product.upc}</p>
          </div>
        </div>

        <div className="text-center p-3 sm:p-4 bg-green-50 border-2 border-green-300 rounded-lg">
          <p className="text-xs sm:text-sm font-semibold text-green-700 mb-1">Amazon</p>
          <p className="text-2xl sm:text-3xl font-bold text-green-700">${product.amazonPrice.toFixed(2)}</p>
        </div>

        <div className="text-center p-3 sm:p-4 bg-blue-50 border-2 border-blue-300 rounded-lg">
          <p className="text-xs sm:text-sm font-semibold text-blue-700 mb-1">Walmart</p>
          <p className="text-2xl sm:text-3xl font-bold text-blue-700">${product.walmartPrice.toFixed(2)}</p>
        </div>

        <div className="text-center p-4 sm:p-5 bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-400 rounded-lg col-span-1 md:col-span-2 shadow-sm">
          <div className="flex items-center justify-center mb-2">
            <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-orange-700 mr-1" />
            <p className="text-xs sm:text-sm font-semibold text-orange-700">Precio LÍDER (Reventa)</p>
          </div>
          <p className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-orange-700">${product.leaderPrice}</p>
        </div>
      </div>
    </div>
  );
}
