# DESIGN.md — Planelles Studio

Sistema real, tal y como está en `css/styles.css` (tokens y base),
`css/sections.css` (arte por sección) y `js/motion.js` (todo el movimiento).

## Voz visual

**Blanco y negro por tonos, con el azul del logo como único color.** Todo lo
demás es una escala de grises de once pasos. Cuando aparece azul, significa
algo: es acción, es marca o es el elemento vivo de la pantalla.

La web tiene que ser **supervisual**. No hay ni un bloque de solo texto sobre
fondo blanco: cada sección lleva imagen, maqueta, canvas o fondo propio.

## Tipografía

Tres familias, cada una con un trabajo distinto.

| Rol | Familia | Dónde |
|---|---|---|
| Secciones | **Archivo** 700/800/900, tracking -0.042em | todos los h2, h3, botones, cifras, wordmark |
| Hero | **Libre Caslon Text** 400 | solo el titular del hero y las dos citas |
| Texto | **Geist** 400/500/600 | párrafos, etiquetas, formulario |

El hero se queda en serif a propósito: es lo único de la versión anterior que
funcionaba tal cual. El resto va en grotesca pesada y muy apretada.

Ninguna de las tres está en la lista de reflejo (Inter, DM Sans, Playfair,
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
| 2 | El coste | papel | tres dibujos animados, uno por motivo |
| 3 | Constelación | papel + halo azul | ocho mini webs flotando, enlazadas al centro |
| 4 | Servicios | oscuro | cintas 3D en canvas |
| 5 | Antes / Después | degradado azul | comparador arrastrable |
| 6 | Tuya de verdad | oscuro | cintas 3D + maqueta de edición en directo |
| 7 | Estudio | papel | retrato |
| 8 | Final | oscuro | portátil 3D que se abre y se acerca |

**No hay etiquetas introductorias de sección** (el `01 ——— EL COSTE INVISIBLE`
de la versión anterior). Se quitaron todas a petición de Quique. No volver a
meterlas.

## Las cuatro piezas de movimiento

Todo en `js/motion.js`, sin librerías. Curva única `--ease` (out-expo), cero
bounce. Sin desenfoques ni escalados del contenido al hacer scroll.

**1. Cordillera tramada (hero).** Búfer de canvas a 0.42 de resolución escalado
con `image-rendering: pixelated`, para que el punto salga gordo. Crestas de
multifractal en cresta, caída de tinta precalculada en tablas, matriz de Bayer
8x8 y un ruido fijo por píxel contra el bandeado. Cuatro capas con parallax.

**2. Cintas 3D (secciones oscuras).** Veinte bandas onduladas trazadas con un
degradado horizontal cuyo brillo viaja. Superpuestas dan pliegues con volumen.
Se dibujan a 30 fps.

**3. Constelación de webs.** Ocho maquetas colocadas en porcentajes alrededor
del texto central. Cada una flota en su propio bucle (`--dur` y `--d` distintos
por tarjeta) y todo el conjunto se inclina con `--mx`/`--my` del puntero. Un SVG
recalcula las ocho líneas de puntos que las enlazan al centro mientras la
sección está a la vista.

Al mover una tarjeta hay que comprobar que no pisa el bloque central: pasó con
«Clínica dental» y «Gimnasio» y hubo que apartarlas.

**4. El portátil final.** Un raíl de 320svh (240 en móvil) con un bloque
`sticky` dentro. El progreso del scroll escribe cuatro variables en la sección:

| Variable | Tramo | Qué hace |
|---|---|---|
| `--lid` | p 0 → 0.30 | la tapa se abre de -88° a 0° |
| `--zoom` | p 0.20 → 0.68 | la cámara entra 1180px en la pantalla |
| `--panel` | p 0.60 → 0.82 | el contacto aparece y el portátil se apaga |

El formulario **no** va dentro de la pantalla escalada: es una capa aparte que
entra por encima. Así se lee y se usa perfecto en el punto final, en vez de ser
texto diminuto ampliado.

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

El logo va en `img/logo.png`. Si falta, el wordmark cae en un SVG geométrico
de repuesto y la web no se rompe, pero pierde la marca.
