/* Saca teléfonos, WhatsApp, correos y redes de la web de un prospecto.

   Uso:  node scripts/contactos-web.mjs dominio.es [otro.com ...]

   Mira la portada y, si las encuentra, también las páginas de contacto, que
   es donde casi siempre están los datos buenos. */

const AGENTE =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';

const traer = async (url) => {
  try {
    const c = new AbortController();
    const t = setTimeout(() => c.abort(), 12000);
    const r = await fetch(url, { redirect: 'follow', signal: c.signal, headers: { 'User-Agent': AGENTE } });
    clearTimeout(t);
    return r.ok ? await r.text() : '';
  } catch {
    return '';
  }
};

/* Un teléfono español: 9 dígitos que empiezan por 6, 7, 8 o 9, con o sin
   prefijo y con separadores de cualquier tipo. */
const normaliza = (t) => t.replace(/[^\d+]/g, '').replace(/^\+?34/, '');
const esValido = (t) => /^[6789]\d{8}$/.test(t);
const bonito = (t) => `${t.slice(0, 3)} ${t.slice(3, 6)} ${t.slice(6)}`;

function extraer(html) {
  const tel = new Set();
  const wa = new Set();
  const mail = new Set();
  const redes = new Set();

  // href="tel:..." es el más fiable
  for (const m of html.matchAll(/href=["']tel:([^"']+)["']/gi)) {
    const n = normaliza(m[1]);
    if (esValido(n)) tel.add(n);
  }

  // teléfonos escritos en el texto
  const texto = html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<[^>]+>/g, ' ');
  for (const m of texto.matchAll(/(?:\+?34[\s.-]?)?([6789]\d{2}[\s.-]?\d{3}[\s.-]?\d{3})\b/g)) {
    const n = normaliza(m[1]);
    if (esValido(n)) tel.add(n);
  }

  for (const m of html.matchAll(/(?:wa\.me|api\.whatsapp\.com\/send\?phone=)\/?(\+?\d+)/gi)) {
    const n = normaliza(m[1]);
    if (esValido(n)) wa.add(n);
  }

  for (const m of html.matchAll(/[\w.+-]+@[\w-]+\.[\w.]{2,}/g)) {
    const e = m[0].toLowerCase();
    if (!/\.(png|jpg|jpeg|gif|svg|webp|css|js)$/.test(e) && !/sentry|wixpress|example/.test(e)) mail.add(e);
  }

  for (const m of html.matchAll(/https?:\/\/(?:www\.)?(instagram|facebook|linkedin)\.com\/([\w.\-/]+)/gi)) {
    const u = m[2].replace(/[/?].*$/, '');
    if (u && !/sharer|share|plugins|tr\b/.test(u)) redes.add(`${m[1]}: ${u}`);
  }

  return { tel: [...tel], wa: [...wa], mail: [...mail], redes: [...redes] };
}

for (const w of process.argv.slice(2)) {
  const base = /^https?:\/\//.test(w) ? w : `https://${w}`;
  console.log(`\n── ${w} ${'─'.repeat(Math.max(0, 50 - w.length))}`);

  let html = await traer(base);
  if (!html) {
    console.log('  no carga');
    continue;
  }

  // busca enlaces a páginas de contacto y las añade
  const extra = new Set();
  for (const m of html.matchAll(/href=["']([^"']*(?:contact|contacto|aviso-legal|legal|quienes)[^"']*)["']/gi)) {
    let u = m[1];
    if (u.startsWith('/')) u = new URL(u, base).href;
    if (u.startsWith('http') && u.includes(new URL(base).hostname)) extra.add(u);
  }
  for (const u of [...extra].slice(0, 3)) html += await traer(u);

  const c = extraer(html);
  console.log(`  Teléfonos : ${c.tel.length ? c.tel.map(bonito).join(' · ') : '—'}`);
  console.log(`  WhatsApp  : ${c.wa.length ? c.wa.map(bonito).join(' · ') : '—'}`);
  console.log(`  Correos   : ${c.mail.length ? c.mail.slice(0, 4).join(' · ') : '—'}`);
  console.log(`  Redes     : ${c.redes.length ? c.redes.slice(0, 4).join(' · ') : '—'}`);
}

console.log('');
