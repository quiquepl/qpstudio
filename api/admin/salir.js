/* POST /api/admin/salir — cierra la sesión borrando la cookie. */
import { json, metodoNoPermitido } from '../_http.js';
import { cookieDeCierre, esSeguro } from '../_sesion.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return metodoNoPermitido(res, ['POST']);
  res.setHeader('Set-Cookie', cookieDeCierre({ seguro: esSeguro(req) }));
  return json(res, 200, { ok: true });
}
