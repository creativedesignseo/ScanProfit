# 📦 ScanProfit

> Sistema de escaneo y análisis de productos por código UPC/EAN con IA

[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.1-646cff)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Latest-3ecf8e)](https://supabase.com/)

## 🌟 Características

- ✅ **Escaneo de códigos UPC/EAN** - Entrada manual o con escáner de código de barras
- 🤖 **Enriquecimiento con IA** - Generación automática de descripciones usando OpenAI GPT-4o-mini
- 📊 **Búsqueda multi-fuente** - Consulta en OpenFoodFacts y UPCItemDB
- 👥 **Sistema de autenticación** - Login de empleados con Supabase Auth
- 📥 **Exportación a CSV** - Descarga de lotes de productos en formato Excel compatible
- 📱 **100% Responsive** - Funciona en desktop, tablet y móvil
- 🎨 **UI Moderna** - Diseño profesional con TailwindCSS

## 🚀 Inicio Rápido

### Prerequisitos

- Node.js 18+ y npm
- Cuenta en [Supabase](https://supabase.com)
- API Key de [OpenAI](https://platform.openai.com/) (opcional, para enriquecimiento con IA)

### Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/creativedesignseo/ScanProfit.git
cd ScanProfit
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Edita `.env` y agrega tus credenciales de Supabase:
```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

4. **Configurar Supabase**

   a. Ejecuta las migraciones en tu proyecto Supabase:
   ```bash
   # Instala Supabase CLI si no lo tienes
   npm install -g supabase

   # Enlaza tu proyecto
   supabase link --project-ref tu-proyecto-id

   # Ejecuta migraciones
   supabase db push
   ```

   b. Despliega la Edge Function:
   ```bash
   supabase functions deploy product-lookup
   ```

   c. Configura el secret de OpenAI (opcional):
   ```bash
   supabase secrets set OPENAI_API_KEY=tu-openai-key
   ```

5. **Crear un empleado de prueba**

   Ve a tu proyecto en Supabase > Authentication > Users y crea un usuario:
   - Email: `admin@scanprofit.com`
   - Password: `tu-password-seguro`
   
   Luego ve a Table Editor > employees y verifica que se creó el registro automáticamente.

6. **Iniciar servidor de desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 📁 Estructura del Proyecto

```
ScanProfit/
├── src/
│   ├── components/          # Componentes React
│   │   ├── LoginScreen.tsx
│   │   ├── ProductScanner.tsx
│   │   ├── ProductDetails.tsx
│   │   └── ProductTable.tsx
│   ├── services/            # Lógica de negocio
│   │   ├── authService.ts
│   │   └── productService.ts
│   ├── types/               # Tipos TypeScript
│   ├── lib/                 # Configuración de librerías
│   ├── utils/               # Utilidades
│   └── App.tsx              # Componente principal
├── supabase/
│   ├── functions/           # Edge Functions
│   │   └── product-lookup/
│   └── migrations/          # Migraciones SQL
└── public/                  # Archivos estáticos
```

## 🔧 Scripts Disponibles

```bash
npm run dev        # Servidor de desarrollo
npm run build      # Build de producción
npm run preview    # Vista previa del build
npm run lint       # Ejecutar ESLint
npm run typecheck  # Verificar tipos TypeScript
```

## 🎨 Tecnologías

### Frontend
- **React 18** - Librería UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **TailwindCSS** - Framework CSS utility-first
- **Lucide React** - Iconos

### Backend
- **Supabase** - Backend as a Service
  - PostgreSQL - Base de datos
  - Auth - Autenticación
  - Edge Functions - Serverless functions
- **OpenAI GPT-4o-mini** - Generación de contenido

### APIs Externas
- **OpenFoodFacts** - Base de datos de productos alimenticios
- **UPCItemDB** - Base de datos de productos generales

## 📖 Uso

### 1. Iniciar Sesión
- Ingresa con las credenciales de un empleado registrado

### 2. Escanear Productos
- Elige modo **Manual** o **Escáner**
- Ingresa o escanea el código UPC/EAN
- La app buscará el producto automáticamente

### 3. Gestionar Lote
- Los productos se agregan a la tabla
- Puedes eliminar productos con el botón 🗑️
- El contador muestra cuántos productos hay

### 4. Exportar
- Haz clic en "Generar Excel"
- Se descargará un archivo CSV con todos los productos

## 🔒 Seguridad

- ✅ Row Level Security (RLS) habilitado en Supabase
- ✅ Variables de entorno para credenciales
- ✅ Autenticación obligatoria
- ✅ Validación en frontend y backend
- ✅ `.env` no se commitea (está en .gitignore)

## 🚢 Deployment

### Opción 1: Vercel

1. Conecta tu repositorio en Vercel
2. Configura las variables de entorno
3. Deploy automático

### Opción 2: Netlify

```bash
npm run build
netlify deploy --prod --dir=dist
```

### Configurar Edge Function en Supabase

```bash
supabase functions deploy product-lookup
supabase secrets set OPENAI_API_KEY=tu-key
```

## 🐛 Problemas Conocidos

1. **ESLint warning** - Incompatibilidad menor de versión TypeScript (no afecta funcionalidad)
2. **Browserslist desactualizado** - Ejecutar `npx update-browserslist-db@latest`

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una branch (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la branch (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es privado y está bajo licencia propietaria.

## 👨‍💻 Autor

**Creative Design SEO**

## 📞 Soporte

Para soporte, abre un issue en GitHub.

---

## 📚 Documentación Adicional

Para una revisión completa del código y arquitectura, consulta [REVISION_APLICACION.md](./REVISION_APLICACION.md)

---

**Versión Beta 1.0** - Sistema de Escaneo de Productos
