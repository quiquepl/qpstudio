/* POST /api/admin/publicar — lanza un despliegue para que los textos
   guardados pasen a la web.

   Los textos se guardan al instante en la base de datos, pero la web es
   estática: el HTML lleva el texto ya escrito dentro. Eso es lo que la hace
   rápida y lo que permite que Google lea el contenido definitivo sin
   ejecutar JavaScript. El precio es que hay que reconstruirla.

   Reconstruir se pide a un Deploy Hook de Vercel, cuya URL vive en
   VERCEL_DEPLOY_HOOK. Si no está configurada, se dice claramente en vez de
   fingir que ha funcionado. */
import { consulta } from '../_db.js';
import { json, metodoNoPermitido } from '../_http.js';
import { sesionDe } from '../_sesion.js';

export default async function handler(req, res) {
  const usuario = sesionDe(req);
  if (!usuario) return json(res, 401, { error: 'Necesitas iniciar sesión.' });
  if (req.method !== 'POST') return metodoNoPermitido(res, ['POST']);

  const hook = process.env.VERCEL_DEPLOY_HOOK;
  if (!hook) {
    return json(res, 501, {
      error:
        'Falta configurar el despliegue automático. Los textos están guardados y saldrán en la próxima publicación.'
    });
  }

  try {
    const r = await fetch(hook, { method: 'POST' });
    if (!r.ok) throw new Error(`Vercel respondió ${r.status}`);

    await consulta('insert into publicaciones (usuario) values ($1)', [usuario]);

    return json(res, 200, {
      ok: true,
      mensaje: 'Publicando. La web se actualiza en un par de minutos.'
    });
  } catch (e) {
    console.error('[publicar] fallo:', e);
    return json(res, 502, { error: 'No he podido lanzar la publicación. Inténtalo otra vez.' });
  }
}
