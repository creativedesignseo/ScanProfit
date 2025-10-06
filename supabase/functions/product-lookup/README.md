# Product Lookup Edge Function

## Descripción
Esta función de Supabase Edge Function busca información de productos por código UPC y genera datos enriquecidos usando la API de OpenAI.

## Funcionalidad

### 1. Búsqueda de Producto
- **OpenFoodFacts API**: Primera opción para buscar productos alimenticios
- **UPCItemDB API**: Segunda opción como respaldo
- **Producto genérico**: Si ambas APIs fallan, genera un producto genérico

### 2. Generación de Precios con OpenAI
La función utiliza **OpenAI GPT-4o-mini** para generar:
- Precios estimados realistas para Amazon
- Precios estimados realistas para Walmart (típicamente 3-5% más bajos)
- Precio promedio calculado
- Descripción detallada del producto
- Ficha técnica completa (marca, categoría, peso, origen)

### 3. Cálculo de Leader Price
- Leader Price = Precio Promedio × 1.15 (+15% margen sugerido)

## Configuración Requerida

### Variables de Entorno
Esta función requiere la siguiente variable de entorno:

```bash
OPENAI_API_KEY=sk-...
```

#### Cómo Configurar en Supabase:
1. Ve a tu proyecto en [Supabase Dashboard](https://app.supabase.com)
2. Navega a **Settings** → **Edge Functions**
3. En la sección **Environment Variables**, agrega:
   - **Nombre**: `OPENAI_API_KEY`
   - **Valor**: Tu API key de OpenAI (comienza con `sk-`)

#### Obtener API Key de OpenAI:
1. Crea una cuenta en [OpenAI Platform](https://platform.openai.com)
2. Ve a **API keys** en tu dashboard
3. Crea una nueva API key
4. Copia y guarda la clave de forma segura

## API Response

### Endpoint
```
GET /functions/v1/product-lookup?upc={UPC_CODE}
```

### Headers
```
Authorization: Bearer {SUPABASE_ANON_KEY}
Content-Type: application/json
```

### Response Structure
```json
{
  "upc": "012000161568",
  "nombre": "Coca Cola 2L",
  "precioAmazon": 2.49,
  "precioWalmart": 2.37,
  "precioPromedio": 2.43,
  "descripcion": "Coca Cola es la bebida carbonatada más popular del mundo...",
  "fichaTecnica": {
    "marca": "Coca Cola",
    "categoria": "Bebidas",
    "peso": "2L",
    "origen": "Estados Unidos",
    "codigo_barras": "012000161568"
  },
  "image": "https://images.openfoodfacts.org/...",
  "leaderPrice": 2.79
}
```

## Notas Importantes

### Sobre los Precios
⚠️ **Los precios son estimaciones generadas por IA**, no precios reales en tiempo real.

OpenAI genera precios basándose en:
- Tipo de producto
- Marca
- Categoría
- Conocimiento general del mercado
- Tendencias de precios típicas

### Ventajas vs Sistema Anterior
✅ Precios más realistas basados en conocimiento de mercado
✅ Considera características específicas del producto
✅ Adaptable a diferentes tipos de productos
✅ Menos código y más mantenible

### Limitaciones
- Requiere créditos de OpenAI (costos por uso)
- Los precios no son datos en tiempo real
- Depende de la disponibilidad de la API de OpenAI

## Manejo de Errores

### Si OpenAI falla:
```json
{
  "precioAmazon": 0,
  "precioWalmart": 0,
  "precioPromedio": 0,
  "descripcion": "Producto - Producto no disponible. Error al obtener información de precios."
}
```

### Si el UPC no se encuentra:
Se genera un producto genérico con imagen de placeholder.

## Desarrollo Local

### Ejecutar localmente con Supabase CLI:
```bash
# Asegúrate de tener Supabase CLI instalado
supabase functions serve product-lookup --env-file .env.local
```

### Archivo .env.local ejemplo:
```bash
OPENAI_API_KEY=sk-your-key-here
```

## Testing

### Ejemplo con curl:
```bash
curl -X GET "http://localhost:54321/functions/v1/product-lookup?upc=012000161568" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json"
```

## Dependencias
- `@supabase/functions-js` - Runtime de Supabase Edge Functions
- `openai@4.47.1` - Cliente de OpenAI para Node.js/Deno

## Modelo de OpenAI
- **Modelo**: `gpt-4o-mini`
- **Temperature**: 0.7 (balance entre creatividad y consistencia)
- **Tokens aproximados por request**: 500-800 tokens

## Costos Estimados
Con `gpt-4o-mini`:
- Input: ~$0.00015 por 1K tokens
- Output: ~$0.0006 por 1K tokens
- **Costo aproximado por consulta**: $0.0005 - $0.001 USD

## Soporte
Para problemas o preguntas, contacta al equipo de desarrollo.
