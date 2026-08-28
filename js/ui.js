/* ═══════════════════════════════════════════════════════════════════════
   PLANELLES STUDIO · ui.js
   Menú, comparador antes/después, botones magnéticos y formulario.
   ── CAMBIA ESTO cuando tengas los datos definitivos del estudio ──
   ═══════════════════════════════════════════════════════════════════════ */
const CONTACTO = {
  email: 'hola@planellesstudio.com',
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

    const paint = (v) => {
      pos = clamp(v);
      ba.style.setProperty('--pos', pos + '%');
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

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const inputs = [...form.querySelectorAll('input, textarea')];
      const bad = inputs.filter((i) => !check(i));

      if (bad.length) {
        bad[0].focus();
        status.textContent = 'Falta algo arriba. Lo he marcado.';
        return;
      }

      const get = (id) => form.querySelector('#' + id).value.trim();
      const cuerpo = [
        `Nombre: ${get('f-name')}`,
        `Email: ${get('f-mail')}`,
        '',
        get('f-msg')
      ].join('\n');

      location.href =
        `mailto:${CONTACTO.email}` +
        `?subject=${encodeURIComponent('Quiero mejorar mi web · ' + get('f-name'))}` +
        `&body=${encodeURIComponent(cuerpo)}`;

      status.textContent =
        `Te he abierto el correo con todo escrito. Dale a enviar y te contesto hoy. ` +
        `Si no se ha abierto, escríbeme a ${CONTACTO.email}.`;
    });
  }
})();
