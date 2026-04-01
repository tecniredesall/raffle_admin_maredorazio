# Guía de Instalación Local

Pasos para descargar y correr el proyecto en tu máquina local.

---

## Requisitos Previos

1. **Node.js** versión 24 o superior
   - Descarga: https://nodejs.org/

2. **pnpm** (gestor de paquetes)
   - Instálalo ejecutando:
     ```bash
     npm install -g pnpm
     ```

---

## Paso 1: Descargar el proyecto

Descarga o clona el proyecto completo en tu máquina.

---

## Paso 2: Instalar dependencias

Abre una terminal en la carpeta raíz del proyecto (donde está el archivo `pnpm-workspace.yaml`) y ejecuta:

```bash
pnpm install
```

Esto instalará todas las dependencias de todos los paquetes del monorepo.

---

## Paso 3: Variables de entorno

El proyecto necesita estas variables de entorno para funcionar. Puedes configurarlas directamente en la terminal antes de ejecutar el comando de desarrollo, o crear un archivo `.env` en la carpeta `artifacts/admin-panel/`.

| Variable              | Descripción                                      | Ejemplo                              |
|-----------------------|--------------------------------------------------|--------------------------------------|
| `PORT`                | Puerto donde correrá la app                      | `3000`                               |
| `BASE_PATH`           | Ruta base de la app                              | `/`                                  |
| `VITE_API_BASE_URL`   | (Opcional) URL de la API backend                 | `https://api.dev.maredorazio.com`    |

Si no defines `VITE_API_BASE_URL`, la app usará por defecto `https://api.dev.maredorazio.com`.

---

## Paso 4: Levantar en modo desarrollo

Ejecuta desde la raíz del proyecto:

```bash
PORT=3000 BASE_PATH=/ pnpm --filter @workspace/admin-panel run dev
```

Luego abre en el navegador:

```
http://localhost:3000
```

---

## Paso 5: Compilar para producción

Para generar los archivos estáticos optimizados:

```bash
pnpm --filter @workspace/admin-panel run build:static
```

Los archivos se generarán en `artifacts/admin-panel/dist/public/`.

---

## Paso 6: Servir el build de producción (opcional)

Si quieres probar el build de producción localmente:

```bash
PORT=3000 pnpm --filter @workspace/admin-panel run serve
```

---

## Estructura del proyecto

```
proyecto/
├── artifacts/
│   └── admin-panel/          ← La app principal
│       ├── client/
│       │   ├── src/           ← Código fuente React
│       │   ├── docs/          ← Documentación
│       │   ├── public/        ← Archivos estáticos
│       │   └── index.html     ← Punto de entrada HTML
│       ├── vite.config.ts     ← Configuración de Vite
│       └── package.json       ← Dependencias de la app
├── lib/                       ← Librerías compartidas
├── scripts/                   ← Scripts utilitarios
├── pnpm-workspace.yaml        ← Configuración del monorepo
└── package.json               ← Paquete raíz
```

---

## Notas adicionales

- El `index.html` incluye una meta tag de `Cache-Control` para evitar que el navegador cachee la página. Ver `docs/README.md` para más detalles.
- Al compilar para producción, Vite agrega un hash único al nombre de los archivos JS y CSS, forzando al navegador a descargar siempre la versión más reciente.
