# AGENTS.md: GoldenMovies (Mi Cartelera Personal)

## Proyecto
App web para registrar películas y series, buscar en TMDB y guardar una lista personal por usuario. Épica en curso: E2 «Noche de película».

## Stack
- Vite + React + TypeScript, React Router
- Supabase (Auth y PostgreSQL con RLS) y API de TMDB
- Vitest y Prettier; Bootstrap solo en la épica E2

## Estructura
- `src/pages/`, `src/components/`: pantallas y componentes
- `src/lib/`: acceso a Supabase y TMDB del Proyecto 3 (no se mueve)
- `src/dominio/`: funciones puras y sus tests (E2)
- `src/services/`: servicios de Supabase y TMDB de E2
- `src/styles/`: tokens y tema
- `supabase/migraciones/`: migraciones SQL
- `docs/prd/`, `docs/backlog/`, `docs/specs/`, `docs/diseno/`

## Comandos
- `pnpm dev`, `pnpm test`, `pnpm build`, `pnpm lint`

## Convenciones
- Nombres del dominio en español; camelCase en TypeScript; snake_case en la base de datos.
- Nunca usar `any`.
- Los componentes no llaman a Supabase ni a TMDB; lo hacen los servicios.

## Reglas
- Nunca leer ni modificar `.env` ni `.env.local`.
- Nunca escribir claves en el código; en el frontend solo la clave pública de Supabase, nunca la `service_role`.
- Ninguna funcionalidad se implementa sin una spec en `docs/specs/`.
- No reescribir el Proyecto 3: se evoluciona.
- Ejecutar `pnpm test` y `pnpm build` antes de dar una tarea por terminada.
- Para cualquier tarea visual, lee DESIGN.md antes de escribir código.
