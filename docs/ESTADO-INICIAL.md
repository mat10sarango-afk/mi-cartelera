# Estado inicial · GoldenMovies (Proyecto 3)

Borrador escrito a partir de la lectura del código del repositorio, sin ejecutarlo. Antes de dar este documento por bueno hay que revisarlo con el agente en plan mode, completar la sección 7 y corregir lo que no coincida con la realidad.

## 1. Qué hace hoy y con qué stack

GoldenMovies (antes «Mi Cartelera Personal») es una app web donde cada usuario registra películas y series, las busca en TMDB y guarda una lista personal en Supabase. Está publicada en Vercel (`vercel.json` reescribe todas las rutas a `index.html`).

**Pantallas y rutas** ([App.tsx](../src/App.tsx)):

| Ruta | Pantalla | Qué hace |
| --- | --- | --- |
| `/login`, `/registro` | Login, Registro | Alta e inicio de sesión con Supabase Auth |
| `/` | Inicio | Buscador (TMDB `search/multi`) y Explorador (novedades, más taquilleras, por año, con paginación) |
| `/mi-lista` | Mi lista | Contador por estado, filtro por estado, orden por fecha o calificación, edición de estado, calificación (1 a 5) y comentario, y eliminación con confirmación |
| `/titulo/:id` | Detalle | Póster, sinopsis, géneros, elenco (10), calificación de TMDB y opinión personal |

Todas las rutas salvo login y registro pasan por `RutaProtegida`, que redirige a `/login` si no hay sesión.

**Stack:** Vite 8, React 19, TypeScript, React Router 7, `@supabase/supabase-js` 2, ESLint. Gestor de paquetes: pnpm (`pnpm-lock.yaml`). No hay Vitest, Prettier ni Bootstrap. En `src/` no hay ningún uso de `any`.

## 2. Estructura

- `src/pages/`: Inicio, Login, Registro, MiLista, Detalle.
- `src/components/`: Buscador, Explorador, LayoutAuth, Navbar, RutaProtegida, TarjetaLista, TarjetaResultado.
- `src/context/`: AuthProvider, authContext, useAuth.
- `src/hooks/useAgregar.ts`: agregar un título a la lista con mensajes por título.
- `src/lib/`: `supabase.ts` (cliente), `lista.ts` (CRUD de `mi_lista`) y `tmdb.ts` (búsqueda, exploración y detalle).
- `src/types.ts`: `ItemLista`, `ResultadoBusqueda`, `DetalleTMDB`, `Estado`, `TipoContenido`.
- `src/index.css`: todos los estilos. `src/App.css` está vacío.
- `docs/capturas/`: cuatro capturas (login, búsqueda, mi lista, detalle) que sirven de referencia visual.

## 3. Base de datos

Una sola tabla, `mi_lista`, documentada solo en el README (no hay migración en el repo):

- Columnas: `id`, `user_id` (por defecto `auth.uid()`), `tmdb_id`, `titulo`, `poster_url`, `tipo_contenido` (`pelicula` o `serie`), `estado` (`por_ver`, `viendo`, `vista`), `calificacion_personal` (1 a 5), `comentario`, `fecha_agregado`.
- Restricción única: `(user_id, tmdb_id, tipo_contenido)`.
- RLS activada, con cuatro políticas (ver, insertar, editar y borrar solo las propias).
- `eliminarItem` hace un borrado físico.

## 4. Lo que ya cumple del harness esperado

Nada del harness existía: no hay `AGENTS.md`, `CLAUDE.md`, skills, hooks, tests ni documentación de producto. Este checkpoint lo agrega sin tocar el código de la app.

## 5. Inconsistencias

1. El enunciado da por hecho que el proyecto usa Bootstrap; no lo usa. Todo el estilo está en `src/index.css`, con variables CSS.
2. `AGENTS.md` pide que los componentes no llamen a Supabase, pero `Login`, `Registro` y `AuthProvider` importan el cliente y llaman a `supabase.auth` directamente.
3. El enunciado pide `src/services/` y `src/dominio/`; el proyecto tiene `src/lib/` y no tiene `dominio`.
4. El README dice que `.env.example` está en la raíz; está en `src/`.
5. `index.html` declara `lang="en"` y toda la interfaz está en español.
6. El README termina con una cerca de código sobrante (cuatro comillas invertidas) y da los comandos con npm, mientras el proyecto usa pnpm (`pnpm-lock.yaml`); pnpm solo aparece como alternativa en la instalación.
7. `package.json` incluye la dependencia `"mi-cartelera": "link:"`, que apunta al propio proyecto y parece accidental.

## 6. Riesgos

| Id | Riesgo | Por qué importa |
| --- | --- | --- |
| R-01 | La API key de TMDB va en el bundle y en la URL de cada petición (`api_key=…`) | Cualquiera la ve en la pestaña Network. Las claves de TMDB son gratuitas y revocables, pero hay que documentarlo |
| R-02 | `.gitignore` ignora `*.local` pero no `.env` | Un `.env` con claves podría subirse al repositorio |
| R-03 | No hay tests ni CI | Ningún cambio se puede comprobar de forma automática |
| R-04 | La tabla y las políticas RLS no están versionadas | No se puede reproducir la base de datos desde el repo |
| R-05 | Instalar Bootstrap trae su CSS base (reboot) a una app que ya tiene estilos globales sobre elementos (`button`, `input`, `h1`, `form`) | Podría cambiar el aspecto de las pantallas del Proyecto 3 |
| R-06 | `lista.ts` y `tmdb.ts` mezclan acceso a datos con mensajes de error en español | Al reutilizarlos en E2 hay que decidir qué se comparte y qué se separa |

## 7. Deuda heredada (pendientes, sin corregir todavía)

- [ ] Agregar `.env` al `.gitignore` (R-02).
- [ ] Mover `src/.env.example` a la raíz y corregir el README.
- [ ] Versionar la tabla `mi_lista` y sus políticas en `supabase/migraciones/`.
- [ ] Reemplazar los estilos en línea (`style={…}`) de Navbar, Buscador, TarjetaLista, TarjetaResultado, MiLista y Detalle por clases.
- [ ] Reemplazar los colores literales (`#111`, `#fff`, `#46c37b`, `#444`), en los componentes y en `index.css`, por variables.
- [ ] Revisar el contraste del botón `peligro` (blanco sobre rojo, 3,9:1, por debajo de AA).
- [ ] Sacar las llamadas a `supabase.auth` de `Login`, `Registro` y `AuthProvider` hacia un servicio.
- [ ] Cambiar `lang="en"` por `lang="es"` en `index.html`.
- [ ] Quitar la dependencia `"mi-cartelera": "link:"` si se confirma que es accidental.
- [ ] Limpiar la cerca de código sobrante del README y unificar npm/pnpm.
- [ ] Agregar tests de las reglas de la lista (hoy no hay ninguno).

## 8. Decisiones y supuestos para la épica E2

- **[SUPUESTO] Bootstrap solo en lo nuevo.** La pantalla «Noche de película» usará Bootstrap 5.3 en su tema oscuro, con sus variables sobrescritas por los tokens que el proyecto ya tiene. Las pantallas del Proyecto 3 no se tocan. Esta decisión la tomó el estudiante sin consultarla con el docente; se registra como supuesto hasta que se confirme.
- La instalación de Bootstrap será un ticket de la spec, no parte de este checkpoint: ninguna funcionalidad ni dependencia nueva sin spec.
- El código nuevo de E2 va en `src/dominio/` y `src/services/`. El código del Proyecto 3 se queda en `src/lib/`.
- E2 solo usa películas: la lista admite series, así que las consultas deben filtrar `tipo_contenido = 'pelicula'`.
- La duración no existe hoy en la app: `obtenerDetalle` no lee `runtime` de TMDB. Hace falta una consulta nueva.
- Como `eliminarItem` es borrado físico, la pregunta «qué pasa con una sesión si borro una película de mi lista» depende del modelo de datos que se elija en la spec.

## 9. Por verificar antes de cerrar este documento

Estas comprobaciones no se hicieron al escribir el borrador. Completa la columna con lo que obtengas.

| Comprobación | Resultado obtenido |
| --- | --- |
| `pnpm install` termina sin errores | Sin errores |
| `pnpm build` termina sin errores | Sin errores: 86 módulos, compiló en 2,93 s |
| `pnpm lint` y cuántos avisos da | 0 avisos y 0 errores |
| La app corre con `pnpm dev` y las cuatro pantallas funcionan con una cuenta | Funcionan login, búsqueda, mi lista y detalle |
| Con dos cuentas, cada una ve solo su lista | Cada cuenta ve solo sus títulos |
