# Guía de Despliegue - ScanProfit

Esta aplicación tiene dos componentes que deben desplegarse por separado:

## 1. Frontend (React/Vite) → Netlify

El frontend se despliega automáticamente en Netlify cuando haces push a GitHub.

### Configuración en Netlify:

1. **Variables de entorno requeridas** (configúralas en el panel de Netlify):
   - `VITE_SUPABASE_URL` - URL de tu proyecto Supabase
   - `VITE_SUPABASE_ANON_KEY` - Clave anónima de Supabase

2. **Configuración de build** (ya configurada en `netlify.toml`):
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: 18

3. El archivo `netlify.toml` ya está configurado con:
   - Comando de build
   - Directorio de publicación
   - Redirects para SPA
   - Headers de seguridad

## 2. Edge Function (Supabase) → Supabase Platform

La Edge Function en `supabase/functions/product-lookup/` **NO se despliega en Netlify**. 
Debe desplegarse a Supabase usando el Supabase CLI.

### Pasos para desplegar la Edge Function:

1. **Instalar Supabase CLI** (si no lo tienes):
   ```bash
   npm install -g supabase
   ```

2. **Login a Supabase**:
   ```bash
   supabase login
   ```

3. **Vincular tu proyecto**:
   ```bash
   supabase link --project-ref TU_PROJECT_REF
   ```
   
   Encuentra tu `PROJECT_REF` en la URL de tu proyecto Supabase:
   `https://app.supabase.com/project/[PROJECT_REF]`

4. **Desplegar la función**:
   ```bash
   supabase functions deploy product-lookup
   ```

5. **Verificar el despliegue**:
   La función estará disponible en:
   ```
   https://[TU_PROJECT_REF].supabase.co/functions/v1/product-lookup
   ```

## Verificación del Despliegue

1. **Frontend en Netlify**: Visita tu URL de Netlify y verifica que la app carga
2. **Edge Function**: Abre la consola del navegador y escanea un código de barras
3. **Sin errores 404**: Si todo está configurado correctamente, no deberías ver errores 404 al llamar a la función

## Solución de Problemas

### Error 404 al llamar a la función:
- ✅ Verifica que la función esté desplegada en Supabase: `supabase functions list`
- ✅ Verifica que `VITE_SUPABASE_URL` en Netlify sea correcto
- ✅ Verifica que `VITE_SUPABASE_ANON_KEY` en Netlify sea correcto

### Error de CORS:
- La función ya tiene configuración CORS en `index.ts`
- Verifica que los headers CORS incluyan tu dominio de Netlify

### Función funciona local pero no en producción:
- Asegúrate de haber desplegado la función: `supabase functions deploy product-lookup`
- Las funciones locales (supabase start) no están disponibles en producción

## Flujo de Trabajo Recomendado

1. Desarrolla localmente con `npm run dev` y `supabase start`
2. Haz push a GitHub → Netlify se actualiza automáticamente
3. Cuando cambies la Edge Function, despliégala con `supabase functions deploy product-lookup`
4. Verifica que todo funcione en producción

## Recursos

- [Netlify Docs](https://docs.netlify.com/)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Supabase CLI](https://supabase.com/docs/guides/cli)
