/* POST /api/contacto — guarda un mensaje del formulario.

   Endpoint público, así que asume que le van a llegar cosas raras:
   valida y recorta todo, y limita cuántos mensajes seguidos acepta desde el
   mismo sitio. */
import { createHmac } from 'node:crypto';
import { consulta } from './_db.js';
import { ipDe, json, leerJson, metodoNoPermitido } from './_http.js';

const LIMITES = { nombre: 120, email: 200, mensaje: 4000, origen: 200 };
const MAX_POR_HORA = 5;

const recorta = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

// Validación deliberadamente laxa: el objetivo es descartar lo que
// evidentemente no es un correo, no rechazar direcciones válidas raras.
const pareceEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

export default async function handler(req, res) {
  if (req.method !== 'POST') return metodoNoPermitido(res, ['POST']);

  const cuerpo = await leerJson(req);
  if (!cuerpo) return json(res, 400, { error: 'No he podido leer el formulario.' });

  const nombre = recorta(cuerpo.nombre, LIMITES.nombre);
  const email = recorta(cuerpo.email, LIMITES.email);
  const mensaje = recorta(cuerpo.mensaje, LIMITES.mensaje);
  const origen = recorta(cuerpo.origen, LIMITES.origen) || null;

  if (nombre.length < 2) return json(res, 400, { error: 'Escribe tu nombre.', campo: 'nombre' });
  if (!pareceEmail(email)) return json(res, 400, { error: 'Revisa el correo.', campo: 'email' });
  if (mensaje.length < 10)
    return json(res, 400, { error: 'Cuéntanos un poco más.', campo: 'mensaje' });

  // La IP no se guarda: se guarda un hash con un secreto del servidor, que
  // sirve para contar envíos seguidos y no permite volver a la dirección.
  const semilla = process.env.SESION_SECRETO || 'sin-secreto';
  const ipHash = createHmac('sha256', semilla).update(ipDe(req)).digest('base64url').slice(0, 32);

  try {
    const { rows } = await consulta(
      `select count(*)::int as n from mensajes
        where ip_hash = $1 and creado_en > now() - interval '1 hour'`,
      [ipHash]
    );
    if (rows[0].n >= MAX_POR_HORA) {
      return json(res, 429, {
        error: 'Has enviado varios mensajes seguidos. Prueba dentro de un rato o escríbenos por correo.'
      });
    }

    await consulta(
      `insert into mensajes (nombre, email, mensaje, origen, ip_hash)
       values ($1, $2, $3, $4, $5)`,
      [nombre, email, mensaje, origen, ipHash]
    );

    return json(res, 200, { ok: true });
  } catch (e) {
    // El detalle va al log del servidor; al visitante solo un mensaje útil.
    console.error('[contacto] fallo al guardar:', e);
    return json(res, 500, {
      error: 'No hemos podido guardar el mensaje. Escríbenos a qpstudiocontacto@gmail.com y lo vemos.'
    });
  }
}
