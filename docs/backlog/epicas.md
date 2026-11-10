# GoldenMovies — Épicas

Basado en [docs/prd/goldenmovies.md](../prd/goldenmovies.md). Los números de alcance (A1–A8) y de reglas (R1–R20) remiten a las secciones 4 y 6 del PRD.

## E1 · Mi Cartelera (ya construida)
**Objetivo:** que cada persona registre lo que quiere ver y lleve el control de lo que ya vio.

**Alcance que cubre:**
- A1: cuenta, inicio y cierre de sesión.
- A2: buscar y explorar películas y series.
- A3: lista personal y su gestión.
- A4: detalle de un título.

**Reglas de negocio:** R1 a R5.

**Estado:** terminada en el Proyecto 3. No tiene historias en este backlog: su estado actual está en [docs/ESTADO-INICIAL.md](../ESTADO-INICIAL.md). Lo que E2 necesita de ella es la lista personal con sus estados.

## E2 · Noche de película
**Objetivo:** que la persona, dado el tiempo libre que tiene, arme con su lista una sesión que pueda terminar y la guarde para esa noche.

**Alcance que cubre:**
- A5: indicar el tiempo disponible.
- A6: ver qué películas caben y cuáles no están disponibles.
- A7: armar la sesión.
- A8: guardar, consultar y eliminar sesiones.

**Reglas de negocio:** R6 a R20.

**Historias:** HU-2.1 a HU-2.6, en [E2-noche-de-pelicula.md](E2-noche-de-pelicula.md).

## Cobertura del alcance
Ningún punto del alcance de E2 quedó fuera de las historias:
- A5 y A6: HU-2.1 y HU-2.2.
- A7: HU-2.3.
- A8: HU-2.4 (guardar), HU-2.5 (consultar) y HU-2.6 (eliminar).

**Dependencias:**
- E2 depende de E1: necesita la lista personal, sus estados y que cada persona vea solo lo suyo. No modifica E1.
- Dentro de E2, HU-2.3 a HU-2.6 parten de la pantalla que construye HU-2.1.
