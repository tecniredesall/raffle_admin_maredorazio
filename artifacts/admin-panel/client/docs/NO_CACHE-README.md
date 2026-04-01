# No Cache - Documentación Técnica

## ¿Qué es?

Una estrategia para evitar que el navegador cachee la aplicación, asegurando que los usuarios siempre vean la versión más reciente.

---

## Implementación actual: Meta tag en index.html

El archivo `index.html` incluye esta meta tag:

```html
<meta http-equiv="Cache-Control" content="no-store, no-cache, must-revalidate, max-age=0">
```

### Directivas

| Directiva          | Descripción                                                              |
|--------------------|--------------------------------------------------------------------------|
| `no-store`         | El navegador no almacena ninguna versión de la respuesta                 |
| `no-cache`         | El navegador debe revalidar con el servidor antes de usar una copia      |
| `must-revalidate`  | Después de que la respuesta se vuelve obsoleta, no se puede reusar       |
| `max-age=0`        | La respuesta se considera obsoleta inmediatamente                        |

---

## Implementación recomendada: CacheBuster Provider

Para un control más robusto del caché a nivel de aplicación React, se recomienda crear un provider que envuelva toda la app. Este provider verifica periódicamente si hay una nueva versión disponible y fuerza la recarga.

### Paso 1: Crear el provider

Crear el archivo `src/providers/CacheBusterProvider.tsx`:

```tsx
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface CacheBusterContextType {
  currentVersion: string | null;
  isNewVersionAvailable: boolean;
  forceRefresh: () => void;
}

const CacheBusterContext = createContext<CacheBusterContextType>({
  currentVersion: null,
  isNewVersionAvailable: false,
  forceRefresh: () => {},
});

export function useCacheBuster() {
  return useContext(CacheBusterContext);
}

interface Props {
  children: ReactNode;
  checkInterval?: number; // milisegundos entre cada chequeo (default: 5 minutos)
}

export function CacheBusterProvider({ children, checkInterval = 5 * 60 * 1000 }: Props) {
  const [currentVersion, setCurrentVersion] = useState<string | null>(null);
  const [latestVersion, setLatestVersion] = useState<string | null>(null);

  const isNewVersionAvailable =
    currentVersion !== null && latestVersion !== null && currentVersion !== latestVersion;

  const fetchVersion = async () => {
    try {
      const response = await fetch("/version.json", {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });
      if (response.ok) {
        const data = await response.json();
        return data.version as string;
      }
    } catch {
      // silenciar errores de red
    }
    return null;
  };

  useEffect(() => {
    fetchVersion().then((version) => {
      if (version) {
        setCurrentVersion(version);
        setLatestVersion(version);
      }
    });

    const interval = setInterval(async () => {
      const version = await fetchVersion();
      if (version) {
        setLatestVersion(version);
      }
    }, checkInterval);

    return () => clearInterval(interval);
  }, [checkInterval]);

  const forceRefresh = () => {
    window.location.reload();
  };

  return (
    <CacheBusterContext.Provider value={{ currentVersion, isNewVersionAvailable, forceRefresh }}>
      {children}
    </CacheBusterContext.Provider>
  );
}
```

### Paso 2: Crear el archivo version.json

Crear el archivo `public/version.json`:

```json
{
  "version": "1.0.0"
}
```

Este archivo se actualiza (manual o automáticamente en el CI/CD) cada vez que se hace un nuevo deploy.

### Paso 3: Envolver la app con el provider

En `src/App.tsx`:

```tsx
import { CacheBusterProvider } from "@/providers/CacheBusterProvider";

function App() {
  return (
    <CacheBusterProvider checkInterval={5 * 60 * 1000}>
      {/* ... el resto de la app */}
    </CacheBusterProvider>
  );
}
```

### Paso 4: Mostrar aviso de nueva versión (opcional)

Crear un componente que avise al usuario cuando hay una nueva versión:

```tsx
import { useCacheBuster } from "@/providers/CacheBusterProvider";

export function UpdateBanner() {
  const { isNewVersionAvailable, forceRefresh } = useCacheBuster();

  if (!isNewVersionAvailable) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-primary text-primary-foreground px-6 py-3 rounded-xl shadow-lg flex items-center gap-4">
      <span>Hay una nueva versión disponible</span>
      <button
        onClick={forceRefresh}
        className="bg-white/20 hover:bg-white/30 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
      >
        Actualizar
      </button>
    </div>
  );
}
```

---

## Hashing de archivos estáticos

Vite genera automáticamente un hash en el nombre de los archivos JS y CSS al compilar (por ejemplo `index-3a7f1b09.js`). Cada vez que el código cambia y se vuelve a compilar, el hash se actualiza porque el contenido del archivo es diferente. Esto fuerza al navegador a descargar la nueva versión sin necesidad de limpiar la caché manualmente.

---

## Resumen de estrategias

| Estrategia                  | Nivel        | Qué resuelve                                       |
|-----------------------------|--------------|-----------------------------------------------------|
| Meta tag Cache-Control      | HTML         | Evita que el navegador cachee el index.html          |
| Hash en nombres de archivos | Build (Vite) | Fuerza descarga de JS/CSS nuevos en cada deploy      |
| CacheBuster Provider        | App (React)  | Detecta nuevas versiones y avisa al usuario en vivo  |
