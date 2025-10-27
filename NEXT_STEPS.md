# 🎯 Próximos Pasos para Resolver el Error 404

## ✅ Lo que se ha Completado

Se ha creado el archivo `netlify.toml` que le indica a Netlify cómo construir y desplegar tu aplicación.

## 🔧 Lo que DEBES Hacer Ahora

### Paso 1: Desplegar la Edge Function a Supabase

**El problema principal**: La Edge Function en `supabase/functions/product-lookup/` existe en GitHub pero **NO está desplegada en Supabase**. Por eso ves el error 404.

**Solución**:

1. Abre tu terminal local (no GitHub)

2. Instala el Supabase CLI (si no lo tienes):
   ```bash
   npm install -g supabase
   ```

3. Login a Supabase:
   ```bash
   supabase login
   ```

4. Ve al directorio de tu proyecto:
   ```bash
   cd /ruta/a/ScanProfit
   ```

5. Vincula tu proyecto Supabase:
   ```bash
   supabase link --project-ref TU_PROJECT_REF
   ```
   
   **¿Dónde encuentro mi PROJECT_REF?**
   - Ve a https://app.supabase.com/projects
   - Selecciona tu proyecto
   - En la URL verás: `https://app.supabase.com/project/[PROJECT_REF]`
   - Copia ese ID

6. **DESPLIEGA LA FUNCIÓN**:
   ```bash
   supabase functions deploy product-lookup
   ```

### Paso 2: Verificar Variables de Entorno en Netlify

1. Ve al panel de Netlify: https://app.netlify.com
2. Selecciona tu sitio
3. Ve a: Site configuration → Environment variables
4. Asegúrate de tener:
   - `VITE_SUPABASE_URL` = tu URL de Supabase (ej: `https://xxxxx.supabase.co`)
   - `VITE_SUPABASE_ANON_KEY` = tu clave anónima de Supabase

5. Si hiciste cambios, **Redeploy** el sitio en Netlify

### Paso 3: Probar

1. Ve a tu sitio de Netlify
2. Abre la consola del navegador (F12)
3. Escanea un código de barras
4. **NO deberías ver error 404**

## 📋 Resumen de Archivos Creados

- `netlify.toml` - Configuración de Netlify (build, publish directory, redirects)
- `DEPLOYMENT.md` - Guía completa de despliegue
- `README.md` - Actualizado con información del proyecto
- `NEXT_STEPS.md` - Este archivo

## ❓ FAQ

### ¿Por qué la función no se despliega automáticamente?

Las Edge Functions de Supabase son código backend que se ejecuta en los servidores de Supabase, no en Netlify. Netlify solo aloja el frontend (HTML, CSS, JS). Las funciones deben desplegarse manualmente usando el CLI de Supabase.

### ¿Funciona en Bolt.new pero no en Netlify?

Bolt.new automáticamente despliega tanto el frontend como las Edge Functions a Supabase. Cuando usas GitHub + Netlify, solo el frontend se despliega automáticamente. Debes desplegar las funciones manualmente.

### ¿Tengo que desplegar la función cada vez que hago cambios?

- **Frontend**: Se despliega automáticamente en Netlify con cada push a GitHub
- **Edge Function**: Solo cuando cambias el código en `supabase/functions/`, debes ejecutar `supabase functions deploy product-lookup`

## 🆘 Ayuda Adicional

Si después de seguir estos pasos aún tienes problemas:

1. Verifica que la función esté desplegada:
   ```bash
   supabase functions list
   ```

2. Revisa los logs de la función:
   ```bash
   supabase functions logs product-lookup
   ```

3. Verifica la consola del navegador para ver el error exacto

4. Comprueba que las variables de entorno en Netlify sean correctas

## 📚 Recursos

- [Guía Completa de Despliegue](./DEPLOYMENT.md)
- [Documentación de Supabase CLI](https://supabase.com/docs/guides/cli)
- [Documentación de Netlify](https://docs.netlify.com/)
