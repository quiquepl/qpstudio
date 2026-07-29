/* ═══════════════════════════════════════════════════════════════════════
   PLANELLES STUDIO · motion.js
   Todo el movimiento ligado al scroll y al puntero, sin dependencias.
   Un único bucle rAF escribe variables CSS. Nada de librerías.
   ═══════════════════════════════════════════════════════════════════════ */
(() => {
  'use strict';

  const root = document.documentElement;
  const quiet = matchMedia('(prefers-reduced-motion: reduce)');
  const coarse = matchMedia('(hover: none)');
  const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v);

  /* ─────────────────────────────────────────────────────────────────────
     1 · Reveals. Una sola gramática de entrada para toda la web.
     ───────────────────────────────────────────────────────────────────── */
  const revealables = document.querySelectorAll('[data-reveal]');

  revealables.forEach((el) => {
    const d = Number(el.dataset.revealD || 0);
    if (d) el.style.setProperty('--rd', `${d * 85}ms`);
  });

  if (quiet.matches) {
    revealables.forEach((el) => el.classList.add('is-in'));
  } else {
    const seen = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add('is-in');
          seen.unobserve(e.target);
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.12 }
    );
    revealables.forEach((el) => seen.observe(el));

    // El hero entra solo, sin esperar al scroll.
    requestAnimationFrame(() => {
      document
        .querySelectorAll('.hero [data-reveal]')
        .forEach((el) => el.classList.add('is-in'));
    });
  }

  /* ─────────────────────────────────────────────────────────────────────
     2 · Contadores. Suben al entrar en pantalla, una sola vez.
     ───────────────────────────────────────────────────────────────────── */
  const counters = document.querySelectorAll('[data-count]');

  const runCount = (el) => {
    const target = Number(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    if (!Number.isFinite(target) || quiet.matches || target === 0) {
      el.textContent = target + suffix;
      return;
    }
    const dur = 1100;
    const t0 = performance.now();
    const tick = (now) => {
      const p = clamp((now - t0) / dur);
      // out-expo, la misma curva que el CSS
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if (counters.length) {
    const countObs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          runCount(e.target);
          countObs.unobserve(e.target);
        }
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => countObs.observe(el));
  }

  /* ─────────────────────────────────────────────────────────────────────
     3 · Bucle de scroll. Un solo rAF para todo lo que depende del scroll.
     ───────────────────────────────────────────────────────────────────── */
  const nav = document.getElementById('nav');
  const hero = document.querySelector('.hero');
  const stepsWrap = document.getElementById('steps');
  const stepsLine = stepsWrap?.querySelector('.steps__line i');
  const steps = stepsWrap ? [...stepsWrap.querySelectorAll('.step')] : [];

  const navLinks = [...document.querySelectorAll('.nav__links a')];
  const targets = navLinks
    .map((a) => {
      const el = document.querySelector(a.getAttribute('href'));
      return el ? { a, el } : null;
    })
    .filter(Boolean);

  let queued = false;
  let lastActive = null;

  const frame = () => {
    queued = false;
    // el alto puede llegar a 0 si la pestaña está oculta: nunca dividir por él
    const vh = Math.max(1, innerHeight);
    const y = Math.max(0, scrollY);

    // progreso global del documento (barra del nav + atmósfera)
    const max = Math.max(1, document.body.scrollHeight - vh);
    root.style.setProperty('--scroll', (y / max).toFixed(4));

    // nav pegado
    nav.classList.toggle('is-stuck', y > 12);

    // el hero se aleja mientras la web sube por encima
    if (hero && !quiet.matches) {
      hero.style.setProperty('--hero-out', clamp(y / (vh * 0.85)).toFixed(4));
    }

    // línea del proceso: se rellena a la altura de la mirada
    if (stepsLine) {
      const r = stepsWrap.getBoundingClientRect();
      const eye = vh * 0.55;
      stepsLine.style.setProperty(
        '--fill',
        clamp((eye - r.top) / Math.max(1, r.height)).toFixed(4)
      );
      for (const s of steps) {
        const sr = s.getBoundingClientRect();
        s.classList.toggle('is-live', sr.top < eye && sr.bottom > vh * 0.18);
      }
    }

    // enlace activo del nav: la última sección cuyo inicio ya pasamos
    let active = null;
    for (const t of targets) {
      if (t.el.getBoundingClientRect().top <= vh * 0.35) active = t;
    }
    if (active !== lastActive) {
      navLinks.forEach((a) => a.classList.remove('is-active'));
      if (active) active.a.classList.add('is-active');
      lastActive = active;
    }
  };

  const onScroll = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(frame);
  };

  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll, { passive: true });
  frame();

  /* ─────────────────────────────────────────────────────────────────────
     4 · Escena 3D del hero. Se inclina con el puntero.
     ───────────────────────────────────────────────────────────────────── */
  const stage = document.getElementById('stage');

  if (stage && !quiet.matches && !coarse.matches) {
    let raf = 0;
    const move = (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const mx = (e.clientX / innerWidth - 0.5) * 2;
        const my = (e.clientY / innerHeight - 0.5) * 2;
        stage.style.setProperty('--mx', mx.toFixed(3));
        stage.style.setProperty('--my', my.toFixed(3));
      });
    };
    addEventListener('pointermove', move, { passive: true });
  }

  /* ─────────────────────────────────────────────────────────────────────
     5 · Partículas. Canvas ligero, en pausa cuando no se ve.
     ───────────────────────────────────────────────────────────────────── */
  const makeDust = (canvas, opts) => {
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const dots = [];
    let w = 0;
    let h = 0;
    let dpr = 1;
    let alive = false;
    let raf = 0;
    const pointer = { x: -9999, y: -9999 };

    const size = () => {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = Math.max(1, Math.round(r.width));
      h = Math.max(1, Math.round(r.height));
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const density = innerWidth < 700 ? 26000 : 13000;
      const n = clamp(Math.round((w * h) / density), 14, opts.max);
      dots.length = 0;
      for (let i = 0; i < n; i++) {
        dots.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.16,
          vy: (Math.random() - 0.5) * 0.16,
          r: 0.7 + Math.random() * 1.5
        });
      }
    };

    const draw = () => {
      raf = 0;
      ctx.clearRect(0, 0, w, h);

      for (const d of dots) {
        d.x += d.vx;
        d.y += d.vy;

        // el puntero aparta las partículas: interacción, no decoración
        const dx = d.x - pointer.x;
        const dy = d.y - pointer.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 16900) {
          const f = (1 - Math.sqrt(d2) / 130) * 0.9;
          d.x += dx * 0.02 * f;
          d.y += dy * 0.02 * f;
        }

        if (d.x < -10) d.x = w + 10;
        if (d.x > w + 10) d.x = -10;
        if (d.y < -10) d.y = h + 10;
        if (d.y > h + 10) d.y = -10;

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, 6.283);
        ctx.fillStyle = opts.dot;
        ctx.fill();
      }

      // hilos entre vecinos cercanos, con tope para que salga barato
      ctx.lineWidth = 1;
      for (let i = 0; i < dots.length; i++) {
        let links = 0;
        for (let j = i + 1; j < dots.length && links < 2; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist > 118) continue;
          links++;
          ctx.strokeStyle = opts.line.replace('$a', (1 - dist / 118) * opts.lineMax);
          ctx.beginPath();
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.stroke();
        }
      }

      if (alive) raf = requestAnimationFrame(draw);
    };

    const start = () => {
      if (alive) return;
      alive = true;
      if (!raf) raf = requestAnimationFrame(draw);
    };
    const stop = () => {
      alive = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    size();
    // ResizeObserver y no 'resize': el canvas puede medir 0 si el panel
    // aún no está visible, y así se recupera solo en cuanto lo esté.
    new ResizeObserver(size).observe(canvas);

    const host = canvas.parentElement;
    host.addEventListener(
      'pointermove',
      (e) => {
        const r = canvas.getBoundingClientRect();
        pointer.x = e.clientX - r.left;
        pointer.y = e.clientY - r.top;
      },
      { passive: true }
    );
    host.addEventListener('pointerleave', () => {
      pointer.x = pointer.y = -9999;
    });

    new IntersectionObserver((entries) => {
      entries[0].isIntersecting ? start() : stop();
    }).observe(canvas);

    document.addEventListener('visibilitychange', () => {
      document.hidden ? stop() : start();
    });
  };

  if (!quiet.matches) {
    const heroDust = document.getElementById('dust-hero');
    const ctaDust = document.getElementById('dust-cta');
    // rgba y no oklch: el canvas de Safari antiguo no entiende oklch
    if (heroDust)
      makeDust(heroDust, {
        max: 72,
        dot: 'rgba(31, 71, 224, 0.34)',
        line: 'rgba(31, 71, 224, $a)',
        lineMax: 0.16
      });
    if (ctaDust)
      makeDust(ctaDust, {
        max: 60,
        dot: 'rgba(255, 255, 255, 0.42)',
        line: 'rgba(255, 255, 255, $a)',
        lineMax: 0.24
      });
  }
})();
