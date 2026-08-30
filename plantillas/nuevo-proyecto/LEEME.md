# Arrancar un proyecto nuevo

Dos archivos. Se copian a la carpeta del cliente y ya está.

```
QPSTUDIO.md   el manual del estudio. NO se toca por cliente
CLAUDE.md     los datos de ESTE cliente. Se rellena entero
```

## Por qué dos y no uno

`CLAUDE.md` lo lee Claude Code **solo**, sin que tengas que decirle nada, en
cuanto abres una sesión en esa carpeta. Y su primera línea, `@QPSTUDIO.md`,
arrastra el manual entero.

O sea: abres Claude Code en la carpeta del cliente y ya sabe quién eres, cómo
trabajas, cómo se monta la web y qué no se hace nunca. **No hace falta que le
mandes nada ni que le expliques el proyecto otra vez.**

## Cómo se usa

```bash
mkdir "C:\Users\quiqu\Desktop\CLIENTES\nombre-del-cliente"
cp plantillas/nuevo-proyecto/QPSTUDIO.md plantillas/nuevo-proyecto/CLAUDE.md "C:\Users\quiqu\Desktop\CLIENTES\nombre-del-cliente"
```

Luego rellenas `CLAUDE.md`. Todo lo que va entre llaves dobles se sustituye.
Cuando busques `{{` y no aparezca nada, está listo.

**Rellénalo antes de la primera sesión**, no durante. Diez minutos ahí ahorran
media hora de preguntas después.

Si un apartado no aplica a ese cliente, **bórralo entero**. Mejor corto que
lleno de «no procede».

## Cómo se mantiene

`QPSTUDIO.md` es un documento vivo. Cuando en un proyecto se aprenda algo que
sirva para todos los siguientes, se anota en **la copia maestra**, que es esta:

```
plantillas/nuevo-proyecto/QPSTUDIO.md
```

Y de ahí se copia a los proyectos que sigan activos. Si lo anotas solo en la
carpeta de un cliente, el siguiente proyecto no se entera.

Las secciones que más van a crecer son la **17 (errores ya cometidos)** y la
**5 (lecciones técnicas)**. Son las que más tiempo ahorran.

## Qué NO va en estos archivos

- Contraseñas, tokens ni cadenas de conexión. Eso va en `.env.local`, que no
  se sube a Git.
- Datos personales del cliente más allá del contacto de trabajo.
- El código. El manual explica el criterio; el código se lee del repositorio.
