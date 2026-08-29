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
<link rel="preload" href="fuentes/archivo-800-latin.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="fuentes/geist-400-latin.woff2" as="font" type="font/woff2" crossorigin />
<link rel="stylesheet" href="css/fuentes.css" />
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
    <a class="brand brand--mark-only" href="/" aria-label="QP Studio, inicio">
      <img class="brand__mark" src="img/logo.png" alt="QP Studio" width="40" height="40" />
    </a>
    <nav class="nav__links" id="menu" aria-label="Secciones">
${NAV.map(([h, l]) => `      <a href="${h}"${h === title.__self ? ' class="is-active"' : ''}><span>${l}</span></a>`).join('\n')}
    </nav>
    <div class="nav__end">
      <a class="btn btn--blue btn--sm magnet" href="/contacto"><span>Solicitar propuesta</span></a>
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
        <a class="brand brand--mark-only" href="/" aria-label="QP Studio, inicio">
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
          <a href="https://wa.me/34684759883" target="_blank" rel="noopener" aria-label="WhatsApp">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.86 9.86 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 1.67c2.2 0 4.27.86 5.83 2.42a8.2 8.2 0 0 1 2.41 5.82c0 4.54-3.7 8.24-8.25 8.24a8.23 8.23 0 0 1-4.19-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm-3.2 4.3c-.15 0-.4.06-.61.29-.21.23-.8.78-.8 1.9s.82 2.2.93 2.36c.12.15 1.6 2.44 3.88 3.42.54.23.96.37 1.29.48.54.17 1.04.15 1.43.09.44-.07 1.34-.55 1.53-1.08.19-.53.19-.98.13-1.08-.06-.09-.21-.15-.44-.26-.23-.12-1.34-.66-1.55-.74-.21-.08-.36-.11-.51.11-.15.23-.58.74-.71.89-.13.15-.26.17-.49.06-.23-.12-.96-.36-1.83-1.13-.68-.6-1.13-1.35-1.27-1.58-.13-.23-.01-.35.1-.47.1-.1.23-.27.35-.4.11-.14.15-.23.23-.39.08-.15.04-.29-.02-.4-.06-.12-.51-1.23-.7-1.68-.18-.44-.37-.38-.51-.39h-.43z"/></svg>
          </a>
        </div>
      </div>
      <nav class="foot__col" aria-label="Navegación">
        <h3>Navegación</h3>
        <a href="/">Inicio</a>
        <a href="/servicios">Servicios</a>
        <a href="/gestion">Gestión</a>
        <a href="/mantenimiento">Mantenimiento</a>
        <a href="/contacto">Contacto</a>
      </nav>
      <nav class="foot__col" aria-label="Servicios">
        <h3>Servicios</h3>
        <a href="/servicios#diseno">Diseño web</a>
        <a href="/servicios#rediseno">Rediseño web</a>
        <a href="/servicios#ecommerce">Comercio electrónico</a>
        <a href="/servicios#automatizacion">Automatización</a>
      </nav>
      <nav class="foot__col" aria-label="Legal">
        <h3>Legal</h3>
        <a href="/aviso-legal">Aviso legal</a>
        <a href="/privacidad">Política de privacidad</a>
        <a href="/cookies">Política de cookies</a>
        <a href="mailto:qpstudiocontacto@gmail.com">qpstudiocontacto@gmail.com</a>
      </nav>
    </div>
    <div class="foot__end">
      <p>© <span id="year">2026</span> QP Studio. Todos los derechos reservados.</p>
      <nav class="foot__mini" aria-label="Legal y administración">
        <a href="/aviso-legal">Aviso legal</a>
        <a href="/privacidad">Privacidad</a>
        <a href="/cookies">Cookies</a>
        <a href="/admin">Admin</a>
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
    <p class="crumb"><a href="/">Inicio</a> · ${crumb}</p>
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
    <a class="btn btn--blue magnet" href="/contacto"><span>Solicitar propuesta</span></a>
  </div>
</section>
`;

/* ── Piezas visuales reutilizables ─────────────────────────────────── */

const aura = `<div class="aura" aria-hidden="true"><span></span><span></span><span></span><span></span></div>`;

const foto = (id, alt) =>
  `<img src="https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=65" alt="${alt}" width="900" height="600" loading="lazy" decoding="async" />`;

/* ── Servicios ─────────────────────────────────────────────────────── */

const servicio = (id, titulo, lead, extra, incluye, img) => `
  <article class="svc" id="${id}">
    <div class="svc__txt">
      <h2>${titulo}</h2>
      <p class="svc__lead">${lead}</p>
      <p class="svc__extra">${extra}</p>
      <h3 class="svc__h3">Qué incluye</h3>
      <ul class="chips">${incluye.map((i) => `<li>${i}</li>`).join('')}</ul>
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
  ['Diseño a medida', 'Textos incluidos', 'Dominio y alojamiento', 'Velocidad y SEO', 'Panel de administración', 'Acompañamiento personal'],
  'photo-1486406146926-c627a92ad1ab'
)}
${servicio(
  'rediseno',
  'Rediseño web',
  'Para webs que ya existen pero se han quedado por detrás del negocio. Auditamos lo que tienes, conservamos el posicionamiento ganado y los contenidos que funcionan, y rehacemos solo lo que está limitando los resultados.',
  'Antes de tocar nada te decimos con sinceridad si compensa rehacerla entera o si basta con ajustes concretos. Preferimos un encargo pequeño a uno innecesario.',
  ['Auditoría previa', 'Migración sin pérdidas', 'Redirecciones', 'Contenido conservado', 'Métricas antes y después', 'Panel de administración'],
  'photo-1552664730-d307ca884978'
)}
${servicio(
  'ecommerce',
  'Comercio electrónico',
  'Para negocios que ya venden online o quieren empezar. Trabajamos el catálogo, la ficha de producto y el proceso de compra con un objetivo concreto: que el carrito llegue al final.',
  'Se conecta con el inventario y la facturación que ya uses. Si todavía no usas ninguno, te proponemos el que encaje con tu volumen real, no con el que te gustaría tener.',
  ['Catálogo y buscador', 'Ficha de producto', 'Pasarela de pago', 'Envíos e impuestos', 'Gestión de pedidos', 'Panel de administración'],
  'photo-1441986300917-64674bd600d8'
)}
${servicio(
  'automatizacion',
  'Automatización e integraciones',
  'Para negocios que ya tienen web y pierden horas en tareas repetitivas. Conectamos formularios, avisos y herramientas internas para que el sitio opere sin intervención manual.',
  'Cada automatización se documenta: qué hace, cuándo se dispara y a dónde llega. Si algún día quieres cambiarla, sabrás exactamente dónde tocar.',
  ['Formularios y CRM', 'Avisos automáticos', 'Calendarios', 'Recordatorios', 'Asistentes con IA', 'Documentación'],
  'photo-1460925895917-afdab827c52f'
)}
    <div class="notice">
      <b>Presupuestos.</b> Todavía estamos cerrando las tarifas públicas. Cada propuesta se prepara a
      medida tras una primera conversación y se entrega por escrito con el alcance cerrado.
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
  phead('Gestión', 'La web es tuya.<br />También su día a día.', 'Cada proyecto se prepara para que puedas mantenerlo sin depender de nosotros.') +
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
        <p>Desde un panel propio, sin tocar código. Te acompañamos en persona sobre tu propia web hasta que lo manejes con soltura.</p>
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
      <article class="gcard"><b>Cambios puntuales</b><span>Lo que no quieras hacer tú, sin esperas ni tickets.</span></article>
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
  'Solicita una propuesta para tu proyecto web. Respondemos en menos de 48 horas.',
  phead(
    'Contacto',
    'Cuéntanos qué necesita tu negocio.',
    'Te enviamos una propuesta por escrito con el alcance cerrado, sin compromiso y sin coste. Respondemos en menos de 48 horas.'
  ) +
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
      <p class="form__alt">También por <a href="https://wa.me/34684759883" target="_blank" rel="noopener">WhatsApp</a></p>
      <p class="form__status" id="form-status" role="status" aria-live="polite"></p>
    </form>

    <div class="contact__aside">
      <h2>Qué ocurre después</h2>
      <ol class="pasos">
        <li><b>Respondemos</b><span>En menos de 48 horas, siempre.</span></li>
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
        <p class="login__hint">Acceso restringido. Las credenciales se comprueban en el servidor y la sesión dura ocho horas.</p>
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

      <div class="pubar" id="publicar-barra" hidden>
        <p><b>Hay cambios sin publicar.</b> Están guardados, pero la web todavía enseña la versión anterior.</p>
        <div class="pubar__acciones">
          <span class="ebox__estado" id="publicar-estado" role="status"></span>
          <button type="button" class="btn btn--blue btn--sm magnet" id="publicar"><span>Publicar en la web</span></button>
        </div>
      </div>

      <div class="tabs" role="tablist">
        <button class="tabs__btn" role="tab" aria-selected="true" data-tab="tab-textos">Editar textos</button>
        <button class="tabs__btn" role="tab" aria-selected="false" data-tab="tab-bloques">Añadir secciones</button>
        <button class="tabs__btn" role="tab" aria-selected="false" data-tab="tab-mensajes">Mensajes recibidos</button>
        <button class="tabs__btn" role="tab" aria-selected="false" data-tab="tab-analitica">Visitas</button>
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

      <div class="tabs__panel" id="tab-analitica" role="tabpanel" hidden>
        <div id="analitica"></div>
      </div>

      <div class="notice">
        <b>Los mensajes son reales; los textos todavía no.</b> La bandeja de entrada lee la base de
        datos y el acceso se comprueba en el servidor. Los cambios de texto y los bloques añadidos
        siguen guardándose solo en este navegador: falta llevarlos también a la base de datos y que
        la web los lea al publicarse.
      </div>
    </div>

  </div>
</section>
` + foot
  );
  console.log('escrito admin.html');
};
adminPage();

/* ── Mantenimiento y propiedad ─────────────────────────────────────── */

page(
  'mantenimiento.html',
  'Mantenimiento',
  'Qué incluye el mantenimiento, qué es tuyo desde el primer día y qué pasa el día que decidas seguir por tu cuenta.',
  phead('Mantenimiento', 'Tu web es tuya.<br />También el día que te vayas.', 'La mayoría de estudios te entrega una web y se queda con las llaves. Aquí no funciona así, y esta página explica exactamente cómo funciona.') +
    `
<section class="pbody">
  <div class="shell">
    <h2>Qué incluye el mantenimiento</h2>
    <div class="gcards">
      <article class="gcard"><b>Copias de seguridad</b><span>De la web y de la base de datos, para poder volver atrás si algo se rompe.</span></article>
      <article class="gcard"><b>Actualizaciones y seguridad</b><span>Certificado, dependencias y vigilancia de que todo sigue en pie.</span></article>
      <article class="gcard"><b>Cambios puntuales</b><span>Lo que no quieras hacer tú desde el panel, sin esperas ni tickets.</span></article>
      <article class="gcard gcard--blue"><b>Soporte 24/7</b><span>Dudas e incidencias resueltas cualquier día y a cualquier hora.</span></article>
      <article class="gcard"><b>Rendimiento</b><span>Velocidad de carga y comportamiento en móvil, revisados de forma periódica.</span></article>
      <article class="gcard"><b>Un solo interlocutor</b><span>Siempre la misma persona, que ya conoce tu proyecto.</span></article>
    </div>
  </div>
</section>

<section class="pbody sec--tuyo">
  ${aura}
  <div class="shell">
    <h2>Qué es tuyo desde el primer día</h2>
    <p class="lead-max">No hay nada que tengas que reclamar más adelante. Estas cuatro cosas son tuyas desde que empezamos, no desde que terminamos.</p>
    <div class="gcards">
      <article class="gcard"><b>El dominio</b><span>Registrado a tu nombre desde el principio. Nosotros solo tenemos el acceso técnico para configurarlo.</span></article>
      <article class="gcard"><b>Los contenidos</b><span>Textos, fotografías y todo lo que se publique. Descargables en cualquier momento.</span></article>
      <article class="gcard"><b>El código</b><span>Sin plantillas cerradas ni sistemas propietarios. Cualquier desarrollador puede continuarlo.</span></article>
      <article class="gcard"><b>La base de datos</b><span>PostgreSQL estándar. Se exporta entera con un comando y se restaura donde quieras.</span></article>
    </div>
  </div>
</section>

<section class="pbody">
  <div class="shell">
    <h2>Si algún día decides seguir por tu cuenta</h2>
    <p class="lead-max">Sin permanencia y sin penalización. Nos lo dices y te lo entregamos todo. El proceso completo es de una tarde, y <b>la web no deja de funcionar en ningún momento</b>.</p>

    <ol class="pasos">
      <li>
        <b>Nos avisas</b>
        <span>No hace falta motivo ni preaviso largo. Preferimos que te quedes porque quieres, no porque no puedas salir.</span>
      </li>
      <li>
        <b>Creas tus cuentas</b>
        <span>Una de alojamiento y otra de base de datos, a tu nombre. Te guiamos por teléfono: son unos quince minutos.</span>
      </li>
      <li>
        <b>Transferimos el proyecto</b>
        <span>La web y la base de datos pasan a tus cuentas con la transferencia oficial de cada plataforma. Sin cortes de servicio.</span>
      </li>
      <li>
        <b>Te entregamos el código</b>
        <span>El repositorio pasa a tu nombre, con la documentación de cómo está montado y cómo se publica.</span>
      </li>
      <li>
        <b>Salimos de tus cuentas</b>
        <span>Dejamos de tener acceso. El dominio ni se toca, porque ya era tuyo.</span>
      </li>
    </ol>

    <div class="notice">
      <b>Con total transparencia:</b> a partir de ese momento pagas el alojamiento y la base de datos
      directamente al proveedor, sin intermediarios. Para una web de negocio suele ser cuestión de unos
      pocos euros al mes. Te decimos las cifras exactas de tu caso antes de que decidas nada.
    </div>
  </div>
</section>
` +
    pcta('¿Hablamos de tu proyecto?', 'Te contamos cómo quedaría el tuyo, sin compromiso y sin coste.')
);

/* ── Legales ───────────────────────────────────────────────────────── */

/* Los datos del titular viven en un solo sitio: si cambia el NIF o el
   domicilio se toca aquí y se regeneran las tres páginas. */
const T = {
  nombre: 'Quique Planelles',
  marca: 'QP Studio',
  nif: '54020797F',
  dir: 'Calle Federico García Moliner 25, España',
  email: 'qpstudiocontacto@gmail.com'
};

const legal = (file, titulo, desc, cuerpo, aviso) =>
  page(file, titulo, desc, phead(titulo, titulo, desc) + `
<section class="pbody">
  <div class="shell prose">
${cuerpo}
    <p class="prose__fecha">Última actualización: agosto de 2026.</p>
    <div class="notice">
      <b>${aviso}</b>
    </div>
  </div>
</section>
`);

legal('aviso-legal.html', 'Aviso legal', 'Titular, condiciones de uso y responsabilidad del sitio web de QP Studio.',
`    <h2>1. Datos del titular</h2>
    <p>En cumplimiento del artículo 10 de la Ley 34/2002 de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se informa de lo siguiente:</p>
    <ul>
      <li><b>Titular:</b> ${T.nombre}, que opera bajo la marca ${T.marca}.</li>
      <li><b>NIF:</b> ${T.nif}</li>
      <li><b>Domicilio:</b> ${T.dir}</li>
      <li><b>Correo electrónico:</b> <a href="mailto:${T.email}">${T.email}</a></li>
      <li><b>Actividad:</b> diseño, desarrollo y mantenimiento de sitios web.</li>
    </ul>

    <h2>2. Objeto y aceptación</h2>
    <p>Este aviso regula el acceso y el uso del sitio <b>qpstudio.es</b>. La navegación atribuye la condición de usuario e implica aceptar estas condiciones en la versión publicada en el momento del acceso. El titular puede modificarlas en cualquier momento.</p>

    <h2>3. Condiciones de uso</h2>
    <p>El usuario se compromete a usar el sitio conforme a la ley y a no emplearlo con fines ilícitos, ni para dañar los sistemas del titular o de terceros, ni para introducir contenido que vulnere derechos ajenos.</p>

    <h2>4. Propiedad intelectual e industrial</h2>
    <p>Los contenidos del sitio —textos, diseño, código, estructura, marcas y logotipos— pertenecen al titular o a terceros que han autorizado su uso. Queda prohibida su reproducción, distribución, comunicación pública o transformación sin autorización expresa y por escrito.</p>
    <p>Las fotografías de ejemplo proceden de bancos de imágenes con licencia de uso libre y pertenecen a sus respectivos autores.</p>

    <h2>5. Responsabilidad</h2>
    <p>El titular no responde del uso que los usuarios hagan de los contenidos, ni de los daños derivados de interrupciones, virus o fallos ajenos a su control. Se compromete a mantener el sitio operativo dentro de lo razonable, sin garantizar una disponibilidad ininterrumpida.</p>

    <h2>6. Enlaces a terceros</h2>
    <p>El sitio puede contener enlaces a páginas de terceros, por ejemplo WhatsApp o LinkedIn. El titular no controla sus contenidos ni sus políticas de privacidad, y no responde de ellos.</p>

    <h2>7. Legislación y jurisdicción</h2>
    <p>Estas condiciones se rigen por la legislación española. Para cualquier controversia, las partes se someten a los juzgados y tribunales del domicilio del usuario cuando este tenga la condición de consumidor.</p>
`,
`Falta el NIF. Antes de dar este aviso por completo hay que sustituir el marcador por el número real: la LSSI-CE lo exige.`);

legal('privacidad.html', 'Política de privacidad', 'Cómo trata QP Studio los datos personales recibidos a través del sitio web.',
`    <h2>1. Responsable del tratamiento</h2>
    <ul>
      <li><b>Responsable:</b> ${T.nombre} (${T.marca})</li>
      <li><b>NIF:</b> ${T.nif}</li>
      <li><b>Domicilio:</b> ${T.dir}</li>
      <li><b>Contacto:</b> <a href="mailto:${T.email}">${T.email}</a></li>
    </ul>

    <h2>2. Qué datos tratamos y de dónde salen</h2>
    <p>Solo tratamos los datos que nos facilitas voluntariamente:</p>
    <ul>
      <li><b>Formulario de contacto:</b> nombre, correo electrónico y el contenido del mensaje.</li>
      <li><b>Correo o WhatsApp:</b> los datos que decidas incluir en tu comunicación.</li>
      <li><b>Datos técnicos:</b> dirección IP y datos de conexión que el servidor registra para funcionar y para su propia seguridad.</li>
      <li><b>Recuento de visitas:</b> página visitada, dominio de procedencia y un identificador que se recalcula cada día a partir de la IP y el navegador. No se guarda la IP y el identificador no permite seguir a nadie de un día para otro.</li>
    </ul>
    <p>No tratamos categorías especiales de datos ni datos de menores de edad.</p>

    <h2>3. Para qué los usamos y con qué base legal</h2>
    <ul>
      <li><b>Responder a tu solicitud y preparar una propuesta.</b> Base: tu consentimiento y la aplicación de medidas precontractuales a petición tuya (arts. 6.1.a y 6.1.b del RGPD).</li>
      <li><b>Gestionar la relación durante el proyecto.</b> Base: la ejecución del contrato (art. 6.1.b).</li>
      <li><b>Cumplir obligaciones fiscales y contables.</b> Base: obligación legal (art. 6.1.c).</li>
      <li><b>Mantener el sitio seguro y operativo.</b> Base: interés legítimo (art. 6.1.f).</li>
      <li><b>Saber cuánta gente visita el sitio.</b> Base: interés legítimo (art. 6.1.f), con datos que no identifican a nadie.</li>
    </ul>
    <p>No enviamos comunicaciones comerciales no solicitadas, no elaboramos perfiles y no tomamos decisiones automatizadas.</p>

    <h2>4. Cuánto tiempo los conservamos</h2>
    <ul>
      <li>Consultas que no acaban en proyecto: <b>un año</b> desde el último contacto.</li>
      <li>Datos de clientes: durante la relación y, después, <b>seis años</b> por las obligaciones contables y fiscales.</li>
      <li>Recuento de visitas: <b>un año</b>, y en forma que no identifica a nadie desde el primer momento.</li>
    </ul>
    <p>Cumplidos esos plazos, los datos se suprimen.</p>

    <h2>5. A quién se los comunicamos</h2>
    <p>No vendemos ni cedemos datos. Solo acceden a ellos los proveedores necesarios para prestar el servicio, que actúan como encargados del tratamiento:</p>
    <ul>
      <li><b>Vercel Inc.</b> — alojamiento del sitio web.</li>
      <li><b>Supabase</b> — base de datos donde se guardan los mensajes del formulario.</li>
      <li><b>Google (Gmail)</b> — correo electrónico.</li>
      <li><b>IONOS</b> — registro del dominio.</li>
    </ul>
    <p>Alguno de estos proveedores puede tratar datos fuera del Espacio Económico Europeo. En esos casos la transferencia se ampara en las Cláusulas Contractuales Tipo aprobadas por la Comisión Europea.</p>

    <h2>6. Tus derechos</h2>
    <p>Puedes ejercer en cualquier momento los derechos de <b>acceso, rectificación, supresión, oposición, limitación del tratamiento y portabilidad</b>, y retirar el consentimiento que hayas dado, escribiendo a <a href="mailto:${T.email}">${T.email}</a> e indicando qué derecho ejerces. Respondemos en el plazo máximo de un mes.</p>
    <p>Si consideras que no hemos atendido bien tu solicitud, puedes reclamar ante la <b>Agencia Española de Protección de Datos</b> (<a href="https://www.aepd.es" target="_blank" rel="noopener">www.aepd.es</a>), C/ Jorge Juan 6, 28001 Madrid.</p>

    <h2>7. Seguridad</h2>
    <p>Aplicamos medidas técnicas y organizativas razonables: conexión cifrada (HTTPS) en todo el sitio, acceso restringido al panel de administración y copias de seguridad de la base de datos.</p>
`,
`Falta el NIF y quedan pendientes los contratos de encargado de tratamiento con los proveedores citados. Revísalo con un profesional antes de darlo por cerrado.`);

legal('cookies.html', 'Política de cookies', 'Qué cookies y servicios de terceros utiliza el sitio web de QP Studio.',
`    <h2>1. Qué es una cookie</h2>
    <p>Una cookie es un archivo pequeño que un sitio web guarda en tu navegador para recordar información sobre tu visita. Se consideran equivalentes otras tecnologías de almacenamiento local, como <i>localStorage</i>.</p>

    <h2>2. Qué usa este sitio</h2>
    <p>Este sitio <b>no utiliza cookies de publicidad ni de seguimiento</b>. No hay Google Analytics, ni píxeles de redes sociales, ni perfilado de ningún tipo. Por eso no verás un banner de consentimiento: no hay nada que consentir.</p>
    <p>Sí llevamos un <b>recuento de visitas propio</b>, que no usa cookies ni servicios de terceros. Al cargar una página se anota la dirección visitada, el dominio desde el que se llegó y un identificador calculado a partir de la dirección IP y del navegador <b>mezclados con la fecha del día</b>. Como la fecha entra en el cálculo, ese identificador cambia cada jornada: sirve para saber cuánta gente entró hoy, pero no permite reconocer a nadie mañana ni relacionar dos visitas de días distintos. No se guarda la dirección IP.</p>
    <p>Sí hay almacenamiento técnico en dos casos concretos, ambos exentos de consentimiento según el artículo 22.2 de la LSSI-CE:</p>
    <ul>
      <li><b>Sesión del panel de administración.</b> Solo si accedes al panel privado, para mantener la sesión abierta. No se crea navegando por el sitio público.</li>
      <li><b>Preferencias de la propia página</b>, guardadas en tu navegador. No salen de tu dispositivo y no nos llegan.</li>
    </ul>

    <h2>3. Servicios de terceros</h2>
    <p>Las tipografías se sirven desde este mismo sitio, así que no se las pedimos a nadie. Quedan estos recursos externos que, por el propio funcionamiento de internet, reciben tu dirección IP:</p>
    <ul>
      <li><b>Unsplash</b> — algunas imágenes de ejemplo. <a href="https://unsplash.com/privacy" target="_blank" rel="noopener">Política de Unsplash</a>.</li>
      <li><b>Vercel</b> — alojamiento. <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener">Política de Vercel</a>.</li>
    </ul>

    <h2>4. Cómo gestionarlas o eliminarlas</h2>
    <p>Puedes bloquear o borrar el almacenamiento de este sitio desde la configuración de tu navegador:</p>
    <ul>
      <li><b>Chrome:</b> Configuración → Privacidad y seguridad → Cookies y otros datos de sitios.</li>
      <li><b>Edge:</b> Configuración → Cookies y permisos del sitio.</li>
      <li><b>Firefox:</b> Ajustes → Privacidad y seguridad → Cookies y datos del sitio.</li>
      <li><b>Safari:</b> Preferencias → Privacidad → Gestionar datos de sitios web.</li>
    </ul>
    <p>Bloquearlo no te impide navegar. Como mucho tendrías que volver a identificarte en el panel de administración.</p>

    <h2>5. Cambios</h2>
    <p>Si en el futuro añadimos analítica o cualquier cookie no exenta, se implantará un banner de consentimiento previo y se actualizará esta página antes de activarla.</p>
`,
`Redactado sobre el funcionamiento actual del sitio. Si algún día se añade analítica, hay que actualizar esta página y poner banner de consentimiento antes de activarla.`);

console.log('Listo.');
