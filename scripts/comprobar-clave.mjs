/* Comprueba que ADMIN_CLAVE y ADMIN_CLAVE_HASH de .env.local se
   corresponden. Útil cuando el acceso falla y no sabes si el problema está
   en la contraseña, en el hash o en cómo se leen las variables.

   Uso:  node scripts/comprobar-clave.mjs */
import { claveCorrecta } from '../api/_sesion.js';
import { cargarEnv } from './_comun.mjs';

cargarEnv();
const env = process.env;
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
