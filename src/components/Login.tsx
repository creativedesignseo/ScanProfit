import { useState, FormEvent } from 'react';
import { Lock, User } from 'lucide-react';

interface LoginProps {
  onLogin: (username: string, password: string) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Por favor ingresa un usuario');
      return;
    }
    if (!password.trim()) {
      setError('Por favor ingresa una contraseña');
      return;
    }
    onLogin(username, password);
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

          <div className="bg-baraki-yellow-light border-2 border-baraki-yellow-dark rounded-xl p-4 mb-6">
            <p className="text-center text-baraki-black font-bold text-lg mb-2">
              Aplicación Demostrativa
            </p>
            <div className="text-center text-baraki-black-light text-sm space-y-1">
              <p>Usuario: <span className="font-bold text-baraki-black">demo</span></p>
              <p>Contraseña: <span className="font-bold text-baraki-black">demo</span></p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-semibold text-baraki-black mb-2"
              >
                Usuario
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-baraki-black-light" />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError('');
                  }}
                  placeholder="Ingresa tu usuario"
                  className="w-full pl-10 pr-4 py-3 border-2 border-baraki-black rounded-lg focus:ring-2 focus:ring-baraki-yellow focus:border-baraki-yellow text-lg transition-all"
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-baraki-black mb-2"
              >
                Contraseña
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
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 font-medium text-center">{error}</p>
            )}

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
