/* Borra los intentos de acceso fallidos, que es lo que bloquea el panel
   durante quince minutos tras ocho errores seguidos.

   Uso:  node scripts/desbloquear.mjs

   Sirve para cuando te dejas fuera a ti mismo y no quieres esperar. */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import pg from 'pg';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
for (const fichero of ['.env.local', '.env']) {
  try {
    for (const linea of readFileSync(join(RAIZ, fichero), 'utf8').split(/\r?\n/)) {
      const m = linea.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  } catch {
    /* puede no existir */
  }
}

const cadena = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
if (!cadena) {
  console.error('Falta DATABASE_URL. Ejecuta: npx neon env pull');
  process.exit(1);
}

const cliente = new pg.Client({ connectionString: cadena });
await cliente.connect();
const { rowCount } = await cliente.query('delete from intentos_acceso');
await cliente.end();

console.log(
  rowCount
    ? `Borrados ${rowCount} intento(s) fallido(s). Ya puedes volver a entrar.`
    : 'No había ningún bloqueo activo.'
);
