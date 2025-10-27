# ScanProfit

Aplicación para escanear códigos de barras y comparar precios entre Amazon y Walmart.

## 🚀 Inicio Rápido

### Desarrollo Local

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
Crea un archivo `.env` con:
```
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima
```

3. Ejecutar en desarrollo:
```bash
npm run dev
```

## 📦 Despliegue

Ver [DEPLOYMENT.md](./DEPLOYMENT.md) para instrucciones completas de despliegue en Netlify y Supabase.

## 🏗️ Estructura del Proyecto

- `/src` - Código fuente del frontend (React + TypeScript)
- `/supabase/functions` - Edge Functions de Supabase
- `netlify.toml` - Configuración de despliegue en Netlify

## 🛠️ Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Vista previa de la build de producción
- `npm run lint` - Ejecuta el linter
- `npm run typecheck` - Verifica los tipos de TypeScript

## 📝 Tecnologías

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Supabase Edge Functions
- html5-qrcode
