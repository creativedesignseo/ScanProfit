# Documento de Requisitos Funcionales
## Analizador de Lotes - Sistema de Escaneo y Análisis de Productos

**Versión:** 1.0
**Fecha:** 9 de Octubre, 2025
**Estado:** Funcional

---

## 1. Introducción

### 1.1 Propósito
El Analizador de Lotes es una aplicación web diseñada para facilitar el escaneo, análisis y gestión de productos mediante códigos de barras UPC/EAN. El sistema permite a los usuarios recopilar información de productos, comparar precios de diferentes retailers y generar reportes detallados para análisis de mercado y toma de decisiones comerciales.

### 1.2 Alcance
Esta aplicación proporciona:
- Escaneo rápido de productos mediante entrada manual o cámara
- Búsqueda automática de información de productos
- Comparación de precios entre Amazon y Walmart
- Cálculo de precio promedio y precio sugerido de reventa
- Gestión de lotes de productos
- Exportación de datos a formato Excel/CSV

### 1.3 Usuarios Objetivo
- Comerciantes y revendedores
- Analistas de mercado
- Gestores de inventario
- Equipos de compras

---

## 2. Requisitos Funcionales

### 2.1 Escaneo de Productos

#### RF-001: Entrada Manual de Código UPC/EAN
**Prioridad:** Alta
**Descripción:** El sistema debe permitir la entrada manual de códigos de barras UPC/EAN.

**Criterios de Aceptación:**
- El campo de entrada acepta únicamente valores numéricos
- Longitud válida: 12 o 13 dígitos
- Búsqueda automática al completar 12 o 13 dígitos
- Validación inmediata del formato del código
- Limpieza automática del campo después de búsqueda exitosa
- Mensajes de error claros para códigos inválidos

**Flujo:**
1. Usuario ingresa código numérico
2. Sistema valida longitud (12-13 dígitos)
3. Sistema ejecuta búsqueda automática
4. Sistema muestra resultado o mensaje de error
5. Campo se limpia automáticamente

#### RF-002: Escaneo con Cámara
**Prioridad:** Alta
**Descripción:** El sistema debe permitir el escaneo de códigos de barras utilizando la cámara del dispositivo.

**Criterios de Aceptación:**
- Solicitud de permisos de cámara al usuario
- Activación de cámara trasera por defecto
- Detección automática de códigos UPC/EAN
- Área de escaneo claramente demarcada (250x250px)
- Búsqueda automática al detectar código válido
- Cierre automático de cámara tras escaneo exitoso
- Manejo de errores de permisos denegados
- Botón de cancelación accesible

**Flujo:**
1. Usuario presiona "Escanear con Cámara"
2. Sistema solicita permisos de cámara
3. Cámara se activa con área de escaneo visible
4. Sistema detecta y valida código de barras
5. Sistema ejecuta búsqueda automática
6. Cámara se cierra y muestra resultado

### 2.2 Búsqueda y Recuperación de Información

#### RF-003: Búsqueda de Producto por UPC
**Prioridad:** Alta
**Descripción:** El sistema debe buscar información detallada del producto en bases de datos externas.

**Criterios de Aceptación:**
- Búsqueda en múltiples fuentes: OpenFoodFacts y UPCItemDB
- Tiempo de respuesta máximo: 5 segundos
- Indicador visual de carga durante búsqueda
- Manejo de productos no encontrados
- Generación de producto genérico si no se encuentra en bases de datos
- Recuperación de imagen del producto cuando esté disponible

**Datos Recuperados:**
- Nombre del producto
- Marca
- Categoría
- Imagen del producto
- Código UPC/EAN

#### RF-004: Generación de Información Enriquecida
**Prioridad:** Alta
**Descripción:** El sistema debe generar información detallada del producto utilizando IA.

**Criterios de Aceptación:**
- Generación de descripción profesional del producto
- Creación de ficha técnica completa
- Estimación de precios realistas basados en categoría
- Cálculo de precio promedio entre retailers
- Determinación de precio sugerido de reventa (LÍDER)
- Fallback a datos genéricos si IA no está disponible

**Información Generada:**
- Descripción detallada (2-3 oraciones)
- Ficha técnica:
  - Marca
  - Categoría específica
  - Peso con unidad
  - País de origen
  - Código de barras
- Precios:
  - Amazon
  - Walmart
  - Promedio
  - LÍDER (precio sugerido de reventa)

### 2.3 Visualización de Productos

#### RF-005: Detalle de Producto Individual
**Prioridad:** Alta
**Descripción:** El sistema debe mostrar información completa del último producto escaneado.

**Criterios de Aceptación:**
- Visualización de imagen del producto
- Nombre y descripción claramente visibles
- Precios destacados con códigos de color:
  - Verde para Amazon
  - Azul para Walmart
  - Gris para Promedio
  - Naranja para Precio LÍDER
- Ficha técnica expandida con todos los detalles
- Diseño responsivo para móviles y desktop
- Imágenes con fallback si no están disponibles

**Elementos Visuales:**
- Imagen del producto (100x100px)
- Nombre del producto
- UPC/EAN
- Marca y categoría
- Descripción completa
- Tarjetas de precios
- Ficha técnica detallada

#### RF-006: Tabla de Productos Escaneados
**Prioridad:** Alta
**Descripción:** El sistema debe mantener y mostrar un listado de todos los productos escaneados en la sesión actual.

**Criterios de Aceptación:**
- Vista de tabla responsiva para desktop
- Vista de tarjetas para dispositivos móviles
- Contador de productos en tiempo real
- Información resumida por producto:
  - Nombre
  - UPC
  - Precios (Amazon, Walmart, LÍDER)
- Botón de eliminación individual por producto
- Sin límite de productos en el lote
- Prevención de duplicados con alerta al usuario

**Funcionalidades:**
- Agregar productos al lote automáticamente tras escaneo
- Detectar y alertar sobre duplicados
- Eliminar productos individualmente
- Visualización adaptativa según dispositivo

### 2.4 Gestión de Lotes

#### RF-007: Prevención de Duplicados
**Prioridad:** Media
**Descripción:** El sistema debe prevenir la adición de productos duplicados al lote.

**Criterios de Aceptación:**
- Verificación de UPC antes de agregar al lote
- Mensaje de alerta claro indicando el producto duplicado
- Producto no se agrega si ya existe en el lote
- Información del producto se muestra de todas formas

**Mensaje de Alerta:**
- "El producto '[Nombre]' ya está en el lote."

#### RF-008: Eliminación de Productos
**Prioridad:** Alta
**Descripción:** El sistema debe permitir la eliminación individual de productos del lote.

**Criterios de Aceptación:**
- Botón de eliminación visible en cada producto
- Eliminación instantánea sin confirmación
- Actualización inmediata del contador de productos
- Actualización inmediata de la tabla/lista
- Icono claramente identificable (papelera)

### 2.5 Exportación de Datos

#### RF-009: Generación de Reporte Excel/CSV
**Prioridad:** Alta
**Descripción:** El sistema debe generar un archivo CSV compatible con Excel con todos los productos del lote.

**Criterios de Aceptación:**
- Formato CSV con separador punto y coma (;)
- Codificación UTF-8 para caracteres especiales
- Nombre de archivo con fecha: "Reporte_Lote_Productos_YYYY-MM-DD.csv"
- Descarga automática al hacer clic
- Botón deshabilitado cuando no hay productos
- Compatible con Excel y Google Sheets

**Columnas del Reporte:**
1. Nombre del Producto
2. UPC/EAN
3. Marca
4. Categoría
5. Peso
6. Origen
7. Descripción
8. Precio Amazon
9. Precio Walmart
10. Precio Promedio
11. Precio LÍDER Sugerido

**Formato de Datos:**
- Textos entre comillas dobles
- Números con 2 decimales
- Escape de comillas internas
- Valores "N/A" para datos no disponibles

---

## 3. Requisitos No Funcionales

### 3.1 Rendimiento

#### RNF-001: Tiempo de Respuesta
- Búsqueda de producto: máximo 5 segundos
- Renderizado de interfaz: instantáneo
- Exportación CSV: máximo 2 segundos para 100 productos

#### RNF-002: Capacidad
- Soporte para lotes de hasta 1000 productos sin degradación de rendimiento
- Manejo eficiente de memoria en navegador

### 3.2 Usabilidad

#### RNF-003: Interfaz de Usuario
- Diseño responsivo para móviles (320px+), tablets y desktop
- Interfaz intuitiva sin necesidad de capacitación
- Mensajes de error claros y accionables
- Retroalimentación visual inmediata en todas las acciones
- Accesibilidad táctil optimizada para dispositivos móviles

#### RNF-004: Experiencia de Usuario
- Búsqueda automática para minimizar clics
- Limpieza automática de campos
- Transiciones suaves y animaciones sutiles
- Estados de carga visibles
- Paleta de colores consistente:
  - Naranja/Ámbar: acción principal
  - Verde: Amazon
  - Azul: Walmart
  - Gris: información neutral

### 3.3 Compatibilidad

#### RNF-005: Navegadores
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Navegadores móviles modernos

#### RNF-006: Dispositivos
- Smartphones (iOS y Android)
- Tablets
- Computadoras de escritorio
- Laptops

### 3.4 Seguridad

#### RNF-007: Protección de Datos
- Comunicación HTTPS con APIs externas
- Autenticación en llamadas a Edge Functions
- CORS configurado correctamente
- Sin almacenamiento de datos personales
- Datos de sesión en memoria del navegador únicamente

#### RNF-008: Privacidad
- No se almacenan datos de productos después de cerrar sesión
- Permisos de cámara solicitados explícitamente
- Sin tracking de usuarios

### 3.5 Mantenibilidad

#### RNF-009: Código
- Arquitectura modular con componentes reutilizables
- TypeScript para type safety
- Separación de responsabilidades clara
- Comentarios en código complejo
- Estructura de carpetas organizada

#### RNF-010: Escalabilidad
- Diseño preparado para agregar nuevos retailers
- Edge Functions desplegables independientemente
- API extensible para nuevas funcionalidades

---

## 4. Arquitectura del Sistema

### 4.1 Componentes Frontend

#### Componentes React:
- **App.tsx**: Componente principal, gestión de estado global
- **ProductScanner.tsx**: Interfaz de entrada de UPC y acceso a cámara
- **CameraScanner.tsx**: Modal de escaneo con cámara
- **ProductDetails.tsx**: Visualización detallada de producto
- **ProductTable.tsx**: Listado y gestión de productos en lote

#### Servicios:
- **productService.ts**: Comunicación con Edge Function
- **csvExport.ts**: Generación de archivos CSV

#### Tipos:
- **product.ts**: Definiciones TypeScript de interfaces

### 4.2 Backend

#### Supabase Edge Functions:
- **product-lookup**: Búsqueda de productos en APIs externas y generación de datos enriquecidos con OpenAI

#### APIs Externas:
- **OpenFoodFacts**: Base de datos de productos alimenticios
- **UPCItemDB**: Base de datos general de productos
- **OpenAI GPT-4o-mini**: Generación de descripciones y fichas técnicas

### 4.3 Flujo de Datos

```
Usuario → Frontend (React)
    ↓
    Ingreso de UPC/Escaneo
    ↓
Frontend → Supabase Edge Function (product-lookup)
    ↓
Edge Function → APIs Externas (OpenFoodFacts, UPCItemDB)
    ↓
Edge Function → OpenAI (Enriquecimiento de datos)
    ↓
Edge Function → Frontend (Datos completos)
    ↓
Frontend → Visualización y Gestión
    ↓
Usuario → Exportación CSV (procesamiento local)
```

---

## 5. Casos de Uso

### 5.1 Caso de Uso Principal: Análisis de Lote de Productos

**Actor:** Comerciante

**Precondiciones:**
- Usuario tiene acceso a la aplicación
- Dispositivo con cámara (opcional)
- Productos con códigos UPC/EAN válidos

**Flujo Principal:**
1. Usuario accede a la aplicación
2. Usuario ingresa o escanea código UPC del primer producto
3. Sistema busca y muestra información del producto
4. Sistema agrega producto al lote automáticamente
5. Usuario repite pasos 2-4 para todos los productos del lote
6. Usuario revisa la lista de productos
7. Usuario elimina productos duplicados o incorrectos si es necesario
8. Usuario presiona "Generar Excel"
9. Sistema genera y descarga archivo CSV
10. Usuario analiza datos en Excel o Google Sheets

**Flujos Alternativos:**

**5.1a - Producto no encontrado:**
- En paso 3, si el producto no existe:
  - Sistema muestra mensaje de error
  - Usuario verifica el código e intenta nuevamente

**5.1b - Producto duplicado:**
- En paso 4, si el producto ya existe:
  - Sistema muestra alerta de duplicado
  - Producto no se agrega al lote
  - Usuario continúa con siguiente producto

**5.1c - Error de cámara:**
- En paso 2, si la cámara falla:
  - Sistema muestra mensaje de error
  - Usuario usa entrada manual como alternativa

**Postcondiciones:**
- Lote de productos completo y exportado
- Usuario tiene archivo CSV con datos para análisis

### 5.2 Casos de Uso Secundarios

#### CU-02: Comparación Rápida de Precios
**Objetivo:** Verificar el precio de un producto específico antes de compra

**Flujo:**
1. Usuario escanea producto individual
2. Revisa precios de Amazon y Walmart
3. Compara con precio LÍDER sugerido
4. Toma decisión de compra

#### CU-03: Verificación de Producto
**Objetivo:** Confirmar información de un producto desconocido

**Flujo:**
1. Usuario escanea código de barras
2. Revisa nombre, marca y categoría
3. Lee descripción y ficha técnica
4. Determina autenticidad del producto

---

## 6. Validaciones y Reglas de Negocio

### 6.1 Validaciones de Entrada

**VE-001: Código UPC/EAN**
- Longitud: exactamente 12 o 13 dígitos
- Tipo: solo números (0-9)
- Sin espacios ni caracteres especiales

**VE-002: Estado de Carga**
- No permitir múltiples búsquedas simultáneas
- Deshabilitar botones durante búsqueda

### 6.2 Reglas de Negocio

**RN-001: Cálculo de Precio LÍDER**
- Fórmula: Precio Promedio × 1.15
- Resultado redondeado a 2 decimales
- Representa precio sugerido de reventa con 15% de margen

**RN-002: Precio Promedio**
- Fórmula: (Precio Amazon + Precio Walmart) / 2
- Resultado redondeado a 2 decimales

**RN-003: Generación de Precios**
- Precios basados en categoría del producto
- Variación entre retailers: ±5%
- Rango de precios realista según tipo de producto

**RN-004: Gestión de Lote**
- Un producto puede aparecer solo una vez por UPC
- Sin límite máximo de productos (limitado por memoria del navegador)
- Orden de productos según orden de escaneo

---

## 7. Mensajes del Sistema

### 7.1 Mensajes de Error

**ME-001: Código Inválido**
- "El código debe tener 12 o 13 dígitos (UPC/EAN)."
- Contexto: Validación de entrada manual

**ME-002: Producto No Encontrado**
- "Producto con código [UPC] no encontrado. Verifica el código."
- Contexto: Búsqueda sin resultados

**ME-003: Error de Búsqueda**
- "Error al buscar el producto. Intenta nuevamente."
- Contexto: Fallo en comunicación con servidor

**ME-004: Error de Cámara**
- "No se pudo acceder a la cámara. Verifica los permisos."
- Contexto: Permisos denegados o cámara no disponible

### 7.2 Mensajes de Información

**MI-001: Producto Duplicado**
- "El producto '[Nombre]' ya está en el lote."
- Contexto: Intento de agregar producto existente

**MI-002: Estado de Búsqueda**
- "Buscando producto..."
- Contexto: Búsqueda en progreso

**MI-003: Lote Vacío**
- "No hay productos escaneados aún."
- "Comienza escaneando un código de barras."
- Contexto: Tabla sin productos

### 7.3 Mensajes de Éxito

**MS-001: Producto Encontrado**
- Sección "Producto Encontrado" con check verde
- Contexto: Búsqueda exitosa con datos completos

---

## 8. Dependencias Externas

### 8.1 Servicios de Terceros

**OpenFoodFacts API**
- **Propósito:** Base de datos de productos alimenticios
- **Endpoint:** https://world.openfoodfacts.org/api/v0/product/{upc}.json
- **Gratuito:** Sí
- **Límites:** Sin límite de tasa
- **Fallback:** Búsqueda en UPCItemDB

**UPCItemDB API**
- **Propósito:** Base de datos general de productos
- **Endpoint:** https://api.upcitemdb.com/prod/trial/lookup?upc={upc}
- **Plan:** Trial
- **Límites:** 100 requests/día
- **Fallback:** Generación de producto genérico

**OpenAI API**
- **Propósito:** Generación de descripciones y fichas técnicas
- **Modelo:** GPT-4o-mini
- **Límites:** Según plan de Supabase
- **Fallback:** Datos genéricos predefinidos

### 8.2 Bibliotecas Frontend

**React 18.3.1**
- Framework UI principal

**html5-qrcode 2.3.8**
- Escaneo de códigos de barras con cámara

**Lucide React 0.344.0**
- Biblioteca de iconos

**TypeScript 5.5.3**
- Type safety

**Tailwind CSS 3.4.1**
- Framework de estilos

**Vite 5.4.2**
- Build tool y dev server

### 8.3 Servicios Supabase

**Edge Functions**
- Ejecución de lógica serverless
- Integración con OpenAI

**Autenticación**
- Protección de Edge Functions (Anon Key)

---

## 9. Configuración y Despliegue

### 9.1 Variables de Entorno

**Requeridas:**
```
VITE_SUPABASE_URL=https://[proyecto].supabase.co
VITE_SUPABASE_ANON_KEY=[clave-anonima]
```

**En Edge Function:**
```
OPENAI_API_KEY=[clave-openai]
```

### 9.2 Comandos de Despliegue

**Desarrollo:**
```bash
npm run dev
```

**Build:**
```bash
npm run build
```

**Type Check:**
```bash
npm run typecheck
```

**Lint:**
```bash
npm run lint
```

---

## 10. Limitaciones Conocidas

### 10.1 Limitaciones Técnicas

**LT-001: Datos de Precios**
- Los precios son estimados y generados algorítmicamente
- No son precios reales de Amazon o Walmart
- Propósito: demostración y análisis relativo

**LT-002: Base de Datos de Productos**
- Cobertura limitada a productos en OpenFoodFacts y UPCItemDB
- Productos regionales pueden no estar disponibles
- Información puede estar desactualizada

**LT-003: Límites de API**
- UPCItemDB: 100 requests/día en plan trial
- OpenAI: según cuota de Supabase
- Fallbacks implementados para ambos casos

**LT-004: Almacenamiento**
- Datos en memoria del navegador únicamente
- Lote se pierde al recargar página
- Sin persistencia entre sesiones

### 10.2 Limitaciones de Negocio

**LN-001: Alcance Geográfico**
- Precios basados en mercado estadounidense
- Retailers limitados a Amazon y Walmart

**LN-002: Tipos de Productos**
- Optimizado para productos de consumo
- Menos preciso para productos digitales o servicios

---

## 11. Evolución Futura

### 11.1 Mejoras Propuestas

**Fase 2:**
- Persistencia de lotes en base de datos Supabase
- Autenticación de usuarios
- Historial de lotes anteriores
- Comparación entre lotes

**Fase 3:**
- Integración con APIs reales de retailers
- Soporte para más retailers (Target, Best Buy, etc.)
- Alertas de cambios de precio
- Recomendaciones de compra basadas en tendencias

**Fase 4:**
- Aplicación móvil nativa
- Modo offline
- Sincronización en múltiples dispositivos
- Análisis predictivo con IA

### 11.2 Optimizaciones Técnicas

- Code splitting para mejorar tiempo de carga
- Service Worker para caché de datos
- Implementación de Progressive Web App (PWA)
- Compresión de imágenes automática
- Lazy loading de componentes

---

## 12. Glosario

**UPC (Universal Product Code):** Código de barras de 12 dígitos utilizado en América del Norte.

**EAN (European Article Number):** Código de barras de 13 dígitos utilizado internacionalmente.

**Edge Function:** Función serverless ejecutada en el edge (cerca del usuario) de Supabase.

**Lote:** Conjunto de productos escaneados en una sesión de análisis.

**Precio LÍDER:** Precio sugerido de reventa calculado con 15% de margen sobre el precio promedio.

**CORS (Cross-Origin Resource Sharing):** Mecanismo de seguridad del navegador para peticiones entre dominios.

**CSV (Comma-Separated Values):** Formato de archivo para datos tabulares compatible con Excel.

**Responsivo:** Diseño que se adapta a diferentes tamaños de pantalla.

**Fallback:** Solución alternativa cuando la opción principal no está disponible.

---

## 13. Contacto y Soporte

Para consultas sobre requisitos o funcionalidad, contactar al equipo de desarrollo.

**Versión del Documento:** 1.0
**Última Actualización:** 9 de Octubre, 2025
**Estado:** Aprobado - En Producción
