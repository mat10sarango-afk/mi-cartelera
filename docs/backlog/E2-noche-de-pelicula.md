# E2 · Noche de película — Historias de usuario y tickets

Épicas: [docs/backlog/epicas.md](epicas.md). PRD: [docs/prd/goldenmovies.md](../prd/goldenmovies.md). Refinamiento con la IA: [docs/backlog/refinamiento-E2.md](refinamiento-E2.md).
Spec: [docs/specs/01-noche-de-pelicula.md](../specs/01-noche-de-pelicula.md) y [docs/specs/02-interfaz-noche-de-pelicula.md](../specs/02-interfaz-noche-de-pelicula.md).
Rol único: el usuario de Mi Cartelera, con su cuenta y su lista. Los números de alcance (A5 a A8) y de reglas (R6 a R20) remiten a las secciones 4 y 6 del PRD.

## Historias de E2

Todas pasan INVEST: son independientes en lo posible (cada una se puede probar sola, aunque HU-2.3 a HU-2.6 parten de lo que construye HU-2.1), negociables en la interfaz, valiosas para el usuario, estimables, pequeñas (cada una se construye en un solo ticket de interfaz, y algunas lo comparten) y verificables con los criterios de abajo.

### HU-2.1 · Indicar mi tiempo y ver qué películas caben
**Estado:** refinada.

Como usuario de Mi Cartelera, quiero indicar cuánto tiempo tengo libre y ver qué películas de mi lista «por ver» caben en ese tiempo, para elegir algo que pueda terminar.
- **Alcance PRD:** A5 (tiempo disponible) y A6 (qué cabe).
- **Reglas del PRD que aplican:** R6, R7, R9, R13 y R19.
- **Decisiones del cliente y del estudiante:**
  - El tiempo es un número entero de minutos, entre 30 y 600.
  - Solo entran películas de mi lista en estado «por ver»; las series no.
  - Una película que ocupa exactamente el tiempo disponible sí cabe.
  - Las películas que caben se ordenan de menor a mayor duración y, si empatan, primero la que lleva más tiempo en mi lista (decisión 2 del estudiante).
- **Casos borde:** los propuestos con la IA y su resolución están en [refinamiento-E2.md](refinamiento-E2.md).

#### Criterios de aceptación
1. **Películas que caben** (R7, R9)
   - DADO que tengo en «por ver» películas de 90, 120 y 200 minutos,
   - CUANDO indico 150 minutos,
   - ENTONCES veo las de 90 y 120, cada una con su duración, y no veo la de 200.
2. **Cabe justo** (R9)
   - DADO una película por ver de 150 minutos,
   - CUANDO indico 150 minutos,
   - ENTONCES la película aparece entre las que caben.
3. **Orden de las que caben** (R13)
   - DADO tres películas por ver: A de 120 minutos, B de 90 minutos agregada hace una semana y C de 90 minutos agregada ayer,
   - CUANDO indico 300 minutos,
   - ENTONCES las veo en este orden: B, C y A.
4. **Tiempo mínimo** (R6)
   - DADO que estoy eligiendo mi tiempo,
   - CUANDO indico 30 minutos,
   - ENTONCES la app lo acepta y me muestra las películas de 30 minutos o menos.
5. **Tiempo máximo** (R6)
   - DADO que estoy eligiendo mi tiempo,
   - CUANDO indico 600 minutos,
   - ENTONCES la app lo acepta.
6. **Menos del mínimo** (R6)
   - DADO que estoy eligiendo mi tiempo,
   - CUANDO indico 29 minutos,
   - ENTONCES la app no actualiza la lista y me avisa de que el tiempo debe estar entre 30 y 600 minutos.
7. **Más del máximo** (R6)
   - DADO que estoy eligiendo mi tiempo,
   - CUANDO indico 601 minutos,
   - ENTONCES la app no actualiza la lista y me avisa de que el tiempo debe estar entre 30 y 600 minutos.
8. **Sin tiempo** (R6)
   - DADO que no he escrito ningún tiempo,
   - CUANDO intento ver qué cabe,
   - ENTONCES la app me pide que indique cuántos minutos tengo.
9. **Tiempo no entero** (R6)
   - DADO que estoy eligiendo mi tiempo,
   - CUANDO indico 90,5 minutos,
   - ENTONCES la app no lo acepta y me avisa de que debe ser un número entero de minutos.
10. **Solo películas por ver** (R7)
   - DADO una lista con películas en «por ver», «viendo» y «vista», y una serie en «por ver»,
   - CUANDO indico un tiempo suficiente,
   - ENTONCES solo veo las películas que están en «por ver».
11. **Sin películas por ver** (R7)
   - DADO que no tengo ninguna película en «por ver»,
   - CUANDO abro la pantalla,
   - ENTONCES la app me avisa de que no tengo películas por ver.
12. **Ninguna cabe** (R9)
   - DADO películas por ver de 120 y 150 minutos,
   - CUANDO indico 90 minutos,
   - ENTONCES la app me avisa de que ninguna película por ver cabe en 90 minutos.
13. **Cuántas quedaron fuera** (R9, R19)
   - DADO películas por ver de 90, 120 y 200 minutos,
   - CUANDO indico 150 minutos,
   - ENTONCES la app me dice que 1 película por ver no cabe en ese tiempo.
14. **Cargando** (R10)
   - DADO que la app todavía está consultando las duraciones,
   - CUANDO miro la pantalla,
   - ENTONCES la app me indica que está cargando y no me dice que no tengo películas.
15. **Error al cargar** (R10)
   - DADO que no se pueden cargar mis películas o sus duraciones,
   - CUANDO abro la pantalla,
   - ENTONCES la app me avisa del error y me deja intentarlo de nuevo.
16. **Solo con sesión iniciada** (R18)
   - DADO que no he iniciado sesión,
   - CUANDO intento abrir Noche de película,
   - ENTONCES la app me lleva a iniciar sesión.

### HU-2.2 · Entender por qué una película no está disponible
**Estado:** refinada.

Como usuario de Mi Cartelera, quiero ver cuáles de mis películas «por ver» no se pueden agregar a una sesión y por qué, para no pensar que desaparecieron de mi lista.
- **Alcance PRD:** A6 (qué cabe).
- **Reglas del PRD que aplican:** R10.
- **Decisiones del cliente y del estudiante:**
  - Una película sin duración conocida no se puede agregar y la app explica por qué.
  - Una duración de 0 minutos se trata como duración desconocida.
- **Casos borde:** los propuestos con la IA y su resolución están en [refinamiento-E2.md](refinamiento-E2.md).

#### Criterios de aceptación
1. **Película sin duración** (R10)
   - DADO una película por ver de la que no se conoce la duración,
   - CUANDO miro la lista de lo que cabe,
   - ENTONCES aparece como no disponible, con el motivo escrito, y no puedo agregarla a la sesión.
2. **Duración cero** (R10)
   - DADO una película por ver cuyo catálogo informa 0 minutos de duración,
   - CUANDO miro la lista,
   - ENTONCES se trata igual que una película sin duración.
3. **Falla una consulta** (R10)
   - DADO que no se pudo consultar la duración de una película pero sí la de las demás,
   - CUANDO miro la lista,
   - ENTONCES esa película aparece como no disponible con un motivo distinto y las demás se ven con normalidad.
4. **Siempre visibles** (R10)
   - DADO películas sin duración,
   - CUANDO indico cualquier tiempo válido,
   - ENTONCES siguen apareciendo como no disponibles, después de las que caben.
5. **Motivo escrito** (R10)
   - DADO cualquier película no disponible,
   - CUANDO la miro en la lista,
   - ENTONCES veo el motivo escrito con palabras, no solo con un color.

### HU-2.3 · Armar una sesión con una o varias películas
**Estado:** refinada.

Como usuario de Mi Cartelera, quiero agregar y quitar películas de una sesión y ver en todo momento cuánto dura y cuánto tiempo me queda, para armar una noche que pueda terminar.
- **Alcance PRD:** A7 (armar la sesión).
- **Reglas del PRD que aplican:** R8, R9, R10, R17 y R20.
- **Decisiones del cliente y del estudiante:**
  - Hay 10 minutos de pausa entre una película y la siguiente; no hay pausa antes de la primera ni después de la última.
  - Una sesión cabe si la suma de las duraciones más las pausas no supera el tiempo disponible; ocupar exactamente el tiempo sí cabe.
  - Si una película no cabe en lo que queda, la app no la agrega y explica por qué.
- **Casos borde:** los propuestos con la IA y su resolución están en [refinamiento-E2.md](refinamiento-E2.md).

#### Criterios de aceptación
1. **Primera película** (R8, R9)
   - DADO que tengo 180 minutos y la sesión vacía,
   - CUANDO agrego una película de 100 minutos,
   - ENTONCES la sesión muestra una duración total de 100 minutos y 80 minutos restantes.
2. **Segunda película con pausa** (R8, R9)
   - DADO que tengo 240 minutos y una película de 100 minutos en la sesión,
   - CUANDO agrego una de 90 minutos,
   - ENTONCES la sesión muestra 200 minutos de duración total (100 + 10 de pausa + 90) y 40 minutos restantes.
3. **Tercera película** (R8, R9)
   - DADO que tengo 300 minutos y una sesión con películas de 100 y 90 minutos,
   - CUANDO agrego una de 60 minutos,
   - ENTONCES la sesión muestra 270 minutos de duración total (con dos pausas) y 30 minutos restantes.
4. **Ocupa exactamente el tiempo** (R9)
   - DADO que tengo 200 minutos y una película de 100 minutos en la sesión,
   - CUANDO agrego una de 90 minutos,
   - ENTONCES la app la agrega y muestra 200 minutos de duración total y 0 restantes.
5. **No cabe en lo que queda** (R9, R20)
   - DADO que tengo 200 minutos y una película de 100 minutos en la sesión,
   - CUANDO intento agregar una de 91 minutos,
   - ENTONCES la app no la agrega y me dice que me pasaría 1 minuto del tiempo disponible.
6. **Película sin duración** (R10)
   - DADO una película por ver sin duración conocida,
   - CUANDO intento agregarla a la sesión,
   - ENTONCES la app no la agrega y me explica que no se conoce su duración.
7. **Película repetida** (R17)
   - DADO una película que ya está en la sesión,
   - CUANDO intento agregarla otra vez,
   - ENTONCES la app no la agrega y me indica que ya está en la sesión.
8. **Quitar una película** (R8, R9)
   - DADO una sesión con tres películas de 60, 80 y 90 minutos en ese orden,
   - CUANDO quito la de 80 minutos,
   - ENTONCES ya no está, las otras dos mantienen su orden y la duración total pasa a 160 minutos (60 + 10 + 90).
9. **Quitar la única película** (R9)
   - DADO una sesión con una sola película,
   - CUANDO la quito,
   - ENTONCES la sesión queda vacía, con 0 minutos de duración y todo el tiempo disponible como restante.
10. **Total y restante siempre visibles** (R9)
   - DADO una sesión vacía o con películas,
   - CUANDO miro el panel de la sesión,
   - ENTONCES veo siempre la duración total con pausas y el tiempo restante.
11. **Cambio de tiempo con sesión armada** (R9, R20)
   - DADO una sesión que dura 200 minutos, armada cuando tenía 240,
   - CUANDO cambio mi tiempo disponible a 180,
   - ENTONCES la sesión se conserva, la app me avisa de que dura 200 y mi tiempo es 180, y no me deja guardarla hasta que quite películas.
12. **Película agregada marcada** (R17)
   - DADO una película que ya está en la sesión,
   - CUANDO miro la lista de lo que cabe,
   - ENTONCES aparece marcada como agregada.
13. **Orden dentro de la sesión** (R8)
   - DADO que agrego primero la película B y luego la A,
   - CUANDO miro la sesión,
   - ENTONCES veo B y luego A, en el orden en que las agregué.

### HU-2.4 · Guardar la sesión
**Estado:** refinada.

Como usuario de Mi Cartelera, quiero guardar la sesión que armé, con un nombre si quiero, para tenerla lista para esa noche.
- **Alcance PRD:** A8 (guardar).
- **Reglas del PRD que aplican:** R11, R12, R15, R16 y R17.
- **Decisiones del cliente y del estudiante:**
  - Guardar una sesión no cambia el estado de sus películas: siguen «por ver» (decisión del cliente).
  - Una película puede estar en dos sesiones guardadas (decisión 1 del estudiante).
  - Al guardar se copian título, duración y póster dentro de la sesión (decisión 4 del estudiante).
  - El nombre es opcional, de 60 caracteres como máximo, y la fecha de creación se registra sola (decisión 5 del estudiante).
- **Casos borde:** los propuestos con la IA y su resolución están en [refinamiento-E2.md](refinamiento-E2.md).

#### Criterios de aceptación
1. **Guardar con nombre** (R16)
   - DADO una sesión armada que cabe en mi tiempo y el nombre «Viernes de terror»,
   - CUANDO la guardo,
   - ENTONCES aparece en mis sesiones guardadas con ese nombre, sus películas en orden con su duración, su duración total y su fecha de creación.
2. **Guardar sin nombre** (R16)
   - DADO una sesión armada que cabe, sin nombre,
   - CUANDO la guardo,
   - ENTONCES se guarda y se muestra con su fecha de creación en lugar del nombre.
3. **Nombre de 60 caracteres** (R16)
   - DADO que estoy guardando una sesión,
   - CUANDO escribo un nombre de exactamente 60 caracteres,
   - ENTONCES la app lo acepta.
4. **Nombre de 61 caracteres** (R16)
   - DADO que estoy guardando una sesión,
   - CUANDO escribo un nombre de 61 caracteres,
   - ENTONCES la app no la guarda y me avisa de que el nombre no puede pasar de 60 caracteres.
5. **Nombre de solo espacios** (R16)
   - DADO que estoy guardando una sesión,
   - CUANDO escribo un nombre formado solo por espacios,
   - ENTONCES se trata como si no tuviera nombre.
6. **Sesión vacía** (R17)
   - DADO que no hay ninguna película en la sesión,
   - CUANDO intento guardarla,
   - ENTONCES la app no la guarda y me indica que agregue al menos una película.
7. **Guardar una sesión que ocupa justo el tiempo** (R9, R11)
   - DADO una sesión cuya duración total es igual a mi tiempo disponible,
   - CUANDO la guardo,
   - ENTONCES se guarda.
8. **Sesión que no cabe** (R9)
   - DADO una sesión que ya no cabe porque reduje mi tiempo,
   - CUANDO intento guardarla,
   - ENTONCES la app no la guarda y me muestra el aviso de que me paso del tiempo.
9. **Las películas siguen «por ver»** (R11)
   - DADO tres películas «por ver» en una sesión,
   - CUANDO la guardo,
   - ENTONCES las tres siguen «por ver» en Mi lista y siguen apareciendo en lo que cabe.
10. **Una película en dos sesiones** (R12)
   - DADO una película que ya está en una sesión guardada,
   - CUANDO la agrego a otra sesión y la guardo,
   - ENTONCES las dos sesiones guardadas la muestran.
11. **Después de guardar** (R11)
   - DADO que acabo de guardar una sesión con éxito,
   - CUANDO termina el guardado,
   - ENTONCES veo la confirmación y el panel de la sesión queda vacío para armar otra.
12. **Falla al guardar** (R11)
   - DADO que no se puede guardar la sesión,
   - CUANDO intento guardarla,
   - ENTONCES la app me avisa del error, conserva la sesión que armé y no deja ninguna sesión a medias.
13. **Un solo guardado por clic** (R11)
   - DADO que acabo de pulsar guardar,
   - CUANDO vuelvo a pulsar antes de que termine,
   - ENTONCES no se guarda dos veces.
14. **Nombres repetidos** (R16)
   - DADO una sesión guardada llamada «Viernes»,
   - CUANDO guardo otra también llamada «Viernes»,
   - ENTONCES se guardan las dos.

### HU-2.5 · Consultar mis sesiones guardadas
**Estado:** refinada.

Como usuario de Mi Cartelera, quiero ver mis sesiones guardadas con su detalle, para saber qué tengo planeado ver.
- **Alcance PRD:** A8 (consultar).
- **Reglas del PRD que aplican:** R14, R15, R16 y R18.
- **Decisiones del cliente y del estudiante:**
  - Una sesión guardada no se modifica (decisión 3 del estudiante).
  - La sesión conserva título, duración y póster tal como estaban al guardarla (decisión 4 del estudiante).
  - Cada usuario solo ve sus propias sesiones.
- **Casos borde:** los propuestos con la IA y su resolución están en [refinamiento-E2.md](refinamiento-E2.md).

#### Criterios de aceptación
1. **Mis sesiones** (R18)
   - DADO que tengo varias sesiones guardadas,
   - CUANDO abro la pantalla,
   - ENTONCES las veo todas, la más reciente primero.
2. **Detalle de una sesión** (R15, R16)
   - DADO una sesión guardada,
   - CUANDO la miro en mis sesiones,
   - ENTONCES veo su nombre o su fecha, su fecha de creación, el tiempo disponible con el que la armé, sus películas en orden con su duración y su duración total con pausas.
3. **Sin sesiones** (R18)
   - DADO que no he guardado ninguna sesión,
   - CUANDO abro la pantalla,
   - ENTONCES la app me avisa de que todavía no tengo sesiones guardadas.
4. **Cargando sesiones** (R18)
   - DADO que mis sesiones todavía no terminan de cargar,
   - CUANDO miro la sección,
   - ENTONCES la app me indica que está cargando y no me dice que no tengo sesiones.
5. **Error al cargar sesiones** (R18)
   - DADO que mis sesiones no se pueden cargar,
   - CUANDO abro la pantalla,
   - ENTONCES la app me avisa del error y no me dice que no tengo sesiones.
6. **Solo las mías** (R18)
   - DADO dos cuentas distintas, cada una con sesiones guardadas,
   - CUANDO una de ellas abre sus sesiones,
   - ENTONCES solo ve las suyas.
7. **Película borrada de mi lista** (R15)
   - DADO una película que está en una sesión guardada y que después eliminé de Mi lista,
   - CUANDO miro la sesión,
   - ENTONCES sigue mostrando esa película con su título y su duración guardados, y la duración total no cambia.
8. **Película con otro estado** (R11, R15)
   - DADO una película de una sesión guardada que después marqué como «vista»,
   - CUANDO miro la sesión,
   - ENTONCES la sesión no cambia.
9. **La sesión no se modifica** (R14)
   - DADO una sesión guardada,
   - CUANDO la miro,
   - ENTONCES no hay forma de cambiar sus películas, su nombre ni su tiempo.

### HU-2.6 · Eliminar una sesión guardada
**Estado:** refinada.

Como usuario de Mi Cartelera, quiero eliminar una sesión guardada que ya no quiero, para que mis sesiones no se llenen de planes que no voy a usar.
- **Alcance PRD:** A8 (eliminar). **[SUPUESTO]** La ficha del cliente habla de guardar y consultar; eliminar se añade porque, sin poder modificar, no habría forma de quitar una sesión.
- **Reglas del PRD que aplican:** R14 y R18.
- **Decisiones del cliente y del estudiante:**
  - Una sesión guardada no se modifica, pero se puede eliminar (decisión 3 del estudiante).
- **Casos borde:** los propuestos con la IA y su resolución están en [refinamiento-E2.md](refinamiento-E2.md).

#### Criterios de aceptación
1. **Eliminar una sesión** (R14)
   - DADO una sesión guardada,
   - CUANDO elijo eliminarla y confirmo,
   - ENTONCES desaparece de mis sesiones guardadas.
2. **Cancelar la eliminación** (R14)
   - DADO una sesión guardada,
   - CUANDO elijo eliminarla y cancelo,
   - ENTONCES la sesión se conserva.
3. **Mi lista queda intacta** (R11, R14)
   - DADO una sesión guardada con tres películas,
   - CUANDO la elimino,
   - ENTONCES las tres películas siguen en Mi lista con su estado «por ver».
4. **No puedo eliminar sesiones ajenas** (R18)
   - DADO dos cuentas distintas,
   - CUANDO una intenta eliminar una sesión de la otra,
   - ENTONCES no puede.
5. **Falla al eliminar** (R14)
   - DADO que no se puede eliminar la sesión,
   - CUANDO intento eliminarla,
   - ENTONCES la app me avisa del error y la sesión sigue en mi lista de sesiones.

## Historias fuera de alcance
Se dejan anotadas para no perderlas, pero no entran en E2.

### HU-2.7 · Editar una sesión guardada — fuera de alcance
Como usuario, quiero cambiar las películas o el nombre de una sesión guardada, para ajustar mi plan.
- **Motivo:** decisión 3 del estudiante: una sesión guardada no se modifica; para cambiarla se elimina y se arma otra.

### HU-2.8 · Reordenar las películas de una sesión — fuera de alcance
Como usuario, quiero cambiar el orden de las películas dentro de la sesión, para verlas en el orden que prefiera.
- **Motivo:** la ficha no lo pide. Las películas quedan en el orden en que se agregaron.

### HU-2.9 · Compartir o programar una sesión — fuera de alcance
Como usuario, quiero compartir una sesión con amigos o ponerle un recordatorio, para organizar la noche.
- **Motivo:** compartir, recordatorios, notificaciones y calendarios son no-alcance explícito del cliente.

### HU-2.10 · Opcionales con puntos extra — pendientes de decidir
«Llenar mi noche», filtro por género, marcar sesión como realizada, validación del límite en la base de datos, revisión adversarial y app publicada. Cada uno pide su historia, sus criterios y su lugar en la spec antes de tocar código. Hoy no están en E2; si se eligen, se agregan aquí y a las specs primero.

## Tickets
Historias: HU-2.1 a HU-2.6. Según AGENTS.md, ninguna funcionalidad se implementa sin spec: las specs 01 y 02 existen antes de T-01. Un commit por ticket, con su id en el mensaje.

### T-01 · Preparar Bootstrap, el tema y Vitest
**Estado:** pendiente.

- **Historia:** ninguna (la necesitan todas).
- **Tipo:** Configuración.
- **Descripción:** Instalar Vitest como dependencia de desarrollo y agregar el script `test`. Instalar solo el CSS de Bootstrap, importarlo en `src/main.tsx` antes de `index.css`, activar el tema oscuro de Bootstrap con `data-bs-theme='dark'` en `index.html`, y crear `src/styles/tema.css` con los tokens nuevos y las variables de Bootstrap apuntadas a los tokens, como pide DESIGN.md.
- **Definition of Done:**
  - [ ] `pnpm test` se ejecuta y pasa al menos un test de prueba.
  - [ ] Bootstrap está instalado sin `react-bootstrap`, sin iconos y sin su JavaScript (D-10).
  - [ ] `src/main.tsx` importa Bootstrap, `index.css` y `tema.css`, en ese orden.
  - [ ] Las cuatro pantallas del Proyecto 3 se ven como en `docs/capturas/` (D-11) y siguen funcionando.
  - [ ] `pnpm build` y `pnpm lint` pasan.
- **Dependencias:** las specs 01 y 02.
- **Nota:** si D-11 falla, se ajusta `tema.css` o el orden de importación; no se edita `index.css`.

### T-02 · Reglas del tiempo y de la sesión
**Estado:** pendiente.

- **Historia:** HU-2.1 y HU-2.3.
- **Tipo:** Modelo/Dominio.
- **Descripción:** En `src/types/` y `src/dominio/`, definir los tipos de la épica y escribir las funciones puras que validan el tiempo disponible y deciden si una sesión cabe y si se puede agregar una película. Sin llamadas a red ni a Supabase.
- **Definition of Done:**
  - [ ] Hay tests de `validarTiempoDisponible` en los límites: 29, 30, 600, 601, vacío y decimal.
  - [ ] Hay tests de `evaluarSesion`: sesión vacía, una sola película sin pausa, dos y tres películas con sus pausas, exactamente el tiempo, un minuto de más, película sin duración y tiempo fuera de rango.
  - [ ] Hay tests de `puedeAgregar`, incluido el exceso en minutos.
  - [ ] Hay tests de `normalizarDuracion` (0, negativo, `null`, decimal).
  - [ ] Ningún tipo usa `any`; `pnpm test` y `pnpm build` pasan.
- **Dependencias:** T-01.

### T-03 · Candidatas, orden y nombre de la sesión
**Estado:** pendiente.

- **Historia:** HU-2.1, HU-2.2 y HU-2.4.
- **Tipo:** Modelo/Dominio.
- **Descripción:** En `src/dominio/`, escribir la función pura que separa las películas por ver en las que caben (ordenadas), las no disponibles y las que quedan fuera, y las funciones que validan y normalizan el nombre de la sesión.
- **Definition of Done:**
  - [ ] Hay tests de orden: por duración, desempate por fecha en la lista y desempate final por título.
  - [ ] Hay tests de que una película de exactamente el tiempo cabe y una de un minuto más queda fuera.
  - [ ] Hay tests de películas sin duración: siempre aparecen, después de las que caben.
  - [ ] Hay tests del nombre: vacío, solo espacios, 60 y 61 caracteres.
  - [ ] Ningún tipo usa `any`; `pnpm test` y `pnpm build` pasan.
- **Dependencias:** T-02.

### T-04 · Migración y políticas RLS
**Estado:** pendiente.

- **Historia:** HU-2.4, HU-2.5 y HU-2.6.
- **Tipo:** Datos.
- **Descripción:** Crear en `supabase/migraciones/` la migración con las tablas de sesiones y de películas de sesión, la función que guarda una sesión completa en una sola operación y las políticas RLS. Aplicarla en Supabase.
- **Definition of Done:**
  - [ ] La migración está en `supabase/migraciones/`, en snake_case, igual a la de la spec 01.
  - [ ] RLS está activada en las dos tablas y no hay política de actualización.
  - [ ] Con dos cuentas, cada una ve y elimina solo sus sesiones, y no puede insertar películas en una sesión ajena (consultas SQL anotadas en `docs/VERIFICACION.md`).
  - [ ] Una sesión sin películas no se puede guardar con la función.
  - [ ] No hay claves ni valores secretos en el repositorio.
- **Dependencias:** las specs 01 y 02.

### T-05 · Servicios de lectura: películas por ver y duraciones
**Estado:** pendiente.

- **Historia:** HU-2.1 y HU-2.2.
- **Tipo:** Datos.
- **Descripción:** En `src/services/`, añadir el servicio que lee las películas «por ver» del usuario y el servicio que consulta la duración de cada película en el catálogo externo. No se modifican `src/lib/lista.ts` ni `src/lib/tmdb.ts`.
- **Definition of Done:**
  - [ ] Solo los servicios llaman a Supabase y al catálogo; los componentes no.
  - [ ] Una duración ausente o de 0 minutos llega como `null`.
  - [ ] El fallo de la consulta de una película no impide recibir las demás.
  - [ ] La clave del catálogo se lee de la variable de entorno que ya usa el proyecto.
  - [ ] `pnpm test` y `pnpm build` pasan.
- **Dependencias:** T-02.

### T-06 · Servicio de sesiones: guardar, listar y eliminar
**Estado:** pendiente.

- **Historia:** HU-2.4, HU-2.5 y HU-2.6.
- **Tipo:** Datos.
- **Descripción:** En `src/services/`, añadir el servicio que guarda una sesión (validando antes con el dominio), lista las sesiones del usuario con sus películas y elimina una sesión.
- **Definition of Done:**
  - [ ] Solo el servicio llama a Supabase.
  - [ ] Guardar valida con `evaluarSesion` y `validarNombreSesion` antes de llamar a la base de datos.
  - [ ] Un fallo al guardar no deja una sesión sin películas.
  - [ ] Las sesiones se listan de la más reciente a la más antigua.
  - [ ] `pnpm test` y `pnpm build` pasan.
- **Dependencias:** T-03 y T-04.

### T-07 · Pantalla: ruta, tiempo y qué cabe
**Estado:** pendiente.

- **Historia:** HU-2.1 y HU-2.2.
- **Tipo:** Interfaz.
- **Descripción:** Crear la pantalla «Noche de película» en una ruta protegida, con el enlace en la barra de navegación, el campo del tiempo y la lista de películas que caben con sus estados de carga, vacío y error. Aplica DESIGN.md y la spec 02.
- **Definition of Done:**
  - [ ] HU-2.1-CA1 a CA16 y HU-2.2-CA1 a CA5 se comprueban en el navegador y quedan anotados.
  - [ ] La ruta solo es accesible con sesión iniciada.
  - [ ] D-01, D-02, D-03, D-04, D-06, D-07, D-08 y D-09 pasan sobre lo construido.
  - [ ] `pnpm test`, `pnpm build` y `pnpm lint` pasan.
- **Dependencias:** T-01, T-03 y T-05.

### T-08 · Armar la sesión
**Estado:** pendiente.

- **Historia:** HU-2.3.
- **Tipo:** Interfaz.
- **Descripción:** Añadir el panel de la sesión: agregar y quitar películas, duración total con pausas, tiempo restante y los avisos de por qué una película no se agrega.
- **Definition of Done:**
  - [ ] HU-2.3-CA1 a CA13 se comprueban en el navegador y quedan anotados.
  - [ ] El total y el restante son visibles en todo momento (D-05).
  - [ ] La pausa y los límites se importan del dominio; ningún componente escribe 10, 30 ni 600 a mano.
  - [ ] `pnpm test`, `pnpm build` y `pnpm lint` pasan.
- **Dependencias:** T-02 y T-07.

### T-09 · Guardar la sesión
**Estado:** pendiente.

- **Historia:** HU-2.4.
- **Tipo:** Interfaz.
- **Descripción:** Añadir el nombre opcional, el botón de guardar con sus estados (enviando, éxito, error) y el vaciado del panel tras guardar.
- **Definition of Done:**
  - [ ] HU-2.4-CA1 a CA14 se comprueban en el navegador y quedan anotados.
  - [ ] Guardar no cambia el estado de las películas en Mi lista.
  - [ ] El botón se deshabilita mientras guarda y cuando la sesión está vacía o no cabe.
  - [ ] `pnpm test`, `pnpm build` y `pnpm lint` pasan.
- **Dependencias:** T-06 y T-08.

### T-10 · Consultar y eliminar sesiones guardadas
**Estado:** pendiente.

- **Historia:** HU-2.5 y HU-2.6.
- **Tipo:** Interfaz.
- **Descripción:** Añadir la sección de sesiones guardadas, con sus estados de carga, vacío y error, el detalle de cada sesión y la eliminación con confirmación.
- **Definition of Done:**
  - [ ] HU-2.5-CA1 a CA9 y HU-2.6-CA1 a CA5 se comprueban en el navegador y quedan anotados.
  - [ ] No hay ningún control para editar una sesión guardada.
  - [ ] `pnpm test`, `pnpm build` y `pnpm lint` pasan.
- **Dependencias:** T-06 y T-07.

### T-11 · Verificar en el navegador y con dos cuentas
**Estado:** pendiente.

- **Historia:** HU-2.1 a HU-2.6.
- **Tipo:** Test.
- **Descripción:** Comprobar todos los criterios, con tests automáticos donde se pueda y con pruebas manuales en el navegador y con dos cuentas para el resto. Llenar `docs/VERIFICACION.md`.
- **Definition of Done:**
  - [ ] Cada criterio tiene su resultado obtenido anotado en `docs/VERIFICACION.md`.
  - [ ] Con dos cuentas se demuestra que una no ve ni elimina las sesiones de la otra.
  - [ ] Los criterios de diseño D-01 a D-12 tienen su resultado.
  - [ ] Las funciones del Proyecto 3 siguen funcionando igual.
  - [ ] `pnpm test`, `pnpm build` y `pnpm lint` pasan.
- **Dependencias:** T-09 y T-10.

### Orden de ejecución sugerido
1. **Antes de empezar:** PRD, backlog y specs en `docs/` (este checkpoint).
2. **T-01:** Bootstrap, tema y Vitest.
3. **T-02 y T-04 en paralelo.** No dependen entre sí.
4. **T-03 y T-05 en paralelo**, cuando T-02 esté listo.
5. **T-06:** servicio de sesiones, cuando estén T-03 y T-04.
6. **T-07:** pantalla con el tiempo y lo que cabe.
7. **T-08:** armar la sesión.
8. **T-09:** guardar la sesión.
9. **T-10:** consultar y eliminar.
10. **T-11:** verificación final.

Para probar el aislamiento entre usuarios hacen falta dos cuentas de prueba, cada una con algunas películas «por ver».
