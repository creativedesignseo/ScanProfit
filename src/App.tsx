import { useState } from 'react';
import { Download, PackageOpen } from 'lucide-react';
import { ProductScanner } from './components/ProductScanner';
import { ProductTable } from './components/ProductTable';
import { ProductDetails } from './components/ProductDetails';
import { exportToCSV } from './utils/csvExport';
import { fetchProductData, fetchProductDataViaN8n, saveProduct } from './services/productService';
import type { Product } from './types/product';


function App() {
  const [scannedProducts, setScannedProducts] = useState<Product[]>([]);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const userId = 'default-user';

  const handleScan = async (upc: string) => {
    setIsLoading(true);
    try {
      // First try via n8n webhook (or fallback to existing fetchProductData)
      let product = await fetchProductDataViaN8n(upc);
      if (!product) {
        product = await fetchProductData(upc);
      }

      if (!product) {
        alert(`Producto con código ${upc} no encontrado. Verifica el código.`);
        setCurrentProduct(null);
        return;
      }

      setCurrentProduct(product);
    } catch (error) {
      alert('Error al buscar el producto. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveProduct = (index: number) => {
    setScannedProducts(scannedProducts.filter((_, i) => i !== index));
  };

  const handleExport = () => {
    if (scannedProducts.length === 0) return;
    exportToCSV(scannedProducts);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-baraki-yellow-light to-baraki-yellow p-2 sm:p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8 border-4 border-baraki-black">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <img
                src="/Baraki Vector.png"
                alt="Baraki Bodegón"
                className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
              />
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-baraki-black">
                  BARAKI BODEGÓN
                </h1>
                <p className="text-xs sm:text-sm text-baraki-black-light">Analizador de Lotes</p>
              </div>
            </div>
          </div>
          <p className="text-sm sm:text-base text-baraki-black-light text-center">Búsqueda rápida por UPC/EAN</p>
        </header>

        <ProductScanner
          onScan={handleScan}
          isLoading={isLoading}
        />

        {currentProduct && (
          <ProductDetails
            product={currentProduct}
            onSave={async (updatedProduct) => {
              const success = await saveProduct(updatedProduct, userId);
              if (success) {
                const existingIndex = scannedProducts.findIndex(p => p.upc === updatedProduct.upc);
                if (existingIndex !== -1) {
                  const updated = [...scannedProducts];
                  updated[existingIndex] = updatedProduct;
                  setScannedProducts(updated);
                } else {
                  setScannedProducts([...scannedProducts, updatedProduct]);
                }

                setCurrentProduct(null);
                alert('Producto guardado exitosamente');
              } else {
                alert('Error al guardar el producto');
              }
            }}
          />
        )}

        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border-4 border-baraki-black">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center">
              <PackageOpen className="w-5 h-5 sm:w-6 sm:h-6 text-baraki-black mr-2" />
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-baraki-black">
                Productos
                <span className="text-baraki-yellow-dark ml-1">({scannedProducts.length})</span>
              </h2>
            </div>
            <button
              onClick={handleExport}
              disabled={scannedProducts.length === 0}
              className="flex items-center gap-2 bg-baraki-yellow hover:bg-baraki-yellow-dark text-baraki-black border-2 border-baraki-black px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl w-full sm:w-auto justify-center active:scale-95"
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">Generar Excel</span>
            </button>
          </div>

          <ProductTable
            products={scannedProducts}
            onRemove={handleRemoveProduct}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
