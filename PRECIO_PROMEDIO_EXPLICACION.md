# Explicación: ¿De dónde viene el Precio Promedio Real?

## Resumen
El **precio promedio real** (`precioPromedio`) se calcula completamente en el **backend** de esta aplicación, específicamente en el archivo `supabase/functions/product-lookup/index.ts`.

## Flujo de Cálculo de Precios

### 1. Generación de Precios Base
**Ubicación:** Función `generateRealisticPrice()` - línea 96

Los precios de Amazon y Walmart se generan utilizando un algoritmo que:
- Analiza el nombre del producto
- Asigna un rango de precio base según la categoría del producto
- Aplica una variación (variance) para simular diferencias de precio entre tiendas

```typescript
const amazonPrice = generateRealisticPrice(productInfo.name, upc, 0.05);   // +5% variación
const walmartPrice = generateRealisticPrice(productInfo.name, upc, -0.03);  // -3% variación
```

### 2. Cálculo del Precio Promedio Real
**Ubicación:** Función `generarFichaProducto()` - línea 154

El precio promedio se calcula como la **media aritmética simple**:

```typescript
const precioPromedio = parseFloat(((precioAmazon + precioWalmart) / 2).toFixed(2));
```

**Ejemplo:**
- Si Amazon = $50.00
- Y Walmart = $48.00
- Entonces precioPromedio = ($50.00 + $48.00) / 2 = **$49.00**

### 3. Cálculo del Precio LÍDER (Reventa)
**Ubicación:** Flujo principal - línea 282

El precio LÍDER se calcula aplicando un markup del 15% sobre el precio promedio:

```typescript
const leaderPrice = parseFloat((fichaEnriquecida.precioPromedio * 1.15).toFixed(2));
```

**Ejemplo:**
- Si precioPromedio = $49.00
- Entonces leaderPrice = $49.00 × 1.15 = **$56.35**

## Papel de OpenAI

**IMPORTANTE:** OpenAI **NO** calcula ni modifica los precios.

OpenAI solo genera:
- ✅ Nombre mejorado del producto
- ✅ Descripción detallada
- ✅ Ficha técnica (marca, categoría, peso, origen)

Los precios se calculan **antes** de enviar la solicitud a OpenAI y se **agregan después** de recibir la respuesta.

## Resumen del Flujo Completo

```
1. Usuario escanea UPC
   ↓
2. searchUPCDatabase() busca información del producto
   ↓
3. generateRealisticPrice() genera precios para Amazon y Walmart
   ↓
4. generarFichaProducto() calcula:
   - precioPromedio = (Amazon + Walmart) / 2
   - Luego solicita a OpenAI descripción y ficha técnica
   - Retorna todo combinado con los precios calculados
   ↓
5. Se calcula leaderPrice = precioPromedio × 1.15
   ↓
6. Se retorna el objeto ProductData completo al frontend
```

## Archivos Relevantes

1. **Backend (Cálculo de precios):**
   - `supabase/functions/product-lookup/index.ts`
     - Línea 96: `generateRealisticPrice()`
     - Línea 131: `generarFichaProducto()`
     - Línea 154: Cálculo de `precioPromedio`
     - Línea 282: Cálculo de `leaderPrice`

2. **Frontend (Visualización):**
   - `src/components/ProductDetails.tsx`
     - Línea 63: Muestra el precio promedio
   - `src/types/product.ts`
     - Define la interfaz Product con `precioPromedio`
   - `src/services/productService.ts`
     - Consume la API y retorna los datos al frontend

## Verificación

Para verificar que el cálculo es correcto, revisa los logs de la consola del backend:

```
Precio promedio calculado: $XX.XX (Amazon: $XX.XX + Walmart: $XX.XX) / 2
```

Este log se imprime en la línea 155 del archivo `index.ts` cada vez que se calcula un precio promedio.
