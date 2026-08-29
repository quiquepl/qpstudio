/* Servidor estático mínimo para desarrollo. Cero dependencias.
   Uso: node server.mjs [puerto]
   En producción no hace falta: la web es estática (Vercel, Netlify, etc.). */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('.', import.meta.url));
const PORT = Number(process.argv[2] || process.env.PORT || 4321);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8'
};

/* Las variables de .env.local no las inyecta nadie en local, así que las
   carga el propio servidor. En Vercel ya vienen puestas en el entorno. */
for (const fichero of ['.env.local', '.env']) {
  try {
    const texto = await readFile(join(ROOT, fichero), 'utf8');
    for (const linea of texto.split(/\r?\n/)) {
      const m = linea.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  } catch {
    /* puede no existir */
  }
}

/* Emula el enrutado de funciones de Vercel: /api/algo ejecuta api/algo.js.
   Sin esto habría que usar `vercel dev` para probar el formulario, y así el
   mismo código se prueba en local exactamente igual que se publica. */
async function funcionApi(req, res, rel) {
  const limpio = rel.replace(/^\/api\//, '').replace(/\.js$/, '');
  // Nada de subir por el árbol ni de invocar los módulos internos (_db, ...)
  if (!/^[a-z0-9-]+(\/[a-z0-9-]+)*$/.test(limpio)) return false;

  const modulo = join(ROOT, 'api', ...limpio.split('/')) + '.js';
  if (!modulo.startsWith(join(ROOT, 'api'))) return false;

  try {
    await stat(modulo);
  } catch {
    return false;
  }

  try {
    // El sufijo hace que Node recargue el módulo en cada petición: así se ve
    // el cambio al guardar sin reiniciar el servidor.
    const { default: handler } = await import(`file://${modulo}?t=${Date.now()}`);
    await handler(req, res);
  } catch (e) {
    console.error(`[api] ${limpio}:`, e);
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: e.message }));
    }
  }
  return true;
}

createServer(async (req, res) => {
  try {
    let rel = decodeURIComponent(new URL(req.url, 'http://x').pathname);

    if (rel.startsWith('/api/') && (await funcionApi(req, res, rel))) return;

    if (rel.endsWith('/')) rel += 'index.html';

    const path = join(ROOT, normalize(rel).replace(/^(\.\.[/\\])+/, ''));
    if (!path.startsWith(ROOT)) {
      res.writeHead(403).end('Forbidden');
      return;
    }

    // mismo comportamiento que cleanUrls de Vercel: /servicios sirve
    // servicios.html, para que en local se navegue igual que publicado
    let info;
    try {
      info = await stat(path);
    } catch {
      const alt = path + ".html";
      await stat(alt);
      const body = await readFile(alt);
      res.writeHead(200, { "Content-Type": TYPES[".html"], "Cache-Control": "no-store" });
      res.end(body);
      return;
    }
    const file = info.isDirectory() ? join(path, 'index.html') : path;
    const body = await readFile(file);

    res.writeHead(200, {
      'Content-Type': TYPES[extname(file).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-store'
    });
    res.end(body);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>404</h1><p><a href="/">Volver al inicio</a></p>');
  }
}).listen(PORT, () => {
  console.log(`Planelles Studio en http://localhost:${PORT}`);
});
