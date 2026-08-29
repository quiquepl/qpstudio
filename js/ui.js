/* ═══════════════════════════════════════════════════════════════════════
   QP STUDIO · ui.js
   Menú, comparador antes/después, botones magnéticos y formulario.
   ── CAMBIA ESTO cuando tengas los datos definitivos del estudio ──
   ═══════════════════════════════════════════════════════════════════════ */
const CONTACTO = {
  email: 'qpstudiocontacto@gmail.com',
  whatsapp: '34600000000' // sin +, sin espacios
};

(() => {
  'use strict';

  const quiet = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const clamp = (v, a = 0, b = 100) => (v < a ? a : v > b ? b : v);

  /* ── Año del footer ────────────────────────────────────────────────── */
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ── Menú móvil ────────────────────────────────────────────────────── */
  const burger = document.getElementById('burger');
  const menu = document.getElementById('menu');

  if (burger && menu) {
    const setMenu = (open) => {
      menu.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    };

    burger.addEventListener('click', () =>
      setMenu(burger.getAttribute('aria-expanded') !== 'true')
    );
    menu.addEventListener('click', (e) => {
      if (e.target.closest('a')) setMenu(false);
    });
    addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setMenu(false);
    });
    addEventListener('resize', () => {
      if (innerWidth > 880) setMenu(false);
    });
  }

  /* ── Comparador antes / después ────────────────────────────────────── */
  const ba = document.getElementById('ba');
  const handle = document.getElementById('ba-handle');

  if (ba && handle) {
    const frame = ba.querySelector('.ba__frame');
    let pos = 50;
    let dragging = false;

    const tagOld = ba.querySelector('.ba__tag--old');
    const tagNew = ba.querySelector('.ba__tag--new');

    const paint = (v) => {
      pos = clamp(v);
      ba.style.setProperty('--pos', pos + '%');
      // con una web ocupando todo el marco, la etiqueta de la otra sobra
      if (tagNew) tagNew.classList.toggle('is-off', pos > 93);
      if (tagOld) tagOld.classList.toggle('is-off', pos < 7);
      handle.setAttribute('aria-valuenow', Math.round(pos));
      handle.setAttribute(
        'aria-valuetext',
        pos < 12
          ? 'Se ve la web nueva'
          : pos > 88
            ? 'Se ve la web antigua'
            : `${Math.round(pos)} % de web antigua a la izquierda`
      );
    };

    const fromEvent = (e) => {
      const r = frame.getBoundingClientRect();
      paint(((e.clientX - r.left) / r.width) * 100);
    };

    frame.addEventListener('pointerdown', (e) => {
      dragging = true;
      ba.classList.add('is-dragging');
      frame.setPointerCapture(e.pointerId);
      fromEvent(e);
    });
    frame.addEventListener('pointermove', (e) => {
      if (dragging) fromEvent(e);
    });
    const release = (e) => {
      if (!dragging) return;
      dragging = false;
      ba.classList.remove('is-dragging');
      if (frame.hasPointerCapture(e.pointerId)) frame.releasePointerCapture(e.pointerId);
    };
    frame.addEventListener('pointerup', release);
    frame.addEventListener('pointercancel', release);

    handle.addEventListener('keydown', (e) => {
      const step = e.shiftKey ? 12 : 4;
      const map = { ArrowLeft: -step, ArrowRight: step, ArrowDown: -step, ArrowUp: step };
      if (e.key in map) {
        paint(pos + map[e.key]);
        e.preventDefault();
      } else if (e.key === 'Home') {
        paint(0);
        e.preventDefault();
      } else if (e.key === 'End') {
        paint(100);
        e.preventDefault();
      }
    });

    paint(50);

    // Al entrar en pantalla el control hace un barrido en dos tiempos: abre
    // hasta el pasado y vuelve. Así se entiende que hay algo que arrastrar
    // sin tener que leerlo. Si el observador no llegase a dispararse, se
    // queda en el 50 % de reposo.
    if (!quiet.matches) {
      const keys = [
        { at: 0, v: 50 },
        { at: 0.42, v: 88 },
        { at: 1, v: 46 }
      ];
      const at = (p) => {
        for (let i = 1; i < keys.length; i++) {
          if (p > keys[i].at) continue;
          const a = keys[i - 1];
          const b = keys[i];
          const t = (p - a.at) / (b.at - a.at);
          return a.v + (b.v - a.v) * (1 - Math.pow(1 - t, 3));
        }
        return keys[keys.length - 1].v;
      };

      const hint = new IntersectionObserver(
        (entries) => {
          if (!entries[0].isIntersecting) return;
          hint.disconnect();
          let t0 = 0;
          const run = (now) => {
            if (!t0) t0 = now;
            const p = Math.min((now - t0) / 2200, 1);
            if (dragging) return; // si el visitante toma el control, se cede
            paint(at(p));
            if (p < 1) requestAnimationFrame(run);
          };
          setTimeout(() => requestAnimationFrame(run), 320);
        },
        { threshold: 0.45 }
      );
      hint.observe(ba);
    }
  }

  /* ── Botones magnéticos (solo con ratón de verdad) ─────────────────── */
  if (fine.matches && !quiet.matches) {
    document.querySelectorAll('.magnet').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
        const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
        el.style.setProperty('--tx', (dx * 6).toFixed(2) + 'px');
        el.style.setProperty('--ty', (dy * 4).toFixed(2) + 'px');
      });
      el.addEventListener('pointerleave', () => {
        el.style.setProperty('--tx', '0px');
        el.style.setProperty('--ty', '0px');
      });
    });
  }

  /* ── Formulario ────────────────────────────────────────────────────────
     Esta fase no lleva backend. Valida en el navegador y abre el correo
     con todo escrito, así que funciona de verdad desde el primer día.
     Para pasar a un endpoint real, ver README.md.
     ─────────────────────────────────────────────────────────────────── */
  const form = document.getElementById('form');
  const status = document.getElementById('form-status');

  // los enlaces de contacto salen de la configuración de arriba
  document.querySelectorAll('a[href^="mailto:"]').forEach((a) => {
    a.href = 'mailto:' + CONTACTO.email;
    if (a.textContent.includes('@')) a.textContent = CONTACTO.email;
  });
  document.querySelectorAll('a[href*="wa.me/"]').forEach((a) => {
    a.href = a.href.replace(/wa\.me\/\d+/, 'wa.me/' + CONTACTO.whatsapp);
  });

  if (form) {
    const rules = {
      'f-name': (v) => (v.trim().length >= 2 ? '' : 'Dime cómo te llamas, aunque sea solo el nombre.'),
      'f-mail': (v) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Revisa el email: sin él no puedo contestarte.',
      'f-msg': (v) => (v.trim().length >= 8 ? '' : 'Con una frase me vale, pero necesito algo.')
    };

    const check = (input) => {
      const msg = rules[input.id] ? rules[input.id](input.value) : '';
      const field = input.closest('.field');
      field.classList.toggle('is-bad', Boolean(msg));
      if (msg) field.dataset.msg = msg;
      else delete field.dataset.msg;
      return !msg;
    };

    form.querySelectorAll('input, textarea').forEach((input) => {
      input.addEventListener('blur', () => check(input));
      input.addEventListener('input', () => {
        if (input.closest('.field').classList.contains('is-bad')) check(input);
      });
    });

    /* El formulario ya no abre el cliente de correo: manda el mensaje a
       /api/contacto, que lo guarda en la base de datos. Si el envío falla,
       se ofrece el correo como salida para que nadie se quede sin poder
       contactar por un fallo nuestro. */
    const boton = form.querySelector('button[type="submit"]');
    const textoBoton = boton ? boton.querySelector('span') : null;
    const etiquetaOriginal = textoBoton ? textoBoton.textContent : '';
    let enviando = false;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (enviando) return;

      const inputs = [...form.querySelectorAll('input, textarea')];
      const bad = inputs.filter((i) => !check(i));

      if (bad.length) {
        bad[0].focus();
        status.textContent = 'Falta algo arriba. Lo he marcado.';
        return;
      }

      const get = (id) => form.querySelector('#' + id).value.trim();

      enviando = true;
      if (boton) boton.disabled = true;
      if (textoBoton) textoBoton.textContent = 'Enviando…';
      status.textContent = '';

      try {
        const r = await fetch('/api/contacto', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre: get('f-name'),
            email: get('f-mail'),
            mensaje: get('f-msg'),
            origen: location.pathname
          })
        });
        const datos = await r.json().catch(() => ({}));

        if (r.ok) {
          form.reset();
          status.textContent = 'Recibido. Te contesto en menos de 48 horas.';
        } else {
          status.textContent =
            datos.error || `No he podido enviarlo. Escríbeme a ${CONTACTO.email}.`;
        }
      } catch {
        status.textContent =
          `No hay conexión con el servidor. Escríbeme a ${CONTACTO.email} y lo vemos.`;
      } finally {
        enviando = false;
        if (boton) boton.disabled = false;
        if (textoBoton) textoBoton.textContent = etiquetaOriginal;
      }
    });
  }
  /* ── Acceso al panel desde el enlace "Admin" del pie ──────────────── */
  const gate = document.getElementById("gate");
  if (gate) {
    const gform = document.getElementById("gate-form");
    const gerr = document.getElementById("gate-error");

    document.querySelectorAll('a[href="/admin"]').forEach((a) => {
      a.addEventListener("click", async (e) => {
        e.preventDefault();
        // Quien manda es el servidor: si la cookie de sesión sigue valiendo
        // se entra directo, y si no, se piden las credenciales.
        try {
          const r = await fetch("/api/admin/sesion");
          if (r.ok && (await r.json()).activa) {
            location.href = "/admin";
            return;
          }
        } catch {
          /* sin conexión: se pide igualmente y ya fallará el envío */
        }
        gerr.textContent = "";
        gform.reset();
        gate.showModal();
        document.getElementById("g-user").focus();
      });
    });

    document.getElementById("gate-close")?.addEventListener("click", () => gate.close());
    gate.addEventListener("click", (e) => {
      if (e.target === gate) gate.close();
    });

    gform.addEventListener("submit", async (e) => {
      e.preventDefault();
      const pass = document.getElementById("g-pass");
      const enviar = gform.querySelector('button[type="submit"]');
      gerr.textContent = "";
      if (enviar) enviar.disabled = true;

      try {
        const r = await fetch("/api/admin/entrar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            usuario: document.getElementById("g-user").value.trim(),
            clave: pass.value
          })
        });
        if (r.ok) {
          location.href = "/admin";
          return;
        }
        const datos = await r.json().catch(() => ({}));
        gerr.textContent = datos.error || "Usuario o contraseña incorrectos.";
      } catch {
        gerr.textContent = "No hay conexión con el servidor.";
      }

      if (enviar) enviar.disabled = false;
      pass.value = "";
      pass.focus();
    });
  }

  /* ── Tarjetas de la banda: desplegables solo en móvil ─────────────── */
  const bandCards = [...document.querySelectorAll("details.bandc")];
  if (bandCards.length) {
    const mq = matchMedia("(max-width: 620px)");
    const ajustar = () => bandCards.forEach((c, i) => (c.open = !mq.matches || i === 0));
    ajustar();
    mq.addEventListener("change", ajustar);
  }

  /* ── Aviso de visita ─────────────────────────────────────────────── */
  /* Analítica propia: sin cookies, sin terceros y sin nada que
     identifique a nadie. Va con sendBeacon para que el navegador lo mande
     en segundo plano y no retrase la página; si no existe, se usa fetch
     con keepalive, que aguanta aunque el visitante cambie de página al
     momento. Cualquier fallo se traga en silencio: es una estadística, no
     puede estropearle la visita a nadie. */
  try {
    const datos = JSON.stringify({
      ruta: location.pathname,
      referente: document.referrer || null
    });
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/visita", new Blob([datos], { type: "application/json" }));
    } else {
      fetch("/api/visita", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: datos,
        keepalive: true
      }).catch(() => {});
    }
  } catch {
    /* sin analítica, la web funciona igual */
  }
})();
