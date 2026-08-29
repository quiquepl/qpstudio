/* /api/admin/mensajes — bandeja del panel. Requiere sesión.

   GET    lista los mensajes (paginado)
   PATCH  marca uno como leído o no leído
   DELETE borra uno

   Devuelve datos personales, así que lo primero de todo es comprobar la
   sesión. Sin cookie válida, 401 y no se toca la base de datos. */
import { consulta } from '../_db.js';
import { json, leerJson, metodoNoPermitido } from '../_http.js';
import { sesionDe } from '../_sesion.js';

const POR_PAGINA = 50;

export default async function handler(req, res) {
  if (!sesionDe(req)) return json(res, 401, { error: 'Necesitas iniciar sesión.' });

  try {
    if (req.method === 'GET') {
      const url = new URL(req.url, 'http://x');
      const pagina = Math.max(1, Number(url.searchParams.get('pagina')) || 1);

      const { rows } = await consulta(
        `select id, nombre, email, mensaje, origen, leido, creado_en
           from mensajes
          order by creado_en desc
          limit $1 offset $2`,
        [POR_PAGINA, (pagina - 1) * POR_PAGINA]
      );
      const totales = await consulta(
        `select count(*)::int as total,
                count(*) filter (where not leido)::int as sin_leer
           from mensajes`
      );

      return json(res, 200, {
        mensajes: rows,
        total: totales.rows[0].total,
        sinLeer: totales.rows[0].sin_leer,
        pagina,
        porPagina: POR_PAGINA
      });
    }

    if (req.method === 'PATCH') {
      const cuerpo = await leerJson(req);
      const id = Number(cuerpo?.id);
      if (!Number.isInteger(id)) return json(res, 400, { error: 'Falta el identificador.' });

      const { rows } = await consulta(
        'update mensajes set leido = $2 where id = $1 returning id, leido',
        [id, Boolean(cuerpo.leido)]
      );
      if (!rows.length) return json(res, 404, { error: 'Ese mensaje ya no existe.' });
      return json(res, 200, { ok: true, ...rows[0] });
    }

    if (req.method === 'DELETE') {
      const cuerpo = await leerJson(req);
      const id = Number(cuerpo?.id);
      if (!Number.isInteger(id)) return json(res, 400, { error: 'Falta el identificador.' });

      const { rowCount } = await consulta('delete from mensajes where id = $1', [id]);
      if (!rowCount) return json(res, 404, { error: 'Ese mensaje ya no existe.' });
      return json(res, 200, { ok: true });
    }

    return metodoNoPermitido(res, ['GET', 'PATCH', 'DELETE']);
  } catch (e) {
    console.error('[mensajes] fallo:', e);
    return json(res, 500, { error: 'No he podido consultar los mensajes.' });
  }
}
