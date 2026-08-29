/* Borra los intentos de acceso fallidos, que es lo que bloquea el panel
   durante quince minutos tras ocho errores seguidos.

   Uso:  node scripts/desbloquear.mjs

   Sirve para cuando te dejas fuera a ti mismo y no quieres esperar. */
import pg from 'pg';
import { cadenaDirecta } from './_comun.mjs';

const cadena = cadenaDirecta();
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
