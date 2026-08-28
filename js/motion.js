/* ═══════════════════════════════════════════════════════════════════════
   QP STUDIO · motion.js
   Cordillera tramada, cintas 3D, webs en órbita y el ordenador final.
   Sin dependencias. Un rAF por pieza y todas paradas fuera de pantalla.
   ═══════════════════════════════════════════════════════════════════════ */
(() => {
  'use strict';

  const root = document.documentElement;
  const quiet = matchMedia('(prefers-reduced-motion: reduce)');
  const coarse = matchMedia('(hover: none)');
  const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v);

  /* ── 1 · Reveals ───────────────────────────────────────────────────── */
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

  /* ── 2 · Scroll: progreso, nav y el ordenador final ────────────────── */
  const nav = document.getElementById('nav');
  const navLinks = [...document.querySelectorAll('.nav__links a')];
  const targets = navLinks
    .map((a) => {
      const el = document.querySelector(a.getAttribute('href'));
      return el ? { a, el } : null;
    })
    .filter(Boolean);

  const finale = document.getElementById('hablemos');
  const rail = finale?.querySelector('.finale__rail');
  const panel = finale?.querySelector('.finale__panel');
  const use3d = finale && rail && !quiet.matches;
  // el HTML arranca con .no-3d puesto: si no hay JS o hay movimiento reducido,
  // el formulario se ve suelto y legible en vez de esconderse tras el raíl
  if (use3d) root.classList.remove("no-3d");

  let scrollPx = 0;
  let queued = false;
  let lastActive = null;
  let panelLive = false;

  const frame = () => {
    queued = false;
    const vh = Math.max(1, innerHeight);
    const y = Math.max(0, scrollY);
    scrollPx = y;

    root.style.setProperty('--scroll', (y / Math.max(1, document.body.scrollHeight - vh)).toFixed(4));
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

    if (use3d) {
      const r = rail.getBoundingClientRect();
      // fuera de pantalla no hay nada que calcular
      if (r.bottom < -200 || r.top > vh + 200) return;
      const travel = Math.max(1, r.height - vh);
      const p = clamp(-r.top / travel);

      // al mínimo movimiento la tapa se levanta, al siguiente se entra en la
      // pantalla, y a partir de ahí el contacto se queda fijo
      finale.style.setProperty('--lid', clamp(p / 0.16).toFixed(3));
      finale.style.setProperty('--zoom', clamp((p - 0.16) / 0.34).toFixed(3));
      const pan = clamp((p - 0.38) / 0.16);
      finale.style.setProperty('--panel', pan.toFixed(3));

      const live = pan > 0.8;
      if (live !== panelLive) {
        panel.classList.toggle('is-live', live);
        panelLive = live;
      }
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

  /* ── 3 · Puntero: solo inclina la maqueta del editor ───────────────── */
  if (!quiet.matches && !coarse.matches) {
    let raf = 0;
    addEventListener(
      'pointermove',
      (e) => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          raf = 0;
          root.style.setProperty('--mx', ((e.clientX / innerWidth - 0.5) * 2).toFixed(3));
          root.style.setProperty('--my', ((e.clientY / innerHeight - 0.5) * 2).toFixed(3));
        });
      },
      { passive: true }
    );
  }

  /* ═══ 4 · Webs en órbita ══════════════════════════════════════════════
     Giran solas, siempre, sin tocar el ratón. También en móvil, con el
     anillo más pequeño y las tarjetas más chicas.

     Un solo transform por tarjeta y fotograma. Las que van por abajo
     están "delante": más grandes, más opacas y por encima del texto. Las
     de arriba pasan por detrás.
     ═══════════════════════════════════════════════════════════════════ */
  const orbitSec = document.getElementById('trabajo');
  const field = document.getElementById('orbit-field');
  const svg = document.getElementById('orbit-links');

  if (orbitSec && field && !quiet.matches) {
    const cards = [...field.querySelectorAll('.wcard')];
    const core = field.querySelector('.orbit__core');
    const n = cards.length;

    field.classList.add('is-orbiting');
    field.appendChild(svg); // dentro del campo: coordenadas locales

    const ns = 'http://www.w3.org/2000/svg';
    const lines = cards.map(() => {
      const l = document.createElementNS(ns, 'line');
      svg.appendChild(l);
      return l;
    });

    let W = 0, H = 0, cw = 0, rx = 0, ry = 0, cx = 0, cy = 0;
    const ch = new Float64Array(n);
    let alive = false, raf = 0;

    const measure = () => {
      W = field.clientWidth;
      const small = W < 760;
      cw = small ? Math.max(84, Math.round(W * 0.24)) : Math.round(Math.min(186, W * 0.155));
      H = small ? Math.round(Math.min(560, W * 1.32)) : Math.round(Math.min(760, W * 0.62));

      field.style.setProperty('--cw', cw + 'px');
      field.style.setProperty('--field-h', H + 'px');

      // el anillo se sale un poco por los lados a propósito: llena el borde
      rx = small ? W * 0.44 : W * 0.375;
      ry = H * 0.36;
      cx = W / 2;
      cy = H / 2;

      svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      for (let i = 0; i < n; i++) ch[i] = cards[i].offsetHeight;
    };

    const step = (now) => {
      raf = 0;
      const t = now * 0.00007; // vuelta completa en ~90 s
      for (let i = 0; i < n; i++) {
        const a = t + (i / n) * 6.2831853;
        const s = Math.sin(a);
        const depth = (s + 1) / 2;
        const x = cx + rx * Math.cos(a) - cw / 2;
        const y = cy + ry * s - ch[i] / 2;
        const el = cards[i];
        el.style.transform =
          `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${(0.72 + depth * 0.36).toFixed(3)})`;
        el.style.opacity = (0.4 + depth * 0.6).toFixed(2);
        el.style.zIndex = depth > 0.52 ? 7 : 2;

        const l = lines[i];
        l.setAttribute('x1', cx.toFixed(0));
        l.setAttribute('y1', cy.toFixed(0));
        l.setAttribute('x2', (x + cw / 2).toFixed(1));
        l.setAttribute('y2', (y + ch[i] / 2).toFixed(1));
      }
      if (alive) raf = requestAnimationFrame(step);
    };

    measure();
    step(performance.now());

    new ResizeObserver(() => {
      measure();
      if (!alive) step(performance.now());
    }).observe(field);

    new IntersectionObserver(
      (e) => {
        alive = e[0].isIntersecting;
        if (alive && !raf) raf = requestAnimationFrame(step);
      },
      { rootMargin: '120px' }
    ).observe(orbitSec);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        alive = false;
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
      } else if (!raf) {
        raf = requestAnimationFrame(step);
      }
    });

    // el núcleo, encima de las que pasan por detrás
    core.style.zIndex = 5;
  }

  /* ═══ 5 · Cordillera tramada a un bit (hero) ═════════════════════════ */

  const BAYER = new Float32Array(
    [
      0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26,
      12, 44, 4, 36, 14, 46, 6, 38, 60, 28, 52, 20, 62, 30, 54, 22,
      3, 35, 11, 43, 1, 33, 9, 41, 51, 19, 59, 27, 49, 17, 57, 25,
      15, 47, 7, 39, 13, 45, 5, 37, 63, 31, 55, 23, 61, 29, 53, 21
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
    return a + (hash(i + 1, s) - a) * f * f * (3 - 2 * f);
  };
  const ridged = (x, s) => {
    let sum = 0, w = 0, amp = 0.5, f = 1;
    for (let o = 0; o < 3; o++) {
      const nz = 1 - Math.abs(noise(x * f, s + o * 71) * 2 - 1);
      sum += nz * nz * amp;
      w += amp;
      amp *= 0.5;
      f *= 2.07;
    }
    return sum / w;
  };

  const LAYERS = [
    { base: 0.58, amp: 0.48, freq: 0.0052, fall: 0.52, ink: 0.26, speed: 0.008, par: 0.06, seed: 11 },
    { base: 0.74, amp: 0.46, freq: 0.0076, fall: 0.44, ink: 0.38, speed: 0.014, par: 0.11, seed: 47 },
    { base: 0.90, amp: 0.44, freq: 0.0108, fall: 0.36, ink: 0.52, speed: 0.022, par: 0.17, seed: 83 },
    { base: 1.04, amp: 0.42, freq: 0.0150, fall: 0.30, ink: 0.70, speed: 0.033, par: 0.24, seed: 137 }
  ];

  const makeRidges = (canvas, opts) => {
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const SCALE = 0.42;
    const cfg = LAYERS.slice(LAYERS.length - opts.layers);
    let W = 0, H = 0, img = null, px = null;
    let tops = [], decay = [], fade = null, jitter = null;
    let alive = false, raf = 0, flip = 0;

    const [r, g, b] = opts.rgb;
    const DOT = (255 << 24) | (b << 16) | (g << 8) | r;

    const size = () => {
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(1, Math.round(rect.width * SCALE));
      const h = Math.max(1, Math.round(rect.height * SCALE));
      if (w === W && h === H) return;
      W = w; H = h;
      canvas.width = W; canvas.height = H;
      img = ctx.createImageData(W, H);
      px = new Uint32Array(img.data.buffer);
      tops = cfg.map(() => new Float32Array(W));
      decay = cfg.map((c) => {
        const fall = Math.max(6, c.fall * H);
        const table = new Float32Array(Math.ceil(fall * 4.5));
        for (let d = 0; d < table.length; d++) table[d] = c.ink * Math.exp(-d / fall);
        return table;
      });
      fade = new Float32Array(H);
      for (let y = 0; y < H; y++) {
        const p = y / H;
        fade[y] = p < 0.86 ? 1 : Math.max(0, 1 - (p - 0.86) / 0.14) ** 1.3;
      }
      jitter = new Float32Array(W * H);
      for (let i = 0; i < jitter.length; i++) jitter[i] = (hash(i, 9173) - 0.5) * 0.075;
    };

    const draw = (t) => {
      for (let l = 0; l < cfg.length; l++) {
        const c = cfg[l];
        const arr = tops[l];
        // el scroll desplaza cada capa a distinta velocidad: parallax real
        const off = t * c.speed + scrollPx * c.par * 0.004;
        for (let x = 0; x < W; x++) arr[x] = (c.base - ridged(x * c.freq + off, c.seed) * c.amp) * H;
      }
      px.fill(0);
      const last = cfg.length - 1;
      for (let x = 0; x < W; x++) {
        let start = H;
        for (let l = 0; l <= last; l++) if (tops[l][x] < start) start = tops[l][x];
        for (let y = start < 0 ? 0 : Math.floor(start); y < H; y++) {
          let v = 0;
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

    size();
    draw(0);
    new ResizeObserver(() => { size(); if (!alive) draw(performance.now() * 0.001); }).observe(canvas);
    new IntersectionObserver((e) => (e[0].isIntersecting ? start() : stop())).observe(canvas);
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  };

  const heroRidges = document.getElementById('ridges-hero');
  if (heroRidges) makeRidges(heroRidges, { rgb: [30, 32, 40], layers: innerWidth < 620 ? 3 : 4 });

    /* ═══ 6 · Cintas 3D de fondo ═════════════════════════════════════════ */

  const makeRibbons = (canvas) => {
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const BANDS = 20;
    let W = 0, H = 0, dpr = 1;
    let alive = false, raf = 0, flip = 0;

    const size = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(devicePixelRatio || 1, 1.5);
      W = Math.max(1, Math.round(rect.width));
      H = Math.max(1, Math.round(rect.height));
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (t) => {
      ctx.clearRect(0, 0, W, H);
      ctx.lineCap = 'round';
      const lw = (H / BANDS) * 1.75;

      for (let i = 0; i < BANDS; i++) {
        const f = i / (BANDS - 1);
        const y0 = H * (-0.12 + f * 1.24);
        const amp = H * (0.045 + f * 0.085);
        const freq = 1.2 + f * 0.55;
        const ph = t * (0.10 + f * 0.055) + i * 0.34;

        ctx.beginPath();
        for (let x = -24; x <= W + 24; x += 18) {
          const u = x / W;
          const y = y0 + Math.sin(u * freq * 6.283 + ph) * amp + Math.sin(u * freq * 3.1 - ph * 0.7) * amp * 0.42;
          if (x === -24) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        const c = 0.5 + 0.42 * Math.sin(ph * 0.55 + f * 1.7);
        const grad = ctx.createLinearGradient(0, 0, W, 0);
        const stop = (p, col) => grad.addColorStop(clamp(p), col);
        stop(0, 'rgba(16, 22, 38, 0.9)');
        stop(c - 0.3, 'rgba(24, 34, 60, 0.9)');
        stop(c - 0.09, `rgba(58, 84, 148, ${0.5 + f * 0.35})`);
        stop(c, `rgba(96, 132, 210, ${0.55 + f * 0.35})`);
        stop(c + 0.09, `rgba(58, 84, 148, ${0.5 + f * 0.35})`);
        stop(c + 0.3, 'rgba(24, 34, 60, 0.9)');
        stop(1, 'rgba(16, 22, 38, 0.9)');

        ctx.strokeStyle = grad;
        ctx.lineWidth = lw;
        ctx.stroke();
      }
    };

    const loop = (now) => {
      raf = 0;
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

    size();
    draw(0);
    new ResizeObserver(() => { size(); if (!alive) draw(performance.now() * 0.001); }).observe(canvas);
    new IntersectionObserver((e) => (e[0].isIntersecting ? start() : stop())).observe(canvas);
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  };

  ['ribbons-serv', 'ribbons-tuya'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) makeRibbons(el);
  });
})();
