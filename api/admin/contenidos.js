/* /api/admin/contenidos — los textos que el panel puede cambiar.

   GET  devuelve los cambios guardados y cuándo se publicó por última vez
   PUT  guarda un lote de cambios

   Solo se guardan los campos DISTINTOS del original: si el panel manda un
   valor igual al que ya trae el HTML, se borra la fila. Así la tabla contiene
   únicamente lo que de verdad se ha tocado, y volver atrás es dejar el campo
   como estaba. */
import { consulta } from '../_db.js';
import { json, leerJson, metodoNoPermitido } from '../_http.js';
import { sesionDe } from '../_sesion.js';

const LIMITE_VALOR = 4000;
const LIMITE_CAMPOS = 200;

export default async function handler(req, res) {
  const usuario = sesionDe(req);
  if (!usuario) return json(res, 401, { error: 'Necesitas iniciar sesión.' });

  try {
    if (req.method === 'GET') {
      const { rows } = await consulta('select clave, valor, actualizado from contenidos');
      const ultima = await consulta(
        'select creado_en from publicaciones order by creado_en desc limit 1'
      );

      const cambios = {};
      let masReciente = null;
      for (const r of rows) {
        cambios[r.clave] = r.valor;
        if (!masReciente || r.actualizado > masReciente) masReciente = r.actualizado;
      }

      const publicado = ultima.rows[0]?.creado_en ?? null;
      return json(res, 200, {
        cambios,
        guardado: masReciente,
        publicado,
        // Si se ha guardado algo después de la última publicación, la web
        // todavía no lo refleja y el panel debe avisarlo.
        pendiente: Boolean(masReciente && (!publicado || masReciente > publicado))
      });
    }

    if (req.method === 'PUT') {
      const cuerpo = await leerJson(req, 512 * 1024);
      const cambios = cuerpo?.cambios;
      if (!cambios || typeof cambios !== 'object')
        return json(res, 400, { error: 'No he recibido ningún cambio.' });

      const claves = Object.keys(cambios);
      if (claves.length > LIMITE_CAMPOS)
        return json(res, 400, { error: 'Demasiados campos de una vez.' });

      let guardados = 0;
      let borrados = 0;

      for (const clave of claves) {
        if (!/^[a-z0-9.]{1,40}$/.test(clave)) continue;
        const entrada = cambios[clave];
        const valor = typeof entrada?.valor === 'string' ? entrada.valor.trim() : null;
        const original = typeof entrada?.original === 'string' ? entrada.original.trim() : '';

        if (valor === null || valor === '' || valor === original) {
          const { rowCount } = await consulta('delete from contenidos where clave = $1', [clave]);
          borrados += rowCount;
          continue;
        }

        await consulta(
          `insert into contenidos (clave, valor, actualizado) values ($1, $2, now())
           on conflict (clave) do update
             set valor = excluded.valor, actualizado = now()`,
          [clave, valor.slice(0, LIMITE_VALOR)]
        );
        guardados++;
      }

      return json(res, 200, { ok: true, guardados, borrados });
    }

    return metodoNoPermitido(res, ['GET', 'PUT']);
  } catch (e) {
    console.error('[contenidos] fallo:', e);
    return json(res, 500, { error: 'No he podido guardar los textos.' });
  }
}
