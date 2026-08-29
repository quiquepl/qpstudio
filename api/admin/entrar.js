/* POST /api/admin/entrar — comprueba las credenciales y abre sesión.

   Responde igual de despacio y con el mismo texto tanto si falla el usuario
   como si falla la contraseña, para no confirmar cuál de los dos existe. */
import { json, leerJson, metodoNoPermitido } from '../_http.js';
import { claveCorrecta, crearCookie, esSeguro } from '../_sesion.js';

const espera = (ms) => new Promise((r) => setTimeout(r, ms));

export default async function handler(req, res) {
  if (req.method !== 'POST') return metodoNoPermitido(res, ['POST']);

  const usuarioEsperado = process.env.ADMIN_USUARIO;
  const hashEsperado = process.env.ADMIN_CLAVE_HASH;
  if (!usuarioEsperado || !hashEsperado || !process.env.SESION_SECRETO) {
    console.error('[admin] faltan ADMIN_USUARIO, ADMIN_CLAVE_HASH o SESION_SECRETO');
    return json(res, 500, { error: 'El acceso no está configurado en el servidor.' });
  }

  const cuerpo = await leerJson(req);
  const usuario = String(cuerpo?.usuario ?? '');
  const clave = String(cuerpo?.clave ?? '');

  // Se comprueba siempre la contraseña, aunque el usuario ya no cuadre, para
  // que el tiempo de respuesta no delate cuál de los dos ha fallado.
  const usuarioVale = usuario === usuarioEsperado;
  const claveVale = claveCorrecta(clave, hashEsperado);

  if (!usuarioVale || !claveVale) {
    await espera(400);
    return json(res, 401, { error: 'Usuario o contraseña incorrectos.' });
  }

  res.setHeader('Set-Cookie', crearCookie(usuario, { seguro: esSeguro(req) }));
  return json(res, 200, { ok: true, usuario });
}
