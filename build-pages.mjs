/* Genera las páginas interiores a partir de una plantilla común.
   Se ejecuta a mano cuando cambia la cabecera o el pie:  node build-pages.mjs
   No forma parte del sitio publicado. */
import { writeFileSync } from 'node:fs';

const NAV = [
  ['index.html', 'Inicio'],
  ['servicios.html', 'Servicios'],
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
<link rel="stylesheet" href="css/pages.css" />${title.__admin ? '<script src="js/admin.js" defer></script>' : ''}
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
          <a href="mailto:qpstudiocontacto@gmail.com" aria-label="Correo electrónico">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 5.5A1.5 1.5 0 0 1 3.5 4h17A1.5 1.5 0 0 1 22 5.5v13a1.5 1.5 0 0 1-1.5 1.5h-17A1.5 1.5 0 0 1 2 18.5zM4.4 6 12 11.7 19.6 6zM20 7.9l-7.4 5.6a1 1 0 0 1-1.2 0L4 7.9V18h16z"/></svg>
          </a>
        </div>
      </div>
      <nav class="foot__col" aria-label="Navegación">
        <h3>Navegación</h3>
        <a href="index.html">Inicio</a>
        <a href="servicios.html">Servicios</a>
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
        <a href="mailto:qpstudiocontacto@gmail.com">qpstudiocontacto@gmail.com</a>
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

<dialog class="gate" id="gate" aria-labelledby="gate-t">
  <form class="gate__box" id="gate-form" method="dialog" novalidate>
    <img class="gate__logo" src="img/logo.png" alt="QP Studio" width="56" height="56" />
    <h2 class="gate__t" id="gate-t">Panel de administración</h2>
    <div class="field">
      <label for="g-user">Usuario</label>
      <input id="g-user" type="text" autocomplete="username" required />
    </div>
    <div class="field">
      <label for="g-pass">Contraseña</label>
      <input id="g-pass" type="password" autocomplete="current-password" required />
    </div>
    <button class="btn btn--blue btn--full magnet" type="submit"><span>Entrar</span></button>
    <p class="gate__error" id="gate-error" role="status" aria-live="polite"></p>
    <button class="gate__close" type="button" id="gate-close" aria-label="Cerrar">Cancelar</button>
  </form>
</dialog>

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

/* ── Piezas visuales reutilizables ─────────────────────────────────── */

const aura = `<div class="aura" aria-hidden="true"><span></span><span></span><span></span><span></span></div>`;

const foto = (id, alt) =>
  `<img src="https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=65" alt="${alt}" width="900" height="600" loading="lazy" decoding="async" />`;

/* ── Servicios ─────────────────────────────────────────────────────── */

const servicio = (id, titulo, lead, extra, incluye, plazo, img) => `
  <article class="svc" id="${id}">
    <div class="svc__txt">
      <h2>${titulo}</h2>
      <p class="svc__lead">${lead}</p>
      <p class="svc__extra">${extra}</p>
      <h3 class="svc__h3">Qué incluye</h3>
      <ul class="chips">${incluye.map((i) => `<li>${i}</li>`).join('')}</ul>
      <p class="svc__plazo"><b>Plazo</b> ${plazo}</p>
    </div>
    <figure class="svc__shot">${foto(img, '')}</figure>
  </article>
`;

page(
  'servicios.html',
  'Servicios',
  'Diseño web, rediseño, comercio electrónico y automatización para negocios de cualquier sector.',
  phead('Servicios', 'Servicios', 'Cuatro líneas de trabajo. Ajustamos el alcance al punto en el que esté cada negocio.') +
    `
<section class="pbody">
  <div class="shell">
${servicio(
  'diseno',
  'Diseño web',
  'Para negocios que parten de cero o que nunca han tenido una web a la altura de su trabajo. Definimos identidad, estructura y contenidos partiendo de tu negocio y del cliente al que quieres llegar, no de una plantilla del sector.',
  'Empezamos por una conversación sobre el negocio, no sobre la web, y terminamos con un sitio publicado, medido y tuyo. Los textos los escribimos nosotros a partir de esa conversación.',
  ['Diseño a medida', 'Textos incluidos', 'Dominio y alojamiento', 'Velocidad y SEO', 'Panel de administración', 'Formación grabada'],
  'De 3 a 5 semanas.',
  'photo-1486406146926-c627a92ad1ab'
)}
${servicio(
  'rediseno',
  'Rediseño web',
  'Para webs que ya existen pero se han quedado por detrás del negocio. Auditamos lo que tienes, conservamos el posicionamiento ganado y los contenidos que funcionan, y rehacemos solo lo que está limitando los resultados.',
  'Antes de tocar nada te decimos con sinceridad si compensa rehacerla entera o si basta con ajustes concretos. Preferimos un encargo pequeño a uno innecesario.',
  ['Auditoría previa', 'Migración sin pérdidas', 'Redirecciones', 'Contenido conservado', 'Métricas antes y después', 'Panel de administración'],
  'De 2 a 4 semanas.',
  'photo-1552664730-d307ca884978'
)}
${servicio(
  'ecommerce',
  'Comercio electrónico',
  'Para negocios que ya venden online o quieren empezar. Trabajamos el catálogo, la ficha de producto y el proceso de compra con un objetivo concreto: que el carrito llegue al final.',
  'Se conecta con el inventario y la facturación que ya uses. Si todavía no usas ninguno, te proponemos el que encaje con tu volumen real, no con el que te gustaría tener.',
  ['Catálogo y buscador', 'Ficha de producto', 'Pasarela de pago', 'Envíos e impuestos', 'Gestión de pedidos', 'Panel de administración'],
  'De 4 a 8 semanas.',
  'photo-1441986300917-64674bd600d8'
)}
${servicio(
  'automatizacion',
  'Automatización e integraciones',
  'Para negocios que ya tienen web y pierden horas en tareas repetitivas. Conectamos formularios, avisos y herramientas internas para que el sitio opere sin intervención manual.',
  'Cada automatización se documenta: qué hace, cuándo se dispara y a dónde llega. Si algún día quieres cambiarla, sabrás exactamente dónde tocar.',
  ['Formularios y CRM', 'Avisos automáticos', 'Calendarios', 'Recordatorios', 'Asistentes con IA', 'Documentación'],
  'Se presupuesta por integración.',
  'photo-1460925895917-afdab827c52f'
)}
    <div class="notice">
      <b>Presupuestos.</b> Todavía estamos cerrando las tarifas públicas. Cada propuesta se prepara a
      medida tras una primera conversación y se entrega por escrito con alcance y fecha cerrados.
    </div>
  </div>
</section>
` +
    pcta('¿Cuál encaja con tu negocio?', 'Cuéntanos en qué punto estás y te decimos qué necesitas, si es que necesitas algo.')
);

/* ── Gestión ───────────────────────────────────────────────────────── */

page(
  'gestion.html',
  'Gestión',
  'Panel de administración, botones con backend real y acompañamiento con soporte 24/7.',
  phead('Gestión', 'La web es tuya.<br />También su día a día.', 'Entregamos cada proyecto preparado para que puedas mantenerlo sin depender de nosotros.') +
    `
<section class="pbody gpanel">
  ${aura}
  <div class="shell gpanel__in">
    <div class="gsplit">
      <div>
        <h2>Lo que cambias tú</h2>
        <ul class="chips chips--lg">
          <li>Textos y titulares</li><li>Precios y tarifas</li><li>Horarios</li>
          <li>Fotografías</li><li>Servicios y productos</li><li>Secciones de temporada</li>
        </ul>
        <p>Desde un panel propio, sin tocar código. La formación se entrega grabada con tu propia web de ejemplo.</p>
      </div>

      <div class="editor" aria-hidden="true">
        <div class="editor__win">
          <span class="win__bar win__bar--wide"><i></i><i></i><i></i><em>tunegocio.com</em></span>
          <div class="editor__body">
            <div class="editor__block is-editing">
              <span class="editor__tag">Editando</span>
              <p>Cambio de aceite <b>59 €</b><span class="caret"></span></p>
            </div>
            <div class="editor__block"><span class="w w-80"></span><span class="w w-55"></span></div>
            <div class="editor__row">
              <span class="editor__btn">Pedir cita</span>
              <span class="editor__btn editor__btn--ghost">WhatsApp</span>
            </div>
          </div>
        </div>
        <span class="editor__cursor"></span>
      </div>
    </div>
  </div>
</section>

<section class="pbody">
  <div class="shell">
    <h2>Botones que funcionan de verdad</h2>
    <div class="gcards">
      <article class="gcard"><b>Formularios</b><span>Llegan a tu correo y quedan registrados en el panel.</span></article>
      <article class="gcard"><b>Reservas y citas</b><span>Sincronizadas con tu calendario, con recordatorio automático.</span></article>
      <article class="gcard"><b>Pagos</b><span>Pasarela y gestión de pedidos desde el primer día.</span></article>
      <article class="gcard"><b>Enlaces externos</b><span>WhatsApp, mapas, redes y plataformas de terceros.</span></article>
    </div>

    <h2 class="gsep">Acompañamiento</h2>
    <div class="gcards">
      <article class="gcard gcard--blue"><b>Soporte 24/7</b><span>Dudas e incidencias resueltas cualquier día y a cualquier hora.</span></article>
      <article class="gcard"><b>Mantenimiento</b><span>Copias de seguridad, actualizaciones y vigilancia del rendimiento.</span></article>
      <article class="gcard"><b>Cambios puntuales</b><span>Lo que no quieras hacer tú, con respuesta el mismo día.</span></article>
      <article class="gcard"><b>Un solo interlocutor</b><span>Siempre la misma persona, que ya conoce tu proyecto.</span></article>
    </div>
  </div>
</section>
` +
    pcta('¿Quieres verlo por dentro?', 'Te enseñamos el panel en una llamada de quince minutos.')
);

/* ── Contacto ──────────────────────────────────────────────────────── */

page(
  'contacto.html',
  'Contacto',
  'Solicita una propuesta para tu proyecto web. Respondemos en menos de 24 horas.',
  `
<section class="pbody gpanel">
  ${aura}
  <div class="shell contact gpanel__in">
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

    <div class="contact__aside">
      <h2>Qué ocurre después</h2>
      <ol class="pasos">
        <li><b>Respondemos</b><span>En menos de 24 horas, siempre.</span></li>
        <li><b>Llamada de 45 minutos</b><span>Sin compromiso, para entender el negocio.</span></li>
        <li><b>Propuesta por escrito</b><span>Alcance, fecha y presupuesto cerrados.</span></li>
        <li><b>Si no encajamos, te lo decimos</b><span>Preferimos no coger un proyecto que hacerlo a medias.</span></li>
      </ol>
    </div>
  </div>
</section>
`
);

/* ── Admin ─────────────────────────────────────────────────────────── */

const adminPage = () => {
  const t = new String('Administración');
  t.__self = 'admin.html';
  t.__admin = true;
  writeFileSync(
    'admin.html',
    head(t, 'Panel de administración de QP Studio.') +
      `
<section class="pbody apage">
  <div class="shell">

    <div id="login">
      <div class="apage__top">
        <img src="img/logo.png" alt="QP Studio" width="52" height="52" />
        <h1>Panel de administración</h1>
      </div>
      <form class="form login" id="login-form" novalidate>
        <div class="field">
          <label for="l-user">Usuario</label>
          <input id="l-user" type="text" autocomplete="username" required />
        </div>
        <div class="field">
          <label for="l-pass">Contraseña</label>
          <input id="l-pass" type="password" autocomplete="current-password" required />
        </div>
        <button class="btn btn--blue btn--full magnet" type="submit"><span>Entrar</span></button>
        <p class="login__error" id="login-error" role="status" aria-live="polite"></p>
        <p class="login__hint">Acceso provisional mientras no haya servidor. Se comprueba en el navegador, así que no protege de verdad: en cuanto exista backend hay que moverlo allí.</p>
      </form>
    </div>

    <div id="panel" hidden>
      <div class="apage__top">
        <img src="img/logo.png" alt="QP Studio" width="52" height="52" />
        <h1>Panel de administración</h1>
      </div>
      <div class="abar">
        <p class="abar__who">Sesión iniciada como <b>quique</b></p>
        <button type="button" class="linkish" id="salir">Cerrar sesión</button>
      </div>

      <div class="tabs" role="tablist">
        <button class="tabs__btn" role="tab" aria-selected="true" data-tab="tab-textos">Editar textos</button>
        <button class="tabs__btn" role="tab" aria-selected="false" data-tab="tab-bloques">Añadir secciones</button>
        <button class="tabs__btn" role="tab" aria-selected="false" data-tab="tab-mensajes">Mensajes recibidos</button>
      </div>

      <div class="tabs__panel" id="tab-textos" role="tabpanel">
        <div id="textos"></div>
      </div>

      <div class="tabs__panel" id="tab-bloques" role="tabpanel" hidden>
        <div class="bloques" id="bloques"></div>
        <div class="cola">
          <h3>Bloques pendientes de publicar</h3>
          <ul id="cola"></ul>
        </div>
      </div>

      <div class="tabs__panel" id="tab-mensajes" role="tabpanel" hidden>
        <div class="inbox">
          <p class="inbox__head"><span>Bandeja de entrada</span><span>0 mensajes</span></p>
          <div class="inbox__empty">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18v12H3zM3 7l9 6 9-6"/></svg>
            <h3>No han llegado mensajes</h3>
            <p>Aquí aparecerán las solicitudes enviadas desde el formulario de contacto, con fecha, datos y estado.</p>
          </div>
        </div>
      </div>

      <div class="notice">
        <b>Sin servidor todavía.</b> Los cambios de texto y los bloques añadidos se guardan solo en este
        navegador, para que puedas probar el flujo. Para que sean reales hace falta base de datos,
        autenticación en el servidor y un endpoint que reciba el formulario.
      </div>
    </div>

  </div>
</section>
` + foot
  );
  console.log('escrito admin.html');
};
adminPage();

/* ── Legales ───────────────────────────────────────────────────────── */

const legal = (file, titulo, desc, cuerpo) =>
  page(file, titulo, desc, phead(titulo, titulo, desc) + `
<section class="pbody">
  <div class="shell prose">
${cuerpo}
    <div class="notice">
      <b>Documento pendiente de revisión.</b> Es una base de trabajo. Antes de publicar debe
      completarse con los datos fiscales reales y revisarse con un profesional: afecta al
      cumplimiento del RGPD y de la LSSI-CE.
    </div>
  </div>
</section>
`);

legal('aviso-legal.html', 'Aviso legal', 'Información general y condiciones de uso del sitio web de QP Studio.',
`    <h2>Titular</h2>
    <p>QP Studio, marca de Quique Planelles. NIF y domicilio pendientes de completar. Correo: qpstudiocontacto@gmail.com</p>
    <h2>Objeto</h2>
    <p>La navegación por el sitio atribuye la condición de usuario e implica la aceptación de estas condiciones.</p>
    <h2>Propiedad intelectual</h2>
    <p>Los contenidos del sitio pertenecen a QP Studio o a terceros que han autorizado su uso. Queda prohibida su reproducción sin autorización expresa.</p>
    <h2>Responsabilidad</h2>
    <p>QP Studio no responde del uso que los usuarios hagan de los contenidos ni de las interrupciones del servicio ajenas a su control.</p>
    <h2>Legislación aplicable</h2>
    <p>Estas condiciones se rigen por la legislación española.</p>
`);

legal('privacidad.html', 'Política de privacidad', 'Cómo trata QP Studio los datos personales recibidos a través del sitio web.',
`    <h2>Responsable</h2>
    <p>QP Studio, marca de Quique Planelles. Correo: qpstudiocontacto@gmail.com</p>
    <h2>Qué datos recogemos</h2>
    <ul><li>Nombre, correo y mensaje del formulario de contacto.</li><li>Datos técnicos necesarios para que el sitio funcione.</li></ul>
    <h2>Para qué</h2>
    <ul><li>Responder a tu solicitud y preparar una propuesta.</li><li>Mantener el contacto durante el proyecto.</li></ul>
    <p>No enviamos comunicaciones comerciales no solicitadas ni cedemos datos a terceros salvo obligación legal.</p>
    <h2>Tus derechos</h2>
    <p>Puedes solicitar acceso, rectificación, supresión, limitación, portabilidad y oposición escribiendo a qpstudiocontacto@gmail.com, y reclamar ante la Agencia Española de Protección de Datos.</p>
`);

legal('cookies.html', 'Política de cookies', 'Qué cookies utiliza el sitio web de QP Studio.',
`    <h2>Qué usamos</h2>
    <p>Este sitio funciona sin cookies de seguimiento ni de publicidad. No hay analítica de terceros ni perfilado.</p>
    <ul>
      <li><b>Técnicas.</b> Las imprescindibles para que el sitio se muestre. No requieren consentimiento.</li>
      <li><b>Terceros.</b> Las tipografías se cargan desde Google Fonts y algunas imágenes desde Unsplash; esos servicios pueden registrar la dirección IP.</li>
    </ul>
    <h2>Cómo gestionarlas</h2>
    <p>Puedes bloquearlas desde tu navegador. Si en el futuro añadimos analítica o marketing, se pedirá consentimiento previo.</p>
`);

console.log('Listo.');
