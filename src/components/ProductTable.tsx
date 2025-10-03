import { Trash2 } from 'lucide-react';
import type { Product } from '../types/product';

interface ProductTableProps {
  products: Product[];
  onRemove: (index: number) => void;
}

export function ProductTable({ products, onRemove }: ProductTableProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12">
        <p className="text-slate-500 text-base sm:text-lg">No hay productos escaneados aún.</p>
        <p className="text-slate-400 text-xs sm:text-sm mt-2">Comienza escaneando un código de barras.</p>
      </div>
    );
  }

  return (
    <>
      {/* Vista móvil - Cards */}
      <div className="block sm:hidden space-y-3">
        {products.map((product, index) => (
          <div key={`${product.upc}-${index}`} className="bg-slate-50 rounded-lg p-3 border border-slate-200">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1 pr-2">
                <p className="text-sm font-bold text-slate-900 break-words">{product.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">UPC: {product.upc}</p>
              </div>
              <button
                onClick={() => onRemove(index)}
                className="text-red-600 hover:text-red-800 transition-colors p-1 active:scale-95"
                aria-label="Eliminar"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-3">
              <div className="text-center">
                <p className="text-xs text-slate-600 mb-0.5">Amazon</p>
                <p className="text-sm font-bold text-green-600">${product.amazonPrice.toFixed(2)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-600 mb-0.5">Walmart</p>
                <p className="text-sm font-bold text-blue-600">${product.walmartPrice.toFixed(2)}</p>
              </div>
              <div className="text-center bg-orange-50 rounded p-1">
                <p className="text-xs text-orange-700 font-semibold mb-0.5">LÍDER</p>
                <p className="text-sm font-bold text-orange-700">${product.leaderPrice}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Vista desktop - Tabla */}
      <div className="hidden sm:block overflow-x-auto -mx-6 px-6">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Producto
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider hidden lg:table-cell">
                UPC/EAN
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Amazon
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Walmart
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Precio LÍDER
              </th>
              <th className="px-3 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Acción
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {products.map((product, index) => (
              <tr key={`${product.upc}-${index}`} className="hover:bg-slate-50 transition-colors">
                <td className="px-3 py-3">
                  <div className="text-sm font-medium text-slate-900 max-w-xs truncate">{product.name}</div>
                </td>
                <td className="px-3 py-3 whitespace-nowrap hidden lg:table-cell">
                  <div className="text-sm text-slate-600">{product.upc}</div>
                </td>
                <td className="px-3 py-3 whitespace-nowrap">
                  <div className="text-sm font-semibold text-green-600">
                    ${product.amazonPrice.toFixed(2)}
                  </div>
                </td>
                <td className="px-3 py-3 whitespace-nowrap">
                  <div className="text-sm font-semibold text-blue-600">
                    ${product.walmartPrice.toFixed(2)}
                  </div>
                </td>
                <td className="px-3 py-3 whitespace-nowrap">
                  <div className="text-sm font-bold text-orange-600">
                    ${product.leaderPrice}
                  </div>
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-right">
                  <button
                    onClick={() => onRemove(index)}
                    className="text-red-600 hover:text-red-800 transition-colors inline-flex items-center active:scale-95"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium hidden md:inline">Eliminar</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
