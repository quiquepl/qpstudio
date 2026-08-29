# DESIGN.md — QP Studio

Sistema real, tal y como está en `css/styles.css` (tokens y base),
`css/sections.css` (arte por sección) y `js/motion.js` (todo el movimiento).

## Voz visual

**Blanco y negro por tonos, con el azul del logo como único color.** Todo lo
demás es una escala de grises de once pasos. Cuando aparece azul, significa
algo: es acción, es marca o es el elemento vivo de la pantalla.

La web tiene que ser **supervisual**. No hay ni un bloque de solo texto sobre
fondo blanco: cada sección lleva imagen, maqueta, canvas o fondo propio.

## Tipografía

Dos familias. Nada de serif: la web es seria.

| Rol | Familia | Dónde |
|---|---|---|
| Titulares | **Archivo** 800/900, tracking -0.042em | hero, h2, h3, botones, wordmark |
| Texto | **Geist** 400/500/600 | párrafos, etiquetas, formulario |

Archivo pesada y muy apretada es la referencia que pidió Quique (el estilo
«Norvik Slowhouse»). El hero también va en Archivo desde la última vuelta.

Ninguna de las dos está en la lista de reflejo (Inter, DM Sans, Playfair,
Cormorant, Instrument y compañía quedan descartadas por monocultivo).

## Color

Escala tonal `--t-00` a `--t-90` en OKLCH, matiz 250, croma 0.002 a 0.026. Ni
`#000` ni `#fff`.

| Token | Valor | Papel |
|---|---|---|
| `--t-00` | `oklch(98.4% 0.002 250)` | fondo |
| `--t-40` | `oklch(63% 0.010 250)` | segunda línea de los titulares (`.soft`) |
| `--t-50` | `oklch(50% 0.012 250)` | metadatos. El gris más claro que pasa 4.5:1 |
| `--t-80` | `oklch(19% 0.022 250)` | texto principal |
| `--t-90` | `oklch(13.5% 0.026 255)` | fondo de las secciones oscuras |
| `--blue` | `oklch(56% 0.215 258)` | acción y marca |
| `--blue-sky` | `oklch(80% 0.130 230)` | azul sobre fondo oscuro |
| `--blue-wash` | `oklch(95% 0.035 250)` | fondos teñidos muy suaves |

La jerarquía de los titulares es **tonal**: primera línea en tinta, segunda en
`--t-40`. Mismo tamaño, mismo peso.

Contraste verificado en todo el texto: mínimo 4.5:1, o 3:1 en tamaños grandes.

## Estructura

Alternancia claro / oscuro para que no haya dos bloques seguidos iguales.

| # | Sección | Fondo | Pieza visual |
|---|---|---|---|
| 1 | Hero | papel | cordillera tramada animada |
| 2 | La primera impresión | foto a sangre | banda oscura, entradilla, tres motivos y remate |
| 3 | Nuestro trabajo | aura viva | ocho webs en órbita continua |
| 4 | Nuestros servicios | oscuro | cintas 3D en canvas |
| 5 | Antes y después | degradado azul | comparador con hero de taller, sin cifras |
| 6 | Tuya de verdad | oscuro | cintas 3D + maqueta de edición |
| 7 | El estudio | papel | retrato |
| 8 | Preguntas frecuentes | aura viva | cuatro desplegables |
| 9 | Final | aura viva | formulario de contacto |

**No hay etiquetas introductorias de sección** (el `01 ——— EL COSTE INVISIBLE`
de la versión anterior). Se quitaron todas a petición de Quique. No volver a
meterlas.

## Las cuatro piezas de movimiento

Todo en `js/motion.js`, sin librerías. Curva única `--ease` (out-expo), cero
bounce. Sin desenfoques ni escalados del contenido al hacer scroll.

**1. Cordillera tramada (hero).** Se mueve sola y **además con el scroll**:
cada capa lleva su propio factor de parallax, así que al bajar la cordillera se
abre en profundidad.
 Búfer de canvas a 0.42 de resolución escalado
con `image-rendering: pixelated`, para que el punto salga gordo. Crestas de
multifractal en cresta, caída de tinta precalculada en tablas, matriz de Bayer
8x8 y un ruido fijo por píxel contra el bandeado. Cuatro capas con parallax.

**2b. Partículas de transición.** Al entrar en la banda del coste, un puñado de
puntos con el mismo grano que las montañas cae desde el borde superior y se
apaga. Cada partícula tiene un umbral fijo, así que desaparece de golpe en vez
de parpadear. Es solo decoración: `pointer-events: none` y por debajo del texto.

**2. Cintas 3D (secciones oscuras).** Veinte bandas onduladas trazadas con un
degradado horizontal cuyo brillo viaja. Superpuestas dan pliegues con volumen.
Se dibujan a 30 fps.

**3. Webs en órbita.** Ocho maquetas girando en círculo alrededor del texto,
**sin parar y sin pausa al pasar el ratón**.

La técnica es rotación anidada: un brazo de tamaño cero gira desde el centro y
la tarjeta gira lo mismo al revés, así que orbita pero se mantiene derecha. Dos
animaciones más, con la misma duración y el mismo retardo, se encargan de la
profundidad (escala y opacidad) y del z-index, para que la mitad de abajo pase
por delante del texto y la de arriba por detrás.

Todo son animaciones CSS **a propósito**: corren en el compositor y el scroll no
las afecta. La versión con `requestAnimationFrame` daba tirones.

Antes de esto se probó con `offset-path: ellipse()`, y **no sirve**:
`offset-distance` avanza por longitud de arco, no por ángulo, así que en una
elipse alargada las tarjetas se amontonaban en unos sitios y dejaban huecos en
otros. Por eso la órbita es circular: en un círculo el arco y el ángulo
coinciden y el reparto sale exacto sin cuentas.

El radio lo calcula `motion.js` para que el anillo no pise el bloque de texto
por los lados ni se salga del campo por arriba y por abajo.

**4. El final.** Ya no hay ordenador. La última sección es el formulario de
contacto sobre el aura, sin raíl ni secuencia de imágenes.

Los canvas se paran fuera de pantalla y con la pestaña oculta.
`prefers-reduced-motion` congela las cordilleras, quita el portátil y deja el
formulario suelto y legible. Lo mismo hace la clase `no-3d` cuando no hay JS.

## Prohibiciones asumidas

- Sin etiquetas introductorias numeradas antes de los titulares.
- Sin desenfoque ni escalado del contenido al hacer scroll.
- Sin secciones de solo texto sobre fondo liso. Todo bloque lleva imagen.
- Sin texto con gradiente (`background-clip: text`).
- Sin em dashes en el copy.
- Poco texto: manda el diseño. Las explicaciones largas van a subapartados.

## Imágenes

Las fotos son de Unsplash y todos los IDs están comprobados. Van en
**escala de grises** (`filter: grayscale(1)`) para que no rompan la paleta.

En el nav **solo va el logo**, sin wordmark. El archivo es `img/logo.png`. Si
falta, cae en un monograma QP dibujado en SVG con el degradado azul: queda
decente, pero no es el cromado del logo real.

La maqueta del taller (el «después» del comparador) **no lleva una gota de
azul**: negro, blanco y un ámbar `#f0a03c`. Es la web de un cliente, no la
nuestra, y tiene que verse de su sector.


## Aura

Fondo vivo de cuatro manchas azules desenfocadas que se desplazan muy despacio,
con una capa de grano encima. Va en la sección de trabajo y en las preguntas
frecuentes. Detrás de todo, `pointer-events: none`, y se congela con
`prefers-reduced-motion`.

## Páginas y administración

La navegación es Inicio, Servicios, Gestión y Contacto. Las páginas interiores se
generan con `node build-pages.mjs` desde una cabecera y un pie comunes.

`admin.html` tiene acceso con usuario y contraseña y tres pestañas: editar
textos (nueve secciones, cuarenta campos, con guardar y restaurar por sección),
añadir secciones (seis tipos de bloque) y mensajes recibidos.

**El acceso se comprueba en el navegador, así que no es seguridad real.** Sirve
para trabajar mientras no haya servidor. Los cambios se guardan en
`localStorage`. En cuanto exista backend, la comprobación y el guardado tienen
que moverse allí.


## Acceso al panel

El enlace «Admin» del pie no lleva directamente a la página: abre una ventana
centrada con el logo y el formulario de acceso. Si las credenciales son
correctas, guarda la sesión y entra. `admin.html` va sin cabecera de página:
logo, título y directo al panel.
