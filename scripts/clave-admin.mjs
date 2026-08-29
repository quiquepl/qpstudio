/* Genera el hash de una contraseña para el panel de administración.

   Uso:
     node scripts/clave-admin.mjs "la contraseña que quieras"
     node scripts/clave-admin.mjs            (inventa una segura)

   Imprime las líneas que hay que poner en .env.local y en Vercel. La
   contraseña en claro solo se muestra aquí: no se guarda en ningún sitio,
   porque lo que se almacena es el hash. */
import { randomBytes } from 'node:crypto';
import { hashDeClave } from '../api/_sesion.js';

// Sin caracteres ambiguos (l, I, 1, O, 0) para poder dictarla por teléfono.
const ALFABETO = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const inventar = (n = 20) =>
  Array.from(randomBytes(n), (b) => ALFABETO[b % ALFABETO.length]).join('');

const clave = process.argv[2] || inventar();
const inventada = !process.argv[2];

console.log('');
if (inventada) console.log(`Contraseña generada:  ${clave}`);
console.log('');
console.log('Pon estas líneas en .env.local y en las variables de Vercel:');
console.log('');
console.log(`ADMIN_CLAVE_HASH=${hashDeClave(clave)}`);
console.log('');
if (inventada) {
  console.log('Apúntala en tu gestor de contraseñas: no vuelve a mostrarse.');
  console.log('');
}
