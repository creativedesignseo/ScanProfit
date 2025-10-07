import { Package, Tag, Barcode } from 'lucide-react';
import type { Product } from '../types/product';

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  return (
    <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-6 border border-orange-200">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-lg flex items-center justify-center shadow-md">
            <Package className="w-8 h-8 sm:w-10 sm:h-10 text-orange-600" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2 break-words">
            {product.nombre || product.name}
          </h3>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm sm:text-base">
              <Barcode className="w-4 h-4 text-slate-600 flex-shrink-0" />
              <span className="text-slate-600 font-medium">UPC:</span>
              <span className="text-slate-800 font-mono">{product.upc}</span>
            </div>

            {product.marca && (
              <div className="flex items-center gap-2 text-sm sm:text-base">
                <Tag className="w-4 h-4 text-slate-600 flex-shrink-0" />
                <span className="text-slate-600 font-medium">Marca:</span>
                <span className="text-slate-800">{product.marca}</span>
              </div>
            )}

            {product.categoria && (
              <div className="flex items-center gap-2 text-sm sm:text-base">
                <Package className="w-4 h-4 text-slate-600 flex-shrink-0" />
                <span className="text-slate-600 font-medium">Categoría:</span>
                <span className="text-slate-800">{product.categoria}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {product.descripcion && (
        <div className="mt-4 pt-4 border-t border-orange-200">
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            {product.descripcion}
          </p>
        </div>
      )}
    </div>
  );
}
