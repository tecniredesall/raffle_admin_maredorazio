# Instalación en Mac (Apple Silicon M1 / M2 / M3)

Guía para levantar el monorepo y el **admin panel** (`artifacts/admin-panel`) en macOS con chip Apple Silicon.

---

## Requisitos

1. **Node.js** **20.19 o superior** (Vite 7 lo exige; 20.15 u otras versiones viejas muestran aviso o fallan).
   - Recomendado: [nvm](https://github.com/nvm-sh/nvm).
2. **pnpm** (el `package.json` raíz obliga a usar pnpm, no npm/yarn).
   ```bash
   npm install -g pnpm
   ```

---

## 1. Clonar el repositorio

Trabaja siempre desde la **raíz del repo**, donde están `pnpm-workspace.yaml` y `package.json`.

---

## 2. Activar una versión de Node válida (nvm)

Ejemplo con Node 20 LTS reciente:

```bash
source ~/.nvm/nvm.sh
nvm install 20.19.6
nvm use 20.19.6
node -v   # debe ser v20.19.x o superior (o 22.12+, 24.x)
```

Opcional: crea un archivo `.nvmrc` en la raíz con `20.19.6` y usa solo `nvm use`.

---

## 3. Instalar dependencias

```bash
cd /ruta/al/raffle_admin_maredorazio
pnpm install
```

Si acabas de **modificar** `overrides` en `pnpm-workspace.yaml` y pnpm se queja del lockfile:

```bash
pnpm install --no-frozen-lockfile
```

---

## 4. Ajuste en `pnpm-workspace.yaml` (nativos en macOS)

En entornos tipo Replit/Linux a veces se **anulan** las dependencias opcionales nativas de varias herramientas (sustituyéndolas por `'-'` en `overrides`). Eso evita instalar binarios que no se usan en Linux, pero en **Mac Apple Silicon** Vite/Rollup/Tailwind **necesitan** esos paquetes.

En este repo, en la sección `overrides` de `pnpm-workspace.yaml`, **no** deben aparecer entradas que bloqueen **darwin** para:

| Herramienta        | Qué debe poder instalarse en Mac (arm64) |
|--------------------|-------------------------------------------|
| **rollup**         | `@rollup/rollup-darwin-arm64`             |
| **lightningcss**   | `lightningcss-darwin-arm64`               |
| **@tailwindcss/oxide** | `@tailwindcss/oxide-darwin-arm64`     |
| **esbuild**        | `@esbuild/darwin-arm64`                   |

Si ves errores del tipo `Cannot find module '@rollup/rollup-darwin-arm64'`, `lightningcss.darwin-arm64.node`, etc., revisa que esas líneas `...darwin-arm64` / `...darwin-x64` **no** estén forzadas a `'-'` en `overrides`. Después vuelve a ejecutar `pnpm install` (o `--no-frozen-lockfile`).

---

## 5. Variables de entorno (admin panel)

Puedes exportarlas en la terminal o usar `artifacts/admin-panel/.env`.

| Variable              | Descripción                    | Ejemplo                          |
|-----------------------|--------------------------------|----------------------------------|
| `PORT`                | Puerto del servidor de Vite    | `3000`                           |
| `BASE_PATH`           | Base URL de la app             | `/`                              |
| `VITE_API_BASE_URL`   | URL del backend (opcional)     | `https://api.dev.maredorazio.com` |

Si no defines `VITE_API_BASE_URL`, la app puede usar la URL por defecto documentada en la guía del cliente.

---

## 6. Levantar el admin panel en desarrollo

Desde la **raíz del monorepo**:

```bash
source ~/.nvm/nvm.sh && nvm use 20.19.6
cd /ruta/al/raffle_admin_maredorazio
PORT=3000 BASE_PATH=/ pnpm --filter @workspace/admin-panel run dev
```

Abre en el navegador: **http://localhost:3000**

El servidor escucha en `0.0.0.0`, así que también puedes usar la IP de tu red local que muestre Vite.

---

## 7. Otros comandos útiles

**Build estático del admin panel** (desde la raíz):

```bash
pnpm --filter @workspace/admin-panel run build:static
```

Salida típica: `artifacts/admin-panel/dist/public/`.

**Preview del build** (ajusta `PORT` si hace falta):

```bash
PORT=3000 pnpm --filter @workspace/admin-panel run serve
```

---

## 8. Problemas frecuentes

| Síntoma | Qué hacer |
|---------|-----------|
| Vite pide Node más nuevo | `nvm use 20.19+` (o 22.12+, 24). |
| Falta `@rollup/rollup-darwin-arm64` o similar | Revisa `overrides` en `pnpm-workspace.yaml` (apartado 4) y reinstala dependencias. |
| `pnpm install` falla en postinstall de **esbuild** | Suele deberse a sandbox/red; prueba de nuevo fuera de restricciones o `rm -rf node_modules && pnpm install`. |
| Error de lockfile tras cambiar `overrides` | `pnpm install --no-frozen-lockfile`. |

---

## Documentación adicional

- Guía general del cliente: `artifacts/admin-panel/client/docs/SETUP.md`
