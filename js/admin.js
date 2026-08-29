/* ═══════════════════════════════════════════════════════════════════════
   QP STUDIO · admin.js
   Panel de administración. Esta fase no tiene backend, así que todo se
   guarda en el navegador (localStorage) y sirve como maqueta funcional
   de lo que hará el panel real.

   El acceso se comprueba en el servidor (/api/admin/entrar), que devuelve
   una cookie de sesión firmada. Aquí no hay ninguna contraseña.

   Los mensajes del formulario salen de la base de datos. Los textos y los
   bloques todavía se guardan en este navegador (localStorage).
   ═══════════════════════════════════════════════════════════════════════ */

/* Secciones de la web y los textos que se pueden editar en cada una.
   El orden es el mismo que el de la home. */
const SECCIONES = [
  {
    id: 'hero',
    nombre: 'Cabecera (hero)',
    campos: [
      { k: 'hero.kicker', et: 'Etiqueta superior', v: 'Estudio digital independiente' },
      { k: 'hero.sub', et: 'Segunda línea', v: 'Dirigido por Quique Planelles' },
      { k: 'hero.t1', et: 'Titular, primera línea', v: 'Haz que tu web refleje' },
      { k: 'hero.t2', et: 'Titular, segunda línea', v: 'el valor real de tu negocio.' },
      { k: 'hero.p', et: 'Párrafo', v: 'Diseño, desarrollo y mantenimiento web para negocios de cualquier sector. Desde proyectos sencillos y directos hasta desarrollos con integraciones a medida.', larga: true },
      { k: 'hero.cta1', et: 'Botón principal', v: 'Solicitar propuesta' },
      { k: 'hero.cta2', et: 'Botón secundario', v: 'Ver servicios' }
    ]
  },
  {
    id: 'impresion',
    nombre: 'La primera impresión',
    campos: [
      { k: 'imp.t1', et: 'Titular, primera línea', v: 'Tu web es la primera reunión.' },
      { k: 'imp.t2', et: 'Titular, segunda línea', v: 'Y decide más de lo que parece.' },
      { k: 'imp.p', et: 'Entradilla', v: 'Tanto si partes de cero como si arrastras una web antigua, el resultado se juzga igual: en los primeros segundos y sin que nadie te explique por qué.', larga: true },
      { k: 'imp.b1', et: 'Motivo 1, titular', v: 'Te buscan antes de contactarte' },
      { k: 'imp.b2', et: 'Motivo 2, titular', v: 'Deciden en segundos' },
      { k: 'imp.b3', et: 'Motivo 3, titular', v: 'Nunca sabrás el motivo' }
    ]
  },
  {
    id: 'trabajo',
    nombre: 'Nuestro trabajo',
    campos: [
      { k: 'tra.t', et: 'Titular', v: 'Nuestro trabajo' },
      { k: 'tra.p', et: 'Párrafo', v: 'Diseñamos y desarrollamos cada proyecto a medida: arquitectura, contenidos, rendimiento e integraciones. Sin plantillas adaptadas ni funciones a medio terminar.', larga: true },
      { k: 'tra.cta', et: 'Botón', v: 'Ver un caso completo' }
    ]
  },
  {
    id: 'servicios',
    nombre: 'Nuestros servicios',
    campos: [
      { k: 'ser.t', et: 'Titular', v: 'Nuestros servicios' },
      { k: 'ser.p', et: 'Entradilla', v: 'Trabajamos con negocios de cualquier sector y tamaño. Ajustamos el nivel de sofisticación a cada caso.', larga: true },
      { k: 'ser.1', et: 'Servicio 01', v: 'Diseño web' },
      { k: 'ser.2', et: 'Servicio 02', v: 'Rediseño web' },
      { k: 'ser.3', et: 'Servicio 03', v: 'Comercio electrónico' },
      { k: 'ser.4', et: 'Servicio 04', v: 'Automatización e integraciones' }
    ]
  },
  {
    id: 'demo',
    nombre: 'Antes y después',
    campos: [
      { k: 'dem.t', et: 'Titular', v: 'Antes y después' },
      { k: 'dem.p', et: 'Subtítulo', v: 'Un taller mecánico real. Arrastra para comparar.' }
    ]
  },
  {
    id: 'gestion',
    nombre: 'Autonomía sobre tu web',
    campos: [
      { k: 'ges.t', et: 'Titular', v: 'Autonomía total sobre tu web' },
      { k: 'ges.1', et: 'Punto 1, titular', v: 'Contenidos editables' },
      { k: 'ges.2', et: 'Punto 2, titular', v: 'Botones funcionales con backend real' },
      { k: 'ges.3', et: 'Punto 3, titular', v: 'Soporte 24/7' }
    ]
  },
  {
    id: 'estudio',
    nombre: 'El estudio',
    campos: [
      { k: 'est.t1', et: 'Titular, primera línea', v: 'Un solo responsable:' },
      { k: 'est.t2', et: 'Titular, segunda línea', v: 'Quique Planelles.' },
      { k: 'est.p', et: 'Párrafo', v: 'La persona con la que hablas es la que diseña, la que programa y la que sigue respondiendo meses después.', larga: true },
      { k: 'est.cita', et: 'Cita destacada', v: 'Trabajar con un estudio pequeño no significa renunciar a nada. Significa que quien decide sobre tu proyecto lo conoce de principio a fin.', larga: true }
    ]
  },
  {
    id: 'faq',
    nombre: 'Preguntas frecuentes',
    campos: [
      { k: 'faq.t', et: 'Titular', v: 'Preguntas frecuentes' },
      { k: 'faq.1', et: 'Pregunta 1', v: '¿Cómo se empieza?' },
      { k: 'faq.2', et: 'Pregunta 2', v: '¿Trabajáis con cualquier tipo de negocio?' },
      { k: 'faq.3', et: 'Pregunta 3', v: '¿Podré modificar la web yo mismo?' },
      { k: 'faq.4', et: 'Pregunta 4', v: '¿Qué ocurre cuando la web ya está publicada?' }
    ]
  },
  {
    id: 'contacto',
    nombre: 'Contacto final',
    campos: [
      { k: 'con.t1', et: 'Titular, primera línea', v: 'Hablemos de tu proyecto.' },
      { k: 'con.t2', et: 'Titular, segunda línea', v: 'Respondemos en menos de 48 horas.' },
      { k: 'con.cta', et: 'Botón de envío', v: 'Enviar solicitud' }
    ]
  }
];

const BLOQUES = [
  { id: 'banner', nombre: 'Banner con imagen', desc: 'Imagen a todo el ancho con titular y botón encima.', icono: '<path d="M3 5h18v14H3zM3 15l5-4 4 3 3-2 6 5"/>' },
  { id: 'img-texto', nombre: 'Imagen y texto', desc: 'Dos columnas: una imagen y un bloque de texto al lado.', icono: '<path d="M3 5h8v14H3zM14 7h7M14 11h7M14 15h5"/>' },
  { id: 'texto', nombre: 'Bloque de texto', desc: 'Titular y párrafos a una o dos columnas.', icono: '<path d="M4 6h16M4 11h16M4 16h10"/>' },
  { id: 'cta', nombre: 'Llamada a la acción', desc: 'Franja destacada con una frase y un botón.', icono: '<path d="M4 8h16v8H4zM9 12h6"/>' },
  { id: 'galeria', nombre: 'Galería de imágenes', desc: 'Rejilla de fotografías con pie opcional.', icono: '<path d="M4 5h6v6H4zM14 5h6v6h-6zM4 13h6v6H4zM14 13h6v6h-6z"/>' },
  { id: 'faq', nombre: 'Preguntas frecuentes', desc: 'Lista de preguntas desplegables.', icono: '<path d="M9 9a3 3 0 1 1 4 2.8V14M12 17.5v.5"/>' }
];

(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const LS = 'qp-admin-textos';
  const LS_BLOQUES = 'qp-admin-bloques';

  /* ── Acceso ──────────────────────────────────────────────────────── */
  const login = $('#login');
  const panel = $('#panel');
  const form = $('#login-form');
  const error = $('#login-error');

  const entrar = () => {
    login.hidden = true;
    panel.hidden = false;
    pintarTextos();
    pintarBloques();
    cargarMensajes();
  };

  /* ── Bandeja de entrada ─────────────────────────────────────────── */

  const fecha = (iso) =>
    new Date(iso).toLocaleString('es-ES', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

  /* Todo lo que viene de la base de datos lo ha escrito un desconocido en
     un formulario público, así que se pinta con textContent y nunca con
     innerHTML: si alguien manda etiquetas, se ven como texto. */
  const cargarMensajes = async () => {
    const caja = document.querySelector('#tab-mensajes .inbox');
    if (!caja) return;

    let datos;
    try {
      const r = await fetch('/api/admin/mensajes');
      if (!r.ok) throw new Error(String(r.status));
      datos = await r.json();
    } catch {
      caja.innerHTML =
        '<p class="inbox__head"><span>Bandeja de entrada</span><span>sin conexión</span></p>' +
        '<div class="inbox__empty"><h3>No he podido cargar los mensajes</h3>' +
        '<p>Comprueba la conexión y vuelve a intentarlo.</p></div>';
      return;
    }

    const { mensajes = [], total = 0, sinLeer = 0 } = datos;
    caja.textContent = '';

    const cab = document.createElement('p');
    cab.className = 'inbox__head';
    const izq = document.createElement('span');
    izq.textContent = 'Bandeja de entrada';
    const der = document.createElement('span');
    der.textContent = total
      ? `${total} mensaje${total === 1 ? '' : 's'}${sinLeer ? ` · ${sinLeer} sin leer` : ''}`
      : '0 mensajes';
    cab.append(izq, der);
    caja.append(cab);

    if (!mensajes.length) {
      const vacio = document.createElement('div');
      vacio.className = 'inbox__empty';
      vacio.innerHTML =
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18v12H3zM3 7l9 6 9-6"/></svg>' +
        '<h3>No han llegado mensajes</h3>' +
        '<p>Aquí aparecerán las solicitudes enviadas desde el formulario de contacto.</p>';
      caja.append(vacio);
      return;
    }

    const lista = document.createElement('ul');
    lista.className = 'inbox__list';

    for (const m of mensajes) {
      const li = document.createElement('li');
      li.className = 'msg' + (m.leido ? '' : ' msg--nuevo');

      const alto = document.createElement('div');
      alto.className = 'msg__alto';
      const quien = document.createElement('b');
      quien.textContent = m.nombre;
      const cuando = document.createElement('time');
      cuando.dateTime = m.creado_en;
      cuando.textContent = fecha(m.creado_en);
      alto.append(quien, cuando);

      const correo = document.createElement('a');
      correo.className = 'msg__mail';
      correo.href = `mailto:${m.email}`;
      correo.textContent = m.email;

      const texto = document.createElement('p');
      texto.className = 'msg__texto';
      texto.textContent = m.mensaje;

      const acciones = document.createElement('div');
      acciones.className = 'msg__acciones';

      const leer = document.createElement('button');
      leer.type = 'button';
      leer.className = 'msg__btn';
      leer.textContent = m.leido ? 'Marcar sin leer' : 'Marcar como leído';
      leer.addEventListener('click', async () => {
        leer.disabled = true;
        await fetch('/api/admin/mensajes', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: m.id, leido: !m.leido })
        }).catch(() => {});
        cargarMensajes();
      });

      const borrar = document.createElement('button');
      borrar.type = 'button';
      borrar.className = 'msg__btn msg__btn--baja';
      borrar.textContent = 'Borrar';
      borrar.addEventListener('click', async () => {
        if (!confirm(`¿Borrar el mensaje de ${m.nombre}? No se puede deshacer.`)) return;
        borrar.disabled = true;
        await fetch('/api/admin/mensajes', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: m.id })
        }).catch(() => {});
        cargarMensajes();
      });

      acciones.append(leer, borrar);
      li.append(alto, correo, texto, acciones);
      lista.append(li);
    }

    caja.append(lista);
  };

  /* ¿Hay sesión abierta? Lo dice el servidor, no el navegador. */
  fetch('/api/admin/sesion')
    .then((r) => r.json())
    .then((d) => {
      if (d.activa) entrar();
    })
    .catch(() => {
      /* sin conexión se queda la pantalla de acceso, que es lo correcto */
    });

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const boton = form.querySelector('button[type="submit"]');
    error.textContent = '';
    if (boton) boton.disabled = true;

    try {
      const r = await fetch('/api/admin/entrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario: $('#l-user').value.trim(),
          clave: $('#l-pass').value
        })
      });
      if (r.ok) {
        entrar();
        return;
      }
      const d = await r.json().catch(() => ({}));
      error.textContent = d.error || 'Usuario o contraseña incorrectos.';
    } catch {
      error.textContent = 'No hay conexión con el servidor.';
    }

    if (boton) boton.disabled = false;
    $('#l-pass').value = '';
    $('#l-pass').focus();
  });

  $('#salir')?.addEventListener('click', async () => {
    await fetch('/api/admin/salir', { method: 'POST' }).catch(() => {});
    location.reload();
  });

  /* ── Pestañas ────────────────────────────────────────────────────── */
  document.querySelectorAll('.tabs__btn').forEach((b) => {
    b.addEventListener('click', () => {
      document.querySelectorAll('.tabs__btn').forEach((x) => x.setAttribute('aria-selected', 'false'));
      document.querySelectorAll('.tabs__panel').forEach((x) => (x.hidden = true));
      b.setAttribute('aria-selected', 'true');
      $('#' + b.dataset.tab).hidden = false;
    });
  });

  /* ── Editar textos ───────────────────────────────────────────────── */
  const leer = () => {
    try {
      return JSON.parse(localStorage.getItem(LS) || '{}');
    } catch {
      return {};
    }
  };
  const guardar = (o) => localStorage.setItem(LS, JSON.stringify(o));

  const pintarTextos = () => {
    const cont = $('#textos');
    if (!cont || cont.dataset.listo) return;
    cont.dataset.listo = '1';
    const datos = leer();

    cont.innerHTML = SECCIONES.map(
      (s) => `
      <section class="ebox" data-sec="${s.id}">
        <header class="ebox__head">
          <h3>${s.nombre}</h3>
          <span class="ebox__id">#${s.id}</span>
        </header>
        <div class="ebox__body">
          ${s.campos
            .map(
              (c) => `
            <label class="efield">
              <span class="efield__et">${c.et}</span>
              ${
                c.larga
                  ? `<textarea rows="3" data-k="${c.k}" data-def="${esc(c.v)}">${esc(datos[c.k] ?? c.v)}</textarea>`
                  : `<input type="text" data-k="${c.k}" data-def="${esc(c.v)}" value="${esc(datos[c.k] ?? c.v)}" />`
              }
            </label>`
            )
            .join('')}
        </div>
        <footer class="ebox__foot">
          <span class="ebox__estado" role="status"></span>
          <div class="ebox__acciones">
            <button type="button" class="btn btn--ghost btn--sm" data-accion="restaurar"><span>Restaurar por defecto</span></button>
            <button type="button" class="btn btn--blue btn--sm" data-accion="guardar"><span>Guardar cambios</span></button>
          </div>
        </footer>
      </section>`
    ).join('');

    cont.addEventListener('click', (e) => {
      const b = e.target.closest('[data-accion]');
      if (!b) return;
      const box = b.closest('.ebox');
      const campos = [...box.querySelectorAll('[data-k]')];
      const estado = box.querySelector('.ebox__estado');
      const datos = leer();

      if (b.dataset.accion === 'restaurar') {
        campos.forEach((c) => {
          c.value = c.dataset.def;
          delete datos[c.dataset.k];
        });
        guardar(datos);
        aviso(estado, 'Textos restaurados.');
      } else {
        campos.forEach((c) => (datos[c.dataset.k] = c.value));
        guardar(datos);
        aviso(estado, 'Cambios guardados en este navegador.');
      }
    });
  };

  const aviso = (el, txt) => {
    el.textContent = txt;
    el.classList.add('is-on');
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove('is-on'), 2600);
  };

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  }

  /* ── Añadir secciones ────────────────────────────────────────────── */
  const pintarBloques = () => {
    const cont = $('#bloques');
    if (!cont || cont.dataset.listo) return;
    cont.dataset.listo = '1';

    cont.innerHTML = BLOQUES.map(
      (b) => `
      <article class="bcard">
        <span class="bcard__ico"><svg viewBox="0 0 24 24" aria-hidden="true">${b.icono}</svg></span>
        <h3>${b.nombre}</h3>
        <p>${b.desc}</p>
        <button type="button" class="btn btn--ghost btn--sm" data-add="${b.id}"><span>Añadir a la web</span></button>
      </article>`
    ).join('');

    const lista = $('#cola');
    const pintarCola = () => {
      let cola = [];
      try {
        cola = JSON.parse(localStorage.getItem(LS_BLOQUES) || '[]');
      } catch {}
      lista.innerHTML = cola.length
        ? cola
            .map(
              (c, i) =>
                `<li><span>${c}</span><button type="button" class="linkish" data-del="${i}">Quitar</button></li>`
            )
            .join('')
        : '<li class="vacio">Todavía no has añadido ningún bloque.</li>';
    };

    cont.addEventListener('click', (e) => {
      const b = e.target.closest('[data-add]');
      if (!b) return;
      const nombre = BLOQUES.find((x) => x.id === b.dataset.add).nombre;
      let cola = [];
      try {
        cola = JSON.parse(localStorage.getItem(LS_BLOQUES) || '[]');
      } catch {}
      cola.push(nombre);
      localStorage.setItem(LS_BLOQUES, JSON.stringify(cola));
      pintarCola();
    });

    lista.addEventListener('click', (e) => {
      const b = e.target.closest('[data-del]');
      if (!b) return;
      let cola = JSON.parse(localStorage.getItem(LS_BLOQUES) || '[]');
      cola.splice(Number(b.dataset.del), 1);
      localStorage.setItem(LS_BLOQUES, JSON.stringify(cola));
      pintarCola();
    });

    pintarCola();
  };
})();
