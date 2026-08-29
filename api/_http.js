/* Utilidades comunes a todas las funciones.

   Se usan las APIs de Node (req/res a secas) en lugar de los ayudantes de
   Vercel, para que el mismo código funcione tal cual en el servidor local de
   desarrollo y no haya que mantener dos versiones. */

export function json(res, codigo, cuerpo) {
  const texto = JSON.stringify(cuerpo);
  res.writeHead(codigo, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Content-Length': Buffer.byteLength(texto)
  });
  res.end(texto);
}

/* Lee el cuerpo JSON de la petición.
   Vercel a veces ya lo ha consumido y lo deja en req.body; en local llega
   como flujo. Se contemplan los dos casos.
   El límite evita que alguien mande un cuerpo enorme y ocupe la función. */
export async function leerJson(req, limiteBytes = 16 * 1024) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return null;
    }
  }

  const trozos = [];
  let total = 0;
  for await (const trozo of req) {
    total += trozo.length;
    if (total > limiteBytes) return null;
    trozos.push(trozo);
  }
  if (!total) return {};
  try {
    return JSON.parse(Buffer.concat(trozos).toString('utf8'));
  } catch {
    return null;
  }
}

export function metodoNoPermitido(res, permitidos) {
  res.setHeader('Allow', permitidos.join(', '));
  return json(res, 405, { error: 'Método no permitido' });
}

/* La IP del visitante según las cabeceras que pone Vercel por delante.
   Solo se usa para derivar un hash; nunca se guarda tal cual. */
export function ipDe(req) {
  const reenviada = req.headers['x-forwarded-for'];
  if (typeof reenviada === 'string' && reenviada) return reenviada.split(',')[0].trim();
  return req.socket?.remoteAddress || 'desconocida';
}
