-- Mensajes del formulario de contacto.
--
-- Los campos que se guardan son exactamente los que declara la política de
-- privacidad: nombre, correo y mensaje. Nada más de la persona.
--
-- ip_hash no es una IP: es un hash irreversible de la IP con un secreto del
-- servidor, y existe solo para poder limitar el número de envíos seguidos
-- desde el mismo sitio. No permite recuperar la dirección original ni
-- cruzarla con nada.

create table if not exists mensajes (
  id         bigint generated always as identity primary key,
  nombre     text        not null,
  email      text        not null,
  mensaje    text        not null,
  origen     text,
  ip_hash    text,
  leido      boolean     not null default false,
  creado_en  timestamptz not null default now()
);

-- La bandeja se lee siempre por fecha descendente.
create index if not exists mensajes_creado_en_idx
  on mensajes (creado_en desc);

-- Índice parcial: solo indexa lo no leído, que es lo que se cuenta para el
-- aviso del panel. Ocupa una fracción de un índice completo.
create index if not exists mensajes_sin_leer_idx
  on mensajes (creado_en desc) where not leido;

-- Para el límite de envíos: busca por hash dentro de una ventana de tiempo.
create index if not exists mensajes_ip_hash_idx
  on mensajes (ip_hash, creado_en desc);
