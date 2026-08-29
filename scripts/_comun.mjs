/* Lo que compartían todos los scripts, en un solo sitio.

   Antes cada uno llevaba su propia copia del cargador de .env y su propia
   forma de sacar la cadena de conexión. Cuatro copias de lo mismo es cuatro
   sitios donde arreglar el mismo fallo. */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

export const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');

/* Mete en process.env lo que haya en .env.local o .env, sin pisar lo que ya
   estuviera puesto. En el despliegue no hay ficheros: las variables ya vienen
   del entorno, y por eso no falla si no existen. */
export function cargarEnv() {
  for (const fichero of ['.env.local', '.env']) {
    try {
      for (const linea of readFileSync(join(RAIZ, fichero), 'utf8').split(/\r?\n/)) {
        const m = linea.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
        if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
      }
    } catch {
      /* el fichero puede no existir */
    }
  }
}

/* pg avisa de que en su próxima versión mayor 'require' pasará a tener la
   semántica floja de libpq en vez de comportarse como 'verify-full'. Neon
   entrega la cadena con sslmode=require, así que se fija explícitamente para
   que el día que cambien no se degrade la verificación del certificado sin
   que nos enteremos. De paso, calla el aviso en cada ejecución. */
export function conCertificadoVerificado(cadena) {
  if (!cadena) return cadena;
  return cadena.replace(/([?&])sslmode=(require|prefer|verify-ca)\b/, '$1sslmode=verify-full');
}

/* La conexión DIRECTA, sin pooler. Es la que hay que usar para cambios de
   esquema y para leer desde los scripts del build: el pooler en modo
   transacción no garantiza el estado de sesión que necesitan. */
export function cadenaDirecta() {
  cargarEnv();
  return conCertificadoVerificado(
    process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL
  );
}
