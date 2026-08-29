/* Genera sitemap.xml y robots.txt, y mete en cada página las etiquetas que
   necesita un buscador: canonical, Open Graph completo, Twitter Card y datos
   estructurados JSON-LD.

   Uso:  node scripts/seo.mjs [--escribir]

   Las páginas se listan aquí una sola vez y de esa lista salen el sitemap y
   las etiquetas. Añadir una página nueva es añadir una línea. */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');

/* El dominio canónico. Todo apunta aquí: sin www el sitio redirige, así que
   si se anunciara la versión sin www cada enlace costaría un salto de más y
   Google vería dos direcciones para lo mismo. */
export const SITIO = 'https://www.qpstudio.es';

const T = {
  nombre: 'QP Studio',
  fundador: 'Quique Planelles',
  email: 'qpstudiocontacto@gmail.com',
  calle: 'Calle Federico García Moliner 25',
  pais: 'ES',
  nif: '54020797F'
};

/* prioridad y frecuencia según lo que cambia cada página */
export const PAGINAS = [
  { ruta: '/', archivo: 'index.html', prioridad: '1.0', frecuencia: 'weekly' },
  { ruta: '/servicios', archivo: 'servicios.html', prioridad: '0.9', frecuencia: 'monthly' },
  { ruta: '/gestion', archivo: 'gestion.html', prioridad: '0.8', frecuencia: 'monthly' },
  { ruta: '/mantenimiento', archivo: 'mantenimiento.html', prioridad: '0.8', frecuencia: 'monthly' },
  { ruta: '/contacto', archivo: 'contacto.html', prioridad: '0.9', frecuencia: 'monthly' },
  { ruta: '/aviso-legal', archivo: 'aviso-legal.html', prioridad: '0.2', frecuencia: 'yearly' },
  { ruta: '/privacidad', archivo: 'privacidad.html', prioridad: '0.2', frecuencia: 'yearly' },
  { ruta: '/cookies', archivo: 'cookies.html', prioridad: '0.2', frecuencia: 'yearly' }
  // admin.html queda fuera a propósito: es privada y no debe indexarse.
];

/* ── Datos estructurados ───────────────────────────────────────────── */

/* Un solo grafo con todo enlazado por @id, que es como Google prefiere
   leerlo: entiende que la organización, el sitio y la página son la misma
   entidad y no tres cosas sueltas. */
function jsonLd(pagina) {
  const idOrg = `${SITIO}/#organizacion`;
  const idSitio = `${SITIO}/#sitio`;

  const grafo = [
    {
      '@type': 'ProfessionalService',
      '@id': idOrg,
      name: T.nombre,
      alternateName: 'QP Studio Web',
      url: SITIO,
      email: T.email,
      description:
        'Estudio digital independiente. Diseño, desarrollo y mantenimiento web para negocios de cualquier sector.',
      logo: { '@type': 'ImageObject', url: `${SITIO}/img/logo.png`, width: 512, height: 512 },
      image: `${SITIO}/img/og.jpg`,
      priceRange: '€€',
      vatID: T.nif,
      address: {
        '@type': 'PostalAddress',
        streetAddress: T.calle,
        addressCountry: T.pais
      },
      founder: { '@type': 'Person', name: T.fundador },
      areaServed: { '@type': 'Country', name: 'España' },
      availableLanguage: 'es',
      knowsAbout: [
        'Diseño web',
        'Rediseño web',
        'Comercio electrónico',
        'Automatización e integraciones',
        'Mantenimiento web',
        'SEO'
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Servicios',
        itemListElement: [
          ['Diseño web', 'Identidad, estructura y contenidos desde cero.'],
          ['Rediseño web', 'Auditoría, migración sin pérdidas y mejora de conversión.'],
          ['Comercio electrónico', 'Catálogo, ficha de producto y proceso de compra.'],
          ['Automatización e integraciones', 'Formularios, avisos y herramientas conectadas.']
        ].map(([nombre, desc]) => ({
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: nombre, description: desc }
        }))
      }
    },
    {
      '@type': 'WebSite',
      '@id': idSitio,
      url: SITIO,
      name: T.nombre,
      inLanguage: 'es-ES',
      publisher: { '@id': idOrg }
    },
    {
      '@type': 'WebPage',
      '@id': `${SITIO}${pagina.ruta}#pagina`,
      url: `${SITIO}${pagina.ruta}`,
      name: pagina.titulo,
      description: pagina.descripcion,
      isPartOf: { '@id': idSitio },
      about: { '@id': idOrg },
      inLanguage: 'es-ES'
    }
  ];

  // Las páginas interiores llevan miga de pan; la portada no la necesita.
  if (pagina.ruta !== '/') {
    grafo.push({
      '@type': 'BreadcrumbList',
      '@id': `${SITIO}${pagina.ruta}#miga`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: SITIO },
        { '@type': 'ListItem', position: 2, name: pagina.titulo }
      ]
    });
  }

  return JSON.stringify({ '@context': 'https://schema.org', '@graph': grafo });
}

/* Las preguntas frecuentes de la portada, como FAQPage: es lo que puede
   sacarte el desplegable de preguntas en los resultados de Google. */
function jsonLdFaq(html) {
  const preguntas = [];
  const re = /<summary>.*?class="faq__q"[^>]*>([\s\S]*?)<\/span><\/summary>\s*<p>([\s\S]*?)<\/p>/g;
  let m;
  while ((m = re.exec(html))) {
    preguntas.push({
      '@type': 'Question',
      name: m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim(),
      acceptedAnswer: {
        '@type': 'Answer',
        text: m[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
      }
    });
  }
  if (!preguntas.length) return null;
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${SITIO}/#faq`,
    mainEntity: preguntas
  });
}

/* ── Etiquetas de cabecera ─────────────────────────────────────────── */

function etiquetas(pagina, html) {
  const url = `${SITIO}${pagina.ruta}`;
  const bloques = [
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:site_name" content="${T.nombre}" />`,
    `<meta property="og:image" content="${SITIO}/img/og.jpg" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="QP Studio · diseño y desarrollo web" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${pagina.titulo}" />`,
    `<meta name="twitter:description" content="${pagina.descripcion}" />`,
    `<meta name="twitter:image" content="${SITIO}/img/og.jpg" />`,
    `<script type="application/ld+json">${jsonLd(pagina)}</script>`
  ];

  if (pagina.ruta === '/') {
    const faq = jsonLdFaq(html);
    if (faq) bloques.push(`<script type="application/ld+json">${faq}</script>`);
  }

  return bloques;
}

/* ── Sitemap y robots ──────────────────────────────────────────────── */

export function sitemap(fecha) {
  const urls = PAGINAS.map(
    (p) =>
      `  <url>\n` +
      `    <loc>${SITIO}${p.ruta}</loc>\n` +
      `    <lastmod>${fecha}</lastmod>\n` +
      `    <changefreq>${p.frecuencia}</changefreq>\n` +
      `    <priority>${p.prioridad}</priority>\n` +
      `  </url>`
  ).join('\n');
  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls +
    '\n</urlset>\n'
  );
}

export function robots() {
  return [
    'User-agent: *',
    'Allow: /',
    '',
    '# El panel es privado y no tiene nada que indexar.',
    'Disallow: /admin',
    '',
    `Sitemap: ${SITIO}/sitemap.xml`,
    ''
  ].join('\n');
}

/* ── Ejecución ─────────────────────────────────────────────────────── */

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const escribir = process.argv.includes('--escribir');
  const fecha = new Date().toISOString().slice(0, 10);
  let tocadas = 0;

  for (const pagina of PAGINAS) {
    const ruta = join(RAIZ, pagina.archivo);
    let html;
    try {
      html = readFileSync(ruta, 'utf8');
    } catch {
      console.log(`  ✗ ${pagina.archivo} no existe`);
      continue;
    }

    pagina.titulo = (/<title>([^<]*)<\/title>/.exec(html)?.[1] || T.nombre).replace(
      / — QP Studio$/,
      ''
    );
    pagina.descripcion = /<meta name="description" content="([^"]*)"/.exec(html)?.[1] || '';

    // Se quitan primero las etiquetas que puso una ejecución anterior, para
    // que volver a ejecutarlo no las duplique.
    let limpio = html
      .replace(/\n?\s*<!-- seo -->[\s\S]*?<!-- \/seo -->/g, '')
      .replace(/\n?\s*<link rel="canonical"[^>]*>/g, '');

    const bloque =
      '\n<!-- seo -->\n' + etiquetas(pagina, limpio).join('\n') + '\n<!-- /seo -->';

    const cierre = limpio.indexOf('</head>');
    if (cierre < 0) {
      console.log(`  ✗ ${pagina.archivo}: no encuentro </head>`);
      continue;
    }
    const salida = limpio.slice(0, cierre) + bloque + '\n' + limpio.slice(cierre);

    if (escribir) writeFileSync(ruta, salida);
    tocadas++;
  }

  if (escribir) {
    writeFileSync(join(RAIZ, 'sitemap.xml'), sitemap(fecha));
    writeFileSync(join(RAIZ, 'robots.txt'), robots());
  }

  console.log(
    `  ${tocadas} página(s) con canonical, Open Graph y JSON-LD` +
      (escribir ? ', más sitemap.xml y robots.txt' : ' (simulacro, usa --escribir)')
  );
}
