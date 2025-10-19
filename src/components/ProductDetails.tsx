import { useState } from 'react';
import { CheckCircle2, DollarSign, Package, TrendingUp, Edit2, Save, X } from 'lucide-react';
import type { Product } from '../types/product';

interface ProductDetailsProps {
  product: Product;
  onSave: (product: Product) => void;
}

export function ProductDetails({ product, onSave }: ProductDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPrice, setEditedPrice] = useState(product.averagePrice.toString());

  const handleSave = () => {
    const newPrice = parseFloat(editedPrice);
    if (!isNaN(newPrice) && newPrice > 0) {
      const updatedProduct = {
        ...product,
        averagePrice: newPrice,
        leaderPrice: parseFloat((newPrice * 1.15).toFixed(2)),
      };
      onSave(updatedProduct);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedPrice(product.averagePrice.toString());
    setIsEditing(false);
  };

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
              alt={product.title}
              className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg border-2 border-slate-200 shadow-sm flex-shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://placehold.co/100x100/6b7280/ffffff?text=Sin+Imagen';
              }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-base sm:text-lg md:text-xl font-bold text-slate-800 break-words">{product.title}</p>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">UPC: {product.upc}</p>
              <div className="mt-2 text-xs sm:text-sm text-slate-600">
                <span className="font-medium">{product.category}</span>
              </div>
            </div>
          </div>
        </div>

        {product.description && (
          <div className="col-span-1 lg:col-span-2 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">{product.description}</p>
          </div>
        )}

        <div className="text-center p-3 sm:p-4 bg-green-50 border-2 border-green-300 rounded-lg">
          <p className="text-xs sm:text-sm font-semibold text-green-700 mb-1">Amazon</p>
          <p className="text-2xl sm:text-3xl font-bold text-green-700">${product.amazonPrice.toFixed(2)}</p>
        </div>

        <div className="text-center p-3 sm:p-4 bg-blue-50 border-2 border-blue-300 rounded-lg">
          <p className="text-xs sm:text-sm font-semibold text-blue-700 mb-1">Walmart</p>
          <p className="text-2xl sm:text-3xl font-bold text-blue-700">${product.walmartPrice.toFixed(2)}</p>
        </div>

        <div className="text-center p-3 sm:p-4 bg-slate-50 border-2 border-slate-300 rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <TrendingUp className="w-4 h-4 text-slate-700 mr-1" />
            <p className="text-xs sm:text-sm font-semibold text-slate-700">Precio Promedio</p>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="ml-2 p-1 hover:bg-slate-200 rounded transition-colors"
                title="Editar precio"
              >
                <Edit2 className="w-3 h-3 text-slate-600" />
              </button>
            )}
          </div>
          {isEditing ? (
            <div className="flex items-center justify-center space-x-2">
              <span className="text-xl font-bold text-slate-700">$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={editedPrice}
                onChange={(e) => setEditedPrice(e.target.value)}
                className="w-24 text-2xl font-bold text-slate-700 border-2 border-slate-400 rounded px-2 py-1 text-center"
                autoFocus
              />
              <button
                onClick={handleSave}
                className="p-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                title="Guardar"
              >
                <Save className="w-4 h-4" />
              </button>
              <button
                onClick={handleCancel}
                className="p-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                title="Cancelar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <p className="text-2xl sm:text-3xl font-bold text-slate-700">${product.averagePrice.toFixed(2)}</p>
          )}
        </div>

        <div className="text-center p-4 sm:p-5 bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-400 rounded-lg col-span-1 lg:col-span-1 shadow-sm">
          <div className="flex items-center justify-center mb-2">
            <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-orange-700 mr-1" />
            <p className="text-xs sm:text-sm font-semibold text-orange-700">Precio LÍDER (Reventa)</p>
          </div>
          <p className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-orange-700">${product.leaderPrice.toFixed(2)}</p>
        </div>

        <div className="p-4 sm:p-5 bg-white border-2 border-slate-300 rounded-lg col-span-1 lg:col-span-2">
          <div className="flex items-center mb-3">
            <Package className="w-5 h-5 text-slate-700 mr-2" />
            <h3 className="text-sm sm:text-base font-bold text-slate-800">Información del Producto</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <p className="text-xs text-slate-500 font-medium">Categoría</p>
              <p className="text-sm sm:text-base text-slate-800 font-semibold">{product.category}</p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-slate-500 font-medium">Código de Barras</p>
              <p className="text-sm sm:text-base text-slate-800 font-semibold">{product.upc}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
