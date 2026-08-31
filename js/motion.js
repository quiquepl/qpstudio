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
  // Solo los enlaces internos (#algo) son selectores válidos. Con las URLs
  // limpias el nav apunta a /servicios y compañía, y pasarle eso a
  // querySelector lanza una excepción que se llevaba por delante todo lo
  // que viene después: ni órbita, ni montañas, ni cintas de fondo.
  const targets = navLinks
    .map((a) => {
      const href = a.getAttribute('href') || '';
      if (href.length < 2 || href[0] !== '#') return null;
      const el = document.querySelector(href);
      return el ? { a, el } : null;
    })
    .filter(Boolean);

  // el final ya no lleva ordenador: es una sección normal
  root.classList.remove("no-3d");

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

  /* ═══ 4 · El mosaico de maquetas no necesita JavaScript ═════════════
     Antes aquí se calculaba el radio del anillo de la órbita. El
     mosaico son cuatro columnas con una animación CSS cada una, así
     que se lleva solo.
     ═══════════════════════════════════════════════════════════════ */

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

  // Cada pieza va aislada: si una falla, las demás siguen. Un solo error
  // sin capturar dejó la web publicada sin órbita, sin montañas y sin
  // cintas, porque tumbaba el archivo entero.
  try {
    const heroRidges = document.getElementById('ridges-hero');
    if (heroRidges) makeRidges(heroRidges, { rgb: [30, 32, 40], layers: innerWidth < 620 ? 3 : 4 });
  } catch (e) {
    console.warn('cordillera:', e);
  }

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
        const ph = t * (0.19 + f * 0.1) + i * 0.34;

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
        stop(c - 0.3, 'rgba(20, 27, 46, 0.9)');
        stop(c - 0.09, `rgba(46, 62, 104, ${0.34 + f * 0.2})`);
        stop(c, `rgba(64, 88, 146, ${0.38 + f * 0.22})`);
        stop(c + 0.09, `rgba(46, 62, 104, ${0.34 + f * 0.2})`);
        stop(c + 0.3, 'rgba(20, 27, 46, 0.9)');
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

  try {
    ['ribbons-serv', 'ribbons-tuya'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) makeRibbons(el);
    });
  } catch (e) {
    console.warn('cintas:', e);
  }

  /* ── Fondos que esperan a hacer falta ────────────────────────────── */

  /* Las fotos de las tarjetas son fondos CSS, y un fondo CSS no admite
     loading="lazy": el navegador se los descarga todos nada más leer la
     hoja de estilos, aunque estén tres pantallas más abajo. Once fotos
     compitiendo por el ancho de banda con lo que sí se está viendo retrasan
     el primer pintado, y eso Google lo mide.

     Así que la URL viaja en data-img y solo se convierte en fondo cuando la
     tarjeta se acerca. El margen de 400px hace que llegue cargada antes de
     entrar en pantalla, así que no se ve aparecer. */
  try {
    const conFoto = document.querySelectorAll('[data-img]');
    if (conFoto.length) {
      const cargar = (el) => {
        el.style.setProperty('--img', `url("${el.dataset.img}")`);
        el.removeAttribute('data-img');
      };

      if (!('IntersectionObserver' in window)) {
        conFoto.forEach(cargar);
      } else {
        const ojo = new IntersectionObserver(
          (entradas, obs) => {
            entradas.forEach((e) => {
              if (!e.isIntersecting) return;
              cargar(e.target);
              obs.unobserve(e.target);
            });
          },
          { rootMargin: '400px' }
        );
        conFoto.forEach((el) => ojo.observe(el));

        /* Red de seguridad. El observador solo avisa cuando la página se
           pinta de verdad; si el navegador la tiene congelada por lo que
           sea, las tarjetas se quedarían sin foto para siempre, que es
           mucho peor que cargarlas tarde.

           Esto espera a que la carga haya terminado y a un hueco de
           inactividad, así que ya se ha medido el primer pintado y no
           quita rendimiento a nada. */
        const rescatar = () => {
          const tarde = () => document.querySelectorAll('[data-img]').forEach(cargar);
          if ('requestIdleCallback' in window) requestIdleCallback(tarde, { timeout: 4000 });
          else setTimeout(tarde, 3000);
        };
        if (document.readyState === 'complete') rescatar();
        else addEventListener('load', rescatar, { once: true });
      }
    }
  } catch (e) {
    console.warn('fondos:', e);
  }
})();
