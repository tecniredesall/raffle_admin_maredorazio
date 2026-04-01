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

### ¿Dónde va el archivo `.env`?

El archivo `.env` debe crearse en `artifacts/admin-panel/`, al mismo nivel que `vite.config.ts`:

```
artifacts/
└── admin-panel/
    ├── .env                ← Aquí va el archivo
    ├── vite.config.ts
    ├── package.json
    └── client/
        └── src/
```

### Contenido del archivo `.env`

```env
PORT=3000
BASE_PATH=/
VITE_API_BASE_URL=https://tu-api.com
```

### Variables disponibles

| Variable              | Descripción                                      | Ejemplo                              | Accesible desde React |
|-----------------------|--------------------------------------------------|--------------------------------------|-----------------------|
| `PORT`                | Puerto donde correrá la app                      | `3000`                               | No                    |
| `BASE_PATH`           | Ruta base de la app                              | `/`                                  | No                    |
| `VITE_API_BASE_URL`   | (Opcional) URL de la API backend                 | `https://api.dev.maredorazio.com`    | Sí                    |

Si no defines `VITE_API_BASE_URL`, la app usará por defecto `https://api.dev.maredorazio.com`.

**Importante:** Solo las variables que empiezan con `VITE_` son accesibles desde el código del cliente (React). Las demás (`PORT`, `BASE_PATH`) solo se usan al momento de ejecutar los comandos de desarrollo o build.

### Archivos `.env` por ambiente

Vite soporta múltiples archivos `.env` para diferentes ambientes. Todos van en `artifacts/admin-panel/`:

| Archivo             | Cuándo se carga                          | ¿Se sube a git? |
|---------------------|------------------------------------------|------------------|
| `.env`              | Siempre                                  | Sí               |
| `.env.local`        | Siempre (sobreescribe `.env`)            | No               |
| `.env.development`  | Solo en modo desarrollo (`dev`)          | Sí               |
| `.env.production`   | Solo en modo producción (`build`)        | Sí               |

Por ejemplo, puedes tener:
- `.env.development` con `VITE_API_BASE_URL=https://api.dev.tudominio.com`
- `.env.production` con `VITE_API_BASE_URL=https://api.tudominio.com`

Vite cargará automáticamente el archivo correcto según el modo en que se ejecute.

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

- El `index.html` incluye una meta tag de `Cache-Control` para evitar que el navegador cachee la página. Ver `docs/NO_CACHE-README.md` para más detalles.
- Al compilar para producción, Vite agrega un hash único al nombre de los archivos JS y CSS, forzando al navegador a descargar siempre la versión más reciente.
