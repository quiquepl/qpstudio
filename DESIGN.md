# DESIGN.md — Planelles Studio

Sistema real, tal y como está implementado en `css/styles.css` (tokens y base) y
`css/sections.css` (arte por sección).

## Voz visual

Tres palabras: **afilado, cercano, cuidado.** El objeto físico de referencia es
la tarjeta de un arquitecto impresa en tipografía gruesa sobre papel de gramaje
alto: mucho aire, una sola tinta fuerte, filetes finos.

Carril estético: **grotesca masiva sobre papel, con azul saturado como voz.**
No es la vía editorial (serif display + filetes + revista), que es hoy el reflejo
por defecto de medio internet. La serif aparece exactamente dos veces, como
contraste emocional, nunca como sistema.

## Tipografía

| Rol | Familia | Uso |
|---|---|---|
| Display | **Schibsted Grotesk** 700/800/900, tracking -0.032 a -0.052em | h1, h2, h3, cifras, wordmark |
| Interfaz y texto | **Geist** 400/500/600 | cuerpo, etiquetas, formulario, nav |
| Acento | **Libre Caslon Text** italic | solo 4 sitios: segunda mitad del H1, nota de servicios, cita de Sobre mí, cierre del CTA |

Ninguna de las tres está en la lista de reflejo (Inter, DM Sans, Instrument,
Playfair, Cormorant, Space Grotesk y compañía quedan descartadas por monocultivo).

Escala fluida con `clamp()`, razón ≥1.25 entre pasos. Titular del hero
`clamp(2.6rem, 6.6vw, 4.9rem)`: el tope está calculado para que ninguna línea
del hero envuelva a 1440px. Si se cambia el copy del hero, hay que volver a
comprobarlo.

## Color

Todo en **OKLCH**. Ni un `#000` ni un `#fff`: cada neutro está teñido hacia el
azul de marca (croma 0.005 a 0.04).

Estrategia: **committed**. Un azul saturado carga las dos secciones bisagra
(04 y el CTA final) y todos los acentos; el resto es papel.

| Token | Valor | Papel |
|---|---|---|
| `--paper` | `oklch(98.4% 0.005 265)` | fondo |
| `--ink` | `oklch(20% 0.038 265)` | texto principal |
| `--ink-2` | `oklch(41% 0.028 265)` | texto secundario |
| `--ink-3` | `oklch(52% 0.026 265)` | metadatos (mínimo que pasa 4.5:1) |
| `--blue` | `oklch(52% 0.235 262)` | acento y acción |
| `--blue-deep` / `--indigo` | `oklch(42% 0.215 265)` / `oklch(46% 0.215 282)` | extremos del gradiente |
| `--cyan` | `oklch(80% 0.125 210)` | chispa sobre oscuro |
| `--night` | `oklch(17.5% 0.045 265)` | secciones invertidas |
| `--ember` | `oklch(62% 0.175 42)` | tensión, reservado |

Gradientes de marca: `--grad-blue` (115°, deep → blue → indigo) y `--grad-lift`
(160°, lift → blue → indigo). El fondo global `.atmos` son tres manchas
radiales desplazadas por `--scroll`, no un degradado plano.

**Contraste verificado**: todo el texto por encima de 4.5:1 (o 3:1 si es grande).
`--ink-3` está exactamente en el borde; no aclararlo.

## Espacio

- Shell 1216px, padding lateral `clamp(1.25rem, 5vw, 4rem)`.
- Separación entre secciones `--stack: clamp(4.5rem, 8.4vw, 8rem)`.
- Radios: 8 / 14 / 22 / 30px. Botones en píldora.
- Rejillas rotas a propósito: la de problemas es 6 columnas con tramos 3-3-2-2-2-6,
  la de servicios 2 grandes + 2 medianos. Nada de seis tarjetas idénticas.

## Movimiento

Un solo sistema. Curvas: `--ease` (out-expo `0.16,1,0.3,1`), `--ease-q`
(out-quart), `--ease-io`. Cero bounce, cero elastic. Duraciones 140 / 240 / 460 /
780 ms.

Piezas, todas sin librerías:

1. **Entrada única** (`[data-reveal]`): opacidad + 18px + desenfoque, escalonada
   con `--rd`. Los titulares usan máscara: `.line` con `overflow:hidden` y la
   línea subiendo desde dentro.
2. **Zoom cinematográfico del hero**: `--hero-out` (0→1) escala, sube, desenfoca
   y baja opacidad del hero mientras la web pasa por encima.
3. **Escena 3D**: `perspective: 1500px` + `preserve-3d`, tres maquetas a
   distintas `translateZ` que se inclinan con `--mx`/`--my` del puntero, más dos
   órbitas en `rotateY` infinito.
4. **Partículas**: canvas propio, densidad por área, DPR tope 2, hilos limitados
   a 2 por punto, el puntero las aparta. En pausa fuera de pantalla y con la
   pestaña oculta.
5. **Bucles**: cinta de verdades entre secciones, en pausa al pasar el ratón.
6. **Línea de proceso**: `--fill` escala en Y siguiendo la altura de la mirada
   (55% del viewport) y enciende cada paso.
7. **Comparador antes/después**: `clip-path` sobre `--pos`. Al entrar en pantalla
   hace un barrido en dos tiempos para que se entienda que se arrastra.
8. **Hover**: botones magnéticos (`--tx`/`--ty`), foco radial que sigue al cursor
   en tarjetas (`--px`/`--py`), halo de sección en las dos oscuras (`--sx`/`--sy`).

Las variables vivas están registradas con `@property` y tipo, para que un valor
inválido del JS no invalide una transformación entera.

`prefers-reduced-motion` apaga partículas, parallax, bucles y zoom, y muestra
todo el contenido de golpe.

## Prohibiciones asumidas

- Sin texto con gradiente (`background-clip: text`).
- Sin bordes laterales de color como acento.
- Cristal (`backdrop-filter`) solo donde hay algo detrás que justifique leerlo
  a través: nav, chip del hero, tarjeta de plazas y formulario del CTA.
- Sin la plantilla de "número gigante + etiqueta + tres cifras" como héroe.
- Sin rejillas de tarjetas idénticas.
- Sin em dashes en el copy.
