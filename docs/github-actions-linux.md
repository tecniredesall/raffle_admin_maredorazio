# GitHub Actions en Linux (CI)

Cómo instalar y compilar este monorepo en **GitHub Actions** sobre **Linux**, y qué tener en cuenta respecto a `pnpm-workspace.yaml` y los runners.

---

## Runner recomendado

Usa **`ubuntu-latest`** (o `ubuntu-22.04` / `ubuntu-24.04`). Es **x86_64** con **glibc** (no Alpine/musl por defecto).

Con la configuración actual de **`overrides`** en `pnpm-workspace.yaml`, se **siguen instalando** los opcionales nativos típicos para ese entorno, por ejemplo:

- Rollup: `rollup-linux-x64-gnu` (no está anulado; sí lo está `linux-x64-musl`)
- lightningcss: `lightningcss-linux-x64-gnu`
- `@tailwindcss/oxide`: paquete **linux x64 gnu** (el **musl** sí está anulado)
- esbuild: el binario **linux x64** no aparece en la lista de anulaciones

En la práctica, **typecheck + build del admin panel** suelen funcionar en `ubuntu-latest` sin tocar los overrides.

---

## Cuándo puede fallar en Linux

| Situación | Riesgo |
|-----------|--------|
| **`ubuntu-latest` x86_64** | Bajo; es el caso “normal” de esta guía. |
| **Runner Linux ARM** (`ubuntu-24.04-arm` u otros) | Alto: muchos opcionales **`linux-arm64-*`** están anulados con `'-'` igual que en otros entornos “slim”. Puedes ver errores al estilo de “cannot find module … linux-arm64”. Habría que **quitar** esas líneas de `overrides` para tu arquitectura (similar a lo documentado para Mac en `docs/instalacion-mac-m1.md`). |
| **Imagen Alpine / musl** | Alto para algunas herramientas: por ejemplo **`linux-x64-musl`** está anulado para Rollup, lightningcss y Tailwind oxide. Mejor **no** usar Alpine para este build salvo que ajustes overrides y pruebes bien. |

---

## Versiones

- **Node.js**: **20.19+** (o 22.12+, 24.x), alineado con Vite 7 y con la guía local.
- **pnpm**: la versión que use el lockfile del repo (por ejemplo la que indique el campo `packageManager` en `package.json` si lo añades, o la que ya uséis en el equipo). En el ejemplo siguiente se fija con `package.json` + `corepack` o con `pnpm/action-setup`.

---

## Ejemplo de workflow

Crea `.github/workflows/ci.yml` (o el nombre que prefieras) con algo equivalente a:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 10

      - uses: actions/setup-node@v4
        with:
          node-version: "20.19.6"
          cache: "pnpm"

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Typecheck
        run: pnpm run typecheck

      - name: Build admin panel
        env:
          BASE_PATH: /
          NODE_ENV: production
          # Opcional: URL de API en tiempo de build si la app la inyecta con Vite
          # VITE_API_BASE_URL: https://api.ejemplo.com
        run: pnpm --filter @workspace/admin-panel run build
```

Ajusta ramas, versión de pnpm y de Node según el proyecto.

---

## Variables de entorno en CI

- **`BASE_PATH`**: para el build del admin panel suele ser `/` (igual que en local).
- **`VITE_API_BASE_URL`**: solo si el frontend la necesita en **build time** (prefijos `VITE_`). Si no la defines, se usa la lógica por defecto del código (ver `artifacts/admin-panel/client/docs/SETUP.md`).
- **`NODE_ENV=production`**: razonable en pasos de `build` para alinear con producción.

No hace falta `PORT` en CI salvo que ejecutes un servidor de desarrollo en el job (poco habitual).

---

## Lockfile y `overrides`

- En CI conviene **`pnpm install --frozen-lockfile`** para que falle si el lockfile no coincide con el árbol de dependencias.
- Si en el repo se **cambian** los `overrides` de `pnpm-workspace.yaml`, hay que regenerar el lockfile en local (`pnpm install` o `pnpm install --no-frozen-lockfile`) y **commitear** `pnpm-lock.yaml`; si no, el job fallará en el install.

---

## Comandos útiles (referencia)

| Objetivo | Comando (desde la raíz del repo) |
|----------|----------------------------------|
| Typecheck monorepo (libs + artifacts + scripts) | `pnpm run typecheck` |
| Build solo admin panel (Vite) | `pnpm --filter @workspace/admin-panel run build` |
| Build estático con `BASE_PATH=/` | `pnpm --filter @workspace/admin-panel run build:static` |
| Build completo raíz (typecheck + todos los `build` presentes) | `pnpm run build` |

---

## Documentación relacionada

- Instalación en Mac Apple Silicon: `docs/instalacion-mac-m1.md`
- Setup del cliente admin: `artifacts/admin-panel/client/docs/SETUP.md`
