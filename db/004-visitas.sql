-- Analítica propia, sin cookies y sin terceros.
--
-- `visitante` no identifica a nadie: es un HMAC de la IP y el navegador
-- mezclado con la fecha del día. Como la fecha entra en el hash, el mismo
-- visitante genera un valor distinto cada día, así que sirve para contar
-- cuánta gente entró hoy pero no para seguir a nadie de un día para otro.
-- Por eso no hace falta banner de consentimiento.

create table if not exists visitas (
  id        bigint generated always as identity primary key,
  ruta      text        not null,
  referente text,
  visitante text        not null,
  dia       date        not null default current_date,
  creado_en timestamptz not null default now()
);

create index if not exists visitas_dia_idx on visitas (dia desc);
create index if not exists visitas_dia_ruta_idx on visitas (dia desc, ruta);
create index if not exists visitas_dia_visitante_idx on visitas (dia, visitante);
