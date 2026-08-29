/* GET /api/admin/sesion — ¿hay sesión abierta?

   El panel lo consulta al cargar para decidir si pide credenciales o entra
   directo. Nunca devuelve datos: solo si la cookie vale. */
import { json, metodoNoPermitido } from '../_http.js';
import { sesionDe } from '../_sesion.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return metodoNoPermitido(res, ['GET']);
  const usuario = sesionDe(req);
  return json(res, 200, usuario ? { activa: true, usuario } : { activa: false });
}
