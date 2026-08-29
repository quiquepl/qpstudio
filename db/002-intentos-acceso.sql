-- Intentos de acceso fallidos al panel, para poder frenar la fuerza bruta.
--
-- Las funciones serverless no comparten memoria entre ejecuciones, así que un
-- contador en variables no sirve: cada petición podría caer en una instancia
-- distinta y empezar de cero. Por eso se cuenta en la base de datos.
--
-- Igual que en mensajes, no se guarda la IP sino un HMAC de la IP. Las filas
-- se borran solas al acertar, y las viejas se limpian en cada comprobación.

create table if not exists intentos_acceso (
  id        bigint generated always as identity primary key,
  ip_hash   text        not null,
  creado_en timestamptz not null default now()
);

create index if not exists intentos_acceso_idx
  on intentos_acceso (ip_hash, creado_en desc);
