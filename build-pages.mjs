/* Genera las páginas interiores a partir de una plantilla común.
   Se ejecuta a mano cuando cambia la cabecera o el pie:  node build-pages.mjs
   No forma parte del sitio publicado. */
import { writeFileSync } from 'node:fs';

const NAV = [
  ['index.html', 'Inicio'],
  ['servicios.html', 'Servicios'],
  ['proceso.html', 'Antes y después'],
  ['gestion.html', 'Gestión'],
  ['contacto.html', 'Contacto']
];

const head = (title, desc) => `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${title} — QP Studio</title>
<meta name="description" content="${desc}" />
<meta name="theme-color" content="#f7f8fa" />
<link rel="icon" href="img/logo.png" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&family=Geist:wght@400;500;600&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="css/styles.css" />
<link rel="stylesheet" href="css/sections.css" />
<link rel="stylesheet" href="css/pages.css" />
<script>document.documentElement.classList.add('js');</script>
</head>

<body>
<a class="skip" href="#main">Saltar al contenido</a>

<header class="nav is-stuck" id="nav">
  <div class="nav__rail" aria-hidden="true"><span class="nav__rail-fill"></span></div>
  <div class="shell nav__inner">
    <a class="brand brand--mark-only" href="index.html" aria-label="QP Studio, inicio">
      <img class="brand__mark" src="img/logo.png" alt="QP Studio" width="40" height="40" />
    </a>
    <nav class="nav__links" id="menu" aria-label="Secciones">
${NAV.map(([h, l]) => `      <a href="${h}"${h === title.__self ? ' class="is-active"' : ''}><span>${l}</span></a>`).join('\n')}
    </nav>
    <div class="nav__end">
      <a class="btn btn--blue btn--sm magnet" href="contacto.html"><span>Solicitar propuesta</span></a>
      <button class="burger" id="burger" type="button" aria-expanded="false" aria-controls="menu" aria-label="Abrir menú">
        <span></span><span></span>
      </button>
    </div>
  </div>
</header>

<main id="main">`;

const foot = `</main>

<footer class="foot">
  <div class="shell">
    <div class="foot__grid">
      <div class="foot__brand">
        <a class="brand brand--mark-only" href="index.html" aria-label="QP Studio, inicio">
          <img class="brand__mark" src="img/logo.png" alt="QP Studio" width="48" height="48" />
        </a>
        <p>QP Studio. Diseño, desarrollo y mantenimiento web para negocios de cualquier sector.</p>
        <div class="foot__social">
          <a href="https://www.linkedin.com/" target="_blank" rel="noopener" aria-label="LinkedIn">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.98 3.5A2.5 2.5 0 1 1 0 3.5a2.5 2.5 0 0 1 4.98 0zM.5 8h4V24h-4zM8 8h3.8v2.2h.06c.53-1 1.83-2.2 3.77-2.2C19.6 8 21 10.3 21 14.1V24h-4v-8.9c0-2.1-.04-4.8-3-4.8s-3.4 2.3-3.4 4.65V24H8z"/></svg>
          </a>
          <a href="mailto:hola@qpstudio.es" aria-label="Correo electrónico">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 5.5A1.5 1.5 0 0 1 3.5 4h17A1.5 1.5 0 0 1 22 5.5v13a1.5 1.5 0 0 1-1.5 1.5h-17A1.5 1.5 0 0 1 2 18.5zM4.4 6 12 11.7 19.6 6zM20 7.9l-7.4 5.6a1 1 0 0 1-1.2 0L4 7.9V18h16z"/></svg>
          </a>
        </div>
      </div>
      <nav class="foot__col" aria-label="Navegación">
        <h3>Navegación</h3>
        <a href="index.html">Inicio</a>
        <a href="servicios.html">Servicios</a>
        <a href="proceso.html">Antes y después</a>
        <a href="gestion.html">Gestión</a>
        <a href="contacto.html">Contacto</a>
      </nav>
      <nav class="foot__col" aria-label="Servicios">
        <h3>Servicios</h3>
        <a href="servicios.html#diseno">Diseño web</a>
        <a href="servicios.html#rediseno">Rediseño web</a>
        <a href="servicios.html#ecommerce">Comercio electrónico</a>
        <a href="servicios.html#automatizacion">Automatización</a>
      </nav>
      <nav class="foot__col" aria-label="Legal">
        <h3>Legal</h3>
        <a href="aviso-legal.html">Aviso legal</a>
        <a href="privacidad.html">Política de privacidad</a>
        <a href="cookies.html">Política de cookies</a>
        <a href="mailto:hola@qpstudio.es">hola@qpstudio.es</a>
      </nav>
    </div>
    <div class="foot__end">
      <p>© <span id="year">2026</span> QP Studio. Todos los derechos reservados.</p>
      <nav class="foot__mini" aria-label="Legal y administración">
        <a href="aviso-legal.html">Aviso legal</a>
        <a href="privacidad.html">Privacidad</a>
        <a href="cookies.html">Cookies</a>
        <a href="admin.html">Admin</a>
      </nav>
    </div>
  </div>
</footer>

<script src="js/motion.js" defer></script>
<script src="js/ui.js" defer></script>
</body>
</html>
`;

const page = (file, title, desc, body) => {
  const t = new String(title);
  t.__self = file;
  writeFileSync(file, head(t, desc) + body + foot);
  console.log('escrito', file);
};

const phead = (crumb, h1, p) => `
<section class="phead">
  <div class="shell phead__in">
    <p class="crumb"><a href="index.html">Inicio</a> · ${crumb}</p>
    <h1>${h1}</h1>
    <p>${p}</p>
  </div>
</section>
`;

const pcta = (h, p) => `
<section class="pcta">
  <div class="shell">
    <h2>${h}</h2>
    <p>${p}</p>
    <a class="btn btn--blue magnet" href="contacto.html"><span>Solicitar propuesta</span></a>
  </div>
</section>
`;

/* ── Servicios ─────────────────────────────────────────────────────── */

const servicio = (id, n, titulo, lead, incluye, precio) => `
  <article class="svc" id="${id}">
    <div>
      <div class="svc__label"><span class="svc__n">${n}</span><h2>${titulo}</h2></div>
      <p class="svc__lead">${lead}</p>
      <div class="svc__price">
        <b>Presupuesto</b>
        <span>${precio}</span>
      </div>
    </div>
    <div class="prose">
      <h3>Qué incluye</h3>
      <ul>${incluye.map((i) => `<li>${i}</li>`).join('')}</ul>
    </div>
  </article>
`;

page(
  'servicios.html',
  'Servicios',
  'Diseño web, rediseño, comercio electrónico y automatización. Alcance y presupuesto de cada servicio.',
  phead(
    'Servicios',
    'Servicios',
    'Cuatro líneas de trabajo. Adaptamos el alcance al punto en el que esté cada negocio: hay proyectos que piden una presencia sencilla, clara y rápida, y otros que necesitan catálogo, reservas o integraciones con herramientas propias.'
  ) +
    `
<section class="pbody">
  <div class="shell">
${servicio(
  'diseno',
  '01',
  'Diseño web',
  'Para negocios que parten de cero o que nunca han tenido una presencia a la altura de su trabajo. Definimos identidad, estructura y contenidos partiendo de tu negocio y del cliente al que quieres llegar, no de una plantilla del sector.',
  [
    'Sesión inicial de definición y análisis de competencia',
    'Arquitectura de contenidos y redacción de textos',
    'Diseño a medida, sin plantillas',
    'Desarrollo, dominio, alojamiento y certificado',
    'Optimización de velocidad y visibilidad en buscadores',
    'Panel de administración y formación grabada'
  ],
  'Pendiente de definir. Se cierra tras la primera conversación y no varía salvo que cambie el alcance.'
)}
${servicio(
  'rediseno',
  '02',
  'Rediseño web',
  'Para webs que ya existen pero que se han quedado por detrás del negocio. Auditamos lo que tienes, conservamos el posicionamiento ganado y los contenidos que funcionan, y rehacemos solo lo que está limitando los resultados.',
  [
    'Auditoría de la web actual y de su rendimiento',
    'Plan de migración sin pérdida de posiciones',
    'Rediseño de la estructura y de los contenidos clave',
    'Redirecciones y control de enlaces rotos',
    'Comparativa de métricas antes y después',
    'Panel de administración y formación grabada'
  ],
  'Pendiente de definir. Depende del volumen de contenido y de la complejidad de la migración.'
)}
${servicio(
  'ecommerce',
  '03',
  'Comercio electrónico',
  'Para negocios que venden online o quieren empezar a hacerlo. Trabajamos el catálogo, la ficha de producto y el proceso de compra con un objetivo claro: reducir el abandono del carrito y sostener el ticket medio.',
  [
    'Catálogo, categorías y buscador',
    'Ficha de producto orientada a conversión',
    'Pasarela de pago y gestión de pedidos',
    'Envíos, impuestos y facturación',
    'Integración con tu inventario si ya lo tienes',
    'Panel de administración y formación grabada'
  ],
  'Pendiente de definir. Varía según el número de referencias y las integraciones necesarias.'
)}
${servicio(
  'automatizacion',
  '04',
  'Automatización e integraciones',
  'Para negocios que ya tienen web y pierden horas en tareas repetitivas. Conectamos formularios, avisos y herramientas internas para que la web opere sin intervención manual.',
  [
    'Formularios conectados a tu correo o a tu CRM',
    'Avisos automáticos por email o WhatsApp',
    'Sincronización con hojas de cálculo y calendarios',
    'Recordatorios de cita y seguimiento posventa',
    'Asistentes con inteligencia artificial cuando aportan valor',
    'Documentación de todo lo que queda automatizado'
  ],
  'Pendiente de definir. Se presupuesta por integración.'
)}
    <div class="notice">
      <b>Sobre los precios.</b> Todavía estamos cerrando las tarifas públicas. Mientras tanto, cada
      presupuesto se prepara a medida después de una primera conversación sin compromiso, y se
      entrega por escrito con alcance y fecha cerrados.
    </div>
  </div>
</section>
` +
    pcta('¿Cuál encaja con tu negocio?', 'Cuéntanos en qué punto estás y te decimos con sinceridad qué servicio necesitas, si es que necesitas alguno.')
);

/* ── Proceso ───────────────────────────────────────────────────────── */

const paso = (meta, h, p, img) => `
  <div class="step">
    <span class="step__meta">${meta}</span>
    <h3>${h}</h3>
    <p>${p}</p>
    ${img ? `<figure><img src="${img}" alt="" width="1200" height="700" loading="lazy" decoding="async" /></figure>` : ''}
  </div>
`;

page(
  'proceso.html',
  'Antes y después',
  'El proceso completo de un rediseño real: un taller mecánico, de una web de 2013 a una presencia actual.',
  phead(
    'Antes y después',
    'De 2013 a hoy,<br />paso a paso.',
    'Talleres Ribera llevaba treinta años trabajando bien y once con la misma web. Este es el recorrido completo del rediseño, desde la primera conversación hasta la web publicada.'
  ) +
    `
<section class="pbody">
  <div class="shell">
    <h2>El punto de partida</h2>
    <p>Una web de 2013: titular genérico, dos párrafos que no explicaban qué hacían, un botón que solo decía «click aquí» y ninguna forma clara de pedir cita. El negocio era excelente. La web no lo contaba.</p>

    <div class="steps">
${paso('Semana 1 · Conversación', 'Entender el negocio, no la web', 'Cuarenta y cinco minutos con el propietario. Qué servicios dejan más margen, qué preguntan los clientes por teléfono una y otra vez, en qué se diferencian del taller de al lado. De ahí salieron la estructura y los textos.', null)}
${paso('Semana 1 · Dirección', 'Propuesta y dirección visual', 'Antes de escribir una línea de código: estructura de páginas, tono y una dirección visual concreta. Se aprobó con dos cambios menores.', 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=70')}
${paso('Semana 2 · Contenidos', 'Fotografía y textos reales', 'Sesión de fotos en el propio taller. Nada de banco de imágenes: el equipo, las instalaciones y los vehículos reales. Los textos se escribieron a partir de la conversación inicial.', 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1200&q=70')}
${paso('Semanas 3 y 4 · Construcción', 'Diseño y desarrollo', 'La web se construyó en un enlace real que el cliente podía abrir en cualquier momento. Revisiones sobre algo que ya se podía tocar, en lugar de informes.', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=70')}
${paso('Semana 5 · Cita online', 'Integración de reservas', 'Formulario de cita conectado al calendario del taller, con aviso automático por correo y recordatorio al cliente el día anterior.', null)}
${paso('Semana 5 · Publicación', 'Lanzamiento y traspaso', 'Migración sin perder posiciones, redirecciones de las páginas antiguas y una sesión grabada para que el propietario pueda cambiar precios y horarios él mismo.', null)}
${paso('Después', 'Seguimiento', 'Revisión mensual de lo que hace la gente en la web y ajustes sobre lo que no funciona. La relación no terminó el día de la publicación.', null)}
    </div>

    <h2>El resultado</h2>
    <p>La misma empresa, los mismos servicios y los mismos precios. Lo único que cambió fue lo que la web transmite en los primeros segundos y lo fácil que resulta pedir una cita.</p>
    <p><a class="btn btn--ghost magnet" href="index.html#demo"><span>Ver la comparación lado a lado</span></a></p>
  </div>
</section>
` +
    pcta('¿Tu web se quedó atrás?', 'Auditamos la que tienes y te decimos con sinceridad si compensa rehacerla.')
);

/* ── Gestión ───────────────────────────────────────────────────────── */

page(
  'gestion.html',
  'Gestión',
  'Panel de administración, botones funcionales con backend real y acompañamiento con soporte 24/7.',
  phead(
    'Gestión',
    'La web es tuya.<br />También su día a día.',
    'Entregamos cada proyecto preparado para que puedas mantenerlo sin depender de nosotros, y seguimos disponibles para lo que sí requiere manos técnicas.'
  ) +
    `
<section class="pbody">
  <div class="shell prose">
    <h2>Lo que puedes hacer tú</h2>
    <ul>
      <li>Actualizar textos, titulares y descripciones de cualquier página.</li>
      <li>Cambiar precios, tarifas y horarios sin esperar a nadie.</li>
      <li>Subir, sustituir y reordenar imágenes.</li>
      <li>Publicar novedades, servicios o productos nuevos.</li>
      <li>Consultar los mensajes que llegan desde el formulario de contacto.</li>
      <li>Activar o desactivar secciones según la temporada.</li>
    </ul>
    <p>Todo desde un panel propio, sin tocar código y sin riesgo de romper nada. La formación se entrega grabada, con tu web de ejemplo, para que puedas volver a consultarla cuando la necesites.</p>

    <h2>Botones funcionales con backend real</h2>
    <p>Los elementos interactivos no son decorativos. Cada botón está conectado a un servicio que funciona de verdad y que puedes comprobar el primer día.</p>
    <ul>
      <li>Formularios que llegan a tu correo y quedan registrados en el panel.</li>
      <li>Reservas y citas sincronizadas con tu calendario.</li>
      <li>Pagos con pasarela y gestión de pedidos.</li>
      <li>Enlaces a WhatsApp, mapas, redes y plataformas externas.</li>
      <li>Avisos automáticos y recordatorios para ti y para tus clientes.</li>
    </ul>

    <h2>Acompañamiento</h2>
    <p>Publicar la web es el principio. A partir de ahí el acompañamiento incluye:</p>
    <ul>
      <li><b>Soporte 24/7.</b> Resolvemos dudas e incidencias en cualquier momento, cualquier día del año.</li>
      <li><b>Mantenimiento técnico.</b> Copias de seguridad, actualizaciones y vigilancia del rendimiento.</li>
      <li><b>Cambios puntuales.</b> Lo que no quieras hacer tú lo hacemos nosotros, con respuesta el mismo día.</li>
      <li><b>Revisión periódica.</b> Analizamos qué hace la gente en la web y proponemos ajustes concretos.</li>
      <li><b>Un único interlocutor.</b> Siempre la misma persona, que ya conoce tu proyecto.</li>
    </ul>

    <div class="notice">
      <b>Adaptado a cada negocio.</b> No todos los proyectos necesitan el mismo nivel de gestión. Hay
      negocios a los que les basta con un panel sencillo y una revisión al año, y otros que trabajan
      con el catálogo a diario. El acompañamiento se dimensiona en función de eso.
    </div>
  </div>
</section>
` +
    pcta('¿Quieres verlo por dentro?', 'Te enseñamos el panel de administración en una llamada de quince minutos.')
);

/* ── Contacto ──────────────────────────────────────────────────────── */

page(
  'contacto.html',
  'Contacto',
  'Solicita una propuesta para tu proyecto web. Respondemos en menos de 24 horas.',
  phead('Contacto', 'Hablemos de tu proyecto.', 'Cuéntanos en qué punto está tu negocio y qué necesitas. Respondemos en menos de 24 horas con una valoración honesta, tengamos o no encaje.') +
    `
<section class="pbody">
  <div class="shell contact">
    <form class="form" id="form" novalidate>
      <div class="form__row">
        <div class="field">
          <label for="f-name">Nombre</label>
          <input id="f-name" name="nombre" type="text" autocomplete="name" required placeholder="Nombre y apellidos" />
        </div>
        <div class="field">
          <label for="f-mail">Email</label>
          <input id="f-mail" name="email" type="email" autocomplete="email" required placeholder="nombre@empresa.com" />
        </div>
      </div>
      <div class="field">
        <label for="f-msg">Tu negocio y qué necesitas</label>
        <textarea id="f-msg" name="mensaje" rows="5" required placeholder="Taller mecánico en Alicante. Web de 2013, queremos rehacerla y añadir cita online."></textarea>
      </div>
      <button class="btn btn--blue btn--full magnet" type="submit"><span>Enviar solicitud</span></button>
      <p class="form__alt">También por <a href="https://wa.me/34600000000" target="_blank" rel="noopener">WhatsApp</a></p>
      <p class="form__status" id="form-status" role="status" aria-live="polite"></p>
    </form>

    <div class="contact__aside prose">
      <h2>Qué ocurre después</h2>
      <ul>
        <li>Leemos tu mensaje y respondemos en menos de 24 horas.</li>
        <li>Si hay encaje, agendamos una llamada de 45 minutos sin compromiso.</li>
        <li>Recibes una propuesta por escrito con alcance, fecha y presupuesto cerrados.</li>
        <li>Si no somos la opción adecuada para tu caso, te lo decimos.</li>
      </ul>
      <dl>
        <dt>Correo</dt><dd><a href="mailto:hola@qpstudio.es">hola@qpstudio.es</a></dd>
        <dt>WhatsApp</dt><dd><a href="https://wa.me/34600000000" target="_blank" rel="noopener">Escribir por WhatsApp</a></dd>
        <dt>Horario de respuesta</dt><dd>Lunes a viernes, de 9:00 a 19:00. Soporte de incidencias 24/7.</dd>
      </dl>
    </div>
  </div>
</section>
`
);

/* ── Admin ─────────────────────────────────────────────────────────── */

const acard = (icon, h, p, estado) => `
  <article class="acard">
    <span class="acard__ico"><svg viewBox="0 0 24 24" aria-hidden="true">${icon}</svg></span>
    <h3>${h}</h3>
    <p>${p}</p>
    <span class="acard__state">${estado}</span>
  </article>
`;

page(
  'admin.html',
  'Administración',
  'Panel de administración de QP Studio: edición de textos, gestión de contenidos y mensajes recibidos.',
  phead('Administración', 'Panel de administración', 'Desde aquí se gestionará el contenido del sitio y los mensajes recibidos. El panel está preparado en la estructura del proyecto y se conectará cuando se defina el backend.') +
    `
<section class="pbody">
  <div class="shell">
    <div class="admin">
${acard('<path d="M4 7h16M4 12h10M4 17h13"/>', 'Editar textos', 'Modificar titulares, párrafos y textos de botones de cualquier sección del sitio, con vista previa antes de publicar.', 'Pendiente de conexión')}
${acard('<path d="M12 5v14M5 12h14"/>', 'Añadir elementos', 'Crear nuevos servicios, casos, preguntas frecuentes o entradas, y ordenarlos sin tocar código.', 'Pendiente de conexión')}
${acard('<path d="M3 5.5h18v13H3zM3 6l9 7 9-7"/>', 'Mensajes recibidos', 'Consultar las solicitudes enviadas desde el formulario de contacto, con fecha, estado y respuesta.', 'Pendiente de conexión')}
    </div>

    <div class="notice">
      <b>Estado actual.</b> Esta fase del proyecto no incluye backend, así que el panel es todavía una
      maqueta: define la estructura y las tres áreas de trabajo, pero no guarda ni lee datos. Para
      activarlo hará falta una base de datos, autenticación y un endpoint que reciba el formulario.
      La ruta de crecimiento está documentada en el README del proyecto.
    </div>
  </div>
</section>
`
);

/* ── Legales ───────────────────────────────────────────────────────── */

const legal = (file, titulo, desc, cuerpo) =>
  page(file, titulo, desc, phead(titulo, titulo, desc) + `
<section class="pbody">
  <div class="shell prose">
${cuerpo}
    <div class="notice">
      <b>Documento pendiente de revisión.</b> Este texto es una base de trabajo. Antes de publicar el
      sitio debe completarse con los datos fiscales reales y revisarse con un profesional, ya que
      afecta al cumplimiento del RGPD y de la LSSI-CE.
    </div>
  </div>
</section>
`);

legal(
  'aviso-legal.html',
  'Aviso legal',
  'Información general y condiciones de uso del sitio web de QP Studio.',
  `    <h2>Titular del sitio</h2>
    <p>Denominación: QP Studio, marca de Quique Planelles.<br />NIF: pendiente de completar.<br />Domicilio: pendiente de completar.<br />Correo de contacto: hola@qpstudio.es</p>

    <h2>Objeto</h2>
    <p>Este aviso regula el acceso y el uso del sitio web de QP Studio. La navegación por el sitio atribuye la condición de usuario e implica la aceptación de estas condiciones.</p>

    <h2>Propiedad intelectual</h2>
    <p>Los contenidos del sitio, incluidos textos, diseño, código y elementos gráficos, pertenecen a QP Studio o a terceros que han autorizado su uso. Queda prohibida su reproducción o distribución sin autorización expresa.</p>

    <h2>Responsabilidad</h2>
    <p>QP Studio no se hace responsable del uso que los usuarios hagan de los contenidos del sitio ni de los daños derivados de fallos o desconexiones en las redes de telecomunicaciones que interrumpan el servicio.</p>

    <h2>Enlaces externos</h2>
    <p>El sitio puede contener enlaces a páginas de terceros. QP Studio no controla ni asume responsabilidad sobre sus contenidos.</p>

    <h2>Legislación aplicable</h2>
    <p>Estas condiciones se rigen por la legislación española. Para cualquier controversia serán competentes los juzgados y tribunales que correspondan conforme a derecho.</p>
`
);

legal(
  'privacidad.html',
  'Política de privacidad',
  'Cómo trata QP Studio los datos personales que recibe a través del sitio web.',
  `    <h2>Responsable del tratamiento</h2>
    <p>QP Studio, marca de Quique Planelles. Correo de contacto: hola@qpstudio.es</p>

    <h2>Qué datos recogemos</h2>
    <ul>
      <li>Los que facilitas en el formulario de contacto: nombre, correo electrónico y el mensaje que escribes.</li>
      <li>Datos técnicos de navegación estrictamente necesarios para que el sitio funcione.</li>
    </ul>

    <h2>Para qué los usamos</h2>
    <ul>
      <li>Responder a tu solicitud y, si procede, elaborar una propuesta.</li>
      <li>Mantener el contacto durante el desarrollo del proyecto.</li>
    </ul>
    <p>No utilizamos tus datos para enviarte comunicaciones comerciales que no hayas solicitado, ni los cedemos a terceros salvo obligación legal.</p>

    <h2>Base jurídica</h2>
    <p>El tratamiento se basa en tu consentimiento al enviar el formulario y, cuando exista relación contractual, en la ejecución de dicho contrato.</p>

    <h2>Conservación</h2>
    <p>Conservamos los datos mientras dure la relación y, después, durante los plazos legalmente exigibles.</p>

    <h2>Tus derechos</h2>
    <p>Puedes solicitar el acceso, la rectificación, la supresión, la limitación, la portabilidad y la oposición al tratamiento escribiendo a hola@qpstudio.es. También puedes reclamar ante la Agencia Española de Protección de Datos.</p>
`
);

legal(
  'cookies.html',
  'Política de cookies',
  'Qué cookies utiliza el sitio web de QP Studio y cómo gestionarlas.',
  `    <h2>Qué son las cookies</h2>
    <p>Son pequeños archivos que los sitios web guardan en tu dispositivo para recordar información sobre tu visita.</p>

    <h2>Qué cookies usamos</h2>
    <p>Este sitio funciona sin cookies de seguimiento ni de publicidad. No utilizamos analítica de terceros ni perfilado.</p>
    <ul>
      <li><b>Técnicas y necesarias.</b> Las imprescindibles para que el sitio se muestre correctamente. No requieren consentimiento.</li>
      <li><b>De terceros.</b> Las tipografías se cargan desde Google Fonts y algunas imágenes desde Unsplash. Esos servicios pueden registrar la dirección IP desde la que se solicita el archivo.</li>
    </ul>

    <h2>Cómo gestionarlas</h2>
    <p>Puedes bloquear o eliminar las cookies desde la configuración de tu navegador. Si en el futuro incorporamos cookies de analítica o de marketing, se solicitará tu consentimiento previo mediante un aviso en el propio sitio.</p>
`
);

console.log('Listo.');
