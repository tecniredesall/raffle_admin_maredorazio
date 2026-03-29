# Panel Admin - Documentación Técnica

## Cache-Control

El archivo `index.html` incluye la siguiente meta tag para evitar que el navegador cachee la página:

```html
<meta http-equiv="Cache-Control" content="no-store, no-cache, must-revalidate, max-age=0">
```

### ¿Qué hace?

- **no-store**: El navegador no almacena ninguna versión de la respuesta.
- **no-cache**: El navegador debe revalidar con el servidor antes de usar una copia cacheada.
- **must-revalidate**: Después de que la respuesta se vuelve obsoleta, no se puede usar sin revalidarla.
- **max-age=0**: La respuesta se considera obsoleta inmediatamente.

### ¿Por qué se usa?

Esto garantiza que cada vez que un usuario abre la app, el navegador descargue la última versión del `index.html`. Desde el HTML actualizado, se cargan los archivos JS y CSS que incluyen un hash único en su nombre (generado automáticamente por Vite en cada build), asegurando que siempre se sirva la versión más reciente del código.

### Hashing de archivos estáticos

Vite genera automáticamente un hash en el nombre de los archivos JS y CSS al compilar (por ejemplo `index-3a7f1b09.js`). Cada vez que el código cambia y se vuelve a compilar, el hash se actualiza porque el contenido del archivo es diferente. Esto fuerza al navegador a descargar la nueva versión sin necesidad de limpiar la caché manualmente.
