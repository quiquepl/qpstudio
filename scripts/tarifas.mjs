/* Escribe el bloque de precios de la portada entre sus marcadores.

   Uso:  node scripts/tarifas.mjs

   A diferencia de aplicar-contenidos, este paso SÍ puede reescribir
   index.html en local, y por eso no está gateado por VERCEL=1: no mete
   nada de la base de datos, sino la salida determinista de
   scripts/_tarifas.mjs. Mismo módulo, mismo HTML. Si nada ha cambiado, el
   fichero queda byte a byte igual y Git no ve nada.

   Lo que sí sería peligroso es lo contrario: editar los precios a mano
   dentro de index.html. Se perderían en la siguiente construcción. Los
   marcadores lo avisan. */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { RAIZ } from './_comun.mjs';
import { bloqueTarifas } from './_tarifas.mjs';

const RUTA = join(RAIZ, 'index.html');
const ABRE = '<!-- tarifas -->';
const CIERRA = '<!-- /tarifas -->';

const html = readFileSync(RUTA, 'utf8');
const i = html.indexOf(ABRE);
const j = html.indexOf(CIERRA);

if (i < 0 || j < 0 || j < i) {
  console.error(`Faltan los marcadores ${ABRE} … ${CIERRA} en index.html.`);
  process.exit(1);
}

const nuevo =
  html.slice(0, i + ABRE.length) + '\n' + bloqueTarifas() + '\n    ' + html.slice(j);

if (nuevo === html) {
  console.log('Los precios de la portada ya estaban al día.');
} else {
  writeFileSync(RUTA, nuevo);
  console.log('Precios escritos en la portada.');
}
