/* Mete en index.html los textos cambiados desde el panel.

   Uso:  node scripts/aplicar-contenidos.mjs

   Lo ejecuta el build antes de publicar. Sustituye el contenido de cada
   elemento con data-txt por lo que haya en la tabla `contenidos`. Lo que no
   esté en la tabla se queda con el texto del fichero.

   Se hace aquí, al construir, y no en el navegador de quien visita la web,
   por dos razones: el HTML que recibe Google ya lleva el texto definitivo, y
   no hay una consulta a la base de datos por cada visita. La web sigue siendo
   estática y sirviéndose desde la caché.

   Si no hay base de datos disponible no falla: deja el HTML como está. Un
   despliegue nunca debe romperse porque la base de datos esté dormida. */
import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { join } from 'node:path';
import { RAIZ, cadenaDirecta } from './_comun.mjs';

/* Escapa lo que va a acabar dentro del HTML. Los textos los escribe una
   persona en un formulario: si alguien pega '<script>', tiene que verse como
   texto y no ejecutarse. */
const escapar = (t) =>
  String(t)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

/* Sustituye el contenido de los elementos con data-txt. */
export function aplicar(html, cambios) {
  let aplicados = 0;
  const salida = html.replace(
    /(<([a-z0-9]+)[^>]*?\sdata-txt="([^"]+)"[^>]*>)([\s\S]*?)(<\/\2>)/gi,
    (todo, apertura, _etiqueta, clave, dentro, cierre) => {
      const nuevo = cambios[clave];
      if (typeof nuevo !== 'string' || !nuevo.length) return todo;
      aplicados++;
      return apertura + escapar(nuevo) + cierre;
    }
  );
  return { html: salida, aplicados };
}

async function leerCambios() {
  const cadena = cadenaDirecta();
  if (!cadena) {
    console.log('  sin DATABASE_URL: dejo los textos del fichero');
    return null;
  }
  const { default: pg } = await import('pg');
  const cliente = new pg.Client({ connectionString: cadena, connectionTimeoutMillis: 15_000 });
  await cliente.connect();
  try {
    const { rows } = await cliente.query('select clave, valor from contenidos');
    return Object.fromEntries(rows.map((r) => [r.clave, r.valor]));
  } finally {
    await cliente.end();
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  let cambios = null;
  try {
    cambios = await leerCambios();
  } catch (e) {
    console.log(`  no he podido leer los textos (${e.message}): dejo los del fichero`);
  }

  if (cambios && Object.keys(cambios).length) {
    const ruta = join(RAIZ, 'index.html');
    const { html, aplicados } = aplicar(readFileSync(ruta, 'utf8'), cambios);

    /* index.html guarda los textos de fábrica y vive en Git. Sobrescribirlo
       en el ordenador de uno los perdería para siempre, y el siguiente commit
       subiría como "original" un texto que solo era un cambio del panel.

       Por eso solo se escribe dentro del despliegue (Vercel pone VERCEL=1),
       donde la copia del repositorio es de usar y tirar. Con --forzar se
       puede reproducir en local para comprobarlo, pero entonces hay que
       deshacer el cambio con `git checkout index.html`. */
    const enDespliegue = process.env.VERCEL === '1';
    if (enDespliegue || process.argv.includes('--forzar')) {
      writeFileSync(ruta, html);
      console.log(`  ${aplicados} texto(s) del panel aplicados a index.html`);
    } else {
      console.log(`  ${aplicados} texto(s) se aplicarán al publicar (aquí no se toca el fichero)`);
    }
  } else {
    console.log('  no hay textos cambiados en el panel');
  }
}
