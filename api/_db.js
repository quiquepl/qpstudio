/* Conexión a Lakebase Postgres (Neon).

   Una sola pool por instancia de función: crearla en cada petición agotaría
   las conexiones del servidor en cuanto haya algo de tráfico.

   Se usa la cadena con -pooler (DATABASE_URL). Es lo que corresponde a
   funciones serverless: muchas instancias efímeras contra un pooler que
   multiplexa. La directa (DATABASE_URL_UNPOOLED) queda para migraciones. */
import pg from 'pg';

let pool;

/* pg avisa de que en su próxima versión mayor 'require' pasará a tener la
   semántica débil de libpq en lugar de comportarse como 'verify-full'. Neon
   entrega la cadena con sslmode=require, así que la fijamos explícitamente
   para que el día que cambien no se degrade la verificación del certificado
   sin que nos enteremos. */
function conCertificadoVerificado(cadena) {
  if (!cadena) return cadena;
  return cadena.replace(/([?&])sslmode=(require|prefer|verify-ca)\b/, '$1sslmode=verify-full');
}

export function getPool() {
  if (pool) return pool;

  const connectionString = conCertificadoVerificado(process.env.DATABASE_URL);
  if (!connectionString) throw new Error('Falta DATABASE_URL');

  pool = new pg.Pool({
    connectionString,
    // La función atiende de una en una; con pocas conexiones sobra y así no
    // se acapara el pooler cuando Vercel levanta muchas instancias a la vez.
    max: 3,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 10_000
  });

  // Si una conexión inactiva se cae (Neon suspende el cómputo a los 5 min),
  // pg emite 'error' en la pool. Sin este manejador, Node tumba el proceso.
  pool.on('error', (e) => console.error('[db] conexión inactiva caída:', e.message));

  // En Vercel con Fluid compute esto cierra las conexiones cuando la
  // instancia se suspende, en lugar de dejarlas colgando del lado de Neon.
  import('@vercel/functions')
    .then(({ attachDatabasePool }) => attachDatabasePool?.(pool))
    .catch(() => {
      /* fuera de Vercel no existe; en local no hace falta */
    });

  return pool;
}

export function consulta(texto, valores) {
  return getPool().query(texto, valores);
}
