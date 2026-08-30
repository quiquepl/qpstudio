# QP STUDIO · Contexto y manual de trabajo

> **Para Claude:** este archivo es todo lo que necesitas saber antes de tocar
> nada. Léelo entero al empezar. No hace falta que explores el repositorio
> para entender cómo trabajamos: está aquí. Lo que sí tendrás que leer es el
> código concreto de ESTE proyecto cuando vayas a modificarlo.
>
> **Escribe y habla siempre en español.** El usuario es Quique Planelles.

---

## 0. Cómo se usa este archivo

Va en la raíz de cada proyecto de cliente, junto a un `CLAUDE.md` corto con
los datos de ese cliente concreto. Claude Code lee el `CLAUDE.md` solo; el
`CLAUDE.md` importa este archivo.

**Este archivo no se personaliza por cliente.** Es el manual del estudio. Lo
que cambia de un cliente a otro va en el `CLAUDE.md` del proyecto.

Si durante un proyecto se aprende algo que sirve para todos los siguientes,
se anota aquí y se copia la versión nueva al resto de proyectos. La versión
maestra vive en el repositorio de QP Studio, en
`plantillas/nuevo-proyecto/QPSTUDIO.md`.

---

## 1. Quién es QP Studio

**Estudio digital independiente dirigido por Quique Planelles.** Estudiante
universitario en Castellón. No es una agencia y no quiere parecerlo.

| Dato | Valor |
|---|---|
| Marca comercial | **QP Studio** |
| Web | https://www.qpstudio.es |
| Correo | qpstudiocontacto@gmail.com |
| WhatsApp | +34 684 759 883 |
| Sociedad que factura | **GEST26** (empresa del padre) |
| CIF de GEST26 | `[pendiente]` |
| Domicilio social | `[pendiente]` |
| Repositorio maestro | `C:\Users\quiqu\Desktop\PLANELLES-STUDIO` |

**Marca y sociedad son cosas distintas y no se mezclan.** Todo lo que ve el
cliente dice QP Studio. GEST26 aparece únicamente en la factura, en el aviso
legal, en la política de privacidad y en el campo `legalName` de los datos
estructurados. Como KitKat y Nestlé.

En schema.org: `name: "QP Studio"`, `legalName: "GEST26"`.

**Nunca publiques el NIF personal de Quique en una página web.** En los
legales va el CIF de la sociedad.

### A quién le vendemos

Dueños de negocios locales, pymes, ecommerce y marcas que ya hacen bien su
trabajo pero no lo aparentan en internet. Perfil **no técnico**. Suelen llegar
con una web de hace años, o solo con Instagram, y con la sospecha de que la
competencia les gana comunicando, no trabajando.

Lo que les mueve no es «quiero una web». Es **«no quiero parecer menos de lo
que soy»**.

### Mensaje central

> **Tu negocio ya es bueno. También debería parecerlo.**

No vendemos «hacer webs». Vendemos percepción, confianza, claridad y presencia
digital. El argumento nunca es miedo agresivo: es reconocimiento.

### Servicios

1. Diseño web
2. Rediseño web
3. Tiendas online
4. Automatización e IA *(secundario, nunca el centro del mensaje)*
5. Mantenimiento *(la parte recurrente del negocio)*

Frase de gobierno para la IA: *la IA acelera el proceso, el criterio decide el
resultado.* Nunca se le dice al cliente que su web la ha hecho una IA.

### La ventaja competitiva, que no se diluye nunca

**Hablas con quien diseña, siempre.** Una sola persona escucha, diseña y
programa. Respuesta el mismo día. Nada de plantilla adaptada al logo. Sigue
disponible cuando la web ya está viva.

Eso es lo único que una agencia grande no puede copiar. En cada web de cliente
hay que dejarlo claro de alguna forma.

---

## 2. Cómo trabaja Quique y qué espera de ti

Esto está aquí porque ahorra fricción y tokens en cada sesión nueva.

### Lo que espera

- **Trabajo terminado, no opciones.** Si hay una decisión obvia, tómala y
  dilo. Preguntar solo cuando dos lecturas del encargo llevan a trabajos
  distintos de verdad.
- **Que verifiques de verdad antes de decir que algo funciona.** Ver la
  sección 17: una vez se dio por bueno un cambio mirando solo códigos HTTP
  200, y la web estaba rota.
- **Que digas lo que no has podido comprobar.** El navegador integrado a
  veces no renderiza; entonces se verifica midiendo el DOM y se dice
  explícitamente que no hay confirmación visual.
- **Encargos en bloque.** Suele mandar seis cosas en un mensaje. Hazlas todas
  y responde una vez, no seis.
- **Nada de sermones.** Si algo es mala idea, una frase y sigues.
- **Castellano llano.** Sin jerga innecesaria. Cuando aparezca un tecnicismo,
  se explica en la misma frase.

### Cuando necesita ayuda, suele ser de una de estas cinco cosas

| Tipo | Qué pide | Cuánto cuesta |
|---|---|---|
| **Web nueva** | Sitio completo para un cliente | Mucho. Bloque entero |
| **Cambios** | Ajustes en una web ya hecha | Poco, si le dices el archivo |
| **Fallo** | «Esto no va» | Impredecible. Pídele el error literal |
| **Captación** | Prospectos, guiones, auditar webs ajenas | Medio |
| **Negocio** | Precios, legal, organización, dudas | Casi nada |

**Una sesión = un tema.** Si cambia de asunto, mejor empezar sesión nueva:
arrastrar tres horas de código a una pregunta de precios se paga en cada
mensaje.

### Reglas de escritura suyas, que valen para todo

- **Sin em dashes** en el copy de las webs.
- Bloques cortos. Cada frase con una intención.
- Primera persona del plural para la marca («creamos»). Singular en la
  sección personal («soy Quique Planelles»).

---

## 3. LO QUE SE HEREDA Y LO QUE SE DECIDE EN CADA PROYECTO

**Esta es la sección más importante del archivo.** Aquí está la diferencia
entre reutilizar el criterio y hacer ocho webs clonadas.

### Se hereda siempre (es el listón de QP Studio)

- La arquitectura técnica: estático + funciones serverless + Postgres
- El proceso de build, el SEO, el despliegue, los legales
- El panel de administración
- El nivel de accesibilidad y de rendimiento
- La forma de escribir código y comentarios
- Las prohibiciones de la sección 19

### Se decide de cero en cada cliente

- **Colores.** El azul de QP Studio es de QP Studio. La web de un taller no
  lleva el azul de QP Studio.
- **Tipografías.** Archivo y Geist son la voz del estudio, no la del cliente.
- **Estructura de secciones y número de páginas.**
- **Las piezas de movimiento.** La cordillera, las cintas y la órbita son
  nuestras. Para un cliente se inventa lo suyo.
- **Fotografía, ilustración y tono de las imágenes.**
- **El copy entero.**

### La regla

> La web de QP Studio demuestra de lo que somos capaces.
> La web del cliente tiene que parecer **del cliente**, no nuestra.

Si un visitante puede mirar dos webs nuestras seguidas y decir «estas son de
la misma persona» por el aspecto, algo se ha hecho mal. Lo que debe repetirse
es la **calidad**, no el estilo.

**Antes de empezar cualquier web, define:** sector, competencia directa,
sensación que tiene que dar (lujo, cercanía, técnico, rápido, sano), paleta,
tipografías y si hay identidad previa que respetar.

---

## 4. Voz y copy

Claro, directo, cercano, profesional, humano. Poco texto: manda el diseño.
Las explicaciones largas van a páginas interiores, no a la portada.

Cada elemento hace **una de dos cosas: genera confianza o quita una duda**.
Si no hace ninguna, fuera.

### Prohibido en copy, siempre

soluciones innovadoras · transformación digital · experiencias disruptivas ·
ecosistema digital · sinergias · propuestas 360 · líder en el sector ·
crecimiento exponencial · tecnología de vanguardia (sin explicar nada)

### Prohibido en la web de QP Studio en concreto

- Plazos de entrega públicos. En un presupuesto concreto sí; en la web no.
- Mencionar «formaciones» o «llamadas grabadas».
- Etiquetas numeradas antes de los titulares.
- Nombres de clientes inventados. Si se enseñan ejemplos de diseño, se
  etiquetan por **sector**, nunca con un nombre falso.

---

## 5. Diseño: el listón, no el estilo

Lo que sigue son criterios de calidad. Se aplican a cualquier paleta.

### Estructura

- **Ningún bloque de solo texto sobre fondo liso.** Toda sección lleva imagen,
  maqueta, canvas o fondo propio.
- **Alternancia claro / oscuro**, para que no haya dos bloques seguidos
  iguales.
- Jerarquía **tonal** en los titulares: primera línea en tinta, segunda en un
  gris medio. Mismo tamaño, mismo peso. Queda mejor que jugar con tamaños.

### Color

- Escala tonal de once pasos en **OKLCH**, no en hex. OKLCH mantiene la
  luminosidad percibida constante, así que una escala sale pareja de verdad.
- **Ni `#000` ni `#fff`.** Fondo alrededor del 98% de luminosidad, tinta
  alrededor del 19%.
- Contraste mínimo **4.5:1** en texto normal y **3:1** en tamaños grandes.
  Verificado, no estimado.
- Un solo color de acento. Cuando aparece, significa algo: acción o marca.

### Movimiento

- **Sin librerías.** Canvas y CSS a pelo.
- Curva única out-expo `cubic-bezier(0.16, 1, 0.3, 1)`. **Cero bounce.**
- Sin desenfoque ni escalado del contenido al hacer scroll.
- Sin texto con gradiente (`background-clip: text`).
- Los canvas **se paran fuera de pantalla y con la pestaña oculta**.
- `prefers-reduced-motion` congela todo y deja el contenido legible.
- La clase `no-3d` hace lo mismo cuando no hay JavaScript.

### Accesibilidad, que no es opcional

- **Sin JavaScript la web se lee entera.** Las animaciones de entrada solo se
  activan si hay JS para poder desactivarlas.
- Todo control se maneja con teclado y anuncia su estado.
- Móvil tan cuidado como escritorio. Los problemas de móvil **se resuelven**,
  no se esconden.

### Lección técnica que ya costó tiempo: órbitas

`offset-path: ellipse()` **no sirve** para repartir elementos en una órbita.
`offset-distance` avanza por longitud de arco, no por ángulo, así que en una
elipse alargada los elementos se amontonan en unos sitios y dejan huecos en
otros.

La solución es **rotación anidada en círculo**: un brazo de tamaño cero gira
desde el centro y la tarjeta gira lo mismo al revés, así orbita pero se
mantiene derecha. En un círculo el arco y el ángulo coinciden y el reparto
sale exacto sin cuentas.

Y va con **animaciones CSS, no con `requestAnimationFrame`**: las CSS corren
en el compositor y el scroll no las afecta. Con rAF daba tirones.

---

## 6. Arquitectura estándar de un proyecto

```
proyecto/
  index.html              portada, con los textos de fábrica dentro
  servicios.html ...      páginas interiores GENERADAS, no editar a mano
  admin.html              panel de administración
  aviso-legal.html · privacidad.html · cookies.html
  404.html

  build-pages.mjs         genera las interiores desde cabecera y pie comunes
  scripts/build.mjs       ÚNICO punto de entrada del build
  scripts/                seo, extraer-textos, aplicar-contenidos, migrar,
                          clave-admin, comprobar-clave, desbloquear, fuentes
  scripts/_comun.mjs      cargarEnv, conCertificadoVerificado, cadenaDirecta

  api/_db.js              pool de Postgres
  api/_http.js            json, leerJson, metodoNoPermitido, ipDe
  api/_sesion.js          scrypt, HMAC de cookie, sesionDe
  api/contacto.js         formulario público
  api/visita.js           analítica
  api/admin/*.js          entrar, salir, sesion, mensajes, contenidos,
                          analitica, publicar

  db/001-....sql          migraciones, por orden de nombre
  css/styles.css          tokens, reset, tipografía, nav, botones, footer
  css/sections.css        arte por sección de la portada
  css/pages.css           páginas interiores
  css/fuentes.css         GENERADO por scripts/fuentes.mjs
  fuentes/*.woff2         tipografías autoalojadas
  js/motion.js            todo el movimiento
  js/ui.js                menú, formulario, interacciones
  js/admin.js             el panel

  contenidos-base.json    GENERADO: textos de fábrica
  sitemap.xml · robots.txt   GENERADOS por el paso de SEO
  vercel.json             caché, cabeceras de seguridad, cleanUrls
  server.mjs              servidor local que imita a Vercel
```

**Cero dependencias de frontend.** Sin React, sin Tailwind, sin build de CSS.
Dos dependencias de servidor y punto: `pg` y `@vercel/functions`.

Esto no es nostalgia. Una web estática de un negocio local carga antes, se
posiciona mejor, no se rompe sola en dos años y el cliente puede llevársela a
cualquier hosting el día que quiera. Es un argumento de venta, no una
limitación.

---

## 7. Frontend

### Tipografías: **autoalojadas siempre**

Nunca la hoja de Google Fonts. Bloquea el renderizado mientras el navegador
resuelve un dominio ajeno y negocia TLS, retrasa el primer pintado, penaliza
el LCP (que Google usa para posicionar) y encima le manda a Google la IP de
cada visitante.

`node scripts/fuentes.mjs` descarga los `.woff2` y genera `css/fuentes.css`
con `@font-face`, `font-display: swap` y **`unicode-range`** por subconjunto
(latin y latin-ext separados), para que el navegador solo baje el trozo que
necesita.

Elegir fuentes con licencia abierta (SIL OFL). Archivo y Geist lo son.

### Imágenes

- `width` y `height` **siempre** en el HTML, para que no salte el layout.
- `loading="lazy"` en todo lo que no esté en la primera pantalla.
- Los fondos CSS no admiten `loading="lazy"`: se cargan con
  `IntersectionObserver` sobre un atributo `data-img`, y **con red de
  seguridad** (`requestIdleCallback` con timeout) por si el observador no
  llega a dispararse nunca.
- La imagen de Open Graph es **1200×630 en JPEG**. Se dibuja en un lienzo, no
  se captura de pantalla: la captura sale al tamaño de la ventana y queda
  borrosa. Un PNG de 791 KB pasó a 82 KB en JPEG.

### Caché, que ya dio un susto

En `vercel.json`:

| Ruta | Cache-Control | Por qué |
|---|---|---|
| `/css/`, `/js/` | `max-age=0, must-revalidate` | Los ficheros **no llevan hash en el nombre**. Con caché larga, quien ya hubiera entrado seguía viendo el JS viejo una hora después de desplegar |
| `/img/`, `/fuentes/` | `max-age=31536000, immutable` | No cambian. Si sustituyes una imagen, **renómbrala** (`logo-2.png`) en vez de sobrescribirla |

`must-revalidate` no significa descargar cada vez: el navegador pregunta y
Vercel contesta `304 Not Modified`, respuesta vacía y coste casi nulo.

Si algún día el CSS pesa de verdad, la solución **no** es subir el `max-age`:
es poner un hash en el nombre del fichero y entonces sí cachearlo un año.

### Cabeceras de seguridad, en todos los proyectos

```
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
X-Frame-Options: SAMEORIGIN
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

---

## 8. Backend: las funciones

Se usan **las APIs de Node a secas** (`req`, `res`), no los ayudantes de
Vercel, para que el mismo código funcione tal cual en `server.mjs` y no haya
que mantener dos versiones.

`server.mjs` enruta `/api/*` a los módulos de `api/`, así que `npm run dev`
sirve la web y las funciones a la vez. **No hace falta `vercel dev`.**

### Patrones que se repiten en cada endpoint

1. Comprobar el método primero, y si no cuadra devolver **405 con cabecera
   `Allow`**.
2. En los endpoints privados, **comprobar la sesión ANTES de tocar la base de
   datos**. Sin cookie válida, 401 y no se consulta nada.
3. Leer el cuerpo con **límite de bytes** (16 KB por defecto), para que nadie
   ocupe la función con un cuerpo enorme.
4. Recortar y validar todo lo que llegue. Validación de correo
   deliberadamente laxa: el objetivo es descartar lo que evidentemente no es
   un correo, no rechazar direcciones válidas raras.
5. **El detalle del error va al log; al visitante solo un mensaje útil** que
   le diga qué hacer ahora («escríbenos a ...»).
6. `Cache-Control: no-store` en todas las respuestas JSON.

### Antiabuso sin guardar IPs

Nunca se guarda la IP. Se guarda un **HMAC-SHA256 de la IP** con un secreto
del servidor: irreversible y no cruzable con nada.

- Formulario: máximo **5 mensajes por hora** desde el mismo hash.
- Panel: **8 fallos en 15 minutos** y deja de aceptar intentos, incluso el
  correcto. Al acertar se borra el historial.

**El contador va en la base de datos, no en memoria.** Las funciones
serverless no comparten memoria entre ejecuciones: cada petición puede caer
en una instancia distinta y empezar de cero.

Esto frena la fuerza bruta desde un sitio pero **no convierte una contraseña
corta en buena**. Un ataque repartido entre muchas direcciones se lo salta.

### Autenticación del panel

- La contraseña **no se guarda**: se guarda un hash **scrypt con sal**.
- Se compara con **`timingSafeEqual`**, para que el tiempo de respuesta no
  delate nada.
- La sesión es una **cookie firmada con HMAC-SHA256**, `HttpOnly` (el
  JavaScript de la página no la puede leer), `SameSite=Strict` (no viaja
  desde otros sitios) y `Secure` en https. Dura ocho horas.

Comprobar la contraseña en el navegador **no es seguridad**. Sirve para
trabajar mientras no hay servidor, y hay que sustituirlo el día que lo haya.

---

## 9. Base de datos

**Neon** (Postgres serverless). Escala a cero cuando no se usa, así que una
web parada no cuesta cómputo.

- Proyecto de QP Studio: `lingering-shadow-50729060`, organización `qpstudio`
  (`org-proud-mode-81915204`), región `aws-us-east-2`, rama `production`.
- **Un proyecto de Neon por cliente.** Así el cliente puede tener acceso al
  suyo sin ver los demás, y el día que se vaya se le transfiere entero con un
  *claim link*.

### Dos cadenas de conexión, y no son intercambiables

| Variable | Uso |
|---|---|
| `DATABASE_URL` | **Con pooler.** Es la de las funciones serverless: muchas instancias efímeras contra un pooler que multiplexa |
| `DATABASE_URL_UNPOOLED` | **Directa.** Solo migraciones y scripts del build. El pooler en modo transacción no garantiza el estado de sesión que necesitan |

`sslmode` se fuerza a **`verify-full`**. Neon entrega la cadena con
`sslmode=require`, y `pg` avisa de que en su próxima versión mayor `require`
pasará a la semántica floja de libpq. Fijarlo evita que la verificación del
certificado se degrade el día que cambien, sin que nos enteremos.

### La pool

**Una sola por instancia de función.** Crearla en cada petición agota las
conexiones en cuanto haya algo de tráfico.

```js
max: 3, idleTimeoutMillis: 10_000, connectionTimeoutMillis: 10_000
pool.on('error', ...)                  // sin esto, Node tumba el proceso
attachDatabasePool(pool)               // @vercel/functions, cierra al suspender
```

El manejador de `error` **no es opcional**: Neon suspende el cómputo a los 5
minutos, la conexión inactiva se cae, `pg` emite `error` y sin manejador Node
mata el proceso.

### Migraciones

Ficheros `.sql` en `db/`, aplicados por orden de nombre, cada uno en su
transacción y anotado en la tabla `migraciones`. Ejecutarlo dos veces no
repite nada.

**Para cambiar el esquema se añade un fichero nuevo. Nunca se edita uno ya
aplicado.**

### Esquema base que se reutiliza

| Tabla | Para qué |
|---|---|
| `mensajes` | Formulario. Solo nombre, correo, mensaje, origen, `ip_hash`, `leido` |
| `intentos_acceso` | Fuerza bruta contra el panel |
| `contenidos` | Textos editables. Clave/valor. **Solo los cambiados** |
| `publicaciones` | Registro de publicaciones, para saber si falta publicar |
| `visitas` | Analítica. Ruta, referente, hash del visitante, día |

Dos detalles de índices que valen para todo:

- **Índice parcial** para lo no leído: `where not leido`. Ocupa una fracción
  de un índice completo y es lo único que se cuenta para el aviso del panel.
- Índice por `(ip_hash, creado_en desc)` para la ventana del límite de envíos.

`contenidos` guarda **solo los campos cambiados**. Si una clave no está, se
queda el texto original del fichero. Así el sitio funciona con la tabla vacía
y volver atrás es borrar una fila.

---

## 10. El panel de administración

Pestañas: **Textos**, **Mensajes**, **Visitas**. Acceso con usuario y
contraseña, `noindex, nofollow`, fuera del sitemap y bloqueado en
`robots.txt`.

### Cómo se editan los textos, que tiene truco

La web es estática: el HTML lleva el texto **ya escrito dentro**. Eso es lo
que la hace rápida y lo que permite que Google lea el contenido definitivo sin
ejecutar JavaScript.

El precio es que hay que **reconstruir** para que un cambio salga. De eso se
encarga el botón **Publicar**, que llama a un **Deploy Hook de Vercel** cuya
URL vive en `VERCEL_DEPLOY_HOOK`.

Se descartó a propósito hidratar los textos desde el cliente en cada carga:
costaría velocidad y posicionamiento.

Quien tenga la URL del hook puede lanzar despliegues. No da acceso a nada más.
Si se filtra: borrar el hook en Vercel, crear otro, actualizar la variable.

Sin esa variable el panel guarda igual y **lo dice claramente**: los cambios
saldrán en la siguiente publicación.

### Añadir un texto editable

1. En `index.html`, poner `data-txt="seccion.clave"` al elemento.
2. En `js/admin.js`, añadir `{ k: 'seccion.clave', et: 'Etiqueta' }` a la
   sección correspondiente. Si el texto es largo, `larga: true`.

El valor no se escribe en ningún sitio: sale del propio HTML.

**No anides `data-txt` dentro de otro `data-txt`.** El de fuera se lleva el
texto del de dentro. Si un titular tiene dos líneas, van en dos spans
hermanos.

### Analítica propia

Sin cookies, sin terceros y sin nada que identifique a nadie. `visitante` es
un HMAC de la IP y el navegador **mezclado con la fecha del día**: como la
fecha entra en el hash, el mismo visitante da un valor distinto mañana.

Sirve para contar cuánta gente entra hoy y no para seguir a nadie, **y por eso
no hace falta banner de consentimiento**. Del referente solo se guarda el
dominio, no la URL completa, que puede llevar términos de búsqueda.

Las visitas a `/admin` no se cuentan: no son tráfico y ensucian los números.

**Lo que cuesta:** cada página vista es una escritura en Postgres, y con
scale-to-zero eso despierta el cómputo. Con tráfico pequeño son céntimos. Con
miles de visitas diarias habrá que agregar en vez de guardar una fila por
visita.

---

## 11. El build

`npm run build` es lo único que hay que ejecutar, y es lo que corre Vercel en
cada despliegue. Hace cuatro cosas **en este orden, que importa**:

| # | Paso | Qué hace | Por qué va aquí |
|---|---|---|---|
| 1 | `extraer-textos` | Lee los `data-txt` de `index.html` y guarda el original de cada uno en `contenidos-base.json` | Es el «texto de fábrica» que muestra el panel y lo que restaura el botón Restaurar |
| 2 | `build-pages` | Regenera las páginas interiores desde la plantilla común | — |
| 3 | `aplicar-contenidos` | Mete en `index.html` los textos cambiados desde el panel | **Después del 1**, para que el original extraído sea el del fichero y no uno ya sustituido |
| 4 | `seo` | Canonical, Open Graph, JSON-LD, sitemap y robots | **El último**, porque el paso 2 reescribe las interiores enteras y borraría sus etiquetas |

**Ningún paso que hable con la base de datos puede tumbar el despliegue.** Si
Neon no contesta, la web sale con los textos del fichero. Es preferible
publicar el contenido de ayer que no publicar nada.

### El detalle que ya destruyó trabajo una vez

`index.html` guarda los textos de fábrica y **vive en Git**. El paso 3 solo lo
reescribe **dentro del despliegue**:

```js
const enDespliegue = process.env.VERCEL === '1';
if (enDespliegue || process.argv.includes('--forzar')) writeFileSync(ruta, html);
```

En local avisa de lo que haría pero no toca el fichero. Si se sobrescribiera
aquí, el siguiente commit subiría como «original» un texto que solo era un
cambio del panel, y el de verdad se perdería para siempre.

**Norma general: un build nunca reescribe un fichero que está en Git.**

---

## 12. SEO

Todo sale de `scripts/seo.mjs`, de **una sola lista de páginas**. Añadir una
página es añadir una línea ahí. El paso es **idempotente**: quita sus propias
etiquetas antes de volver a ponerlas, así que ejecutarlo mil veces no duplica
nada.

### Reglas fijas

- **Dominio canónico con `www`.** El dominio sin `www` redirige, así que
  anunciar esa versión costaría un salto de más en cada enlace y Google vería
  dos direcciones para lo mismo.
- **Título:** la palabra por la que quieres que te encuentren delante, la
  marca detrás, **máximo unos 60 caracteres**, que es donde corta Google.
- **Descripción:** entre 120 y 155 caracteres. No posiciona, pero decide si
  hacen clic. Dice qué se van a encontrar, no lo buenos que somos.
- **Un solo `h1` por página**, y sin saltos de nivel en los encabezados.
- **`admin` fuera del sitemap y bloqueado en `robots.txt`.**

### Datos estructurados

Un solo grafo JSON-LD enlazado por `@id`:

| Tipo | Dónde |
|---|---|
| `ProfessionalService` (o `LocalBusiness` para un negocio con sede) | Todas |
| `WebSite` | Todas |
| `WebPage` | Todas |
| `BreadcrumbList` | Interiores |
| `FAQPage` | Solo donde haya preguntas, sacadas del propio HTML |

`FAQPage` es lo que puede darte el desplegable de preguntas en los
resultados. Merece la pena.

### Auditoría

`node scripts/auditar-seo.mjs` comprueba títulos, descripciones, número de
`h1`, saltos de encabezado, `alt`/`width`/`height`/`loading` de las imágenes,
canonical correcto, etiquetas Open Graph, `lang`, `viewport`, validez del
JSON-LD y `rel="noopener"`.

**El objetivo es cero problemas.** No «pocos».

### Search Console

- Verificar con la **etiqueta `<meta name="google-site-verification">`**, no
  con el fichero HTML. Con `cleanUrls` la ruta del fichero devuelve un 308 y
  Google rechaza la verificación con «el archivo redirige a una ubicación no
  autorizada». La etiqueta no depende de rutas.
- **No quitar la etiqueta después de verificar.** Google la vuelve a
  comprobar cada cierto tiempo y si desaparece pierdes la propiedad.
- Enviar el sitemap en Indexación → Sitemaps → `sitemap.xml`.
- Pedir indexación de la portada a mano acelera la primera aparición.

---

## 13. Despliegue: GitHub, Vercel y dominio

### Ramas

| Rama | Para qué | Dónde acaba |
|---|---|---|
| `main` | Lo que ve el cliente | Dominio de producción |
| `staging` | Pruebas y cambios en curso | URL de preview de Vercel |

Nunca se toca `main` directamente. Se trabaja en `staging`, se mira la
preview y se hace merge.

### Vercel

- Framework Preset: **Other**.
- `buildCommand: "node scripts/build.mjs"`, `outputDirectory: "."`.
- Production Branch: `main`.
- Variables de entorno en **los tres entornos** (production, preview,
  development). Es el olvido más habitual.

### La trampa de `vercel.json` que ya rompió una URL

**Vercel evalúa los `redirects` ANTES que los `rewrites`.** Un rewrite no
puede «rescatar» una ruta que ya tiene un redirect encima, incluido el 308
automático de `cleanUrls`. Intentarlo rompe además la URL limpia que
funcionaba.

Si `cleanUrls` estorba para algo concreto, se busca otra solución, no un
rewrite.

### DNS en IONOS

Para un dominio en IONOS apuntando a Vercel:

| Registro | Nombre | Valor |
|---|---|---|
| `A` | `@` | La IP que indique Vercel |
| `CNAME` | `www` | El host que indique Vercel |

- **TTL: 1 hora** está bien. Más corto no acelera la primera propagación.
- IONOS avisa de conflictos si ya hay registros del paquete de hosting: hay
  que **borrar los antiguos**, no añadir encima.
- Vercel emite el certificado solo. Puede tardar unos minutos después de que
  el DNS resuelva.

---

## 14. Legal

Tres páginas obligatorias: **aviso legal**, **privacidad** y **cookies**.
Se generan desde `build-pages.mjs`, de una constante `T` con los datos.

### Lo que exige la ley

- **LSSI-CE:** nombre o razón social, **CIF**, domicilio y correo de contacto.
  El CIF no es opcional.
- **RGPD:** qué datos se recogen, para qué, base legal, cuánto se conservan,
  quién los trata y cómo ejercer los derechos.
- **Cookies:** si no hay cookies ni terceros, se dice, y **no hace falta
  banner**. Es una ventaja competitiva: la mayoría de webs de la competencia
  llevan un banner porque cargan Google Analytics.

### Coherencia

La política de privacidad tiene que decir **exactamente** los campos que
guarda la base de datos. Si el formulario guarda nombre, correo y mensaje,
eso es lo que pone. Ni más ni menos. El `ip_hash` se declara como dato
técnico para prevenir abuso.

---

## 15. Proceso comercial

### Captación

El repositorio de QP Studio tiene los guiones completos en
`plantillas/captacion/`: llamada con once objeciones, mensajes escritos,
guion de vídeo y secuencia de seguimiento.

Las reglas que no se rompen:

- **El objetivo del primer contacto NUNCA es vender una web.** Es conseguir
  permiso para mandar un vídeo. Nadie compra algo de cuatro cifras en una
  llamada que no pidió; sí acepta que le mandes un WhatsApp.
- **Mira su web treinta segundos y encuentra UNA cosa concreta antes de
  llamar.** Sin observación específica, la llamada suena a agencia genérica y
  se nota en la primera frase.
- **Identifícate en la primera frase.** Nombre y de dónde.
- **Ofrece salida y cúmplela.** Un no te ahorra tiempo; insistir te quema el
  nombre en un sitio donde todos se conocen.
- **No mientas sobre de dónde sacaste el contacto.**
- **Llamar martes a jueves**, de 10:00 a 12:00 o de 16:00 a 18:00. Nunca lunes
  por la mañana ni viernes por la tarde. En hostelería, jamás entre las 13:00
  y las 16:00.
- Expectativa real: **de 20 llamadas contestan 8, aceptan el vídeo 2, te
  contesta 1.** Eso no es fracasar, es el oficio.

### Ganchos que funcionan, por orden

1. El teléfono no se puede pulsar desde el móvil
2. El pie de página pone un año viejo (parece cerrada)
3. Tarda más de cuatro segundos en cargar
4. No sale en Google al buscar su sector y su ciudad
5. El formulario no funciona
6. No hay web, solo una ficha de Facebook

Los dos primeros son los mejores: **cualquiera los entiende y dan vergüenza**.

### Herramientas del repositorio

```bash
node scripts/auditar-web.mjs dominio.es      # da el gancho hecho
node scripts/contactos-web.mjs dominio.es    # teléfonos, WhatsApp, correos, redes
```

### Fuentes de prospectos

- **Google Maps** por sector y ciudad, con filtro de aperturas nuevas.
- **BORME**, que sale todos los días laborables. **Usa el XML, no el PDF**:
  el PDF no deja extraer texto.
  `https://www.boe.es/diario_borme/xml.php?id=BORME-A-AAAA-NNN-P`
  Ojo: las sociedades recién constituidas **no tienen teléfono ni web todavía**.
  Sirven para visita presencial o carta, no para WhatsApp.

### Documentos para el cliente

En `plantillas/`, seis documentos con marcadores `{{ASI}}`:

| Archivo | Cuándo se manda |
|---|---|
| `01-presentacion.md` | Primer contacto, antes de la propuesta |
| `02-bienvenida-inicio.md` | Al confirmar el proyecto |
| `03-entrega-y-accesos.md` | El día que la web se publica |
| `04-guia-panel.md` | Con la entrega |
| `05-mantenimiento-soporte.md` | Con la entrega, o al renovar |
| `06-resumen-llamada.md` | En la hora siguiente a cualquier llamada |

Si al terminar buscas `{{` y no aparece nada, el documento está listo. Si un
apartado no aplica, **se borra entero**.

**El dominio va a nombre del cliente desde el principio.** Sale escrito en
varias plantillas y en la página de mantenimiento. Si no se cumple, esos
documentos se vuelven en tu contra el día que alguien se quiera ir.

---

## 16. Precios y facturación

Marco de trabajo, ajustable por proyecto.

- **Pago partido:** 50% al aceptar el presupuesto, 50% antes de publicar. El
  primer 50% no se devuelve si el cliente abandona: cubre el trabajo hecho.
- **Base + mantenimiento.** La base paga el proyecto; el mantenimiento es lo
  que hace el negocio sostenible.
- El mantenimiento se dice en concreto: «hasta dos horas al mes», «cambios de
  texto e imágenes», no «soporte completo». **No prometas 24/7** si no vas a
  contestar de madrugada.
- **Sin permanencia.** Si un mes decide parar, para. Sin penalización y sin
  llamadas de retención. Es un argumento de venta.
- Al preguntar el precio en una llamada, **da un rango y nunca lo esquives**.
  Esquivarlo parece que ocultas algo, y el rango filtra al que tiene 300 €.

**Factura GEST26.** Quique no es autónomo. La actividad se factura a través de
la empresa del padre. Antes de facturar hacen falta el CIF y el domicilio
social, y conviene que la gestoría revise los tres textos legales.

---

## 17. Errores ya cometidos, que no se repiten

Esta sección vale más que el resto junto.

**1. Dar por bueno un cambio mirando solo códigos HTTP.**
Se verificó un cambio de URLs limpias comprobando que devolvían 200. Los 200
estaban bien y la web estaba rota: un `SyntaxError` en JavaScript. **Un 200
solo dice que el servidor entregó un fichero.** Hay que mirar la consola y el
DOM.

**2. Un `querySelector` con un `href` que no empieza por `#`.**
`document.querySelector('/servicios')` lanza `SyntaxError` y **mata el IIFE
entero**, así que cayeron a la vez la órbita, las montañas y las cintas.
Siempre comprobar el prefijo antes, y **aislar cada bloque de animación en su
propio try/catch** para que un fallo no se lleve el resto.

**3. `git checkout` sobre un fichero con cambios sin commitear.**
Destruyó 45 marcadores `data-txt` que nunca se habían subido. Hubo que
rehacerlos a mano. Antes de descartar cambios, mirar qué hay dentro.

**4. Crear un componente CSS que ya existía.**
Se creó una clase `.pasos` que ya usaba otra página, y el número quedó pintado
encima del título. **Antes de crear una clase, buscarla en todo el CSS.**

**5. Reglas base al final del fichero ganando a un media query.**
En CSS, a igualdad de especificidad **gana la última**. Un bloque base escrito
después de su media query lo anula. Los bases van arriba.

**6. Especificidad ganando en silencio.**
`.pbody p { max-width: 68ch }` estrechaba `.inbox__head` sin que se notara.
Se arregló subiendo la especificidad a `.inbox .inbox__head`. Cuando algo «no
coge el estilo», casi siempre es esto.

**7. Confiar en `node -e` con comillas anidadas en Windows.**
Se rompe. **Escribe el script a un fichero y ejecútalo.** Lo mismo con los
heredocs largos.

**8. Un `<br>` oculto sin espacio detrás.**
En móvil se leía «Preguntasfrecuentes». Si escondes un salto de línea, deja el
espacio.

**9. Suponer que el navegador integrado renderiza.**
A veces está en `visibilityState: hidden` y el `IntersectionObserver` no se
dispara nunca. **Dilo en vez de fingir que has visto la página.**

**10. Rewrites para arreglar un redirect.** Ver la sección 13.

---

## 18. Comandos

```bash
npm run dev                              # web y funciones en localhost:4321
npm run build                            # construye todo. Es lo que corre Vercel
npm run migrate                          # aplica las migraciones pendientes

node scripts/auditar-seo.mjs             # objetivo: cero problemas
node scripts/aplicar-contenidos.mjs --forzar   # y DESHACER el cambio después
node scripts/fuentes.mjs                 # descarga woff2 y regenera fuentes.css

node scripts/clave-admin.mjs "la nueva"  # imprime ADMIN_CLAVE_HASH=...
node scripts/comprobar-clave.mjs         # dice si clave y hash cuadran
node scripts/desbloquear.mjs             # si te bloqueas a ti mismo

npx neon@latest auth
npx neon@latest link --org-id ORG --project-id PROYECTO
```

### Variables de entorno

| Variable | Para qué |
|---|---|
| `DATABASE_URL` | Conexión de las funciones, por el pooler |
| `DATABASE_URL_UNPOOLED` | Conexión directa, solo migraciones |
| `ADMIN_USUARIO` | Usuario del panel |
| `ADMIN_CLAVE_HASH` | Hash scrypt de la contraseña |
| `SESION_SECRETO` | Firma de la cookie y de los hashes de IP |
| `VERCEL_DEPLOY_HOOK` | URL del hook que usa el botón Publicar |

En local salen de `.env.local`. En Vercel hay que ponerlas en **los tres
entornos**.

---

## 19. Prohibiciones

**Técnicas**

- Nada de frameworks de frontend ni de CSS.
- Ninguna dependencia que no se pueda justificar en una frase.
- Nada de Google Fonts enlazado. Autoalojado siempre.
- Nada de Google Analytics ni terceros de seguimiento.
- Nada de guardar IPs en claro.
- Nada de comprobar credenciales en el navegador cuando hay servidor.
- Nada de editar una migración ya aplicada.
- Nada de que el build reescriba un fichero versionado en Git.

**De diseño**

- Web que parezca plantilla o generada automáticamente.
- Secciones de solo texto sobre fondo liso.
- Texto con gradiente.
- Desenfoque o escalado del contenido al hacer scroll.
- Etiquetas numeradas antes de los titulares.
- Poner la IA en el centro del discurso.
- Lenguaje de descuento barato.

**De trato**

- Miedo agresivo para describir los problemas del cliente.
- Prometer plazos que no se van a cumplir.
- Decir que algo está verificado cuando no lo está.

---

## 20. Antes de dar una web por terminada

- [ ] `node scripts/auditar-seo.mjs` a cero problemas
- [ ] Un solo `h1` por página, sin saltos de encabezado
- [ ] Todas las imágenes con `alt`, `width`, `height` y `loading`
- [ ] Canonical correcto en todas las páginas
- [ ] `og:image` de 1200×630 y menos de 200 KB
- [ ] `sitemap.xml` y `robots.txt` generados, con `admin` excluido
- [ ] Formulario probado de verdad, con el mensaje llegando a la base de datos
- [ ] Panel probado: entrar, editar, guardar, publicar, salir
- [ ] Probado sin JavaScript
- [ ] Probado con `prefers-reduced-motion`
- [ ] Probado en móvil real, no solo redimensionando la ventana
- [ ] Contraste verificado
- [ ] Aviso legal, privacidad y cookies con datos reales, sin marcadores
- [ ] Dominio con certificado y redirección de sin-www a con-www
- [ ] Search Console verificado y sitemap enviado
- [ ] Variables de entorno en los tres entornos de Vercel
- [ ] Contraseña del panel cambiada y comunicada al cliente por canal seguro
- [ ] Documentos `03-entrega-y-accesos.md` y `04-guia-panel.md` enviados

---

## 21. Datos pendientes a día de hoy

| Qué | Dónde se pone |
|---|---|
| **CIF de GEST26** | `T` en `build-pages.mjs` y `T` en `scripts/seo.mjs` |
| **Domicilio social de GEST26** | Los mismos dos sitios |
| **URL de LinkedIn** | Pie de página. Ahora apunta al LinkedIn genérico |
| **Aviso por correo de mensajes nuevos** | Pendiente de conectar Resend |

Después de tocar cualquiera de los dos primeros: `npm run build`.
