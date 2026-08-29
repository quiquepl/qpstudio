-- Textos editables desde el panel.
--
-- Un par clave/valor por campo. La clave es la misma que usa el panel
-- ('hero.t1', 'faq.2', …) y el valor es el texto que sustituye al que viene
-- escrito en el HTML.
--
-- Solo se guardan los campos CAMBIADOS. Si una clave no está en la tabla, se
-- queda el texto original del fichero. Así el sitio sigue funcionando aunque
-- la tabla esté vacía, y volver a lo de antes es borrar una fila.

create table if not exists contenidos (
  clave        text primary key,
  valor        text        not null,
  actualizado  timestamptz not null default now()
);

-- Registro de publicaciones, para saber en el panel si lo guardado ya está
-- en la web o falta publicarlo.
create table if not exists publicaciones (
  id        bigint generated always as identity primary key,
  usuario   text,
  creado_en timestamptz not null default now()
);
