# Planelles Studio

Home del estudio. HTML, CSS y JavaScript planos. Cero dependencias, cero paso de
build, cero backend.

```
index.html
css/styles.css      tokens, reset, tipografía, nav, botones, footer
css/sections.css    arte por sección
js/motion.js        cordilleras tramadas, reveals, scroll, contadores
js/ui.js            menú, comparador, botones magnéticos, formulario
img/                aquí va quique.jpg
server.mjs          servidor estático solo para desarrollo
PRODUCT.md          marca, público, tono, anti-referencias
DESIGN.md           sistema visual y de movimiento
```

## Ver en local

```bash
node server.mjs
```

Abre <http://localhost:4321>. Nada que instalar.

## Lo que tienes que cambiar antes de publicar

Son tres cosas y están todas juntas a propósito.

**1. Datos de contacto.** Arriba de `js/ui.js`:

```js
const CONTACTO = {
  email: 'hola@planellesstudio.com',
  whatsapp: '34600000000'
};
```

Ese objeto reescribe todos los `mailto:` y todos los enlaces de WhatsApp de la
página. Los valores actuales son de relleno. En `index.html` hay las mismas
direcciones escritas a mano en el footer y en el formulario, para que funcionen
también sin JavaScript: cámbialas ahí igualmente (busca `planellesstudio.com` y
`34600000000`).

**2. Tu foto.** Guarda un retrato vertical en `img/quique.jpg` (recomendado
640×800 o mayor, misma proporción 4:5). Si el archivo no existe, la sección Sobre
mí muestra un monograma "QP" sobre la trama de puntos, así que la web no se
rompe mientras no la tengas, pero una cara real vende bastante más que dos
iniciales.

**3. Redes.** El footer no lleva redes todavía. Cuando tengas los perfiles del
estudio, añádelos junto al email y el WhatsApp en `foot__links`.

Opcional: la web es a propósito corta. Proceso, plazas abiertas y portfolio van
en subapartados propios cuando toque, no en la home.

## Formulario

Esta fase no lleva backend, así que el formulario valida en el navegador y abre
el cliente de correo con el asunto y el cuerpo ya escritos. Funciona desde el
primer día y no depende de ningún servicio.

Cuando quieras recibirlos sin pasar por el cliente de correo, hay dos caminos:

- **Sin servidor**: crea un formulario en Formspree o Basin y sustituye el bloque
  final de `js/ui.js` (el que hace `location.href = url`) por un `fetch` al
  endpoint que te den.
- **Con función serverless**: en Vercel, un archivo `api/lead.js` que reciba el
  POST y lo mande con Resend. Es el mismo patrón que ya usa el proyecto GEST26.

En los dos casos, lo único que cambia es el `submit`. La validación y los
mensajes de error ya están hechos.

## Publicar

Es una web estática, así que sirve cualquier hosting.

En Vercel: importa el repositorio y déjalo sin framework. `vercel.json` ya trae
las cabeceras de caché y de seguridad.

## Accesibilidad y rendimiento

- Contraste verificado en todo el texto: mínimo 4.5:1, o 3:1 en tamaños grandes.
- `prefers-reduced-motion` congela las cordilleras y muestra todo el contenido de golpe.
- El comparador se maneja con teclado (flechas, Home, End) y anuncia su estado.
- Sin JavaScript la web se lee entera: las animaciones de entrada solo se activan
  si hay JS para desactivarlas.
- Dos fuentes desde Google Fonts con `preconnect` y `display=swap`. Es la única
  petición externa de toda la web. Si quieres cero dependencias externas,
  descarga los `.woff2` a `css/fonts/` y cambia el `<link>` por `@font-face`.

## Lo que queda para la siguiente fase

- Subapartados: proceso, plazas abiertas y portfolio, cada uno en su página.
- Páginas legales (aviso legal, privacidad, cookies).
- Endpoint real del formulario.
- Open Graph con imagen propia (`og:image`).
- Datos estructurados `LocalBusiness` si el estudio va a tener sede física.
