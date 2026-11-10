# Spec 01 · Noche de película (E2)

- **Historias:** HU-2.1 a HU-2.6.
- **Origen:** [docs/backlog/E2-noche-de-pelicula.md](../backlog/E2-noche-de-pelicula.md), [docs/backlog/refinamiento-E2.md](../backlog/refinamiento-E2.md) y [docs/prd/goldenmovies.md](../prd/goldenmovies.md).
- **Tickets:** T-01 a T-11.
- **Interfaz:** [docs/specs/02-interfaz-noche-de-pelicula.md](02-interfaz-noche-de-pelicula.md), que cita [DESIGN.md](../../DESIGN.md).

Esta spec no reescribe el Proyecto 3: todo lo nuevo va en archivos nuevos. Solo se modifican `package.json`, `pnpm-lock.yaml`, `src/App.tsx`, `src/main.tsx`, `index.html` y `src/components/Navbar.tsx`, y en esos archivos solo se agregan líneas: no se quita ni se cambia ninguna de las existentes.

## 0. Decisiones de esta spec
1. **Las constantes viven en el dominio.** `TIEMPO_MINIMO` = 30, `TIEMPO_MAXIMO` = 600, `PAUSA_MINUTOS` = 10 y `NOMBRE_MAXIMO` = 60, en `src/dominio/sesion.ts`. Ningún componente escribe esos números.
2. **La sesión guardada es una copia.** `sesion_peliculas` guarda título, póster y duración, y no tiene clave foránea hacia `mi_lista`. Así borrar una película de la lista, cambiar su estado o cambiar su duración en el catálogo no toca la sesión (decisión 4).
3. **El guardado es una sola operación.** Una función de la base de datos, `guardar_sesion`, inserta la sesión y todas sus películas juntas. Si algo falla, no queda nada a medias.
4. **No hay política de actualización.** Las sesiones no se modifican (decisión 3). Las películas de una sesión solo se borran en cascada al borrar la sesión.
5. **`user_id` también está en `sesion_peliculas`.** Evita consultar la sesión para saber de quién es una fila; la política de inserción comprueba además que la sesión sea del mismo usuario.
6. **La duración sale de `runtime` del catálogo.** Un valor ausente, 0, negativo o no entero se normaliza a `null` (sin duración conocida).
7. **El orden de los motivos en `evaluarSesion` es fijo:** tiempo inválido, luego duración desconocida, luego exceso.
8. **Las duraciones se consultan al abrir la pantalla**, para todas las películas «por ver», en lotes de 10 en paralelo, y se recuerdan en memoria mientras la app esté abierta. Un fallo no se recuerda, para poder reintentar.
9. **Contar caracteres.** El nombre se cuenta por caracteres reales (`Array.from(nombre).length`), igual que `char_length` en la base de datos.
10. **La fecha se muestra en la hora local del navegador.** `created_at` lo pone el servidor.
11. **La clave del catálogo** es la misma variable de entorno que ya usa el proyecto. Su exposición en el navegador es el riesgo R-01 de `docs/ESTADO-INICIAL.md` y no se corrige aquí.

## 1. Base de datos (Supabase)
Archivo: `supabase/migraciones/001_noche_de_pelicula.sql`. No toca `mi_lista`.

```sql
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
```

- **Por qué `security invoker`:** la función corre con los permisos de quien la llama, así que las políticas RLS se siguen aplicando. Nadie puede guardar una sesión a nombre de otro.
- **Sin política de `update`:** una sesión guardada no se puede modificar, ni desde la app ni saltándosela (HU-2.5-CA9).
- **Sin política de `delete` en `sesion_peliculas`:** sus filas solo desaparecen al borrar la sesión, por la cascada.
- **`unique (sesion_id, tmdb_id)`:** impide repetir una película dentro de una misma sesión (R17). La misma película sí puede estar en otras sesiones (R12).
- **La regla «cabe» no se valida en la base de datos.** Vive en el dominio. Validarla también en la base es un opcional con puntos extra (HU-2.10) y requiere su propia historia.
- **Datos de prueba:** las cuentas de prueba se crean desde la app. No hay datos sembrados.

## 2. Tipos de TypeScript
Archivo: `src/types/noche.ts`. Los nombres van en camelCase; los servicios traducen desde y hacia snake_case. `src/types.ts` del Proyecto 3 no se modifica.

```ts
// src/types/noche.ts

// Una película «por ver» de la lista, con la duración ya consultada
export interface PeliculaCandidata {
  itemId: number; // id en mi_lista
  tmdbId: number;
  titulo: string;
  posterUrl: string | null;
  fechaAgregado: string; // ISO 8601
  duracion: number | null; // minutos, entero >= 1; null si no se conoce
  consultaFallida: boolean; // true si no se pudo consultar la duración
}

export type PeliculaConDuracion = PeliculaCandidata & { duracion: number };

export type MotivoNoDisponible = 'duracion_desconocida' | 'consulta_fallida';

export type PeliculaNoDisponible = PeliculaCandidata & { motivo: MotivoNoDisponible };

export interface ClasificacionPeliculas {
  caben: PeliculaConDuracion[]; // ordenadas
  noDisponibles: PeliculaNoDisponible[];
  fuera: number; // duran más que el tiempo disponible
}

// Una película dentro de la sesión (armada o guardada)
export interface PeliculaEnSesion {
  tmdbId: number;
  titulo: string;
  posterUrl: string | null;
  duracion: number; // minutos, entero >= 1
}

export type ResultadoSesion =
  | { cabe: true; total: number; restante: number }
  | { cabe: false; motivo: 'tiempo_invalido' }
  | { cabe: false; motivo: 'duracion_desconocida' }
  | { cabe: false; motivo: 'excede_tiempo'; total: number; exceso: number };

export interface BorradorSesion {
  nombre: string; // lo que escribió el usuario, sin normalizar
  tiempoDisponible: number;
  peliculas: PeliculaEnSesion[]; // en el orden en que se agregaron
}

export interface SesionGuardada {
  id: string;
  nombre: string | null;
  tiempoDisponible: number;
  pausaMinutos: number;
  createdAt: string; // ISO 8601
  peliculas: PeliculaEnSesion[]; // ordenadas por `orden`
}

export type ResultadoGuardar =
  | { ok: true; id: string }
  | { ok: false; motivo: 'sin_peliculas' }
  | { ok: false; motivo: 'nombre_invalido'; mensaje: string }
  | { ok: false; motivo: 'no_cabe'; exceso: number };

export type ResultadoDuracion = { estado: 'ok'; minutos: number | null } | { estado: 'error' };
```

## 3. Funciones puras (`src/dominio/`)
Ninguna de estas funciones lee el reloj, llama a la red ni a Supabase.

### `src/dominio/sesion.ts`
Exporta las constantes (`TIEMPO_MINIMO`, `TIEMPO_MAXIMO`, `PAUSA_MINUTOS`) y estas funciones:

**`validarTiempoDisponible(minutos: number | null): string | null`.** Devuelve el mensaje de error o `null` si es válido.

| Condición | Mensaje |
|---|---|
| `null` o `NaN` | Indica cuántos minutos tienes disponibles. |
| No es entero | El tiempo debe ser un número entero de minutos. |
| Menor que 30 o mayor que 600 | El tiempo debe estar entre 30 y 600 minutos. |

**`normalizarDuracion(valor: number | null | undefined): number | null`.** Devuelve `valor` si es un entero mayor o igual que 1; en cualquier otro caso (`null`, `undefined`, 0, negativo, decimal, `NaN`), `null`.

**`duracionTotal(duraciones: number[], pausa: number): number`.** Suma las duraciones y añade `pausa` una vez por cada película después de la primera: `suma + pausa × (n − 1)`, y 0 si no hay películas.

**`evaluarSesion(tiempoDisponible: number, duraciones: (number | null)[], pausa: number): ResultadoSesion`.** Comprueba, en este orden:
1. Si el tiempo no es válido según `validarTiempoDisponible` → `{ cabe: false, motivo: 'tiempo_invalido' }`.
2. Si alguna duración es `null` o no es un entero mayor o igual que 1 → `{ cabe: false, motivo: 'duracion_desconocida' }`.
3. Si `duracionTotal` supera el tiempo → `{ cabe: false, motivo: 'excede_tiempo', total, exceso }`, con `exceso = total − tiempo`.
4. Si no → `{ cabe: true, total, restante }`, con `restante = tiempo − total`. Con una sesión vacía, `total` es 0 y `restante` es el tiempo.

**`puedeAgregar(tiempoDisponible: number, duracionesActuales: number[], duracionNueva: number | null, pausa: number): ResultadoSesion`.** Evalúa la sesión que resultaría de agregar la película: `evaluarSesion(tiempoDisponible, [...duracionesActuales, duracionNueva], pausa)`.

**Mensajes** (exportados desde el mismo archivo):

| Motivo | Texto |
|---|---|
| `duracion_desconocida` | No se puede agregar: no se conoce su duración. |
| `consulta_fallida` | No se pudo consultar su duración. Inténtalo de nuevo. |
| `excede_tiempo` (función `mensajeExceso(exceso)`) | No cabe: te pasarías {exceso} min del tiempo disponible. |
| Ya está en la sesión | Ya está en tu sesión. |

### `src/dominio/peliculas.ts`
**`clasificarPeliculas(tiempoDisponible: number, peliculas: PeliculaCandidata[]): ClasificacionPeliculas`.** Se llama con un tiempo ya validado.
1. Una película con `consultaFallida` va a `noDisponibles` con motivo `consulta_fallida`.
2. Una película con `duracion` `null` va a `noDisponibles` con motivo `duracion_desconocida`.
3. Una película cuya duración sola cabe en el tiempo (`duracion <= tiempoDisponible`) va a `caben`.
4. Las demás se cuentan en `fuera`.
5. `caben` se ordena por duración ascendente; si empatan, por `fechaAgregado` ascendente (la más antigua primero); si aún empatan, por `titulo` en orden alfabético.
6. `noDisponibles` se ordena por `fechaAgregado` ascendente y luego por `titulo`.

### `src/dominio/nombreSesion.ts`
**`normalizarNombreSesion(nombre: string): string | null`.** Recorta los espacios de los extremos; si queda vacío, devuelve `null`.

**`validarNombreSesion(nombre: string): string | null`.** Normaliza el nombre y, si tiene más de `NOMBRE_MAXIMO` caracteres, devuelve «El nombre no puede pasar de 60 caracteres.»; si no, `null`. Un nombre vacío o de solo espacios es válido.

## 4. Servicios (`src/services/`)
Son los únicos archivos nuevos que importan `src/lib/supabase.ts` o consultan el catálogo. Cada servicio traduce las filas de snake_case a los tipos de camelCase. Ante un error inesperado (red, permisos), lanza un `Error` y el componente muestra un mensaje genérico. No se modifican `src/lib/lista.ts` ni `src/lib/tmdb.ts`.

### `peliculasPorVerService` (`src/services/peliculasPorVerService.ts`)
- `listar(): Promise<Omit<PeliculaCandidata, 'duracion' | 'consultaFallida'>[]>`: las filas de `mi_lista` con `tipo_contenido = 'pelicula'` y `estado = 'por_ver'`, ordenadas por `fecha_agregado` ascendente. La política RLS de `mi_lista` ya limita las filas al usuario.

### `duracionesService` (`src/services/duracionesService.ts`)
- `obtener(tmdbIds: number[]): Promise<Map<number, ResultadoDuracion>>`:
  1. Para cada id que no esté ya recordado, consulta el detalle de la película en el catálogo y lee `runtime`.
  2. Pasa `runtime` por `normalizarDuracion` y devuelve `{ estado: 'ok', minutos }`.
  3. Consulta en lotes de 10 en paralelo, con `Promise.allSettled`. Una consulta que falla da `{ estado: 'error' }` para esa película y no afecta a las demás ni se recuerda.
  4. Recuerda en memoria las duraciones obtenidas mientras la app esté abierta.

### `sesionesService` (`src/services/sesionesService.ts`)
- `guardar(borrador: BorradorSesion): Promise<ResultadoGuardar>`, que funciona así:
  1. Si no hay películas, devuelve `{ ok: false, motivo: 'sin_peliculas' }` sin llamar a la base de datos.
  2. Llama a `validarNombreSesion`. Si hay error, devuelve `nombre_invalido` con el mensaje.
  3. Llama a `evaluarSesion` con el tiempo, las duraciones y `PAUSA_MINUTOS`. Si no cabe por exceso, devuelve `{ ok: false, motivo: 'no_cabe', exceso }`.
  4. Llama a la función `guardar_sesion` con el nombre normalizado, el tiempo, la pausa y las películas con su orden (empezando en 1).
  5. Devuelve `{ ok: true, id }`. Ante un error de la base de datos, lanza un `Error`.
- `listar(): Promise<SesionGuardada[]>`: las sesiones del usuario con sus películas, de la más reciente a la más antigua, con las películas ordenadas por `orden`.
- `eliminar(id: string): Promise<void>`: borra la sesión; sus películas se borran en cascada.

## 5. Componentes (`src/components/noche/` y `src/pages/`)
Ningún componente importa Supabase ni consulta el catálogo; todos usan los servicios y las funciones de `src/dominio/`. Cómo se ven está en la [spec 02](02-interfaz-noche-de-pelicula.md).

### `NocheDePelicula` (`src/pages/NocheDePelicula.tsx`)
- Ruta `/noche`, dentro de `RutaProtegida`. Sin sesión iniciada, la ruta lleva a `/login`.
- Guarda el estado de la pantalla: el tiempo escrito, las películas candidatas, la sesión que se arma y las sesiones guardadas.
- Al abrir, carga las películas «por ver» y sus duraciones y las pasa por `clasificarPeliculas` cuando el tiempo es válido.
- Recarga las sesiones guardadas después de guardar o eliminar una.

### `FormularioTiempo`
- **Campo:** minutos disponibles (número entero). Muestra debajo el mensaje de `validarTiempoDisponible` y no actualiza la lista mientras el tiempo no sea válido.

### `ListaCandidatas` y `TarjetaPelicula`
- **Por cada película que cabe:** póster, título, duración en minutos, insignia «Cabe» y botón de agregar.
- **Si no cabe en lo que queda de la sesión:** insignia «No cabe», el mensaje de `mensajeExceso` y el botón deshabilitado.
- **Si ya está en la sesión:** el texto «Ya está en tu sesión.» y el botón deshabilitado.
- **Por cada película no disponible:** insignia «Sin duración», el mensaje de su motivo y sin botón de agregar. Van después de las que caben.
- **Resumen:** si hay películas fuera, el texto «{n} película(s) por ver no cabe(n) en este tiempo.»
- **Estados:** cargando, sin películas por ver, ninguna cabe y error con opción de reintentar (textos en la sección 6 de la spec 02).

### `PanelSesion` y `BarraTiempo`
- **Películas de la sesión:** en el orden en que se agregaron, cada una con su duración y un botón para quitarla.
- **Total y restante:** siempre visibles, calculados con `evaluarSesion`. Con la sesión vacía, total 0 y restante igual al tiempo.
- **Si la sesión no cabe** (porque se redujo el tiempo): aviso con el total y el tiempo, y el botón de guardar deshabilitado.
- **Nombre:** campo de texto opcional con el mensaje de `validarNombreSesion`.
- **Guardar:** deshabilitado si la sesión está vacía, no cabe o se está guardando. Al terminar, muestra la confirmación y vacía la sesión. Ante un fallo, muestra el aviso y conserva la sesión.

### `ListaSesionesGuardadas` y `TarjetaSesion`
- **Por cada sesión:** el nombre o «Sesión del {fecha}», la fecha de creación, el tiempo disponible con el que se armó, las películas en orden con su duración y la duración total con pausas (`duracionTotal` con la `pausaMinutos` guardada).
- **Eliminar:** pide confirmación con `window.confirm`, como ya hace Mi lista. No hay ningún control para editar.
- **Estados:** cargando, sin sesiones y error.

## 6. Criterios de aceptación
Los DADO / CUANDO / ENTONCES están en el [backlog](../backlog/E2-noche-de-pelicula.md). Aquí se escriben con DEBE / NO DEBE.

### HU-2.1 · Indicar mi tiempo y ver qué películas caben
- **HU-2.1-CA1:** Con 150 min y películas por ver de 90, 120 y 200 min, la pantalla DEBE listar las de 90 y 120 con su duración y NO DEBE listar la de 200.
- **HU-2.1-CA2:** Una película cuya duración es igual al tiempo disponible DEBE aparecer entre las que caben.
- **HU-2.1-CA3:** La lista DEBE ordenarse por duración ascendente y, en caso de empate, por la fecha en que se agregó a Mi lista, la más antigua primero.
- **HU-2.1-CA4:** La app DEBE aceptar 30 minutos.
- **HU-2.1-CA5:** La app DEBE aceptar 600 minutos.
- **HU-2.1-CA6:** La app NO DEBE aceptar 29 minutos y DEBE mostrar el aviso de rango.
- **HU-2.1-CA7:** La app NO DEBE aceptar 601 minutos y DEBE mostrar el aviso de rango.
- **HU-2.1-CA8:** La app NO DEBE mostrar resultados sin tiempo y DEBE pedir que se indique.
- **HU-2.1-CA9:** La app NO DEBE aceptar un tiempo con decimales y DEBE mostrar el aviso de número entero.
- **HU-2.1-CA10:** La lista DEBE incluir solo películas en estado «por ver» y NO DEBE incluir películas «viendo» o «vista» ni series.
- **HU-2.1-CA11:** La app DEBE avisar de que no hay películas por ver, sin mostrar una lista vacía sin explicación.
- **HU-2.1-CA12:** La app DEBE avisar de que ninguna película cabe, indicando el tiempo elegido.
- **HU-2.1-CA13:** La app DEBE indicar cuántas películas por ver quedaron fuera por durar más que el tiempo elegido.
- **HU-2.1-CA14:** Mientras se consulta, la app DEBE mostrar el estado de carga y NO DEBE mostrar el aviso de lista vacía.
- **HU-2.1-CA15:** Ante un fallo de carga, la app DEBE mostrar el aviso de error con la opción de reintentar y NO DEBE decir que no hay películas.
- **HU-2.1-CA16:** La pantalla NO DEBE ser accesible sin sesión iniciada y DEBE redirigir al inicio de sesión.

### HU-2.2 · Entender por qué una película no está disponible
- **HU-2.2-CA1:** Una película sin duración DEBE aparecer como no disponible con su motivo y NO DEBE poder agregarse.
- **HU-2.2-CA2:** Una duración de 0 minutos DEBE tratarse como duración desconocida.
- **HU-2.2-CA3:** El fallo de una sola película NO DEBE afectar a las demás y DEBE mostrar el motivo «no se pudo consultar».
- **HU-2.2-CA4:** Las películas no disponibles DEBEN aparecer siempre, sin depender del tiempo, y DESPUÉS de las que caben.
- **HU-2.2-CA5:** El motivo DEBE mostrarse como texto y NO DEBE depender solo del color.

### HU-2.3 · Armar una sesión con una o varias películas
- **HU-2.3-CA1:** Con una sola película la duración total DEBE ser su duración, sin pausa, y el restante DEBE ser el tiempo menos esa duración.
- **HU-2.3-CA2:** Entre dos películas DEBE sumarse una pausa de 10 minutos.
- **HU-2.3-CA3:** Con tres películas DEBEN sumarse dos pausas.
- **HU-2.3-CA4:** Una sesión que ocupa exactamente el tiempo disponible DEBE caber.
- **HU-2.3-CA5:** Si el total con la película nueva supera el tiempo, la app NO DEBE agregarla y DEBE indicar cuántos minutos se pasaría.
- **HU-2.3-CA6:** La app NO DEBE agregar una película sin duración y DEBE explicar el motivo.
- **HU-2.3-CA7:** Una película NO DEBE aparecer dos veces en la misma sesión.
- **HU-2.3-CA8:** Al quitar una película, la app DEBE recalcular total y restante con las pausas que correspondan y conservar el orden de las demás.
- **HU-2.3-CA9:** Una sesión vacía DEBE mostrar total 0 y restante igual al tiempo disponible.
- **HU-2.3-CA10:** El panel de la sesión DEBE mostrar total y restante en todo momento, también con la sesión vacía.
- **HU-2.3-CA11:** Al reducir el tiempo, la sesión armada DEBE conservarse, la app DEBE avisar del exceso y NO DEBE permitir guardarla mientras no quepa.
- **HU-2.3-CA12:** Una película ya agregada DEBE mostrarse marcada como agregada con texto.
- **HU-2.3-CA13:** Las películas de la sesión DEBEN mostrarse en el orden en que se agregaron.

### HU-2.4 · Guardar la sesión
- **HU-2.4-CA1:** Al guardar, la sesión DEBE aparecer en las guardadas con nombre, películas en orden con duración, duración total y fecha de creación.
- **HU-2.4-CA2:** Una sesión sin nombre DEBE guardarse y mostrarse con su fecha de creación.
- **HU-2.4-CA3:** La app DEBE aceptar un nombre de 60 caracteres.
- **HU-2.4-CA4:** La app NO DEBE guardar con un nombre de 61 caracteres y DEBE mostrar el aviso de longitud.
- **HU-2.4-CA5:** Un nombre de solo espacios DEBE tratarse como ausencia de nombre.
- **HU-2.4-CA6:** La app NO DEBE guardar una sesión sin películas y DEBE indicar que se agregue al menos una.
- **HU-2.4-CA7:** Una sesión que ocupa exactamente el tiempo DEBE poder guardarse.
- **HU-2.4-CA8:** La app NO DEBE guardar una sesión cuya duración supera el tiempo disponible.
- **HU-2.4-CA9:** Guardar una sesión NO DEBE cambiar el estado de sus películas.
- **HU-2.4-CA10:** Una película DEBE poder estar en más de una sesión guardada.
- **HU-2.4-CA11:** Tras guardar, la app DEBE confirmar y DEBE vaciar la sesión en armado.
- **HU-2.4-CA12:** Ante un fallo, la app DEBE avisar, DEBE conservar la sesión armada y NO DEBE dejar una sesión incompleta guardada.
- **HU-2.4-CA13:** Mientras se guarda, la app NO DEBE permitir otro guardado.
- **HU-2.4-CA14:** La app NO DEBE exigir nombres únicos.

### HU-2.5 · Consultar mis sesiones guardadas
- **HU-2.5-CA1:** La pantalla DEBE listar mis sesiones guardadas, la más reciente primero.
- **HU-2.5-CA2:** Cada sesión DEBE mostrar nombre o fecha, fecha de creación, tiempo disponible, películas en orden con duración y duración total con pausas.
- **HU-2.5-CA3:** Sin sesiones, la app DEBE avisar de que todavía no hay ninguna.
- **HU-2.5-CA4:** Mientras cargan, la app DEBE mostrar la carga y NO DEBE decir que no hay sesiones.
- **HU-2.5-CA5:** Ante un fallo, la app DEBE mostrar el aviso de error y NO DEBE decir que no hay sesiones.
- **HU-2.5-CA6:** Un usuario NO DEBE ver ni consultar las sesiones de otro.
- **HU-2.5-CA7:** Borrar una película de Mi lista NO DEBE cambiar las sesiones guardadas que la contienen.
- **HU-2.5-CA8:** Cambiar el estado de una película en Mi lista NO DEBE cambiar las sesiones guardadas.
- **HU-2.5-CA9:** La app NO DEBE ofrecer editar una sesión guardada, y la base de datos NO DEBE permitirlo.

### HU-2.6 · Eliminar una sesión guardada
- **HU-2.6-CA1:** Al confirmar, la sesión DEBE desaparecer de las guardadas.
- **HU-2.6-CA2:** Si el usuario cancela, la sesión NO DEBE eliminarse.
- **HU-2.6-CA3:** Eliminar una sesión NO DEBE tocar Mi lista ni el estado de las películas.
- **HU-2.6-CA4:** Un usuario NO DEBE poder eliminar las sesiones de otro.
- **HU-2.6-CA5:** Ante un fallo, la app DEBE avisar y la sesión DEBE seguir visible.

## 7. Verificación por criterio
- **Vitest (dominio):** tests de las funciones puras, sin red ni base de datos.
- **Manual:** prueba en el navegador contra Supabase y el catálogo.
- **SQL:** consultas en el editor de Supabase como cada cuenta de prueba (ver 7.1).

| Criterio | Verificación | Qué se comprueba |
|---|---|---|
| HU-2.1-CA1 | Vitest + manual | `clasificarPeliculas` deja 90 y 120 en `caben` y cuenta 1 fuera; en el navegador se ven esas dos. |
| HU-2.1-CA2 | Vitest | `clasificarPeliculas(150, [150])` deja la película en `caben`. |
| HU-2.1-CA3 | Vitest | `clasificarPeliculas` devuelve B, C, A; con misma duración y misma fecha ordena por título. |
| HU-2.1-CA4 | Vitest | `validarTiempoDisponible(30)` devuelve `null`. |
| HU-2.1-CA5 | Vitest | `validarTiempoDisponible(600)` devuelve `null`. |
| HU-2.1-CA6 | Vitest + manual | `validarTiempoDisponible(29)` devuelve el mensaje de rango; en pantalla no cambia la lista. |
| HU-2.1-CA7 | Vitest | `validarTiempoDisponible(601)` devuelve el mensaje de rango. |
| HU-2.1-CA8 | Vitest | `validarTiempoDisponible(null)` devuelve el mensaje de tiempo vacío. |
| HU-2.1-CA9 | Vitest | `validarTiempoDisponible(90.5)` devuelve el mensaje de número entero. |
| HU-2.1-CA10 | Manual | Con una lista de prueba que mezcle estados y una serie, solo salen las películas «por ver». |
| HU-2.1-CA11 | Manual | Con una cuenta sin películas «por ver», se ve el aviso. |
| HU-2.1-CA12 | Vitest + manual | `clasificarPeliculas(90, [120, 150])` deja `caben` vacío y `fuera` en 2. |
| HU-2.1-CA13 | Vitest + manual | El conteo `fuera` es 1 y la pantalla muestra «1 película por ver no cabe en este tiempo.» |
| HU-2.1-CA14 | Manual | Con la red limitada en las herramientas del navegador se ve la carga. |
| HU-2.1-CA15 | Manual | Con la red cortada se ve el aviso; al volver la red, reintentar carga la lista. |
| HU-2.1-CA16 | Manual | En una ventana sin sesión, abrir `/noche` lleva a `/login`. |
| HU-2.2-CA1 | Vitest + manual | `puedeAgregar` devuelve `duracion_desconocida`; en pantalla el botón de agregar está deshabilitado. |
| HU-2.2-CA2 | Vitest | `normalizarDuracion(0)` devuelve `null`. |
| HU-2.2-CA3 | Manual | Bloqueando la consulta de una película en las herramientas del navegador, solo esa sale como no disponible. |
| HU-2.2-CA4 | Vitest + manual | `clasificarPeliculas` las devuelve en `sinDuracion` para cualquier tiempo. |
| HU-2.2-CA5 | Manual | Se lee el texto del motivo en cada tarjeta no disponible (criterio de diseño D-03). |
| HU-2.3-CA1 | Vitest | `evaluarSesion(180, [100], 10)` → total 100, restante 80. |
| HU-2.3-CA2 | Vitest | `evaluarSesion(240, [100, 90], 10)` → total 200, restante 40. |
| HU-2.3-CA3 | Vitest | `evaluarSesion(300, [100, 90, 60], 10)` → total 270, restante 30. |
| HU-2.3-CA4 | Vitest + manual | `evaluarSesion(200, [100, 90], 10)` → `cabe: true`, restante 0. |
| HU-2.3-CA5 | Vitest + manual | `puedeAgregar(200, [100], 91, 10)` → `excede_tiempo`, exceso 1. |
| HU-2.3-CA6 | Vitest | `puedeAgregar(180, [], null, 10)` → `duracion_desconocida`. |
| HU-2.3-CA7 | Manual | La tarjeta de una película ya agregada no ofrece agregarla de nuevo y muestra «Ya está en tu sesión.» |
| HU-2.3-CA8 | Vitest + manual | `evaluarSesion(t, [60, 90], 10)` → total 160; en pantalla se conserva el orden. |
| HU-2.3-CA9 | Vitest | `evaluarSesion(180, [], 10)` → total 0, restante 180. |
| HU-2.3-CA10 | Manual | Se ven los dos valores al abrir la pantalla, al agregar y al quitar (criterio de diseño D-05). |
| HU-2.3-CA11 | Vitest + manual | `evaluarSesion(180, [..], 10)` → `excede_tiempo`; el botón de guardar queda deshabilitado. |
| HU-2.3-CA12 | Manual | La tarjeta muestra «Ya está en tu sesión.» |
| HU-2.3-CA13 | Manual | Se agregan B y A y se ve ese orden. |
| HU-2.4-CA1 | Manual | Se guarda y se ve en la lista de sesiones con todos esos datos. |
| HU-2.4-CA2 | Vitest + manual | `validarNombreSesion('')` devuelve `null`; en pantalla se ve «Sesión del {fecha}». |
| HU-2.4-CA3 | Vitest | `validarNombreSesion` con 60 caracteres devuelve `null`. |
| HU-2.4-CA4 | Vitest | `validarNombreSesion` con 61 caracteres devuelve el mensaje de longitud. |
| HU-2.4-CA5 | Vitest | `normalizarNombreSesion('   ')` devuelve `null`. |
| HU-2.4-CA6 | Manual | Con la sesión vacía el botón de guardar está deshabilitado y se lee el motivo. |
| HU-2.4-CA7 | Manual | Se arma una sesión de 200 min con tiempo 200 y se guarda. |
| HU-2.4-CA8 | Vitest + manual | `evaluarSesion` → `excede_tiempo` y guardar deshabilitado. |
| HU-2.4-CA9 | Manual | Después de guardar, Mi lista muestra las tres como «por ver» y la pantalla las sigue ofreciendo. |
| HU-2.4-CA10 | Manual + SQL | Dos sesiones con la misma película; en la tabla de películas de sesión hay una fila por sesión. |
| HU-2.4-CA11 | Manual | Se ve «Sesión guardada.» y el panel queda vacío. |
| HU-2.4-CA12 | Manual + SQL | Con la red cortada se ve el aviso y la sesión sigue armada; en la base no queda una sesión sin películas. |
| HU-2.4-CA13 | Manual | El botón queda deshabilitado durante el guardado y solo aparece una sesión nueva. |
| HU-2.4-CA14 | Manual | Se guardan dos sesiones con el mismo nombre. |
| HU-2.5-CA1 | Manual | Con tres sesiones se ven en orden de creación descendente. |
| HU-2.5-CA2 | Manual | Se comparan los datos con lo guardado. |
| HU-2.5-CA3 | Manual | Con una cuenta nueva se ve el aviso. |
| HU-2.5-CA4 | Manual | Con la red limitada se ve la carga. |
| HU-2.5-CA5 | Manual | Con la red cortada se ve el aviso. |
| HU-2.5-CA6 | Manual + SQL | Con dos cuentas, cada una ve solo las suyas; una consulta directa a la tabla con la otra cuenta devuelve 0 filas ajenas. |
| HU-2.5-CA7 | Manual | Se elimina la película de Mi lista y la sesión conserva título, duración y total. |
| HU-2.5-CA8 | Manual | Se marca como «vista» y la sesión sigue igual. |
| HU-2.5-CA9 | Manual + SQL | No hay controles de edición; un intento de actualizar una fila de la sesión es rechazado. |
| HU-2.6-CA1 | Manual | Se elimina y deja de verse, también al recargar. |
| HU-2.6-CA2 | Manual | Se cancela y la sesión sigue. |
| HU-2.6-CA3 | Manual | Tras eliminar, Mi lista no cambia. |
| HU-2.6-CA4 | SQL | Con la cuenta B, un `delete` sobre la sesión de A afecta 0 filas. |
| HU-2.6-CA5 | Manual | Con la red cortada se ve el aviso y la sesión sigue. |

### 7.1 Pruebas de seguridad con dos cuentas
Con las cuentas A y B (cada una con al menos una sesión guardada) y el identificador de usuario de cada una (se ve en Authentication → Users del panel de Supabase):

```sql
begin;
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"<ID_DE_B>","role":"authenticated"}', true);

select count(*) from sesiones where user_id = '<ID_DE_A>';           -- debe dar 0
select count(*) from sesion_peliculas where user_id = '<ID_DE_A>';   -- debe dar 0
delete from sesiones where user_id = '<ID_DE_A>';                    -- debe afectar 0 filas
update sesiones set nombre = 'x' where user_id = '<ID_DE_B>';        -- debe afectar 0 filas (no hay política de actualización)
rollback;
```

Si el editor no acepta el cambio de rol, la misma comprobación se hace desde la app con las dos cuentas, en dos ventanas distintas, y se anota qué se vio. Los resultados van en `docs/VERIFICACION.md` (T-11).

## 8. Tickets y archivos

| Ticket | Crea | Modifica |
|---|---|---|
| T-01 · Bootstrap, tema y Vitest | `src/styles/tema.css` | `package.json`, `pnpm-lock.yaml`, `src/main.tsx`, `index.html` (solo el atributo `data-bs-theme`) |
| T-02 · Reglas del tiempo y de la sesión | `src/types/noche.ts`, `src/dominio/sesion.ts`, `src/dominio/sesion.test.ts` | — |
| T-03 · Candidatas, orden y nombre | `src/dominio/peliculas.ts`, `src/dominio/peliculas.test.ts`, `src/dominio/nombreSesion.ts`, `src/dominio/nombreSesion.test.ts` | `src/types/noche.ts` (si falta algún tipo) |
| T-04 · Migración y RLS | `supabase/migraciones/001_noche_de_pelicula.sql` | — |
| T-05 · Servicios de lectura | `src/services/peliculasPorVerService.ts`, `src/services/duracionesService.ts` | — |
| T-06 · Servicio de sesiones | `src/services/sesionesService.ts` | — |
| T-07 · Pantalla: ruta, tiempo y qué cabe | `src/pages/NocheDePelicula.tsx`, `src/components/noche/FormularioTiempo.tsx`, `src/components/noche/ListaCandidatas.tsx`, `src/components/noche/TarjetaPelicula.tsx` | `src/App.tsx` (la ruta), `src/components/Navbar.tsx` (solo el enlace) |
| T-08 · Armar la sesión | `src/components/noche/PanelSesion.tsx`, `src/components/noche/BarraTiempo.tsx` | `src/pages/NocheDePelicula.tsx`, `src/components/noche/TarjetaPelicula.tsx` |
| T-09 · Guardar la sesión | — | `src/components/noche/PanelSesion.tsx`, `src/pages/NocheDePelicula.tsx` |
| T-10 · Consultar y eliminar sesiones | `src/components/noche/ListaSesionesGuardadas.tsx`, `src/components/noche/TarjetaSesion.tsx` | `src/pages/NocheDePelicula.tsx` |
| T-11 · Verificar | `docs/VERIFICACION.md` | `src/dominio/*.test.ts` (si falta algún caso), esta spec (resultados) |

Ningún ticket modifica `src/index.css`, `src/lib/`, `src/pages/` del Proyecto 3 ni sus componentes, salvo las dos líneas indicadas en `App.tsx` y `Navbar.tsx`.

Variables de entorno: no se agrega ninguna. Se usan las que ya lee el proyecto (`VITE_SUPABASE_URL`, la clave pública de Supabase y `VITE_TMDB_API_KEY`), cuyos valores van en `.env.local`.

## Pendientes
1. **El límite solo vive en el frontend:** con la política de inserción abierta a cualquier usuario autenticado, alguien con la clave pública podría guardar una sesión que no cabe sin pasar por la app. Validarlo en la base de datos es el opcional HU-2.10.
2. **La clave del catálogo viaja en cada consulta** desde el navegador (R-01 de `docs/ESTADO-INICIAL.md`).
3. **Sin borrador:** una sesión sin guardar se pierde al salir de la pantalla (punto abierto del PRD).
4. **`mi_lista` no está versionada** en `supabase/migraciones/` (deuda del Proyecto 3); esta migración no la incluye.
