import { useState, FormEvent } from 'react';
import { Lock } from 'lucide-react';

interface LoginProps {
  onLogin: (password: string) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Por favor ingresa una contraseña');
      return;
    }
    onLogin(password);
    setError('');
  };

  return (
    <div className="min-h-screen bg-baraki-yellow flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border-4 border-baraki-black">
          <div className="flex flex-col items-center mb-8">
            <img
              src="/Baraki Vector.png"
              alt="Baraki Bodegón"
              className="w-48 h-48 object-contain mb-4"
            />
            <h1 className="text-3xl font-bold text-baraki-black text-center">
              BARAKI BODEGÓN
            </h1>
            <p className="text-baraki-black-light mt-2 text-center">
              Analizador de Lotes
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-baraki-black mb-2"
              >
                Contraseña de Acceso
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-baraki-black-light" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="Ingresa tu contraseña"
                  className="w-full pl-10 pr-4 py-3 border-2 border-baraki-black rounded-lg focus:ring-2 focus:ring-baraki-yellow focus:border-baraki-yellow text-lg transition-all"
                  autoFocus
                />
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-600 font-medium">{error}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-baraki-yellow hover:bg-baraki-yellow-dark text-baraki-black font-bold py-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl border-2 border-baraki-black active:scale-95 text-lg"
            >
              INGRESAR
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
