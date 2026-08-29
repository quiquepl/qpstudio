/* Sesión del panel de administración.

   Hasta ahora el acceso se comprobaba en js/admin.js, es decir, en el
   navegador del visitante: cualquiera que abriese el código veía la
   contraseña. Eso valía mientras el panel era una maqueta sin datos, pero
   la bandeja de mensajes contiene nombres y correos de personas reales, así
   que la comprobación pasa aquí, al servidor.

   Cómo funciona:
   - La contraseña nunca se guarda. Se guarda un hash scrypt con sal, y al
     entrar se compara en tiempo constante (timingSafeEqual), para no filtrar
     información por lo que tarda en fallar.
   - La sesión es una cookie firmada con HMAC-SHA256. El servidor no guarda
     estado: si la firma cuadra y no ha caducado, la sesión vale.
   - La cookie va HttpOnly, así que el JavaScript de la página no puede
     leerla, y SameSite=Strict, así que no viaja desde otros sitios. */
import {
  createHmac,
  randomBytes,
  scryptSync,
  timingSafeEqual
} from 'node:crypto';

const COOKIE = 'qp_sesion';
const DURACION_S = 60 * 60 * 8; // ocho horas

const b64 = (buf) => Buffer.from(buf).toString('base64url');

/* ── Contraseñas ────────────────────────────────────────────────────── */

const PARAMS = { N: 16384, r: 8, p: 1, longitud: 32 };

export function hashDeClave(clave) {
  const sal = randomBytes(16);
  const derivada = scryptSync(clave, sal, PARAMS.longitud, {
    N: PARAMS.N,
    r: PARAMS.r,
    p: PARAMS.p
  });
  return `scrypt$${PARAMS.N}$${PARAMS.r}$${PARAMS.p}$${b64(sal)}$${b64(derivada)}`;
}

export function claveCorrecta(clave, guardado) {
  try {
    const [algoritmo, N, r, p, sal, esperada] = String(guardado).split('$');
    if (algoritmo !== 'scrypt') return false;
    const esperadaBuf = Buffer.from(esperada, 'base64url');
    const derivada = scryptSync(clave, Buffer.from(sal, 'base64url'), esperadaBuf.length, {
      N: Number(N),
      r: Number(r),
      p: Number(p)
    });
    return timingSafeEqual(derivada, esperadaBuf);
  } catch {
    return false;
  }
}

/* ── Cookie firmada ─────────────────────────────────────────────────── */

function firma(datos, secreto) {
  return createHmac('sha256', secreto).update(datos).digest();
}

export function crearCookie(usuario, { seguro }) {
  const secreto = process.env.SESION_SECRETO;
  if (!secreto) throw new Error('Falta SESION_SECRETO');

  const carga = b64(JSON.stringify({ u: usuario, exp: Math.floor(Date.now() / 1000) + DURACION_S }));
  const valor = `${carga}.${b64(firma(carga, secreto))}`;

  const partes = [
    `${COOKIE}=${valor}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Strict',
    `Max-Age=${DURACION_S}`
  ];
  // Secure solo con https: en http el navegador descartaría la cookie y el
  // panel no funcionaría en desarrollo local.
  if (seguro) partes.push('Secure');
  return partes.join('; ');
}

export function cookieDeCierre({ seguro }) {
  const partes = [`${COOKIE}=`, 'Path=/', 'HttpOnly', 'SameSite=Strict', 'Max-Age=0'];
  if (seguro) partes.push('Secure');
  return partes.join('; ');
}

/* Devuelve el usuario de la sesión, o null si no hay sesión válida. */
export function sesionDe(req) {
  const secreto = process.env.SESION_SECRETO;
  if (!secreto) return null;

  const cabecera = req.headers?.cookie;
  if (!cabecera) return null;

  const cruda = cabecera
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${COOKIE}=`));
  if (!cruda) return null;

  const [carga, recibida] = cruda.slice(COOKIE.length + 1).split('.');
  if (!carga || !recibida) return null;

  const esperada = firma(carga, secreto);
  const recibidaBuf = Buffer.from(recibida, 'base64url');
  if (recibidaBuf.length !== esperada.length) return null;
  if (!timingSafeEqual(recibidaBuf, esperada)) return null;

  try {
    const { u, exp } = JSON.parse(Buffer.from(carga, 'base64url').toString('utf8'));
    if (!u || !exp || exp < Math.floor(Date.now() / 1000)) return null;
    return u;
  } catch {
    return null;
  }
}

/* ¿La petición llega por https? Vercel lo indica en x-forwarded-proto. */
export function esSeguro(req) {
  const proto = req.headers?.['x-forwarded-proto'];
  if (typeof proto === 'string') return proto.split(',')[0].trim() === 'https';
  return Boolean(req.socket?.encrypted);
}
