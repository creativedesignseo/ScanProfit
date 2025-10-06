# ScanProfit

Analizador de lotes de productos mediante escaneo de códigos de barras (UPC/EAN) con integración de OpenAI GPT para enriquecimiento de datos.

## Características

- ✅ Escaneo de códigos de barras UPC/EAN
- ✅ Consulta automática de información de productos
- ✅ **Integración con OpenAI GPT-4o-mini** para enriquecer datos
- ✅ Generación de precios de demostración para Amazon y Walmart
- ✅ Cálculo de precio promedio y precio líder de reventa
- ✅ Exportación de lotes a CSV
- ✅ Interfaz responsive y moderna

## Integración con OpenAI

Este proyecto utiliza la API de OpenAI (modelo GPT-4o-mini) para generar información enriquecida de productos. La función `generarFichaProducto()` envía los datos básicos del producto a ChatGPT y recibe un JSON estructurado con:

- Nombre mejorado del producto
- Descripción detallada profesional
- Ficha técnica completa (marca, categoría, peso, origen, código de barras)
- Precios de Amazon y Walmart
- Precio promedio calculado

Para más detalles, consulta la [documentación completa de integración](./docs/OPENAI_INTEGRATION.md).

## Configuración

### 1. Variables de Entorno

Copia el archivo de ejemplo:
```bash
cp .env.example .env
```

Configura las variables necesarias:
```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anon
```

### 2. OpenAI API Key

La clave de OpenAI debe configurarse en **Supabase Edge Functions**:

1. Ve a tu proyecto en Supabase Dashboard
2. Navega a: **Project Settings** → **Edge Functions** → **Secrets**
3. Agrega: `OPENAI_API_KEY=sk-proj-tu-clave-aqui`

⚠️ **Importante**: La API key proporcionada en el issue debe ser rotada inmediatamente ya que ha sido expuesta públicamente.

### 3. Instalación

```bash
npm install
```

### 4. Desarrollo

```bash
npm run dev
```

### 5. Build

```bash
npm run build
```

## Estructura del Proyecto

```
ScanProfit/
├── src/                          # Código fuente del frontend
│   ├── components/               # Componentes React
│   ├── services/                 # Servicios (API calls)
│   ├── types/                    # Tipos TypeScript
│   └── utils/                    # Utilidades
├── supabase/
│   └── functions/
│       └── product-lookup/       # Edge Function con integración OpenAI
│           └── index.ts          # Función generarFichaProducto()
└── docs/                         # Documentación
    └── OPENAI_INTEGRATION.md     # Detalles de integración OpenAI

```

## Tecnologías

- **Frontend**: React + TypeScript + Vite
- **UI**: Tailwind CSS + Lucide Icons
- **Backend**: Supabase Edge Functions (Deno)
- **IA**: OpenAI API (GPT-4o-mini)
- **Escaneo**: html5-qrcode

## Modelo GPT Utilizado

**Modelo**: `gpt-4o-mini`

⚠️ **Nota**: El issue original mencionaba "GPT-5 mini", pero este modelo no existe. El código implementa correctamente `gpt-4o-mini`, que es el modelo más reciente y eficiente de OpenAI disponible.

## Limitaciones Conocidas

### Precios de Demostración

Los precios de Amazon y Walmart son **generados algorítmicamente** para demostración. No son precios reales obtenidos de las APIs oficiales de estos retailers.

Para implementar precios reales, se requiere:
- Amazon Product Advertising API (requiere aprobación de Amazon)
- Walmart API (requiere cuenta de desarrollador verificada)

### Bases de Datos de Productos

La aplicación consulta:
1. OpenFoodFacts (productos alimenticios principalmente)
2. UPCItemDB (base de datos general)

Si un producto no se encuentra, se genera uno genérico basado en el UPC.

## Scripts Disponibles

```bash
npm run dev        # Servidor de desarrollo
npm run build      # Build de producción
npm run preview    # Preview del build
npm run lint       # Ejecutar ESLint
npm run typecheck  # Verificación de tipos TypeScript
```

## Despliegue de Supabase Functions

```bash
# Login a Supabase
supabase login

# Link tu proyecto
supabase link --project-ref tu-proyecto-ref

# Deploy la función
supabase functions deploy product-lookup
```

## Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto es privado y propietario.

## Soporte

Para problemas o preguntas, abre un issue en el repositorio.
