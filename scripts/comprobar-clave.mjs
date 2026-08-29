/* Comprueba que ADMIN_CLAVE y ADMIN_CLAVE_HASH de .env.local se
   corresponden. Útil cuando el acceso falla y no sabes si el problema está
   en la contraseña, en el hash o en cómo se leen las variables.

   Uso:  node scripts/comprobar-clave.mjs */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { claveCorrecta } from '../api/_sesion.js';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const env = {};
for (const linea of readFileSync(join(RAIZ, '.env.local'), 'utf8').split(/\r?\n/)) {
  const m = linea.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}

const clave = env.ADMIN_CLAVE;
const hash = env.ADMIN_CLAVE_HASH;

console.log('usuario           :', env.ADMIN_USUARIO || '(falta)');
console.log('contraseña        :', clave ? `${clave.length} caracteres` : '(falta)');
console.log('hash              :', hash ? `${hash.split('$').length} partes` : '(falta)');
console.log('secreto de sesión :', env.SESION_SECRETO ? 'presente' : '(falta)');
console.log('');
console.log(
  'coinciden         :',
  clave && hash && claveCorrecta(clave, hash) ? 'SÍ' : 'NO'
);
