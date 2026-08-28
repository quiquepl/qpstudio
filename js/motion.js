/* ═══════════════════════════════════════════════════════════════════════
   PLANELLES STUDIO · motion.js
   Cordilleras tramadas a un bit y el poco movimiento que hay, sin
   dependencias. Nada de desenfoques ni de zooms al hacer scroll.
   ═══════════════════════════════════════════════════════════════════════ */
(() => {
  'use strict';

  const root = document.documentElement;
  const quiet = matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v);

  /* ─────────────────────────────────────────────────────────────────────
     1 · Reveals. Aparecer y subir. Nada más.
     ───────────────────────────────────────────────────────────────────── */
  const revealables = document.querySelectorAll('[data-reveal]');

  revealables.forEach((el) => {
    const d = Number(el.dataset.revealD || 0);
    if (d) el.style.setProperty('--rd', `${d * 80}ms`);
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
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
    );
    revealables.forEach((el) => seen.observe(el));

    requestAnimationFrame(() => {
      document.querySelectorAll('.hero [data-reveal]').forEach((el) => el.classList.add('is-in'));
    });
  }

  /* ─────────────────────────────────────────────────────────────────────
     2 · Contadores
     ───────────────────────────────────────────────────────────────────── */
  const counters = document.querySelectorAll('[data-count]');

  const runCount = (el) => {
    const target = Number(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    if (!Number.isFinite(target) || quiet.matches || target === 0) {
      el.textContent = target + suffix;
      return;
    }
    const t0 = performance.now();
    const tick = (now) => {
      const p = clamp((now - t0) / 1100);
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if (counters.length) {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          runCount(e.target);
          obs.unobserve(e.target);
        }
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => obs.observe(el));
  }

  /* ─────────────────────────────────────────────────────────────────────
     3 · Scroll. Barra de progreso, nav pegado y enlace activo.
         El hero ya no se escala, ni se desenfoca, ni se desvanece.
     ───────────────────────────────────────────────────────────────────── */
  const nav = document.getElementById('nav');
  const navLinks = [...document.querySelectorAll('.nav__links a')];
  const targets = navLinks
    .map((a) => {
      const el = document.querySelector(a.getAttribute('href'));
      return el ? { a, el } : null;
    })
    .filter(Boolean);

  let scrollPx = 0;
  let queued = false;
  let lastActive = null;

  const frame = () => {
    queued = false;
    const vh = Math.max(1, innerHeight);
    const y = Math.max(0, scrollY);
    scrollPx = y;

    const max = Math.max(1, document.body.scrollHeight - vh);
    root.style.setProperty('--scroll', (y / max).toFixed(4));

    nav.classList.toggle('is-stuck', y > 12);

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

  /* ═════════════════════════════════════════════════════════════════════
     4 · Cordilleras tramadas
     ─────────────────────────────────────────────────────────────────────
     El búfer del canvas se dibuja a baja resolución y el CSS lo escala
     con image-rendering: pixelated. Así los puntos salen gruesos y
     limpios, como una impresión a un bit, en vez de un degradado suave.

     Cada capa es una línea de cresta sacada de ruido fbm. Debajo de la
     cresta la tinta decae, y una matriz de Bayer 8x8 decide si cada
     píxel se enciende o no. Eso es el tramado.
     ═════════════════════════════════════════════════════════════════════ */

  // Bayer 8x8 ordenada, normalizada a 0..1
  const BAYER = new Float32Array(
    [
      0, 32, 8, 40, 2, 34, 10, 42,
      48, 16, 56, 24, 50, 18, 58, 26,
      12, 44, 4, 36, 14, 46, 6, 38,
      60, 28, 52, 20, 62, 30, 54, 22,
      3, 35, 11, 43, 1, 33, 9, 41,
      51, 19, 59, 27, 49, 17, 57, 25,
      15, 47, 7, 39, 13, 45, 5, 37,
      63, 31, 55, 23, 61, 29, 53, 21
    ].map((v) => (v + 0.5) / 64)
  );

  const hash = (i, s) => {
    let h = Math.imul(i ^ s, 2246822519);
    h = Math.imul(h ^ (h >>> 13), 3266489917);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
  };
  const noise = (x, s) => {
    const i = Math.floor(x);
    const f = x - i;
    const a = hash(i, s);
    const b = hash(i + 1, s);
    return a + (b - a) * f * f * (3 - 2 * f);
  };
  // Multifractal en cresta: 1 - |2n - 1| al cuadrado. Da picos afilados
  // en vez de lomas redondas, que es lo que hace que parezcan montañas.
  const ridged = (x, s) => {
    let sum = 0;
    let w = 0;
    let amp = 0.5;
    let f = 1;
    for (let o = 0; o < 3; o++) {
      const n = 1 - Math.abs(noise(x * f, s + o * 71) * 2 - 1);
      sum += n * n * amp;
      w += amp;
      amp *= 0.5;
      f *= 2.07;
    }
    return sum / w;
  };

  // De lejos a cerca. base es el valle, amp lo que suben los picos desde
  // ahí, fall la distancia de caída de la tinta en fracción del alto.
  // Nada llega a tinta plena: la trama tiene que respirar.
  const LAYERS = [
    { base: 0.58, amp: 0.48, freq: 0.0052, fall: 0.52, ink: 0.26, speed: 0.008, par: 0.05, seed: 11 },
    { base: 0.74, amp: 0.46, freq: 0.0076, fall: 0.44, ink: 0.38, speed: 0.014, par: 0.08, seed: 47 },
    { base: 0.90, amp: 0.44, freq: 0.0108, fall: 0.36, ink: 0.52, speed: 0.022, par: 0.12, seed: 83 },
    { base: 1.04, amp: 0.42, freq: 0.0150, fall: 0.30, ink: 0.70, speed: 0.033, par: 0.17, seed: 137 }
  ];

  const makeRidges = (canvas, opts) => {
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const SCALE = 0.42; // grosor del punto: más bajo, punto más gordo
    const layers = opts.layers ?? LAYERS.length;
    const cfg = LAYERS.slice(LAYERS.length - layers);

    let W = 0;
    let H = 0;
    let img = null;
    let px = null; // vista de 32 bits sobre el búfer
    let tops = [];
    let decay = []; // tablas de caída, para no llamar a Math.exp en el bucle
    let fade = null; // desvanecido de densidad hacia abajo
    let jitter = null; // ruido fijo contra el bandeado
    let alive = false;
    let raf = 0;
    let flip = 0;

    // color del punto empaquetado en ABGR (little endian)
    const [r, g, b] = opts.rgb;
    const DOT = (255 << 24) | (b << 16) | (g << 8) | r;

    const size = () => {
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(1, Math.round(rect.width * SCALE));
      const h = Math.max(1, Math.round(rect.height * SCALE));
      if (w === W && h === H) return;

      W = w;
      H = h;
      canvas.width = W;
      canvas.height = H;
      img = ctx.createImageData(W, H);
      px = new Uint32Array(img.data.buffer);

      tops = cfg.map(() => new Float32Array(W));

      decay = cfg.map((c) => {
        const fall = Math.max(6, c.fall * H);
        const n = Math.ceil(fall * 4.5);
        const table = new Float32Array(n);
        for (let d = 0; d < n; d++) table[d] = c.ink * Math.exp(-d / fall);
        return table;
      });

      fade = new Float32Array(H);
      for (let y = 0; y < H; y++) {
        const p = y / H;
        // solo un cierre corto abajo, para que no quede un corte seco
        fade[y] = p < 0.86 ? 1 : Math.max(0, 1 - (p - 0.86) / 0.14) ** 1.3;
      }

      // ruido fijo por píxel: rompe las bandas del tramado ordenado sin
      // parpadear, porque no depende del tiempo
      jitter = new Float32Array(W * H);
      for (let i = 0; i < jitter.length; i++) jitter[i] = (hash(i, 9173) - 0.5) * 0.075;
    };

    const draw = (t) => {
      const par = scrollPx * 0.0016;

      for (let l = 0; l < cfg.length; l++) {
        const c = cfg[l];
        const arr = tops[l];
        const off = t * c.speed + par * c.par * 100;
        for (let x = 0; x < W; x++) {
          arr[x] = (c.base - ridged(x * c.freq + off, c.seed) * c.amp) * H;
        }
      }

      px.fill(0);

      const last = cfg.length - 1;
      for (let x = 0; x < W; x++) {
        // arrancamos en la cresta más alta de esta columna: el cielo se salta
        let start = H;
        for (let l = 0; l <= last; l++) if (tops[l][x] < start) start = tops[l][x];
        let y = start < 0 ? 0 : Math.floor(start);

        for (; y < H; y++) {
          let v = 0;
          // la capa más cercana que ya ha empezado tapa a las de detrás
          for (let l = last; l >= 0; l--) {
            const top = tops[l][x];
            if (y < top) continue;
            const d = (y - top) | 0;
            const table = decay[l];
            v = d < table.length ? table[d] : 0;
            break;
          }
          if (v <= 0.004) continue;
          const i = y * W + x;
          v = v * fade[y] + jitter[i];
          if (v > BAYER[((y & 7) << 3) | (x & 7)]) px[i] = DOT;
        }
      }

      ctx.putImageData(img, 0, 0);
    };

    const loop = (now) => {
      raf = 0;
      // a la mitad de fotogramas: es un movimiento lento, 30 fps sobran
      // y el coste del tramado se parte por dos
      if ((flip ^= 1)) draw(now * 0.001);
      if (alive) raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (alive || quiet.matches) return;
      alive = true;
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      alive = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    const refresh = () => {
      size();
      if (!alive) draw(performance.now() * 0.001);
    };

    size();
    draw(0);

    new ResizeObserver(refresh).observe(canvas);

    new IntersectionObserver((entries) => {
      entries[0].isIntersecting ? start() : stop();
    }).observe(canvas);

    document.addEventListener('visibilitychange', () => {
      document.hidden ? stop() : start();
    });
  };

  const heroRidges = document.getElementById('ridges-hero');
  const ctaRidges = document.getElementById('ridges-cta');
  const small = innerWidth < 620;

  // tinta sobre papel
  if (heroRidges) makeRidges(heroRidges, { rgb: [34, 32, 29], layers: small ? 3 : 4 });
  // el negativo: papel sobre tinta
  if (ctaRidges) makeRidges(ctaRidges, { rgb: [238, 236, 232], layers: small ? 3 : 4 });
})();
