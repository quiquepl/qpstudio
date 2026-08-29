/* Configuración de los servicios de Neon para este proyecto.
   Declara qué debe tener cada rama; se aplica con `neon deploy`.

   Hoy la web solo usa Lakebase Postgres, que viene con todo proyecto y no
   hace falta declarar. El bucket de Object Storage ya está provisionado en
   la rama y se declara aquí para que quede registrado en el repositorio en
   lugar de existir solo en la consola.

   Documentación: https://neon.com/docs/reference/neon-ts */
import { defineConfig } from '@neon/config/v1';

export default defineConfig({
  preview: {
    buckets: {
      // Pensado para las imágenes que suba el panel de administración.
      // Privado: los ficheros se sirven con URL firmada, no en abierto.
      uploads: {
        access: 'private'
      }
    }
  }
});
