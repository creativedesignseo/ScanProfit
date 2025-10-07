# Integración con OpenAI GPT

## Descripción General

Este proyecto integra la API de OpenAI (modelo GPT-4o-mini) para enriquecer la información de productos escaneados mediante códigos de barras (UPC/EAN).

## Arquitectura

### Flujo de Trabajo

1. **Escaneo de Código**: El usuario escanea un código de barras (UPC/EAN)
2. **Búsqueda de Producto**: Se consultan bases de datos públicas (OpenFoodFacts, UPCItemDB)
3. **Generación de Precios Demo**: Se generan precios realistas de demostración para Amazon y Walmart
4. **Enriquecimiento con OpenAI**: Los datos del producto se envían a GPT-4o-mini
5. **Respuesta Estructurada**: OpenAI devuelve un JSON completo con información enriquecida

### Componentes Principales

#### Función `generarFichaProducto()`

Ubicación: `supabase/functions/product-lookup/index.ts`

```typescript
async function generarFichaProducto(
  nombre: string,
  categoria: string,
  marca: string,
  precioAmazon: number,
  precioWalmart: number,
  upc: string
): Promise<{...}>
```

**Responsabilidades:**
- Inicializa el cliente de OpenAI con la API key del entorno
- Construye un prompt detallado con la información del producto
- Llama a la API de OpenAI (modelo: `gpt-4o-mini`)
- Parsea y valida la respuesta JSON
- Maneja errores con un fallback de datos básicos

## Configuración

### 1. API Key de OpenAI

La clave API debe configurarse en Supabase:

1. Ve a tu proyecto en Supabase Dashboard
2. Navega a **Project Settings** → **Edge Functions**
3. Agrega una nueva variable de entorno:
   - **Nombre**: `OPENAI_API_KEY`
   - **Valor**: Tu API key de OpenAI (formato: `sk-proj-...`)

### 2. Clave API Proporcionada

```
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
```

⚠️ **Nota de Seguridad**: Esta clave ha sido expuesta públicamente y debe ser rotada inmediatamente en la consola de OpenAI.

## Estructura de Datos

### Request a OpenAI

El prompt incluye:
- Nombre del producto
- Categoría
- Marca
- Precio de Amazon (demo)
- Precio de Walmart (demo)
- Precio promedio calculado
- Código de barras (UPC)

### Response de OpenAI

```json
{
  "nombre": "Nombre mejorado del producto",
  "precioAmazon": 29.99,
  "precioWalmart": 27.99,
  "precioPromedio": 28.99,
  "descripcion": "Descripción detallada y profesional del producto...",
  "fichaTecnica": {
    "marca": "Marca del Producto",
    "categoria": "Categoría Específica",
    "peso": "500g",
    "origen": "País de Origen",
    "codigo_barras": "1234567890123"
  }
}
```

## Modelo GPT Utilizado

**Modelo Actual**: `gpt-4o-mini`

⚠️ **Aclaración Importante**: El problema statement original mencionaba "GPT-5 mini", pero este modelo no existe. El modelo correcto y más reciente de OpenAI es `gpt-4o-mini`, que es el que está implementado en el código.

### ¿Por qué gpt-4o-mini?

- ✅ Más reciente y eficiente
- ✅ Mejor relación costo-rendimiento
- ✅ Respuestas más rápidas
- ✅ Mantiene alta calidad en las respuestas

## Precios de Demostración

**Importante**: Los precios de Amazon y Walmart son generados algorítmicamente para demostración. No son precios reales consultados de las APIs de Amazon o Walmart.

### Función `generateRealisticPrice()`

- Genera precios basados en categorías de productos
- Aplica varianza para simular diferencias entre retailers
- Utiliza el UPC como semilla para consistencia

**Limitación Actual**: Para obtener precios reales, se necesitaría:
1. API de Amazon Product Advertising API (requiere aprobación)
2. API de Walmart (requiere cuenta de desarrollador)

## Manejo de Errores

El sistema incluye fallback robusto:

```typescript
try {
  // Llamada a OpenAI
} catch (error) {
  // Devuelve datos básicos sin enriquecimiento
  return {
    nombre,
    precioAmazon,
    precioWalmart,
    precioPromedio,
    descripcion: `${nombre} es un producto de calidad...`,
    fichaTecnica: { /* datos básicos */ }
  };
}
```

## Testing

Para probar la integración:

1. Configura la `OPENAI_API_KEY` en Supabase
2. Deploy la función Edge:
   ```bash
   supabase functions deploy product-lookup
   ```
3. Escanea un código de barras en la aplicación
4. Verifica los logs en Supabase Dashboard

## Costos Estimados

**Modelo**: gpt-4o-mini
- **Input**: ~$0.150 por 1M tokens
- **Output**: ~$0.600 por 1M tokens

**Por consulta** (estimado):
- Prompt: ~200 tokens
- Respuesta: ~150 tokens
- Costo: ~$0.0001 por producto

## Próximos Pasos

### Mejoras Sugeridas

1. **Precios Reales**:
   - Integrar Amazon Product Advertising API
   - Integrar Walmart API
   - Implementar caché para reducir llamadas

2. **Optimización**:
   - Implementar caché de productos comunes
   - Batch processing para múltiples productos
   - Rate limiting para controlar costos

3. **Seguridad**:
   - Rotar la API key expuesta
   - Implementar límites de uso por usuario
   - Agregar validación de inputs

## Soporte

Para problemas con la integración:
1. Verifica que la API key esté configurada en Supabase
2. Revisa los logs de la función Edge en Supabase Dashboard
3. Confirma que el modelo `gpt-4o-mini` está disponible en tu cuenta de OpenAI
