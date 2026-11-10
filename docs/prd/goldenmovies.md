# GoldenMovies (Mi Cartelera Personal) — PRD

Producto completo en dos épicas. E1 es la app que ya existe (Proyecto 3). E2, «Noche de película», es la funcionalidad nueva. Este documento no describe tablas, componentes ni librerías: eso vive en `docs/specs/` y en `DESIGN.md`.

## 1. Problema
Quien ve películas y series acumula títulos que quiere ver y los pierde de vista. E1 resolvió eso: cada persona tiene su lista personal. Pero cuando tiene un rato libre, no sabe cuáles de sus películas «por ver» caben en ese tiempo y a veces empieza algo que no alcanza a terminar.

## 2. Usuarios
Personas con una cuenta propia en la app y su propia lista. No hay otros roles: nadie ve ni modifica lo de otra persona.

## 3. Objetivo y métrica de éxito
- **Objetivo de E1:** que cada persona registre lo que quiere ver y lleve el control de lo que ya vio.
- **Objetivo de E2:** que, dado el tiempo libre que tiene, la persona arme con su propia lista una sesión que pueda terminar, y la guarde para esa noche.
- **Métrica de E2:** que el usuario termine lo que empieza. En la práctica, que ninguna sesión guardada dure más que el tiempo con el que se armó.

## 4. Alcance
**E1 · Mi Cartelera (ya construida):**
- A1. Crear una cuenta, iniciar y cerrar sesión.
- A2. Buscar películas y series, y explorar novedades, las más taquilleras y las de un año.
- A3. Guardar títulos en la lista personal y gestionarlos: cambiar su estado (por ver, viendo, vista), calificar de 1 a 5, comentar y eliminar.
- A4. Ver el detalle de un título: sinopsis, géneros, elenco y calificación.

**E2 · Noche de película (nueva):**
- A5. Indicar cuánto tiempo se tiene disponible.
- A6. Ver qué películas «por ver» de la lista caben en ese tiempo, cada una con su duración, y cuáles no están disponibles y por qué.
- A7. Armar una sesión agregando y quitando películas, viendo en todo momento la duración total y el tiempo restante.
- A8. Guardar la sesión, consultar las sesiones guardadas con su detalle y eliminarlas.

## 5. No-alcance
- Series dentro de las sesiones.
- Ver con amigos o compartir sesiones.
- Recordatorios y notificaciones.
- Sincronizar con plataformas de streaming o con calendarios.
- Recomendar películas que no estén en la lista de la persona.
- Modificar una sesión después de guardarla.
- Cambiar el orden de las películas dentro de una sesión.

## 6. Reglas de negocio
**E1:**
- **R1.** Un título no puede estar dos veces en la lista de una misma persona.
- **R2.** Todo título tiene uno de tres estados: por ver, viendo o vista. Al guardarlo queda «por ver».
- **R3.** La calificación es opcional y va de 1 a 5.
- **R4.** Cada persona solo ve y modifica sus propios títulos.
- **R5.** Eliminar un título de la lista es definitivo.

**E2:**
- **R6.** El tiempo disponible es un número entero de minutos, entre 30 y 600.
- **R7.** Solo entran en una sesión películas de la lista de la persona en estado «por ver». Las series y las películas «viendo» o «vista» no.
- **R8.** Entre una película y la siguiente hay 10 minutos de pausa. No hay pausa antes de la primera ni después de la última. Las películas de la sesión quedan en el orden en que se agregaron.
- **R9.** Una sesión cabe si la suma de las duraciones, más las pausas, no supera el tiempo disponible. Una sesión que ocupa exactamente el tiempo sí cabe.
- **R10.** La duración de cada película se toma del catálogo de películas. Una película sin duración conocida, o con duración de 0 minutos, no se puede agregar, y la app explica por qué.
- **R11.** Guardar una sesión no cambia el estado de sus películas: siguen «por ver».
- **R12.** Una misma película puede estar en varias sesiones guardadas.
- **R13.** Las películas que caben se muestran de menor a mayor duración. Si dos duran lo mismo, va primero la que lleva más tiempo en la lista de la persona.
- **R14.** Una sesión guardada no se modifica. Sí se puede eliminar; para cambiarla, se elimina y se arma otra.
- **R15.** Al guardar una sesión se conservan el título, la duración y el póster de cada película tal como estaban en ese momento. Si la película cambia de estado, se elimina de la lista o cambia su duración en el catálogo, la sesión guardada no cambia.
- **R16.** El nombre de la sesión es opcional y puede tener hasta 60 caracteres. La fecha de creación se registra sola. Dos sesiones pueden llamarse igual. Una sesión sin nombre se muestra con su fecha de creación.
- **R17.** Una sesión guardada tiene al menos una película, y una película no puede estar dos veces en la misma sesión.
- **R18.** Cada persona solo ve y elimina sus propias sesiones, y la pantalla solo es accesible con sesión iniciada.
- **R19.** Las películas que duran más que el tiempo disponible no se listan; la app informa cuántas quedaron fuera.
- **R20.** Si una película no cabe en lo que queda del tiempo, la app no la agrega y explica por qué. Si la persona reduce el tiempo y la sesión armada deja de caber, la sesión se conserva, la app avisa y no permite guardarla hasta que vuelva a caber.

## 7. Supuestos
- [SUPUESTO] Una duración de 0 minutos en el catálogo equivale a duración desconocida.
- [SUPUESTO] Si dos películas empatan en duración y en fecha de incorporación, van primero por orden alfabético del título.
- [SUPUESTO] Las películas que no caben solas en el tiempo elegido no se listan, pero se informa cuántas son.
- [SUPUESTO] Las películas de una sesión se muestran en el orden en que se agregaron.
- [SUPUESTO] Se puede eliminar una sesión guardada. La ficha del cliente habla de guardar y consultar; sin poder modificar, no habría otra forma de quitar una sesión.
- [SUPUESTO] La pausa de cada sesión queda registrada con ella, de modo que si la regla cambia en el futuro, las sesiones antiguas conservan su cálculo.
- [SUPUESTO] No se guarda un borrador: si la persona sale de la pantalla con una sesión sin guardar, se pierde.
- [SUPUESTO] Las duraciones se consultan cuando se abre la pantalla y no se actualizan solas mientras esté abierta.

## 8. Puntos abiertos
- ¿Debería avisarse a la persona antes de salir de la pantalla con una sesión sin guardar?
- ¿Hace falta un máximo de sesiones guardadas por persona?
- ¿Se quiere poder reordenar las películas dentro de una sesión?
- ¿La duración de la película debe incluir un margen para anuncios o créditos?
