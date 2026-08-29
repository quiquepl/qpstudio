/* POST /api/visita — anota una visita. Público y anónimo.

   Lo llama un trozo mínimo de JavaScript al cargar cada página. No pone
   cookies, no usa servicios de terceros y no guarda nada que identifique a
   nadie: solo la ruta, de dónde venía y un hash que cambia cada día.

   Responde 204 sin cuerpo y sin esperar a la base de datos cuando puede: al
   visitante no le importa el resultado y no debe pagar la espera. */
import { createHmac } from 'node:crypto';
import { consulta } from './_db.js';
import { ipDe, json, leerJson, metodoNoPermitido } from './_http.js';

const RUTAS_VALIDAS = /^\/[a-z0-9\-/]{0,60}$/;

export default async function handler(req, res) {
  if (req.method !== 'POST') return metodoNoPermitido(res, ['POST']);

  const cuerpo = await leerJson(req, 2048);
  let ruta = typeof cuerpo?.ruta === 'string' ? cuerpo.ruta.split('?')[0].slice(0, 60) : '/';
  if (!RUTAS_VALIDAS.test(ruta)) ruta = '/';

  // El panel es privado: sus visitas no son tráfico y ensucian los números.
  if (ruta.startsWith('/admin')) {
    res.writeHead(204).end();
    return;
  }

  // Del referente solo interesa el dominio, no la dirección completa: la
  // URL entera puede llevar términos de búsqueda o identificadores.
  let referente = null;
  if (typeof cuerpo?.referente === 'string' && cuerpo.referente) {
    try {
      const host = new URL(cuerpo.referente).hostname.replace(/^www\./, '');
      if (host && !/qpstudio\.es$/.test(host)) referente = host.slice(0, 80);
    } catch {
      /* referente ilegible: se ignora */
    }
  }

  const secreto = process.env.SESION_SECRETO || 'sin-secreto';
  const hoy = new Date().toISOString().slice(0, 10);
  const visitante = createHmac('sha256', secreto)
    .update(`${hoy}|${ipDe(req)}|${req.headers['user-agent'] || ''}`)
    .digest('base64url')
    .slice(0, 24);

  try {
    await consulta('insert into visitas (ruta, referente, visitante) values ($1, $2, $3)', [
      ruta,
      referente,
      visitante
    ]);
  } catch (e) {
    // Que falle la analítica no es motivo para molestar a nadie.
    console.error('[visita] no anotada:', e.message);
  }

  res.writeHead(204).end();
}
