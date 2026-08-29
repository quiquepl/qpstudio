/* Descarga las tipografías de Google Fonts y las deja servidas por el propio
   sitio, con su hoja de estilos en css/fuentes.css.

   Uso:  node scripts/fuentes.mjs

   Por qué no se enlaza directamente a Google:

   - Su hoja bloquea el renderizado. Antes de pintar una sola letra, el
     navegador tiene que resolver un dominio ajeno, negociar TLS y esperar el
     CSS. En una conexión móvil floja eso son cientos de milisegundos que van
     directos al LCP, que es una de las métricas que Google mide para
     posicionar. Sí: perjudica al SEO por servir las fuentes de Google.
   - Desde 2020 los navegadores particionan la caché por sitio, así que ya no
     hay ninguna ventaja de "otro sitio ya la tenía cargada".
   - Se acaba la excusa de contarle la IP de cada visitante a un tercero, que
     es lo que obligaba a citar a Google en la política de cookies.

   Archivo y Geist están bajo licencia SIL Open Font, que permite alojarlas.

   Solo se piden los subconjuntos latinos: el sitio está en español y traerse
   el cirílico o el griego sería peso muerto. */
import { mkdirSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { RAIZ } from './_comun.mjs';

const CONSULTA =
  'family=Archivo:wght@400;500;600;700;800;900&family=Geist:wght@400;500;600&display=swap';

// Con un agente moderno, Google devuelve woff2. Con uno viejo devuelve
// formatos antiguos que pesan el doble.
const AGENTE =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const SUBCONJUNTOS = ['latin', 'latin-ext'];

const DESTINO = join(RAIZ, 'fuentes');
mkdirSync(DESTINO, { recursive: true });

const css = await fetch(`https://fonts.googleapis.com/css2?${CONSULTA}`, {
  headers: { 'User-Agent': AGENTE }
}).then((r) => {
  if (!r.ok) throw new Error(`Google Fonts respondió ${r.status}`);
  return r.text();
});

/* La hoja viene con un comentario /* latin *​/ antes de cada @font-face, que
   es lo único que dice a qué subconjunto pertenece. */
const bloques = [];
const re = /\/\*\s*([a-z-]+)\s*\*\/\s*(@font-face\s*\{[^}]*\})/g;
let m;
while ((m = re.exec(css))) bloques.push({ subconjunto: m[1], regla: m[2] });

const salida = [];
let descargadas = 0;

for (const { subconjunto, regla } of bloques) {
  if (!SUBCONJUNTOS.includes(subconjunto)) continue;

  const familia = /font-family:\s*'([^']+)'/.exec(regla)?.[1] ?? 'fuente';
  const peso = /font-weight:\s*([0-9]+)/.exec(regla)?.[1] ?? '400';
  const estilo = /font-style:\s*([a-z]+)/.exec(regla)?.[1] ?? 'normal';
  const url = /url\(([^)]+)\)/.exec(regla)?.[1];
  if (!url) continue;

  const nombre = `${familia.toLowerCase().replace(/\s+/g, '-')}-${peso}-${subconjunto}.woff2`;
  const datos = Buffer.from(await fetch(url).then((r) => r.arrayBuffer()));
  writeFileSync(join(DESTINO, nombre), datos);
  descargadas++;

  const rango = /unicode-range:\s*([^;]+);/.exec(regla)?.[1];
  salida.push(
    [
      '@font-face {',
      `  font-family: '${familia}';`,
      `  font-style: ${estilo};`,
      `  font-weight: ${peso};`,
      // swap: el texto se ve desde el primer momento con la tipografía del
      // sistema y cambia cuando llega la buena. Sin esto habría un instante
      // en blanco, que es peor.
      '  font-display: swap;',
      `  src: url('../fuentes/${nombre}') format('woff2');`,
      rango ? `  unicode-range: ${rango};` : null,
      '}'
    ]
      .filter(Boolean)
      .join('\n')
  );
}

const cabecera = [
  '/* Tipografías servidas desde este mismo sitio.',
  '',
  '   Generado por scripts/fuentes.mjs. No editar a mano: se sobrescribe.',
  '',
  '   Antes se enlazaba la hoja de Google Fonts, que bloquea el renderizado',
  '   mientras el navegador resuelve un dominio ajeno y negocia TLS. Eso',
  '   retrasa el primer pintado y penaliza el LCP, que Google usa para',
  '   posicionar. Alojarlas aquí quita esa espera y de paso deja de enviarle',
  '   a Google la IP de cada visitante.',
  '',
  '   Archivo y Geist son SIL Open Font License. */',
  ''
].join('\n');

writeFileSync(join(RAIZ, 'css', 'fuentes.css'), cabecera + salida.join('\n\n') + '\n');

const peso = readdirSync(DESTINO).reduce((a, f) => a + statSync(join(DESTINO, f)).size, 0);
console.log(
  `  ${descargadas} archivos woff2 (${Math.round(peso / 1024)} KB) y css/fuentes.css`
);
