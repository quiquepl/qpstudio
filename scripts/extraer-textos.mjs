/* Lee los data-txt de index.html y escribe contenidos-base.json con el texto
   original de cada uno.

   Uso:  node scripts/extraer-textos.mjs   (lo llama build-pages.mjs)

   Existe para que el HTML sea la única fuente de verdad. Antes el panel
   llevaba su propia copia de cada texto y bastaba con retocar la web para
   que las dos versiones dejaran de coincidir: el panel mostraba como
   "original" algo que ya no estaba en ninguna parte. */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');

/* Devuelve el texto de cada elemento con data-txt, en el orden del fichero. */
export function extraer(html) {
  const base = {};
  const re = /<([a-z0-9]+)([^>]*?)\sdata-txt="([^"]+)"([^>]*)>/gi;
  let m;
  while ((m = re.exec(html))) {
    const [completo, etiqueta, , clave] = m;
    const desde = m.index + completo.length;
    const hasta = html.indexOf(`</${etiqueta}`, desde);
    if (hasta < 0) continue;
    base[clave] = html
      .slice(desde, hasta)
      .replace(/<[^>]+>/g, '') // por si dentro hubiera algún <br> o similar
      .replace(/\s+/g, ' ')
      .trim();
  }
  return base;
}

/* pathToFileURL normaliza barras y prefijo de disco. Comparar la cadena a
   mano falla en Windows: import.meta.url lleva tres barras y process.argv[1]
   usa contrabarras. */
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const html = readFileSync(join(RAIZ, 'index.html'), 'utf8');
  const base = extraer(html);
  writeFileSync(join(RAIZ, 'contenidos-base.json'), JSON.stringify(base, null, 2) + '\n');
  console.log(`contenidos-base.json: ${Object.keys(base).length} textos`);
}
