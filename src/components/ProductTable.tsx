import { Trash2 } from 'lucide-react';
import type { Product } from '../types/product';

interface ProductTableProps {
  products: Product[];
  onRemove: (index: number) => void;
}

export function ProductTable({ products, onRemove }: ProductTableProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-slate-400 mb-2">
          <svg
            className="w-16 h-16 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        </div>
        <p className="text-slate-500 text-sm sm:text-base">
          No hay productos escaneados aún
        </p>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          Escanea tu primer producto para comenzar
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <div className="inline-block min-w-full align-middle">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                #
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                UPC
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Producto
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider hidden sm:table-cell">
                Marca
              </th>
              <th className="px-3 sm:px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Acción
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {products.map((product, index) => (
              <tr key={index} className="hover:bg-slate-50 transition-colors">
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                  {index + 1}
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-slate-600 font-mono">
                  {product.upc}
                </td>
                <td className="px-3 sm:px-6 py-4 text-sm text-slate-900">
                  <div className="font-medium break-words max-w-xs">
                    {product.nombre || product.name}
                  </div>
                  <div className="text-xs text-slate-500 sm:hidden mt-1">
                    {product.marca}
                  </div>
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-slate-600 hidden sm:table-cell">
                  {product.marca || '-'}
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onRemove(index)}
                    className="text-red-600 hover:text-red-800 transition-colors p-2 hover:bg-red-50 rounded-lg active:scale-95"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
