import { useState, useEffect } from 'react';
import { Download, PackageOpen, BarChart3, LogOut, User as UserIcon } from 'lucide-react';
import { ProductScanner } from './components/ProductScanner';
import { ProductTable } from './components/ProductTable';
import { ProductDetails } from './components/ProductDetails';
import { LoginScreen } from './components/LoginScreen';
import { exportToCSV } from './utils/csvExport';
import { fetchProductData } from './services/productService';
import { loginEmployee, registerEmployee, logoutEmployee, getCurrentEmployee } from './services/authService';
import type { Product } from './types/product';
import type { Employee } from './types/employee';

function App() {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [scannedProducts, setScannedProducts] = useState<Product[]>([]);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const currentEmployee = await getCurrentEmployee();
      setEmployee(currentEmployee);
    } catch (error) {
      console.error('Error checking session:', error);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    setIsLoginLoading(true);
    try {
      const employeeData = await loginEmployee(email, password);
      setEmployee(employeeData);
    } catch (error) {
      throw error;
    } finally {
      setIsLoginLoading(false);
    }
  };

  const handleRegister = async (email: string, password: string, nombreCompleto: string) => {
    setIsLoginLoading(true);
    try {
      const employeeData = await registerEmployee(email, password, nombreCompleto);
      setEmployee(employeeData);
    } catch (error) {
      throw error;
    } finally {
      setIsLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutEmployee();
      setEmployee(null);
      setScannedProducts([]);
      setCurrentProduct(null);
    } catch (error) {
      alert('Error al cerrar sesión');
    }
  };

  const handleScan = async (upc: string) => {
    setIsLoading(true);
    try {
      const product = await fetchProductData(upc);

      if (!product) {
        alert(`Producto con código ${upc} no encontrado. Verifica el código.`);
        setCurrentProduct(null);
        return;
      }

      setCurrentProduct(product);

      const existingIndex = scannedProducts.findIndex(p => p.upc === product.upc);
      if (existingIndex === -1) {
        setScannedProducts([...scannedProducts, product]);
      } else {
        alert(`El producto "${product.nombre || product.name}" ya está en el lote.`);
      }
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

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mb-4"></div>
          <p className="text-slate-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!employee) {
    return <LoginScreen onLogin={handleLogin} onRegister={handleRegister} isLoading={isLoginLoading} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-2 sm:p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <BarChart3 className="w-8 h-8 sm:w-10 sm:h-10 text-orange-600 mr-2" />
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800">
                  Analizador de Lotes
                </h1>
                <p className="text-xs sm:text-sm text-slate-600">Búsqueda rápida por UPC/EAN</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-slate-800">{employee.nombre_completo}</p>
                <p className="text-xs text-slate-500">{employee.puesto}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors active:scale-95"
                title="Cerrar sesión"
              >
                <UserIcon className="w-4 h-4 sm:hidden" />
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">Salir</span>
              </button>
            </div>
          </div>
          <div className="sm:hidden bg-white rounded-lg p-3 border border-slate-200">
            <p className="text-sm font-semibold text-slate-800">{employee.nombre_completo}</p>
            <p className="text-xs text-slate-500">{employee.puesto} • {employee.departamento}</p>
          </div>
        </header>

        <ProductScanner
          onScan={handleScan}
          isLoading={isLoading}
        />

        {currentProduct && (
          <ProductDetails product={currentProduct} />
        )}

        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-slate-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center">
              <PackageOpen className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 mr-2" />
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800">
                Productos
                <span className="text-orange-600 ml-1">({scannedProducts.length})</span>
              </h2>
            </div>
            <button
              onClick={handleExport}
              disabled={scannedProducts.length === 0}
              className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-amber-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg w-full sm:w-auto justify-center active:scale-95"
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
