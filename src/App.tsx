import React, { useState, useEffect } from 'react';
import { Menu, X, LogOut, BarChart3 } from 'lucide-react';
import { ProductScanner } from './components/ProductScanner';
import { ProductDetails } from './components/ProductDetails';
import { ProductTable } from './components/ProductTable';
import { fetchProductData } from './services/productService';
import { sendScan } from './services/webhook';
import type { Product } from './types/product';

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const userId = 'default-user';

  const handleScan = async (upc: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const product = await fetchProductData(upc);

      if (product) {
        setSelectedProduct(product);

        await sendScan(upc);
      } else {
        setError('Producto no encontrado. Intenta con otro código.');
        setSelectedProduct(null);
      }
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message || 'Error al buscar el producto');
      setSelectedProduct(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProduct = (product: Product) => {
    if (!products.some(p => p.upc === product.upc)) {
      setProducts([product, ...products]);
    } else {
      setProducts(products.map(p => p.upc === product.upc ? product : p));
    }
    setSelectedProduct(null);
  };

  const handleRemoveProduct = (index: number) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-baraki-yellow-light to-white">
      <header className="bg-white shadow-md sticky top-0 z-50 border-b-4 border-baraki-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img
                src="/Baraki Vector.png"
                alt="ScanProfit"
                className="h-10 w-10 sm:h-12 sm:w-12"
              />
              <h1 className="text-xl sm:text-2xl font-bold text-baraki-black hidden sm:block">ScanProfit</h1>
            </div>

            <button
              className="sm:hidden p-2 hover:bg-gray-100 rounded-lg"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <nav className="hidden sm:flex items-center space-x-6">
              <button className="flex items-center space-x-2 text-baraki-black font-semibold hover:text-baraki-yellow transition-colors">
                <BarChart3 size={20} />
                <span>Análisis</span>
              </button>
              <button className="flex items-center space-x-2 text-baraki-black font-semibold hover:text-baraki-yellow transition-colors">
                <LogOut size={20} />
                <span>Salir</span>
              </button>
            </nav>
          </div>

          {isMobileMenuOpen && (
            <div className="sm:hidden pb-4 flex flex-col space-y-3">
              <button className="flex items-center space-x-2 text-baraki-black font-semibold hover:text-baraki-yellow transition-colors w-full p-2">
                <BarChart3 size={20} />
                <span>Análisis</span>
              </button>
              <button className="flex items-center space-x-2 text-baraki-black font-semibold hover:text-baraki-yellow transition-colors w-full p-2">
                <LogOut size={20} />
                <span>Salir</span>
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2">
            <ProductScanner onScan={handleScan} isLoading={isLoading} />

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            )}

            {selectedProduct && (
              <ProductDetails
                product={selectedProduct}
                onSave={handleSaveProduct}
              />
            )}
          </div>

          <aside className="lg:col-span-1">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border-4 border-baraki-black sticky top-24">
              <h2 className="text-lg sm:text-xl font-bold text-baraki-black mb-4">Productos Escaneados</h2>
              <div className="max-h-96 overflow-y-auto">
                <ProductTable
                  products={products}
                  onRemove={handleRemoveProduct}
                />
              </div>
              {products.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <p className="text-sm text-slate-600">
                    Total: <span className="font-bold text-baraki-black">{products.length}</span> productos
                  </p>
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default App;
