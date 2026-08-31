/* Construye el sitio. Es lo que ejecuta Vercel en cada despliegue y lo único
   que hay que llamar a mano:  npm run build

   El orden importa y por eso está en un solo sitio:

     1. extraer-textos    lee los data-txt de index.html y deja el original de
                          cada uno en contenidos-base.json, que es lo que el
                          panel muestra como "texto de fábrica"
     2. build-pages       regenera las páginas interiores desde la plantilla
                          común (cabecera, pie, legales)
     3. aplicar-contenidos mete en index.html los textos cambiados desde el
                          panel. Va DESPUÉS del paso 1 para que el original
                          extraído sea el del fichero y no el ya sustituido
     4. seo               canonical, Open Graph, JSON-LD, sitemap y robots.
                          Va el último porque el paso 2 reescribe las páginas
                          interiores enteras y borraría sus etiquetas

   Ninguno de los pasos que hablan con la base de datos puede tumbar el
   despliegue: si Neon no contesta, la web sale con los textos del fichero.
   Es preferible publicar contenido de ayer que no publicar nada. */
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');

const pasos = [
  ['Precios de la portada', 'scripts/tarifas.mjs', []],
  ['Textos originales', 'scripts/extraer-textos.mjs', []],
  ['Páginas interiores', 'build-pages.mjs', []],
  ['Textos del panel', 'scripts/aplicar-contenidos.mjs', []],
  ['SEO', 'scripts/seo.mjs', ['--escribir']]
];

let fallos = 0;

for (const [nombre, script, args] of pasos) {
  process.stdout.write(`\n▸ ${nombre}\n`);
  try {
    const salida = execFileSync(process.execPath, [join(RAIZ, script), ...args], {
      cwd: RAIZ,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe']
    });
    process.stdout.write(
      salida
        .split('\n')
        .filter(Boolean)
        .map((l) => (l.startsWith(' ') ? l : `  ${l}`))
        .join('\n') + '\n'
    );
  } catch (e) {
    fallos++;
    const detalle = String(e.stdout || '') + String(e.stderr || e.message);
    process.stdout.write(`  ✗ ${detalle.trim().split('\n').slice(-3).join('\n     ')}\n`);
  }
}

if (fallos) {
  console.log(`\n${fallos} paso(s) con problemas. La web se publica igualmente.`);
} else {
  console.log('\nListo.');
}
