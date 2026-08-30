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

/* Código de verificación de Google Search Console.

   Se usa la etiqueta y no el fichero HTML que ofrece Google, porque con
   cleanUrls la ruta del fichero devuelve un 308 y Google rechaza la
   verificación con "el archivo redirige a una ubicación no autorizada".
   La etiqueta no depende de rutas.

   No es un secreto: se sirve en el HTML de todas las páginas.

   No la quites aunque la verificación ya esté hecha: Google la vuelve a
   comprobar cada cierto tiempo y si desaparece pierdes la propiedad. */
export const VERIFICACION_GOOGLE = 'QBvAUidL9GEBSni_bPFn5w6azvIRbNriep8Oyj5xf1k';

/* En schema.org la marca y la sociedad son campos distintos: "name" es el
   nombre con el que se conoce el servicio y "legalName" la sociedad que
   factura. Así Google enseña QP Studio y a la vez tiene el dato correcto. */
const T = {
  nombre: 'QP Studio',
  sociedad: 'GEST26',
  fundador: 'Quique Planelles',
  email: 'qpstudiocontacto@gmail.com',
  calle: '[Domicilio social pendiente]',
  pais: 'ES',
  cif: '[CIF pendiente]'
};

/* Título y descripción de cada página viven aquí, no en el generador.

   El título es lo primero que se lee en Google y lo que más pesa: se
   escribe con la palabra por la que quieres que te encuentren delante y la
   marca detrás, sin pasar de unos 60 caracteres, que es donde corta.

   La descripción no posiciona, pero decide si hacen clic. Entre 120 y 155
   caracteres, diciendo qué se van a encontrar y no lo buenos que somos. */
export const PAGINAS = [
  {
    ruta: '/',
    archivo: 'index.html',
    prioridad: '1.0',
    frecuencia: 'weekly',
    titulo: 'Diseño y desarrollo web para negocios — QP Studio',
    descripcion:
      'Estudio digital independiente en España. Diseñamos, desarrollamos y mantenemos webs para negocios de cualquier sector, con panel para que las gestiones tú.'
  },
  {
    ruta: '/servicios',
    archivo: 'servicios.html',
    prioridad: '0.9',
    frecuencia: 'monthly',
    titulo: 'Servicios: diseño, rediseño y tiendas online — QP Studio',
    descripcion:
      'Diseño web desde cero, rediseño conservando el posicionamiento, comercio electrónico y automatización. Qué incluye cada servicio y cómo trabajamos.'
  },
  {
    ruta: '/gestion',
    archivo: 'gestion.html',
    prioridad: '0.8',
    frecuencia: 'monthly',
    titulo: 'Gestiona tu web tú mismo, sin tocar código — QP Studio',
    descripcion:
      'Cambia textos, precios, horarios e imágenes desde un panel propio. Formularios, reservas y pagos conectados de verdad, con acompañamiento y soporte.'
  },
  {
    ruta: '/mantenimiento',
    archivo: 'mantenimiento.html',
    prioridad: '0.8',
    frecuencia: 'monthly',
    titulo: 'Mantenimiento web sin ataduras — QP Studio',
    descripcion:
      'Qué incluye el mantenimiento, qué es tuyo desde el primer día y cómo te lo entregamos todo el día que decidas seguir por tu cuenta. Sin permanencia.'
  },
  {
    ruta: '/contacto',
    archivo: 'contacto.html',
    prioridad: '0.9',
    frecuencia: 'monthly',
    titulo: 'Pide presupuesto para tu web — QP Studio',
    descripcion:
      'Cuéntanos qué necesita tu negocio y te enviamos una propuesta por escrito, sin compromiso y sin coste. Respondemos en menos de 48 horas.'
  },
  {
    ruta: '/aviso-legal',
    archivo: 'aviso-legal.html',
    prioridad: '0.2',
    frecuencia: 'yearly',
    titulo: 'Aviso legal y datos del titular — QP Studio',
    descripcion:
      'Datos del titular, condiciones de uso, propiedad intelectual y responsabilidad del sitio web de QP Studio, conforme a la LSSI-CE.'
  },
  {
    ruta: '/privacidad',
    archivo: 'privacidad.html',
    prioridad: '0.2',
    frecuencia: 'yearly',
    titulo: 'Política de privacidad — QP Studio',
    descripcion:
      'Qué datos tratamos, con qué base legal, cuánto los conservamos, a quién se comunican y cómo ejercer tus derechos según el RGPD.'
  },
  {
    ruta: '/cookies',
    archivo: 'cookies.html',
    prioridad: '0.2',
    frecuencia: 'yearly',
    titulo: 'Política de cookies — QP Studio',
    descripcion:
      'Este sitio no usa cookies de publicidad ni de seguimiento. Qué almacenamiento técnico hay, qué terceros ven tu IP y cómo bloquearlo desde el navegador.'
  }
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
      legalName: T.sociedad,
      url: SITIO,
      email: T.email,
      description:
        'Estudio digital independiente. Diseño, desarrollo y mantenimiento web para negocios de cualquier sector.',
      logo: { '@type': 'ImageObject', url: `${SITIO}/img/logo.png`, width: 512, height: 512 },
      image: `${SITIO}/img/og.jpg`,
      priceRange: '€€',
      vatID: T.cif,
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
    ...(VERIFICACION_GOOGLE
      ? [`<meta name="google-site-verification" content="${VERIFICACION_GOOGLE}" />`]
      : []),
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:locale" content="es_ES" />`,
    `<meta property="og:site_name" content="${T.nombre}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:title" content="${atributo(pagina.titulo)}" />`,
    `<meta property="og:description" content="${atributo(pagina.descripcion)}" />`,
    `<meta property="og:image" content="${SITIO}/img/og.jpg" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:type" content="image/jpeg" />`,
    `<meta property="og:image:alt" content="QP Studio · diseño y desarrollo web" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${atributo(pagina.titulo)}" />`,
    `<meta name="twitter:description" content="${atributo(pagina.descripcion)}" />`,
    `<meta name="twitter:image" content="${SITIO}/img/og.jpg" />`,
    `<script type="application/ld+json">${jsonLd(pagina)}</script>`
  ];

  if (pagina.ruta === '/') {
    const faq = jsonLdFaq(html);
    if (faq) bloques.push(`<script type="application/ld+json">${faq}</script>`);
  }

  return bloques;
}

/* Comillas y ampersands fuera, que estos textos van dentro de un atributo. */
const atributo = (t) =>
  String(t ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

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

    /* El título y la descripción los manda esta lista, no lo que hubiera en
       el fichero: así hay un solo sitio donde revisarlos todos juntos y
       comprobar que ninguno se repite ni se pasa de largo. */
    let limpio = html
      .replace(/<title>[^<]*<\/title>/, `<title>${atributo(pagina.titulo)}</title>`)
      .replace(
        /<meta name="description" content="[^"]*"\s*\/?>/,
        `<meta name="description" content="${atributo(pagina.descripcion)}" />`
      )
      .replace(/\n?\s*<!-- seo -->[\s\S]*?<!-- \/seo -->/g, '')
      .replace(/\n?\s*<link rel="canonical"[^>]*>/g, '')
      /* Las og: y twitter: que quedaran escritas a mano en el fichero se
         quitan también: si no, convivirían con las que pone este paso y
         cada red social elegiría una de las dos sin criterio. */
      .replace(/\n?\s*<meta property="og:[^"]*"[^>]*>/g, '')
      .replace(/\n?\s*<meta name="twitter:[^"]*"[^>]*>/g, '')
      /* Y la de verificación, para poder cambiar el código sin que queden
         dos etiquetas peleándose. */
      .replace(/\n?\s*<meta name="google-site-verification"[^>]*>/g, '');

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
