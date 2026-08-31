/* Trae las fotos de Unsplash a este mismo sitio y reescribe las referencias.

   Uso:  node scripts/imagenes.mjs

   Por qué. Las fotos venían de images.unsplash.com en cada visita. Eso son
   trece peticiones a un dominio ajeno que hay que resolver, negociar por TLS
   y esperar. Cuando Unsplash tarda o limita, una foto de fondo CSS
   simplemente no aparece: no hay error, no hay hueco, no hay reintento. La
   tarjeta se queda en blanco y no te enteras. Es exactamente el fallo
   intermitente que se veía en las webs en órbita.

   Alojadas aquí van con caché de un año e immutable, salen del mismo
   servidor que el HTML y dejan de depender de nadie. De paso, Unsplash deja
   de recibir la IP de cada visitante.

   Licencia: Unsplash permite descargar y usar las fotos, también en
   proyectos comerciales, sin pedir permiso.

   El script es idempotente: lo que ya está descargado no se vuelve a pedir,
   y si las referencias ya son locales no encuentra nada que reescribir. */
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { RAIZ } from './_comun.mjs';

const DESTINO = join(RAIZ, 'img', 'fotos');
const FICHEROS = ['index.html', 'build-pages.mjs'];

/* fm=jpg en vez de auto=format: auto negocia el formato con el navegador y
   desde un script podría devolver webp o avif según la cabecera del día.
   Aquí interesa un fichero estable con un nombre estable. */
const origen = (id, w) =>
  `https://images.unsplash.com/${id}?fit=crop&w=${w}&q=${w > 600 ? 68 : 62}&fm=jpg`;

const local = (id, w) => `img/fotos/${id}-${w}.jpg`;

mkdirSync(DESTINO, { recursive: true });

/* ── 1. Qué fotos hacen falta y a qué ancho ───────────────────────────── */

const necesarias = new Map(); // "id|w" -> { id, w }
const apunta = (id, w) => necesarias.set(`${id}|${w}`, { id, w: Number(w) });

for (const fichero of FICHEROS) {
  const texto = readFileSync(join(RAIZ, fichero), 'utf8');
  for (const m of texto.matchAll(/images\.unsplash\.com\/(photo-[\w-]+)\?[^"'\s]*?w=(\d+)/g)) {
    apunta(m[1], m[2]);
  }
}

/* El ayudante foto() de build-pages.mjs monta la URL con una variable, así
   que su identificador no aparece en el texto: llega como argumento. Se
   sacan de las llamadas a servicio(), que es quien lo usa. */
const gen = readFileSync(join(RAIZ, 'build-pages.mjs'), 'utf8');
for (const m of gen.matchAll(/'(photo-[\w-]+)'/g)) apunta(m[1], 900);

if (!necesarias.size) {
  console.log('No hay fotos de Unsplash referenciadas. Nada que hacer.');
  process.exit(0);
}

/* ── 2. Descargar lo que falte ────────────────────────────────────────── */

let bajadas = 0;
let bytes = 0;

for (const { id, w } of necesarias.values()) {
  const ruta = join(RAIZ, local(id, w));
  if (existsSync(ruta)) {
    bytes += statSync(ruta).size;
    console.log(`  ·  ${id}-${w}.jpg (ya estaba)`);
    continue;
  }
  const r = await fetch(origen(id, w));
  if (!r.ok) {
    console.error(`  ✗  ${id}-${w}.jpg  HTTP ${r.status}`);
    continue;
  }
  const buf = Buffer.from(await r.arrayBuffer());
  writeFileSync(ruta, buf);
  bytes += buf.length;
  bajadas++;
  console.log(`  ✓  ${id}-${w}.jpg  ${(buf.length / 1024).toFixed(0)} KB`);
}

/* ── 3. Reescribir las referencias ────────────────────────────────────── */

let tocados = 0;

for (const fichero of FICHEROS) {
  const ruta = join(RAIZ, fichero);
  const antes = readFileSync(ruta, 'utf8');
  const despues = antes.replace(
    /https:\/\/images\.unsplash\.com\/(photo-[\w-]+)\?[^"'\s]*?w=(\d+)[^"'\s]*/g,
    (_, id, w) => local(id, w)
  );
  if (despues !== antes) {
    writeFileSync(ruta, despues);
    tocados++;
    console.log(`  →  reescrito ${fichero}`);
  }
}

/* El ayudante foto() se reescribe aparte: su URL se monta con una variable
   y la expresión de arriba no la reconoce. */
const rutaGen = join(RAIZ, 'build-pages.mjs');
const genAntes = readFileSync(rutaGen, 'utf8');
const genDespues = genAntes.replace(
  /https:\/\/images\.unsplash\.com\/\$\{id\}\?[^`"']*/g,
  'img/fotos/${id}-900.jpg'
);
if (genDespues !== genAntes) {
  writeFileSync(rutaGen, genDespues);
  tocados++;
  console.log('  →  reescrito el ayudante foto() de build-pages.mjs');
}

console.log(
  `\n${necesarias.size} foto(s), ${bajadas} nueva(s), ${(bytes / 1024 / 1024).toFixed(2)} MB en total. ` +
    (tocados ? `${tocados} fichero(s) actualizados.` : 'Las referencias ya eran locales.')
);
