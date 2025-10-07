# Guía de Configuración - ScanProfit

Esta guía te ayudará a configurar completamente el proyecto ScanProfit con la integración de OpenAI.

## Prerrequisitos

- Node.js 18+ instalado
- Cuenta de Supabase
- Cuenta de OpenAI con API Key
- Git

## Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/creativedesignseo/ScanProfit.git
cd ScanProfit
```

## Paso 2: Instalar Dependencias

```bash
npm install
```

## Paso 3: Configurar Variables de Entorno del Frontend

1. Copia el archivo de ejemplo:
```bash
cp .env.example .env
```

2. Edita `.env` y configura tus valores de Supabase:
```env
VITE_SUPABASE_URL=https://tuproyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anon-aqui
```

### ¿Dónde encontrar estos valores?

1. Ve a tu proyecto en [Supabase Dashboard](https://app.supabase.com)
2. Haz clic en tu proyecto
3. Ve a **Project Settings** → **API**
4. Copia:
   - **URL del Proyecto** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY`

## Paso 4: Configurar OpenAI API Key en Supabase

⚠️ **IMPORTANTE**: La API key de OpenAI NO se configura en el archivo `.env` del frontend. Se configura en Supabase como secret para las Edge Functions.

### Pasos:

1. Ve a [Supabase Dashboard](https://app.supabase.com)
2. Selecciona tu proyecto
3. En el menú lateral, ve a **Edge Functions**
4. Haz clic en **Secrets** o **Manage secrets**
5. Agrega un nuevo secret:
   - **Name**: `OPENAI_API_KEY`
   - **Value**: Tu API key de OpenAI (formato: `sk-proj-...`)
6. Haz clic en **Save**

### Obtener tu API Key de OpenAI

1. Ve a [OpenAI Platform](https://platform.openai.com)
2. Inicia sesión con tu cuenta
3. Ve a **API Keys** en el menú lateral
4. Haz clic en **+ Create new secret key**
5. Dale un nombre descriptivo (ej: "ScanProfit Production")
6. Copia la clave **inmediatamente** (no podrás verla de nuevo)
7. Pégala en el secret de Supabase

⚠️ **SEGURIDAD**: 
- Nunca compartas tu API key públicamente
- No la subas a Git
- La API key proporcionada en el issue debe ser **ROTADA INMEDIATAMENTE** ya que fue expuesta públicamente

## Paso 5: Deploy de la Edge Function

Si has modificado la función o es tu primera vez desplegándola:

```bash
# Instala Supabase CLI si no lo tienes
npm install -g supabase

# Login a Supabase
supabase login

# Link tu proyecto
supabase link --project-ref tu-proyecto-ref

# Deploy la función
supabase functions deploy product-lookup
```

### ¿Dónde encontrar tu project-ref?

1. En Supabase Dashboard, ve a **Project Settings** → **General**
2. Copia el **Reference ID**

## Paso 6: Verificar la Configuración

Para verificar que todo está configurado correctamente:

1. **Verifica el Secret de OpenAI**:
   - Ve a Supabase Dashboard → Edge Functions → Secrets
   - Confirma que `OPENAI_API_KEY` aparece en la lista
   
2. **Verifica la Edge Function**:
   - Ve a Supabase Dashboard → Edge Functions
   - Deberías ver `product-lookup` en la lista
   - Haz clic para ver los logs

3. **Prueba la función manualmente**:
   ```bash
   curl "https://tuproyecto.supabase.co/functions/v1/product-lookup?upc=012345678905" \
     -H "Authorization: Bearer tu-anon-key"
   ```

## Paso 7: Ejecutar el Proyecto

### Modo Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Build de Producción

```bash
npm run build
npm run preview
```

## Paso 8: Probar la Integración

1. Abre la aplicación
2. Ingresa un código de barras válido (ej: `012345678905`)
3. Haz clic en "Buscar"
4. Observa que el producto se carga con información enriquecida por OpenAI

### Códigos de Barras de Prueba

Algunos UPCs reales para probar:
- `012000161155` - Coca-Cola
- `028400064446` - Doritos
- `079400266736` - Tide Pods
- `037000127710` - Crest Toothpaste

## Monitoreo y Depuración

### Ver Logs de la Edge Function

1. Ve a Supabase Dashboard
2. **Edge Functions** → **product-lookup**
3. Haz clic en **Logs**
4. Verás las llamadas a OpenAI y cualquier error

### Errores Comunes

#### Error: "OPENAI_API_KEY is not set"

**Solución**: La API key no está configurada en Supabase Secrets.
1. Ve a Edge Functions → Secrets
2. Agrega `OPENAI_API_KEY`
3. Re-deploy la función si es necesario

#### Error: "Invalid API Key"

**Solución**: La API key es incorrecta o fue revocada.
1. Ve a OpenAI Platform → API Keys
2. Verifica que la key existe y está activa
3. Genera una nueva si es necesario
4. Actualiza el secret en Supabase

#### Error: "Model gpt-4o-mini not found"

**Solución**: Tu cuenta de OpenAI no tiene acceso al modelo.
1. Verifica tu plan en OpenAI
2. Asegúrate de tener créditos disponibles
3. El modelo gpt-4o-mini requiere al menos $5 USD en créditos

#### Los precios se ven raros o inconsistentes

**Esto es normal**: Los precios de Amazon y Walmart son **generados algorítmicamente** para demostración. No son precios reales.

## Costos Estimados

### OpenAI API (gpt-4o-mini)

- **Input**: $0.150 por 1M tokens
- **Output**: $0.600 por 1M tokens

**Por escaneo de producto**:
- ~200 tokens de entrada
- ~150 tokens de salida
- **Costo por producto**: ~$0.0001 USD
- **1000 productos**: ~$0.10 USD

### Supabase

- Plan gratuito incluye:
  - 2GB de base de datos
  - 1GB de almacenamiento
  - 500,000 invocaciones de Edge Functions por mes
  
Para este proyecto, el plan gratuito es suficiente para desarrollo y pruebas.

## Siguientes Pasos

1. ✅ Configuración básica completa
2. 📝 Personaliza la aplicación según tus necesidades
3. 🔒 **IMPORTANTE**: Rota la API key expuesta públicamente
4. 🚀 Despliega a producción (Vercel, Netlify, etc.)
5. 📊 Configura monitoreo de costos en OpenAI

## Soporte Adicional

Si encuentras problemas:

1. Revisa los logs de Supabase Edge Functions
2. Verifica que todas las variables de entorno están configuradas
3. Confirma que tienes créditos en tu cuenta de OpenAI
4. Revisa el archivo `docs/OPENAI_INTEGRATION.md` para detalles técnicos

## Recursos

- [Documentación de Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Documentación de OpenAI API](https://platform.openai.com/docs)
- [Documentación del proyecto](./OPENAI_INTEGRATION.md)
