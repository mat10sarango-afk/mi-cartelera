-- Noche de película · Migración 001 · Spec 01

-- Sesiones guardadas
create table sesiones (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references auth.users (id) on delete cascade default auth.uid(),
  nombre            text check (nombre is null or char_length(nombre) between 1 and 60),
  tiempo_disponible integer not null check (tiempo_disponible between 30 and 600),
  pausa_minutos     integer not null check (pausa_minutos >= 0),
  created_at        timestamptz not null default now()
);

-- Películas de cada sesión: una copia de lo que había al guardar
create table sesion_peliculas (
  id               bigint generated always as identity primary key,
  sesion_id        uuid not null references sesiones (id) on delete cascade,
  user_id          uuid not null references auth.users (id) on delete cascade default auth.uid(),
  orden            integer not null check (orden >= 1),
  tmdb_id          integer not null,
  titulo           text not null,
  poster_url       text,
  duracion_minutos integer not null check (duracion_minutos >= 1),
  unique (sesion_id, orden),
  unique (sesion_id, tmdb_id)
);

create index sesiones_user_id_created_at_idx on sesiones (user_id, created_at desc);
create index sesion_peliculas_sesion_id_idx on sesion_peliculas (sesion_id);

-- RLS
alter table sesiones enable row level security;
alter table sesion_peliculas enable row level security;

create policy "ver sesiones propias"
  on sesiones for select to authenticated using (auth.uid() = user_id);
create policy "insertar sesiones propias"
  on sesiones for insert to authenticated with check (auth.uid() = user_id);
create policy "borrar sesiones propias"
  on sesiones for delete to authenticated using (auth.uid() = user_id);

create policy "ver películas de sesiones propias"
  on sesion_peliculas for select to authenticated using (auth.uid() = user_id);
create policy "insertar películas en sesiones propias"
  on sesion_peliculas for insert to authenticated
  with check (
    auth.uid() = user_id
    and exists (select 1 from sesiones s where s.id = sesion_id and s.user_id = auth.uid())
  );

-- Guarda una sesión y todas sus películas en una sola operación
create or replace function guardar_sesion(
  p_nombre            text,
  p_tiempo_disponible integer,
  p_pausa_minutos     integer,
  p_peliculas         jsonb
) returns uuid
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_sesion_id uuid;
begin
  if p_peliculas is null
     or jsonb_typeof(p_peliculas) <> 'array'
     or jsonb_array_length(p_peliculas) = 0 then
    raise exception 'La sesión necesita al menos una película.' using errcode = '22023';
  end if;

  insert into sesiones (nombre, tiempo_disponible, pausa_minutos)
  values (nullif(btrim(p_nombre), ''), p_tiempo_disponible, p_pausa_minutos)
  returning id into v_sesion_id;

  insert into sesion_peliculas (sesion_id, orden, tmdb_id, titulo, poster_url, duracion_minutos)
  select v_sesion_id, p.orden, p.tmdb_id, p.titulo, p.poster_url, p.duracion_minutos
  from jsonb_to_recordset(p_peliculas)
       as p(orden integer, tmdb_id integer, titulo text, poster_url text, duracion_minutos integer);

  return v_sesion_id;
end;
$$;

revoke all on function guardar_sesion(text, integer, integer, jsonb) from public;
grant execute on function guardar_sesion(text, integer, integer, jsonb) to authenticated;
