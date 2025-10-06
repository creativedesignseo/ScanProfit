# Arquitectura del Sistema - ScanProfit

## Diagrama de Flujo Completo

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React + Vite)                     │
│                                                                     │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐    │
│  │   Scanner    │      │  App.tsx     │      │   Product    │    │
│  │  Component   │─────▶│  (State Mgmt)│─────▶│   Details    │    │
│  └──────────────┘      └──────────────┘      └──────────────┘    │
│         │                      │                      ▲            │
│         │ UPC Code             │ HTTP GET             │            │
│         └──────────────────────┼──────────────────────┘            │
│                                │                                   │
└────────────────────────────────┼───────────────────────────────────┘
                                 │
                                 │ HTTPS Request
                                 │ /functions/v1/product-lookup?upc=...
                                 │
┌────────────────────────────────▼───────────────────────────────────┐
│                    SUPABASE EDGE FUNCTION (Deno)                   │
│                   product-lookup/index.ts                          │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │ 1. searchUPCDatabase(upc)                                │    │
│  │    ├─▶ OpenFoodFacts API                                 │    │
│  │    └─▶ UPCItemDB API                                     │    │
│  │    Result: { name, category, brand, image }             │    │
│  └──────────────────────────────────────────────────────────┘    │
│                            ▼                                       │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │ 2. generateRealisticPrice(name, upc)                     │    │
│  │    └─▶ Algorithm based on product category              │    │
│  │    Result: { amazonPrice, walmartPrice }                │    │
│  └──────────────────────────────────────────────────────────┘    │
│                            ▼                                       │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │ 3. generarFichaProducto()                                │    │
│  │    ┌────────────────────────────────────────────┐        │    │
│  │    │ OpenAI GPT-4o-mini Integration             │        │    │
│  │    │                                             │        │    │
│  │    │ const openai = new OpenAI({                │        │    │
│  │    │   apiKey: Deno.env.get('OPENAI_API_KEY')   │        │    │
│  │    │ });                                         │        │    │
│  │    │                                             │        │    │
│  │    │ const completion = await                   │        │    │
│  │    │   openai.chat.completions.create({         │        │    │
│  │    │     model: "gpt-4o-mini",                  │        │    │
│  │    │     messages: [{                           │        │    │
│  │    │       role: "user",                        │        │    │
│  │    │       content: prompt                      │        │    │
│  │    │     }],                                    │        │    │
│  │    │     temperature: 0.7                       │        │    │
│  │    │   });                                      │        │    │
│  │    │                                             │        │    │
│  │    │ Returns: Enriched Product Data             │        │    │
│  │    └────────────────────────────────────────────┘        │    │
│  └──────────────────────────────────────────────────────────┘    │
│                            ▼                                       │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │ 4. Calculate Leader Price                                │    │
│  │    leaderPrice = precioPromedio * 1.15                  │    │
│  └──────────────────────────────────────────────────────────┘    │
│                            ▼                                       │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │ 5. Build Response JSON                                   │    │
│  │    {                                                      │    │
│  │      upc, nombre, precioAmazon, precioWalmart,          │    │
│  │      precioPromedio, descripcion, fichaTecnica,         │    │
│  │      image, leaderPrice                                  │    │
│  │    }                                                      │    │
│  └──────────────────────────────────────────────────────────┘    │
│                            │                                       │
└────────────────────────────┼───────────────────────────────────────┘
                             │
                             │ JSON Response
                             │
┌────────────────────────────▼───────────────────────────────────────┐
│                    EXTERNAL SERVICES                                │
│                                                                     │
│  ┌──────────────────┐  ┌──────────────────┐  ┌─────────────────┐ │
│  │  OpenFoodFacts   │  │   UPCItemDB      │  │   OpenAI API    │ │
│  │  Product DB      │  │   Product DB     │  │   (GPT-4o-mini) │ │
│  └──────────────────┘  └──────────────────┘  └─────────────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Componentes Principales

### 1. Frontend Layer

**Tecnologías**: React, TypeScript, Vite, Tailwind CSS

**Componentes**:
- `ProductScanner.tsx` - Interfaz de escaneo
- `CameraScanner.tsx` - Escaneo con cámara
- `ProductDetails.tsx` - Muestra información del producto
- `ProductTable.tsx` - Lista de productos escaneados
- `App.tsx` - Gestión de estado principal

**Servicios**:
- `productService.ts` - Comunicación con Supabase Edge Function

### 2. Backend Layer (Supabase Edge Function)

**Tecnología**: Deno (JavaScript/TypeScript runtime)

**Archivo Principal**: `supabase/functions/product-lookup/index.ts`

**Funciones**:

#### `searchUPCDatabase(upc: string)`
- Consulta bases de datos de productos públicas
- Prioridad: OpenFoodFacts → UPCItemDB → Fallback
- Retorna: `{ name, category, brand, image }`

#### `generateRealisticPrice(name: string, upc: string, variance: number)`
- Genera precios de demostración realistas
- Basado en categorías de productos
- Aplica varianza para simular diferencias entre retailers
- Retorna: `number` (precio en USD)

#### `generarFichaProducto()` ⭐ **FUNCIÓN PRINCIPAL**
- Integración con OpenAI GPT-4o-mini
- Construye prompt estructurado
- Envía datos a la API de OpenAI
- Parsea respuesta JSON
- Maneja errores con fallback
- Retorna: Objeto con información enriquecida

### 3. External Services Layer

#### OpenFoodFacts API
- Base de datos de productos alimenticios
- API pública sin autenticación
- URL: `https://world.openfoodfacts.org/api/v0/product/{upc}.json`

#### UPCItemDB API
- Base de datos general de productos
- API de prueba (trial)
- URL: `https://api.upcitemdb.com/prod/trial/lookup?upc={upc}`

#### OpenAI API ⭐
- Modelo: `gpt-4o-mini`
- Autenticación: API Key (Bearer token)
- Endpoint: `https://api.openai.com/v1/chat/completions`
- Configuración:
  - Temperature: 0.7
  - Role: user
  - Response format: JSON

## Flujo de Datos Detallado

### Paso 1: Escaneo de Código
```
Usuario → Scanner → UPC/EAN Code → Frontend
```

### Paso 2: Request al Backend
```
Frontend → HTTP GET Request → Supabase Edge Function
URL: /functions/v1/product-lookup?upc={code}
Headers:
  - Authorization: Bearer {SUPABASE_ANON_KEY}
  - Content-Type: application/json
```

### Paso 3: Búsqueda de Producto
```
Edge Function → searchUPCDatabase()
  ├─▶ Try: OpenFoodFacts API
  │   └─▶ Success: Return product data
  │   └─▶ Fail: Continue
  ├─▶ Try: UPCItemDB API
  │   └─▶ Success: Return product data
  │   └─▶ Fail: Continue
  └─▶ Fallback: Generate generic product
```

### Paso 4: Generación de Precios
```
Edge Function → generateRealisticPrice()
  Input: product name, UPC
  Algorithm:
    - Categorize product by keywords
    - Assign base price range
    - Apply variance for different retailers
    - Use UPC as seed for consistency
  Output: { amazonPrice, walmartPrice }
```

### Paso 5: Enriquecimiento con OpenAI
```
Edge Function → generarFichaProducto()
  ├─▶ Initialize OpenAI client
  ├─▶ Build structured prompt
  │   Includes:
  │     - Product name
  │     - Category
  │     - Brand
  │     - Amazon price
  │     - Walmart price
  │     - Average price
  │     - UPC code
  │
  ├─▶ Call OpenAI API
  │   POST https://api.openai.com/v1/chat/completions
  │   Body: {
  │     model: "gpt-4o-mini",
  │     messages: [...],
  │     temperature: 0.7
  │   }
  │
  ├─▶ Receive response
  │   Raw text (possibly with markdown formatting)
  │
  ├─▶ Clean response
  │   Remove ```json and ``` markers
  │
  ├─▶ Parse JSON
  │   Convert string to object
  │
  └─▶ Return enriched data
      {
        nombre: "...",
        precioAmazon: 29.99,
        precioWalmart: 27.99,
        precioPromedio: 28.99,
        descripcion: "...",
        fichaTecnica: { ... }
      }
```

### Paso 6: Cálculo de Precio Líder
```
Edge Function:
  leaderPrice = precioPromedio * 1.15
  (Precio sugerido de reventa con 15% de margen)
```

### Paso 7: Response al Frontend
```
Edge Function → JSON Response → Frontend
Body: {
  upc: "...",
  nombre: "...",
  precioAmazon: 29.99,
  precioWalmart: 27.99,
  precioPromedio: 28.99,
  descripcion: "...",
  fichaTecnica: {
    marca: "...",
    categoria: "...",
    peso: "...",
    origen: "...",
    codigo_barras: "..."
  },
  image: "...",
  leaderPrice: 33.34
}
```

### Paso 8: Renderizado en UI
```
Frontend → ProductDetails Component
  Displays:
    - Product image
    - Product name
    - Description
    - Prices (Amazon, Walmart, Average, Leader)
    - Technical specifications
```

## Configuración de Seguridad

### Environment Variables

**Frontend (.env)**:
```env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxx
```

**Backend (Supabase Secrets)**:
```
OPENAI_API_KEY=sk-proj-xxx
```

### Flujo de Autenticación

```
Frontend Request
  ├─▶ Header: Authorization: Bearer {SUPABASE_ANON_KEY}
  └─▶ Supabase validates token
      └─▶ Edge Function executes
          └─▶ Reads OPENAI_API_KEY from Deno.env
              └─▶ Calls OpenAI API
```

## Manejo de Errores

### Nivel 1: searchUPCDatabase()
```
Try OpenFoodFacts → Catch → Try UPCItemDB → Catch → Fallback
```

### Nivel 2: generarFichaProducto()
```
Try OpenAI API → Catch → Return basic product data
```

### Nivel 3: Edge Function
```
Try entire flow → Catch → Return 500 error with details
```

## Optimizaciones Futuras

### 1. Caché de Productos
```
Redis/Supabase Cache
  └─▶ Store frequent products
      └─▶ Reduce OpenAI calls
          └─▶ Lower costs
```

### 2. Batch Processing
```
Multiple UPCs → Single OpenAI call
  └─▶ Reduce latency
      └─▶ Lower costs
```

### 3. Rate Limiting
```
User/IP tracking
  └─▶ Prevent abuse
      └─▶ Control costs
```

## Métricas de Rendimiento

### Latencia Típica
- Búsqueda UPC: 200-500ms
- Generación de precios: <1ms
- Llamada a OpenAI: 1-3s
- **Total**: ~2-4s por producto

### Costos
- OpenAI: ~$0.0001 USD por producto
- Supabase: Free tier (hasta 500K invocaciones/mes)
- Total: ~$0.0001 USD por escaneo

## Escalabilidad

### Actual Capacity
- Supabase Free: 500K invocaciones/mes
- OpenAI: Sin límite (basado en créditos)

### Bottlenecks
1. OpenAI API latency (1-3s)
2. External API availability (OpenFoodFacts, UPCItemDB)

### Soluciones
1. Implementar caché
2. Optimizar prompts (reducir tokens)
3. Considerar batch processing
4. Implementar CDN para imágenes

---

**Última actualización**: 2024
**Version**: 1.0
**Estado**: Producción (requiere API key válida)
