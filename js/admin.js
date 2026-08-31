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

/* Las secciones de la home y los campos editables de cada una.

   Aquí SOLO está la estructura: qué campos hay, cómo se llaman y en qué
   orden. El texto de cada uno NO se guarda aquí, sale de
   contenidos-base.json, que se genera leyendo los data-txt de index.html.

   Antes esta lista llevaba también una copia de cada texto y bastaba con
   retocar la web para que las dos versiones dejaran de coincidir: el panel
   ofrecía "restaurar" a un texto que ya no estaba en ninguna parte. */
const SECCIONES = [
  {
    id: 'hero',
    nombre: 'Cabecera',
    campos: [
      { k: 'hero.kicker', et: 'Etiqueta superior' },
      { k: 'hero.sub', et: 'Segunda línea' },
      { k: 'hero.t1', et: 'Titular, primera línea' },
      { k: 'hero.t2', et: 'Titular, segunda línea' },
      { k: 'hero.p', et: 'Párrafo', larga: true },
      { k: 'hero.pm', et: 'Párrafo en móvil', larga: true },
      { k: 'hero.cta1', et: 'Botón principal' },
      { k: 'hero.cta2', et: 'Botón secundario' }
    ]
  },
  {
    id: 'imp',
    nombre: 'La primera impresión',
    campos: [
      { k: 'imp.t1', et: 'Titular, primera línea', larga: true },
      { k: 'imp.t2', et: 'Titular, segunda línea' },
      { k: 'imp.b1', et: 'Tarjeta 1 · título' },
      { k: 'imp.p1', et: 'Tarjeta 1 · texto', larga: true },
      { k: 'imp.b2', et: 'Tarjeta 2 · título' },
      { k: 'imp.p2', et: 'Tarjeta 2 · texto', larga: true },
      { k: 'imp.b3', et: 'Tarjeta 3 · título' },
      { k: 'imp.p3', et: 'Tarjeta 3 · texto', larga: true }
    ]
  },
  {
    id: 'tra',
    nombre: 'Nuestro trabajo',
    campos: [
      { k: 'tra.t', et: 'Titular' },
      { k: 'tra.p', et: 'Párrafo', larga: true },
      { k: 'tra.cta', et: 'Botón' }
    ]
  },
  {
    id: 'ser',
    nombre: 'Servicios',
    campos: [
      { k: 'ser.t', et: 'Titular' },
      { k: 'ser.p', et: 'Introducción', larga: true },
      { k: 'ser.pm', et: 'Introducción en móvil', larga: true },
      { k: 'ser.1', et: 'Servicio 1' },
      { k: 'ser.2', et: 'Servicio 2' },
      { k: 'ser.3', et: 'Servicio 3' },
      { k: 'ser.4', et: 'Servicio 4' },
      { k: 'ser.precio', et: 'Línea de precio', larga: true }
    ]
  },
  {
    id: 'dem',
    nombre: 'Antes y después',
    campos: [
      { k: 'dem.t', et: 'Titular' },
      { k: 'dem.p', et: 'Pie' }
    ]
  },
  {
    id: 'ges',
    nombre: 'Autonomía sobre tu web',
    campos: [
      { k: 'ges.t', et: 'Titular' },
      { k: 'ges.1', et: 'Punto 1' },
      { k: 'ges.2', et: 'Punto 2' },
      { k: 'ges.3', et: 'Punto 3' }
    ]
  },
  {
    id: 'est',
    nombre: 'El estudio',
    campos: [
      { k: 'est.t1', et: 'Titular, primera línea' },
      { k: 'est.t2', et: 'Titular, segunda línea' },
      { k: 'est.p', et: 'Párrafo', larga: true },
      { k: 'est.cita', et: 'Cita destacada', larga: true }
    ]
  },
  {
    id: 'faq',
    nombre: 'Preguntas frecuentes',
    campos: [
      { k: 'faq.t1', et: 'Titular, primera palabra' },
      { k: 'faq.t2', et: 'Titular, segunda palabra' },
      { k: 'faq.1', et: 'Pregunta 1' },
      { k: 'faq.2', et: 'Pregunta 2' },
      { k: 'faq.3', et: 'Pregunta 3' },
      { k: 'faq.4', et: 'Pregunta 4' }
    ]
  },
  {
    id: 'con',
    nombre: 'Contacto final',
    campos: [
      { k: 'con.t1', et: 'Titular, primera línea' },
      { k: 'con.t2', et: 'Titular, segunda línea' },
      { k: 'con.cta', et: 'Botón' }
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
    pintarAnalitica();
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

  /* Dos fuentes: contenidos-base.json trae el texto de fábrica de cada campo
     (extraído de index.html al construir) y la base de datos trae lo que se
     haya cambiado. El campo muestra el cambio si existe y el original si no.

     Nada se guarda ya en este navegador: antes los cambios vivían en
     localStorage, así que solo los veía quien los había escrito y no llegaban
     a la web nunca. */
  let BASE = {};
  let CAMBIOS = {};
  let PENDIENTE = false;

  const esc = (s) =>
    String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

  const aviso = (el, txt, malo) => {
    if (!el) return;
    el.textContent = txt;
    el.classList.toggle('is-mal', Boolean(malo));
    el.classList.add('is-on');
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove('is-on'), 3200);
  };

  const cargarTextos = async () => {
    const [base, guardado] = await Promise.all([
      fetch('/contenidos-base.json').then((r) => (r.ok ? r.json() : {})).catch(() => ({})),
      fetch('/api/admin/contenidos').then((r) => (r.ok ? r.json() : null)).catch(() => null)
    ]);
    BASE = base;
    CAMBIOS = guardado?.cambios || {};
    PENDIENTE = Boolean(guardado?.pendiente);
  };

  const pintarPublicar = () => {
    const barra = $('#publicar-barra');
    if (!barra) return;
    barra.hidden = !PENDIENTE;
  };

  const pintarTextos = async () => {
    const cont = $('#textos');
    if (!cont) return;

    await cargarTextos();
    pintarPublicar();

    cont.innerHTML = SECCIONES.map(
      (s) => `
      <section class="ebox" data-sec="${s.id}">
        <header class="ebox__head">
          <h3>${s.nombre}</h3>
          <span class="ebox__id">#${s.id}</span>
        </header>
        <div class="ebox__body">
          ${s.campos
            .map((c) => {
              const original = BASE[c.k] ?? '';
              const valor = CAMBIOS[c.k] ?? original;
              const cambiado = c.k in CAMBIOS;
              const attrs = `data-k="${c.k}" data-def="${esc(original)}"`;
              return `
            <label class="efield${cambiado ? ' is-cambiado' : ''}">
              <span class="efield__et">${c.et}${cambiado ? '<i>cambiado</i>' : ''}</span>
              ${
                c.larga
                  ? `<textarea rows="3" ${attrs}>${esc(valor)}</textarea>`
                  : `<input type="text" ${attrs} value="${esc(valor)}" />`
              }
            </label>`;
            })
            .join('')}
        </div>
        <footer class="ebox__foot">
          <span class="ebox__estado" role="status"></span>
          <div class="ebox__acciones">
            <button type="button" class="btn btn--ghost btn--sm" data-accion="restaurar"><span>Restaurar original</span></button>
            <button type="button" class="btn btn--blue btn--sm" data-accion="guardar"><span>Guardar</span></button>
          </div>
        </footer>
      </section>`
    ).join('');

    if (cont.dataset.listo) return;
    cont.dataset.listo = '1';

    cont.addEventListener('click', async (e) => {
      const b = e.target.closest('[data-accion]');
      if (!b) return;

      const box = b.closest('.ebox');
      const campos = [...box.querySelectorAll('[data-k]')];
      const estado = box.querySelector('.ebox__estado');
      const restaurar = b.dataset.accion === 'restaurar';

      if (restaurar) campos.forEach((c) => (c.value = c.dataset.def));

      const cambios = {};
      campos.forEach((c) => {
        cambios[c.dataset.k] = {
          valor: restaurar ? '' : c.value,
          original: c.dataset.def
        };
      });

      b.disabled = true;
      try {
        const r = await fetch('/api/admin/contenidos', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cambios })
        });
        const d = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(d.error || 'no guardado');

        // Se refresca el estado local para que las marcas de "cambiado" y el
        // aviso de publicación cuadren sin recargar la página.
        campos.forEach((c) => {
          const v = restaurar ? '' : c.value.trim();
          if (!v || v === c.dataset.def) delete CAMBIOS[c.dataset.k];
          else CAMBIOS[c.dataset.k] = v;
        });
        PENDIENTE = true;
        pintarPublicar();

        campos.forEach((c) => {
          const et = c.closest('.efield');
          const cambiado = c.dataset.k in CAMBIOS;
          et.classList.toggle('is-cambiado', cambiado);
          const marca = et.querySelector('.efield__et i');
          if (cambiado && !marca) et.querySelector('.efield__et').insertAdjacentHTML('beforeend', '<i>cambiado</i>');
          if (!cambiado && marca) marca.remove();
        });

        aviso(estado, restaurar ? 'Textos originales restaurados.' : 'Guardado. Pulsa Publicar para que salga en la web.');
      } catch (err) {
        aviso(estado, err.message || 'No he podido guardar.', true);
      }
      b.disabled = false;
    });
  };

  /* ── Publicar ────────────────────────────────────────────────────── */
  $('#publicar')?.addEventListener('click', async (e) => {
    const boton = e.currentTarget;
    const estado = $('#publicar-estado');
    boton.disabled = true;
    aviso(estado, 'Lanzando la publicación…');
    try {
      const r = await fetch('/api/admin/publicar', { method: 'POST' });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.error || 'no se ha podido publicar');
      PENDIENTE = false;
      pintarPublicar();
      aviso(estado, d.mensaje || 'Publicando.');
    } catch (err) {
      aviso(estado, err.message, true);
    }
    boton.disabled = false;
  });

  /* ── Analítica ───────────────────────────────────────────────────── */

  /* Los números salen de la propia base de datos: no hay Google Analytics ni
     ningún tercero, y no se guarda nada que identifique a nadie. El gráfico
     se dibuja con divs, sin librerías. */
  let DIAS = 30;

  const pintarAnalitica = async () => {
    const cont = $('#analitica');
    if (!cont) return;
    cont.innerHTML = '<p class="ana__cargando">Cargando…</p>';

    let d;
    try {
      const r = await fetch(`/api/admin/analitica?dias=${DIAS}`);
      if (!r.ok) throw new Error(String(r.status));
      d = await r.json();
    } catch {
      cont.innerHTML = '<p class="ana__cargando">No he podido cargar los números.</p>';
      return;
    }

    const n = (v) => Number(v || 0).toLocaleString('es-ES');
    const dia = (iso) =>
      new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });

    // El gráfico se apoya en el día de más tráfico; si no hay ninguno, se usa
    // 1 para no dividir entre cero y pintar barras infinitas.
    const tope = Math.max(1, ...d.porDia.map((x) => x.paginas));

    const barras = d.porDia
      .map(
        (x) => `
      <div class="ana__barra" style="--alto:${Math.round((x.paginas / tope) * 100)}%"
           title="${dia(x.dia)}: ${n(x.paginas)} páginas, ${n(x.visitantes)} visitantes">
        <span></span>
      </div>`
      )
      .join('');

    const filas = (lista, campo, vacio) =>
      lista.length
        ? `<ul class="ana__lista">${lista
            .map(
              (x) => `<li><span>${esc(x[campo])}</span><b>${n(x.paginas)}</b></li>`
            )
            .join('')}</ul>`
        : `<p class="ana__vacio">${vacio}</p>`;

    cont.innerHTML = `
      <div class="ana__rango" role="group" aria-label="Periodo">
        ${[7, 30, 90]
          .map(
            (v) =>
              `<button type="button" class="ana__rango-b${v === d.dias ? ' is-on' : ''}" data-dias="${v}">${v} días</button>`
          )
          .join('')}
      </div>

      <div class="ana__cifras">
        <div class="ana__c"><b>${n(d.visitantes)}</b><span>visitantes</span></div>
        <div class="ana__c"><b>${n(d.paginas)}</b><span>páginas vistas</span></div>
        <div class="ana__c"><b>${n(d.visitantes_hoy)}</b><span>visitantes hoy</span></div>
        <div class="ana__c"><b>${n(d.paginas_hoy)}</b><span>páginas hoy</span></div>
      </div>

      ${
        d.porDia.length
          ? `<div class="ana__grafico" aria-label="Páginas vistas por día">${barras}</div>
             <p class="ana__pie"><span>${dia(d.porDia[0].dia)}</span><span>${dia(d.porDia[d.porDia.length - 1].dia)}</span></p>`
          : '<p class="ana__vacio">Todavía no hay visitas registradas.</p>'
      }

      <div class="ana__cols">
        <div>
          <h3>Páginas más vistas</h3>
          ${filas(d.porRuta, 'ruta', 'Sin datos aún.')}
        </div>
        <div>
          <h3>De dónde llegan</h3>
          ${filas(d.porReferente, 'referente', 'Nadie ha llegado desde otra web todavía.')}
        </div>
      </div>

      <p class="ana__nota">Sin cookies y sin terceros. El identificador de visitante cambia cada día, así que sirve para contar cuánta gente entra pero no para seguir a nadie.</p>
    `;

    cont.querySelectorAll('[data-dias]').forEach((b) =>
      b.addEventListener('click', () => {
        DIAS = Number(b.dataset.dias);
        pintarAnalitica();
      })
    );
  };

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
