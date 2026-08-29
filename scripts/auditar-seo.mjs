/* Revisa el SEO de las páginas construidas y dice qué falla.

   Uso:  node scripts/auditar-seo.mjs

   No arregla nada: solo mira. Comprueba lo que de verdad afecta al
   posicionamiento y a cómo se ve el sitio compartido, no una lista de
   buenas intenciones. */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { RAIZ } from './_comun.mjs';
import { PAGINAS, SITIO } from './seo.mjs';

const problemas = [];
const avisos = [];
const pega = (lista, pagina, texto) => lista.push(`${pagina.padEnd(20)} ${texto}`);

const titulos = new Map();
const descripciones = new Map();

for (const pagina of PAGINAS) {
  const f = pagina.archivo;
  let html;
  try {
    html = readFileSync(join(RAIZ, f), 'utf8');
  } catch {
    pega(problemas, f, 'no existe');
    continue;
  }

  /* ── título ─────────────────────────────────────────────────────── */
  const titulo = /<title>([^<]*)<\/title>/.exec(html)?.[1] ?? '';
  if (!titulo) pega(problemas, f, 'sin <title>');
  else {
    // Google corta alrededor de los 60 caracteres; por debajo de 25 se
    // desaprovecha el sitio.
    if (titulo.length > 60) pega(avisos, f, `título de ${titulo.length} caracteres, se cortará en Google`);
    if (titulo.length < 25) pega(avisos, f, `título de ${titulo.length} caracteres, muy corto`);
    if (titulos.has(titulo)) pega(problemas, f, `título repetido con ${titulos.get(titulo)}`);
    titulos.set(titulo, f);
  }

  /* ── descripción ────────────────────────────────────────────────── */
  const desc = /<meta name="description" content="([^"]*)"/.exec(html)?.[1] ?? '';
  if (!desc) pega(problemas, f, 'sin meta description');
  else {
    if (desc.length > 160) pega(avisos, f, `descripción de ${desc.length} caracteres, se cortará`);
    if (desc.length < 70) pega(avisos, f, `descripción de ${desc.length} caracteres, se queda corta`);
    if (descripciones.has(desc)) pega(problemas, f, `descripción repetida con ${descripciones.get(desc)}`);
    descripciones.set(desc, f);
  }

  /* ── encabezados ────────────────────────────────────────────────── */
  const h1 = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)];
  if (!h1.length) pega(problemas, f, 'sin <h1>');
  if (h1.length > 1) pega(problemas, f, `${h1.length} <h1>, debe haber uno`);

  // saltos de nivel: pasar de h2 a h4 sin h3 confunde a los lectores de
  // pantalla y despista al rastreador sobre la jerarquía
  const niveles = [...html.matchAll(/<h([1-6])[^>]*>/g)].map((m) => Number(m[1]));
  let previo = 0;
  for (const n of niveles) {
    if (previo && n > previo + 1) {
      pega(avisos, f, `salto de h${previo} a h${n} en los encabezados`);
      break;
    }
    previo = n;
  }

  /* ── imágenes ───────────────────────────────────────────────────── */
  for (const img of html.matchAll(/<img\b[^>]*>/g)) {
    const et = img[0];
    if (!/\salt=/.test(et)) pega(problemas, f, `<img> sin alt: ${et.slice(0, 70)}`);
    if (!/\bwidth=/.test(et) || !/\bheight=/.test(et))
      pega(avisos, f, `<img> sin width/height (provoca saltos de maquetación): ${et.slice(0, 60)}`);
    if (!/loading=/.test(et) && !/logo\.png/.test(et))
      pega(avisos, f, `<img> sin loading: ${et.slice(0, 60)}`);
  }

  /* ── canonical y Open Graph ─────────────────────────────────────── */
  const canon = /<link rel="canonical" href="([^"]*)"/.exec(html)?.[1];
  const esperado = `${SITIO}${pagina.ruta}`;
  if (!canon) pega(problemas, f, 'sin canonical');
  else if (canon !== esperado) pega(problemas, f, `canonical ${canon} debería ser ${esperado}`);

  for (const et of ['og:title', 'og:description', 'og:image', 'og:url', 'og:type']) {
    if (!html.includes(`property="${et}"`)) pega(problemas, f, `falta ${et}`);
  }

  /* ── idioma y ancho de pantalla ─────────────────────────────────── */
  if (!/<html lang="es"/.test(html)) pega(problemas, f, 'sin lang="es"');
  if (!/name="viewport"/.test(html)) pega(problemas, f, 'sin meta viewport');

  /* ── datos estructurados ────────────────────────────────────────── */
  const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if (!ld.length) pega(problemas, f, 'sin JSON-LD');
  for (const bloque of ld) {
    try {
      JSON.parse(bloque[1]);
    } catch (e) {
      pega(problemas, f, `JSON-LD ilegible: ${e.message}`);
    }
  }

  /* ── enlaces ────────────────────────────────────────────────────── */
  for (const a of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) {
    if (!/rel="[^"]*noopener/.test(a[0]))
      pega(problemas, f, `enlace externo sin rel="noopener": ${a[0].slice(0, 60)}`);
  }
  for (const a of html.matchAll(/<a\b[^>]*>\s*<\/a>/g)) {
    pega(avisos, f, 'enlace vacío, sin texto ni imagen');
  }
}

/* ── informe ──────────────────────────────────────────────────────── */
console.log(`\nRevisadas ${PAGINAS.length} páginas.\n`);
if (problemas.length) {
  console.log(`PROBLEMAS (${problemas.length})`);
  problemas.forEach((p) => console.log(`  ✗ ${p}`));
  console.log('');
}
if (avisos.length) {
  console.log(`AVISOS (${avisos.length})`);
  avisos.forEach((p) => console.log(`  · ${p}`));
  console.log('');
}
if (!problemas.length && !avisos.length) console.log('Nada que corregir.\n');

process.exit(problemas.length ? 1 : 0);
