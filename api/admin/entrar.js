/* POST /api/admin/entrar — comprueba las credenciales y abre sesión.

   Responde igual de despacio y con el mismo texto tanto si falla el usuario
   como si falla la contraseña, para no confirmar cuál de los dos existe.

   Además limita los intentos fallidos. Esto importa especialmente cuando la
   contraseña es corta o adivinable: no la convierte en buena, pero impide
   que se pueda probar a lo bruto desde un sitio. Un ataque repartido entre
   muchas direcciones se lo saltaría; la defensa real sigue siendo poner una
   contraseña larga. */
import { createHmac } from 'node:crypto';
import { consulta } from '../_db.js';
import { ipDe, json, leerJson, metodoNoPermitido } from '../_http.js';
import { claveCorrecta, crearCookie, esSeguro } from '../_sesion.js';

const MAX_FALLOS = 8;
const VENTANA = '15 minutes';

const espera = (ms) => new Promise((r) => setTimeout(r, ms));

export default async function handler(req, res) {
  if (req.method !== 'POST') return metodoNoPermitido(res, ['POST']);

  const usuarioEsperado = process.env.ADMIN_USUARIO;
  const hashEsperado = process.env.ADMIN_CLAVE_HASH;
  const secreto = process.env.SESION_SECRETO;
  if (!usuarioEsperado || !hashEsperado || !secreto) {
    console.error('[admin] faltan ADMIN_USUARIO, ADMIN_CLAVE_HASH o SESION_SECRETO');
    return json(res, 500, { error: 'El acceso no está configurado en el servidor.' });
  }

  const ipHash = createHmac('sha256', secreto).update(ipDe(req)).digest('base64url').slice(0, 32);

  try {
    // Se limpian de paso las filas viejas, para que la tabla no crezca sola.
    await consulta(`delete from intentos_acceso where creado_en < now() - interval '1 day'`);

    const { rows } = await consulta(
      `select count(*)::int as n from intentos_acceso
        where ip_hash = $1 and creado_en > now() - interval '${VENTANA}'`,
      [ipHash]
    );
    if (rows[0].n >= MAX_FALLOS) {
      return json(res, 429, {
        error: 'Demasiados intentos fallidos. Espera un cuarto de hora y vuelve a probar.'
      });
    }
  } catch (e) {
    // Si la comprobación falla no se bloquea el acceso legítimo, pero queda
    // constancia: es preferible poder entrar a quedarse fuera por un fallo
    // de la base de datos.
    console.error('[admin] no he podido contar los intentos:', e.message);
  }

  const cuerpo = await leerJson(req);
  const usuario = String(cuerpo?.usuario ?? '');
  const clave = String(cuerpo?.clave ?? '');

  // Se comprueba siempre la contraseña, aunque el usuario ya no cuadre, para
  // que el tiempo de respuesta no delate cuál de los dos ha fallado.
  const usuarioVale = usuario === usuarioEsperado;
  const claveVale = claveCorrecta(clave, hashEsperado);

  if (!usuarioVale || !claveVale) {
    try {
      await consulta('insert into intentos_acceso (ip_hash) values ($1)', [ipHash]);
    } catch (e) {
      console.error('[admin] no he podido anotar el intento:', e.message);
    }
    await espera(400);
    return json(res, 401, { error: 'Usuario o contraseña incorrectos.' });
  }

  // Al acertar se borra el historial: quien entra bien no arrastra los
  // fallos de antes.
  try {
    await consulta('delete from intentos_acceso where ip_hash = $1', [ipHash]);
  } catch {
    /* no es grave: las filas caducan solas */
  }

  res.setHeader('Set-Cookie', crearCookie(usuario, { seguro: esSeguro(req) }));
  return json(res, 200, { ok: true, usuario });
}
