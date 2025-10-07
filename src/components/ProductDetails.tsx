import { CheckCircle2, DollarSign, Package, TrendingUp } from 'lucide-react';
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="col-span-1 lg:col-span-2">
          <div className="flex items-start sm:items-center space-x-3 sm:space-x-4">
            <img
              src={product.image || 'https://placehold.co/100x100/6b7280/ffffff?text=Sin+Imagen'}
              alt={product.nombre || product.name}
              className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg border-2 border-slate-200 shadow-sm flex-shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://placehold.co/100x100/6b7280/ffffff?text=Sin+Imagen';
              }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-base sm:text-lg md:text-xl font-bold text-slate-800 break-words">{product.nombre || product.name}</p>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">UPC: {product.upc}</p>
              {product.fichaTecnica && (
                <div className="mt-2 text-xs sm:text-sm text-slate-600">
                  <span className="font-medium">{product.fichaTecnica.marca}</span>
                  {product.fichaTecnica.categoria && (
                    <span className="ml-2 text-slate-500">• {product.fichaTecnica.categoria}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {product.descripcion && (
          <div className="col-span-1 lg:col-span-2 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">{product.descripcion}</p>
          </div>
        )}

        <div className="text-center p-3 sm:p-4 bg-green-50 border-2 border-green-300 rounded-lg">
          <p className="text-xs sm:text-sm font-semibold text-green-700 mb-1">Amazon</p>
          <p className="text-2xl sm:text-3xl font-bold text-green-700">${(product.precioAmazon || product.amazonPrice || 0).toFixed(2)}</p>
        </div>

        <div className="text-center p-3 sm:p-4 bg-blue-50 border-2 border-blue-300 rounded-lg">
          <p className="text-xs sm:text-sm font-semibold text-blue-700 mb-1">Walmart</p>
          <p className="text-2xl sm:text-3xl font-bold text-blue-700">${(product.precioWalmart || product.walmartPrice || 0).toFixed(2)}</p>
        </div>

        <div className="text-center p-3 sm:p-4 bg-slate-50 border-2 border-slate-300 rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <TrendingUp className="w-4 h-4 text-slate-700 mr-1" />
            <p className="text-xs sm:text-sm font-semibold text-slate-700">Precio Promedio</p>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-slate-700">${(product.precioPromedio || product.averagePrice || 0).toFixed(2)}</p>
        </div>

        <div className="text-center p-4 sm:p-5 bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-400 rounded-lg col-span-1 lg:col-span-1 shadow-sm">
          <div className="flex items-center justify-center mb-2">
            <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-orange-700 mr-1" />
            <p className="text-xs sm:text-sm font-semibold text-orange-700">Precio LÍDER (Reventa)</p>
          </div>
          <p className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-orange-700">${product.leaderPrice.toFixed(2)}</p>
        </div>

        {product.fichaTecnica && (
          <div className="p-4 sm:p-5 bg-white border-2 border-slate-300 rounded-lg col-span-1 lg:col-span-2">
            <div className="flex items-center mb-3">
              <Package className="w-5 h-5 text-slate-700 mr-2" />
              <h3 className="text-sm sm:text-base font-bold text-slate-800">Ficha Técnica</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <p className="text-xs text-slate-500 font-medium">Marca</p>
                <p className="text-sm sm:text-base text-slate-800 font-semibold">{product.fichaTecnica.marca}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Categoría</p>
                <p className="text-sm sm:text-base text-slate-800 font-semibold">{product.fichaTecnica.categoria}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Peso</p>
                <p className="text-sm sm:text-base text-slate-800 font-semibold">{product.fichaTecnica.peso}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Origen</p>
                <p className="text-sm sm:text-base text-slate-800 font-semibold">{product.fichaTecnica.origen}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-slate-500 font-medium">Código de Barras</p>
                <p className="text-sm sm:text-base text-slate-800 font-semibold">{product.fichaTecnica.codigo_barras}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
