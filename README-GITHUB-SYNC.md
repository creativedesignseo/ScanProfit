# Cómo sincronizar este proyecto con GitHub

Pasos rápidos para crear un repo en GitHub y subir este proyecto (local -> GitHub).

1) Crea un nuevo repositorio en GitHub (por ejemplo `ScanProfit`).

2) En tu máquina, desde la carpeta del proyecto, añade, comitea y configura el remoto:

```bash
cd "/Users/juanotero/Downloads/scanprofit v1.1/ScanProfit"
git init
git add .
git commit -m "Initial commit"
# sustituye <your-github-url> por la URL del repo que creaste
git remote add origin <your-github-url>
git branch -M main
git push -u origin main
```

3) Configurar GitHub Actions (CI):
El repositorio ya incluye un workflow en `.github/workflows/ci.yml` que ejecuta typecheck, lint y build en pushes/PRs hacia `main`.

4) Secrets (opcional / recomendado):
Si prefieres no llamar al webhook de n8n directamente desde el cliente, puedes configurar un proxy o poner secretos aquí. Para añadir secretos (Settings → Secrets → Actions):
- `VITE_N8N_WEBHOOK_URL` – URL del webhook o del proxy.
- `VITE_N8N_WEBHOOK_TOKEN` – token compartido para validar llamadas (si lo usas).

5) Probar y desplegar:
- Al hacer `git push` verás el workflow ejecutarse en la pestaña Actions.
- Para desplegar la app o configurar hosting, añade pasos específicos según la plataforma (Vercel, Netlify, etc.).

Si quieres, puedo crear un repo en GitHub y empujar estos cambios por ti: dime el nombre del repo y si me das permiso para ejecutar comandos de git aquí (puedo mostrar los comandos y tú los pegas), o prefieres que te dé los comandos exactos para correr localmente.
