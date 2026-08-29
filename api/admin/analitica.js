/* GET /api/admin/analitica — los números del panel. Requiere sesión.

   Parámetro ?dias=7|30|90 (30 por defecto).

   Todo sale de una sola tabla con cuatro consultas pequeñas y apoyadas en
   índices. Se pide en paralelo porque son independientes: cuatro idas y
   vueltas seguidas a la base de datos harían el panel notablemente más lento
   sin ganar nada. */
import { consulta } from '../_db.js';
import { json, metodoNoPermitido } from '../_http.js';
import { sesionDe } from '../_sesion.js';

export default async function handler(req, res) {
  if (!sesionDe(req)) return json(res, 401, { error: 'Necesitas iniciar sesión.' });
  if (req.method !== 'GET') return metodoNoPermitido(res, ['GET']);

  const url = new URL(req.url, 'http://x');
  const pedidos = Number(url.searchParams.get('dias'));
  const dias = [7, 30, 90].includes(pedidos) ? pedidos : 30;

  try {
    const [resumen, porDia, porRuta, porReferente] = await Promise.all([
      consulta(
        `select
           count(*)::int                                          as paginas,
           count(distinct visitante)::int                         as visitantes,
           count(*) filter (where dia = current_date)::int         as paginas_hoy,
           count(distinct visitante) filter (where dia = current_date)::int as visitantes_hoy
         from visitas
         where dia > current_date - $1::int`,
        [dias]
      ),
      consulta(
        `select dia,
                count(*)::int                  as paginas,
                count(distinct visitante)::int as visitantes
           from visitas
          where dia > current_date - $1::int
          group by dia order by dia`,
        [dias]
      ),
      consulta(
        `select ruta,
                count(*)::int                  as paginas,
                count(distinct visitante)::int as visitantes
           from visitas
          where dia > current_date - $1::int
          group by ruta order by paginas desc limit 12`,
        [dias]
      ),
      consulta(
        `select referente, count(*)::int as paginas
           from visitas
          where dia > current_date - $1::int and referente is not null
          group by referente order by paginas desc limit 8`,
        [dias]
      )
    ]);

    return json(res, 200, {
      dias,
      ...resumen.rows[0],
      porDia: porDia.rows,
      porRuta: porRuta.rows,
      porReferente: porReferente.rows
    });
  } catch (e) {
    console.error('[analitica] fallo:', e);
    return json(res, 500, { error: 'No he podido consultar la analítica.' });
  }
}
