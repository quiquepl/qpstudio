/* Aplica los ficheros .sql de db/ por orden de nombre.
   Uso:  node scripts/migrar.mjs

   Usa la conexión DIRECTA (DATABASE_URL_UNPOOLED), no la del pooler: las
   migraciones necesitan estado de sesión y el pooler en modo transacción no
   lo garantiza. Es lo que recomienda Neon para esquema.

   Cada fichero se envuelve en una transacción y se anota en la tabla
   migraciones, así que ejecutarlo dos veces no repite trabajo. */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import pg from 'pg';
import { RAIZ, cadenaDirecta } from './_comun.mjs';

const DB = join(RAIZ, 'db');

const cadena = cadenaDirecta();
if (!cadena) {
  console.error('Falta DATABASE_URL. Ejecuta: npx neon env pull');
  process.exit(1);
}
if (cadena.includes('-pooler.')) {
  console.warn('Aviso: estás migrando por el pooler. Mejor DATABASE_URL_UNPOOLED.');
}
const cliente = new pg.Client({ connectionString: cadena });
await cliente.connect();

await cliente.query(`
  create table if not exists migraciones (
    fichero     text primary key,
    aplicada_en timestamptz not null default now()
  )
`);

const { rows } = await cliente.query('select fichero from migraciones');
const hechas = new Set(rows.map((r) => r.fichero));
const pendientes = readdirSync(DB).filter((f) => f.endsWith('.sql')).sort();

let aplicadas = 0;
for (const fichero of pendientes) {
  if (hechas.has(fichero)) {
    console.log(`  ·  ${fichero} (ya estaba)`);
    continue;
  }
  const sql = readFileSync(join(DB, fichero), 'utf8');
  try {
    await cliente.query('begin');
    await cliente.query(sql);
    await cliente.query('insert into migraciones (fichero) values ($1)', [fichero]);
    await cliente.query('commit');
    console.log(`  ✓  ${fichero}`);
    aplicadas++;
  } catch (e) {
    await cliente.query('rollback');
    console.error(`  ✗  ${fichero}\n     ${e.message}`);
    await cliente.end();
    process.exit(1);
  }
}

await cliente.end();
console.log(aplicadas ? `\nListo: ${aplicadas} migración(es) aplicada(s).` : '\nNada que aplicar.');
