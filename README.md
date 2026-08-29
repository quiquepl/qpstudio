# QP Studio

Estudio digital independiente dirigido por Quique Planelles.

Home del estudio. HTML, CSS y JavaScript planos. Cero dependencias, cero paso de
build, cero backend.

```
index.html          home
servicios.html      detalle de los cuatro servicios y presupuestos
gestion.html        panel, botones con backend y acompañamiento
mantenimiento.html  qué incluye, qué es del cliente y cómo se entrega
contacto.html       formulario en página propia
admin.html          panel de administración: mensajes reales, textos aún en el navegador
aviso-legal.html · privacidad.html · cookies.html
build-pages.mjs     genera las páginas interiores desde una plantilla común
api/                funciones de Vercel: formulario y panel
db/                 migraciones SQL, por orden de nombre
scripts/build.mjs   construye la web: es lo único que hay que ejecutar
scripts/            extraer textos, aplicar los del panel, SEO, migrar,
                    clave del panel, comprobarla, desbloquear
contenidos-base.json textos de fábrica, generados desde index.html
sitemap.xml · robots.txt · img/og.jpg   generados por el paso de SEO
neon.ts             servicios de Neon declarados como código
css/styles.css      tokens, reset, tipografía, nav, botones, footer
css/sections.css    arte por sección de la home
css/pages.css       páginas interiores
js/motion.js        cordillera, cintas 3D, órbita, ordenador final
js/ui.js            menú, comparador, botones magnéticos, formulario
img/logo.png        logo QP · img/quique.jpg  retrato
server.mjs          servidor estático solo para desarrollo
```

## Páginas interiores

Se generan con `node build-pages.mjs`, que usa una cabecera y un pie comunes.
Si cambias el nav o el footer, tócalo ahí y vuelve a ejecutarlo: si no, las ocho
páginas se desincronizan de la home.

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
  email: 'qpstudiocontacto@gmail.com',
  whatsapp: '34600000000'
};
```

Ese objeto reescribe todos los `mailto:` y todos los enlaces de WhatsApp de la
página. Los valores actuales son de relleno. En `index.html` hay las mismas
direcciones escritas a mano en el footer y en el formulario, para que funcionen
también sin JavaScript: cámbialas ahí igualmente (busca `planellesstudio.com` y
`34600000000`).

**3. Tu foto.** Guarda un retrato vertical en `img/quique.jpg` (recomendado
640×800 o mayor, misma proporción 4:5). Si el archivo no existe, la sección Sobre
mí muestra un monograma "QP" sobre la trama de puntos, así que la web no se
rompe mientras no la tengas, pero una cara real vende bastante más que dos
iniciales.

**2. Redes.** El footer no lleva redes todavía. Cuando tengas los perfiles del
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
- `prefers-reduced-motion` congela los canvas, quita el portátil 3D y deja el
  formulario suelto y legible. Lo mismo hace la clase `no-3d` si no hay JS.
- El comparador se maneja con teclado (flechas, Home, End) y anuncia su estado.
- Sin JavaScript la web se lee entera: las animaciones de entrada solo se activan
  si hay JS para desactivarlas.
- Tres fuentes desde Google Fonts y las fotos desde Unsplash, ambas con
  `preconnect`. Son las únicas peticiones externas. Si quieres cero dependencias externas,
  descarga los `.woff2` a `css/fonts/` y cambia el `<link>` por `@font-face`.

## Lo que queda para la siguiente fase

- Subapartados: proceso, plazas abiertas y portfolio, cada uno en su página.
- Páginas legales (aviso legal, privacidad, cookies).
- Endpoint real del formulario.
- Open Graph con imagen propia (`og:image`).
- Datos estructurados `LocalBusiness` si el estudio va a tener sede física.
