# DESIGN.md — Planelles Studio

Sistema real, tal y como está implementado en `css/styles.css` (tokens y base),
`css/sections.css` (arte por sección) y `js/motion.js` (las cordilleras).

## Voz visual

Tres palabras: **sobrio, artesanal, sin ruido.**

El objeto físico de referencia es un grabado impreso a un solo color sobre papel
de buen gramaje. De ahí sale todo: la escala de grises, la serif de texto y,
sobre todo, la trama de puntos. Nada de color, nada de degradados de marca,
nada de brillos.

Carril estético: **monocromo tramado a un bit.** La imagen de la web no es una
foto ni un icono: es una cordillera dibujada punto a punto en tiempo real.

## Color

No hay color. Hay una **escala tonal de once pasos** del papel a la tinta,
`--t-00` a `--t-90`, en OKLCH con un croma de 0.0025 a 0.006 en el matiz 85
(cálido). Esa pizca de croma es lo que evita que el gris salga clínico.

Ni `#000` ni `#fff` en ningún sitio.

| Token | Valor | Papel |
|---|---|---|
| `--t-00` | `oklch(98.2% 0.0025 85)` | fondo |
| `--t-40` | `oklch(64% 0.005 85)` | segunda línea de los titulares (`.soft`) |
| `--t-50` | `oklch(51% 0.005 85)` | metadatos. Es el gris más claro que pasa 4.5:1 |
| `--t-60` | `oklch(39% 0.005 85)` | texto secundario |
| `--t-80` | `oklch(21% 0.006 85)` | texto principal |
| `--t-90` | `oklch(15.5% 0.006 85)` | fondo del CTA |

**La jerarquía es tonal, no de peso.** Los titulares van todos en el mismo
tamaño y el mismo peso: la primera línea en tinta y la segunda en `--t-40`. Ese
contraste hace el trabajo que en otras webs hace el color.

Contraste verificado en todo el texto: mínimo 4.5:1, o 3:1 en tamaños grandes.
`--t-50` está justo en el borde; no aclararlo.

## Tipografía

Dos familias, y las dos trabajan.

| Rol | Familia | Uso |
|---|---|---|
| Display | **Libre Caslon Text** 400 (italic para acentos) | h1, h2, cifras, índices, wordmark |
| Interfaz y texto | **Geist** 400/500/600 | cuerpo, etiquetas, nav, formulario, h3 |

Libre Caslon en regular y a gran tamaño es lo que da el aire de grabado. No se
usa en negrita salvo en el wordmark. Ninguna de las dos está en la lista de
reflejo (Inter, DM Sans, Playfair, Cormorant, Instrument y compañía quedan
descartadas por monocultivo).

Escala fluida con `clamp()`. El titular del hero es
`clamp(2.05rem, 4.6vw, 3.65rem)`: el tope está calculado para que la segunda
línea no envuelva a 1280px. Si se cambia ese copy, hay que volver a comprobarlo.

## Textura: la trama

Es el único elemento decorativo de la marca, y aparece en tres sitios:

1. **Las cordilleras** del hero y del CTA (canvas, animadas).
2. El **filete de puntos** sobre cada motivo de la sección 01 (`--dots`).
3. El **hueco de la foto** mientras no haya retrato real.

`--dots` es un `radial-gradient` de 0.5px repetido cada 3px. Usa `currentColor`,
así que hereda el tono de donde se ponga.

## Las cordilleras

Están en `js/motion.js` y no dependen de ninguna librería.

- El búfer del canvas se dibuja a **0.42 de la resolución** y el CSS lo escala
  con `image-rendering: pixelated`. Por eso el punto sale gordo y nítido, como
  una impresión a un bit, en vez de un degradado suave.
- Cada capa es una línea de cresta sacada de un **multifractal en cresta**
  (`1 - |2n - 1|` al cuadrado, tres octavas). Eso da picos afilados en lugar de
  lomas redondas.
- Debajo de cada cresta la tinta **decae exponencialmente**. Las tablas de caída
  se precalculan al medir, así el bucle de píxeles no llama nunca a `Math.exp`.
- Una **matriz de Bayer 8x8** decide si cada píxel se enciende. Eso es el
  tramado. Un ruido fijo por píxel (±0.037) rompe las bandas del tramado
  ordenado sin parpadear, porque no depende del tiempo.
- Cuatro capas, de lejos a cerca. La cercana va más abajo, más oscura y se
  mueve más rápido: eso es el parallax. En móvil son tres.
- **Ninguna capa llega a tinta plena** (máximo 0.70). La trama tiene que
  respirar.
- Se dibuja a **30 fps** (un fotograma sí y otro no). Es un movimiento lento y
  así el coste se parte por dos. En pausa fuera de pantalla y con la pestaña
  oculta.

En el CTA la misma función se dibuja en negativo: puntos de papel sobre tinta.

## Espacio

- Shell 1152px, padding lateral `clamp(1.25rem, 5vw, 3.5rem)`.
- Separación entre secciones `--stack: clamp(4.5rem, 8vw, 7.5rem)`.
- Radios: 6 / 12 / 18 / 26px. Botones en píldora.
- Separadores: un filete de 1px que se desvanece por los lados, nunca una caja.
- **Casi no hay tarjetas.** Los motivos de la sección 01 son columnas con un
  filete de puntos encima. Los servicios son una lista de cuatro filas. Encajar
  todo en rectángulos con borde era la respuesta fácil.

## Movimiento

Un solo sistema. Curva `--ease` (out-expo `0.16,1,0.3,1`), cero bounce.
Duraciones 140 / 240 / 460 / 760 ms.

1. **Entrada**: opacidad y 14px de subida, escalonada con `--rd`. Los titulares
   suben desde dentro de su propia máscara (`.line` con `overflow: hidden`).
   **Sin desenfoque y sin zoom**: molestaban al leer y se quitaron a propósito.
   No volver a meterlos.
2. **Cordilleras**: descritas arriba. Es el movimiento principal de la web.
3. **Comparador antes/después**: `clip-path` sobre `--pos`, con un barrido en
   dos tiempos al entrar en pantalla para que se entienda que se arrastra.
4. **Hover**: botones magnéticos (`--tx`/`--ty`), filas de servicio que se
   indentan, filete de puntos que se oscurece.

`prefers-reduced-motion` congela las cordilleras en un fotograma y muestra todo
el contenido de golpe.

## Prohibiciones asumidas

- Nada de color. Si algún día entra un acento, será uno y con motivo.
- Sin texto con gradiente (`background-clip: text`).
- Sin desenfoque ni escalado del contenido al hacer scroll.
- Cristal (`backdrop-filter`) solo en el nav, donde hay algo detrás que hay que
  leer a través.
- Sin rejillas de tarjetas idénticas.
- Sin em dashes en el copy.

## Estructura de la home

Deliberadamente corta. Cuatro secciones numeradas y un cierre.

1. Hero con la cordillera
2. `01` El coste invisible (tres motivos)
3. `02` Servicios (cuatro filas)
4. `03` Antes / Después (comparador)
5. `04` Estudio (quién lo hace)
6. CTA con la cordillera en negativo
7. Footer

Proceso, plazas abiertas y portfolio quedan para subapartados propios. No
volver a meterlos en la home.
