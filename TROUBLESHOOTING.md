# 🔧 Guía de Solución de Problemas

## Problemas Comunes y Soluciones

### 1. Error: "Missing Supabase environment variables"

**Síntoma:**
```
Error: Missing Supabase environment variables
```

**Causa:** No existe archivo `.env` o las variables no están configuradas

**Solución:**
```bash
# 1. Copiar el archivo de ejemplo
cp .env.example .env

# 2. Editar .env y agregar tus credenciales de Supabase
# VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
# VITE_SUPABASE_ANON_KEY=tu-anon-key
```

**Obtener las credenciales:**
1. Ve a https://app.supabase.com
2. Selecciona tu proyecto
3. Ve a Settings > API
4. Copia "Project URL" y "anon public"

---

### 2. Error: "Credenciales inválidas" al hacer login

**Síntoma:**
No puedes iniciar sesión con email y contraseña

**Causas posibles:**

#### Opción A: No existe el usuario
**Solución:**
1. Ve a tu proyecto en Supabase
2. Authentication > Users
3. Click "Add user" > "Create new user"
4. Ingresa email y contraseña
5. Verifica que se creó el registro en la tabla `employees`

#### Opción B: Empleado no está activo
**Solución:**
1. Ve a Table Editor > employees
2. Busca el registro del empleado
3. Asegúrate que `activo = true`

#### Opción C: No se ejecutaron las migraciones
**Solución:**
```bash
# Instalar Supabase CLI
npm install -g supabase

# Enlazar proyecto
supabase link --project-ref tu-proyecto-id

# Ejecutar migraciones
supabase db push
```

---

### 3. Error: "Product not found" al escanear

**Síntoma:**
Todos los productos devuelven "no encontrado"

**Causas posibles:**

#### Opción A: Edge Function no desplegada
**Solución:**
```bash
supabase functions deploy product-lookup
```

#### Opción B: CORS bloqueando la petición
**Solución:**
Verificar en la consola del navegador (F12) si hay errores CORS. 
La Edge Function ya tiene CORS configurado, pero verifica que la URL sea correcta.

#### Opción C: API externa caída
**Solución:**
La aplicación tiene fallback automático. Si ambas APIs (OpenFoodFacts y UPCItemDB) están caídas, generará un producto genérico.

---

### 4. Error: OpenAI no está enriqueciendo productos

**Síntoma:**
Los productos aparecen con descripciones genéricas

**Causa:** OpenAI API key no configurada

**Solución:**
```bash
# Configurar secret en Supabase
supabase secrets set OPENAI_API_KEY=tu-openai-key

# Re-desplegar la función
supabase functions deploy product-lookup
```

**Verificar:**
```bash
supabase secrets list
```

**Nota:** El enriquecimiento con OpenAI es **opcional**. La app funciona sin él con descripciones básicas.

---

### 5. Error al compilar TypeScript

**Síntoma:**
```
Error: Cannot find module 'X'
```

**Solución:**
```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install

# Verificar tipos
npm run typecheck
```

---

### 6. ESLint falla con error de TypeScript

**Síntoma:**
```
TypeError: Error while loading rule '@typescript-eslint/no-unused-expressions'
```

**Causa:** Incompatibilidad de versión TypeScript

**Solución Temporal:**
```bash
# Downgrade TypeScript a versión compatible
npm install --save-dev typescript@5.5.4
```

**Solución Permanente:**
Esperar actualización de @typescript-eslint que soporte TypeScript 5.6+

**Workaround:**
El error no afecta la funcionalidad. Puedes ignorar el linter:
```bash
# Build sin lint
npm run build
```

---

### 7. Export CSV descarga vacío o corrupto

**Síntoma:**
El archivo CSV no se abre correctamente en Excel

**Causas posibles:**

#### Opción A: No hay productos escaneados
**Solución:**
Escanea al menos un producto antes de exportar

#### Opción B: Encoding incorrecto
**Solución:**
El archivo ya tiene BOM UTF-8. Si Excel no lo abre correctamente:
1. Abre el CSV en un editor de texto
2. Guárdalo como UTF-8
3. Abrirlo en Excel con "Datos > Desde texto"

---

### 8. La aplicación no carga / Pantalla blanca

**Síntoma:**
Pantalla blanca después del build

**Solución:**

#### Desarrollo:
```bash
# Limpiar caché y reiniciar
rm -rf node_modules/.vite
npm run dev
```

#### Producción:
```bash
# Rebuild
npm run build

# Vista previa local
npm run preview
```

**Verificar consola del navegador (F12)** para errores JavaScript

---

### 9. "Cannot read properties of null" en producción

**Síntoma:**
La app funciona en desarrollo pero falla en producción

**Causa:** Variables de entorno no configuradas en el servidor

**Solución:**

#### Vercel:
1. Settings > Environment Variables
2. Agregar `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`
3. Re-deploy

#### Netlify:
1. Site settings > Build & deploy > Environment
2. Agregar variables
3. Re-deploy

---

### 10. La cámara no funciona para escanear códigos

**Síntoma:**
El modo "Escáner" no activa la cámara

**Causa:** 
La aplicación no tiene integración de cámara implementada. Solo es un modo de entrada.

**Solución:**
Usa un **escáner de código de barras USB/Bluetooth** que emule teclado:
1. Conecta el escáner
2. Selecciona modo "Escáner"
3. Escanea el código (el escáner escribirá en el input automáticamente)

**Nota:** Para usar cámara web, se necesitaría integrar una librería como `html5-qrcode` (ya está en package.json pero no implementada).

---

## 🔍 Debugging

### Ver logs de Edge Function

```bash
# Ver logs en tiempo real
supabase functions logs product-lookup --follow

# Ver logs históricos
supabase functions logs product-lookup
```

### Ver logs en navegador

1. Abre DevTools (F12)
2. Ve a Console
3. Busca errores en rojo
4. Ve a Network > XHR para ver peticiones

### Verificar estado de Supabase

```bash
# Ver estado del proyecto
supabase status

# Ver configuración
supabase projects list
```

---

## 📞 Obtener Ayuda

Si el problema persiste:

1. **Revisa la documentación completa** en [REVISION_APLICACION.md](./REVISION_APLICACION.md)
2. **Verifica la arquitectura** en [ARQUITECTURA.md](./ARQUITECTURA.md)
3. **Abre un issue** en GitHub con:
   - Descripción del problema
   - Pasos para reproducir
   - Logs de error
   - Versión de Node.js (`node --version`)
   - Sistema operativo

---

## ✅ Checklist de Diagnóstico

Antes de reportar un bug, verifica:

- [ ] Node.js 18+ instalado
- [ ] `npm install` ejecutado sin errores
- [ ] Archivo `.env` existe y tiene valores correctos
- [ ] Variables de entorno en Supabase configuradas
- [ ] Migraciones ejecutadas en Supabase
- [ ] Edge Function desplegada
- [ ] Usuario existe en Supabase Auth
- [ ] Registro existe en tabla `employees`
- [ ] Empleado está activo (`activo = true`)
- [ ] Consola del navegador sin errores
- [ ] Build de producción exitoso

---

**Última actualización:** 2024
