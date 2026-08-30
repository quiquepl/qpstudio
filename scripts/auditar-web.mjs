/* Audita la web de un posible cliente y saca los problemas concretos que
   sirven de gancho en la llamada.

   Uso:  node scripts/auditar-web.mjs lafloris.com otraweb.es ...

   No sustituye a mirarla con los ojos, pero en diez segundos te da la frase
   con la que empezar. La lista sale ordenada por lo que más le duele a un
   negocio, no por lo que más le gusta a un técnico. */

const LIMITE_MS = 12000;

const traer = async (url) => {
  const control = new AbortController();
  const reloj = setTimeout(() => control.abort(), LIMITE_MS);
  const t0 = Date.now();
  try {
    const r = await fetch(url, {
      redirect: 'follow',
      signal: control.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0 Safari/537.36' }
    });
    const html = await r.text();
    return { ok: true, estado: r.status, url: r.url, ms: Date.now() - t0, html, cab: r.headers };
  } catch (e) {
    return { ok: false, error: e.name === 'AbortError' ? 'no responde a tiempo' : e.message };
  } finally {
    clearTimeout(reloj);
  }
};

function analizar(html, ms, cab) {
  const hay = (re) => re.test(html);
  const uno = (re) => (re.exec(html) || [])[1]?.trim() ?? null;

  const graves = [];
  const medios = [];
  const bien = [];

  /* ── Lo que cuesta llamadas ─────────────────────────────────────── */
  if (!hay(/href=["']tel:/i))
    graves.push('El teléfono no se puede pulsar: hay que copiarlo a mano');
  else bien.push('Teléfono pulsable');

  if (!hay(/wa\.me|api\.whatsapp|whatsapp:/i)) medios.push('No hay WhatsApp');
  else bien.push('WhatsApp');

  if (!hay(/name=["']viewport["']/i))
    graves.push('NO está adaptada a móvil — se ve minúscula en el teléfono');
  else bien.push('Adaptada a móvil');

  if (ms > 4000) graves.push(`Tarda ${(ms / 1000).toFixed(1)} s en cargar`);
  else if (ms > 2500) medios.push(`Va lenta: ${(ms / 1000).toFixed(1)} s`);
  else bien.push(`Carga en ${(ms / 1000).toFixed(1)} s`);

  /* ── Lo que le cuesta salir en Google ───────────────────────────── */
  const titulo = uno(/<title[^>]*>([^<]*)</i);
  if (!titulo) graves.push('Sin título: Google no sabe qué poner en el resultado');
  else if (titulo.length > 65)
    medios.push(`Título de ${titulo.length} letras: Google lo corta`);

  if (!hay(/name=["']description["']/i))
    graves.push('Sin descripción: Google se inventa el texto del resultado');

  const h1 = (html.match(/<h1[\b>]/gi) || []).length;
  if (h1 === 0) graves.push('Sin H1: Google no sabe de qué va la página');
  else if (h1 > 1) medios.push(`${h1} H1 distintos, debería haber uno`);

  if (!hay(/application\/ld\+json/i))
    medios.push('Sin datos estructurados: no sale como negocio en búsquedas locales');

  /* ── Lo que se ve al compartirla ────────────────────────────────── */
  if (!hay(/property=["']og:image["']/i))
    medios.push('Al compartirla por WhatsApp sale sin imagen');

  /* ── Accesibilidad e imágenes ───────────────────────────────────── */
  const imgs = (html.match(/<img\b[^>]*>/gi) || []);
  const sinAlt = imgs.filter((i) => !/\salt=/i.test(i)).length;
  if (sinAlt > 0) medios.push(`${sinAlt} de ${imgs.length} imágenes sin describir`);

  /* ── Señales de abandono ────────────────────────────────────────── */
  const anios = [...html.matchAll(/(?:©|&copy;|Copyright)\s*(20\d\d)/gi)].map((m) => Number(m[1]));
  const ahora = new Date().getFullYear();
  if (anios.length && Math.max(...anios) < ahora - 1)
    graves.push(`El pie pone "© ${Math.max(...anios)}": parece abandonada`);

  if (hay(/flash|<marquee|<font\b|<center\b/i))
    graves.push('Usa etiquetas de hace veinte años');

  /* ── Peso ───────────────────────────────────────────────────────── */
  const kb = Math.round(html.length / 1024);
  if (kb > 300) medios.push(`El HTML pesa ${kb} KB, muchísimo`);

  const plataforma = /wp-content|wp-includes/i.test(html)
    ? 'WordPress'
    : /cdn\.shopify/i.test(html)
      ? 'Shopify'
      : /wixstatic|wix\.com/i.test(html)
        ? 'Wix'
        : /squarespace/i.test(html)
          ? 'Squarespace'
          : 'a medida o desconocida';

  return { graves, medios, bien, titulo, kb, plataforma };
}

/* ── Ejecución ──────────────────────────────────────────────────────── */

const webs = process.argv.slice(2);
if (!webs.length) {
  console.log('Uso: node scripts/auditar-web.mjs dominio.es [otro.com ...]');
  process.exit(0);
}

for (const w of webs) {
  const url = /^https?:\/\//.test(w) ? w : `https://${w}`;
  console.log(`\n${'═'.repeat(66)}\n${w}\n${'═'.repeat(66)}`);

  const r = await traer(url);
  if (!r.ok) {
    console.log(`  ✗ NO CARGA (${r.error})`);
    console.log('  → Gancho: "vuestra web no me carga, ¿lo sabíais?"');
    continue;
  }
  if (r.estado >= 400) {
    console.log(`  ✗ Devuelve error ${r.estado}`);
    continue;
  }

  const a = analizar(r.html, r.ms, r.cab);
  console.log(`  ${a.plataforma} · ${a.kb} KB · ${(r.ms / 1000).toFixed(1)} s`);
  if (a.titulo) console.log(`  "${a.titulo.slice(0, 70)}"`);

  if (a.graves.length) {
    console.log('\n  PROBLEMAS GORDOS');
    a.graves.forEach((p) => console.log(`    ✗ ${p}`));
  }
  if (a.medios.length) {
    console.log('\n  MEJORABLES');
    a.medios.forEach((p) => console.log(`    · ${p}`));
  }
  if (a.bien.length) console.log(`\n  Bien: ${a.bien.join(', ')}`);

  const gancho = a.graves[0] || a.medios[0];
  if (gancho) console.log(`\n  → GANCHO PARA LA LLAMADA:\n    "${gancho}"`);
  else console.log('\n  → Sin gancho técnico claro. Mírala con los ojos.');
}

console.log('');
