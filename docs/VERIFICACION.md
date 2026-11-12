#- **Fecha de la prueba:** 11-11-2026
- **Quién probó:** Usuario del proyecto.
- **Navegador y tamaño de pantalla:** Navegador de escritorio; resolución exacta sin registrar.
- **Cuentas de prueba:** Dos cuentas distintas de Supabase (A y B).

**Comprobación técnica:** Las 69 pruebas automatizadas pasaron. `pnpm build` terminó correctamente y ESLint no reportó errores. Se confirmó el inicio de sesión, el guardado de sesiones y la separación de sesiones entre dos cuentas. La migración SQL fue aplicada en Supabase. Las comprobaciones no realizadas permanecen pendientes.

## 1. Comprobaciones automáticas

| Comprobación | Resultado obtenido |
|---|---|
| `pnpm test` (tests de `src/dominio/`) | 	69 pruebas superadas. |
| `pnpm build` | Compilación completada correctamente. |
| `pnpm lint` | ESLint completado sin errores. |

## 2. Criterios de aceptación

### HU-2.1 · Indicar mi tiempo y ver qué películas caben

| Criterio | Qué se comprueba | Resultado obtenido |
|---|---|---|
| HU-2.1-CA1 · Películas que caben | `clasificarPeliculas` deja 90 y 120 en `caben` y cuenta 1 fuera; en el navegador se ven esas dos. | |
| HU-2.1-CA2 · Cabe justo | `clasificarPeliculas(150, [150])` deja la película en `caben`. | |
| HU-2.1-CA3 · Orden de las que caben | `clasificarPeliculas` devuelve B, C, A; con misma duración y misma fecha ordena por título. | |
| HU-2.1-CA4 · Tiempo mínimo | `validarTiempoDisponible(30)` devuelve `null`. | |
| HU-2.1-CA5 · Tiempo máximo | `validarTiempoDisponible(600)` devuelve `null`. | |
| HU-2.1-CA6 · Menos del mínimo | `validarTiempoDisponible(29)` devuelve el mensaje de rango; en pantalla no cambia la lista. | |
| HU-2.1-CA7 · Más del máximo | `validarTiempoDisponible(601)` devuelve el mensaje de rango. | |
| HU-2.1-CA8 · Sin tiempo | `validarTiempoDisponible(null)` devuelve el mensaje de tiempo vacío. | |
| HU-2.1-CA9 · Tiempo no entero | `validarTiempoDisponible(90.5)` devuelve el mensaje de número entero. | |
| HU-2.1-CA10 · Solo películas por ver | Con una lista de prueba que mezcle estados y una serie, solo salen las películas «por ver». | |
| HU-2.1-CA11 · Sin películas por ver | Con una cuenta sin películas «por ver», se ve el aviso. | |
| HU-2.1-CA12 · Ninguna cabe | `clasificarPeliculas(90, [120, 150])` deja `caben` vacío y `fuera` en 2. | |
| HU-2.1-CA13 · Cuántas quedaron fuera | El conteo `fuera` es 1 y la pantalla muestra «1 película por ver no cabe en este tiempo.» | |
| HU-2.1-CA14 · Cargando | Con la red limitada en las herramientas del navegador se ve la carga. | |
| HU-2.1-CA15 · Error al cargar | Con la red cortada se ve el aviso; al volver la red, reintentar carga la lista. | |
| HU-2.1-CA16 · Solo con sesión iniciada | En una ventana sin sesión, abrir `/noche` lleva a `/login`. | |

### HU-2.2 · Entender por qué una película no está disponible

| Criterio | Qué se comprueba | Resultado obtenido |
|---|---|---|
| HU-2.2-CA1 · Película sin duración | `puedeAgregar` devuelve `duracion_desconocida`; en pantalla el botón de agregar está deshabilitado. | |
| HU-2.2-CA2 · Duración cero | `normalizarDuracion(0)` devuelve `null`. | |
| HU-2.2-CA3 · Falla una consulta | Bloqueando la consulta de una película en las herramientas del navegador, solo esa sale como no disponible. | |
| HU-2.2-CA4 · Siempre visibles | `clasificarPeliculas` las devuelve en `sinDuracion` para cualquier tiempo. | |
| HU-2.2-CA5 · Motivo escrito | Se lee el texto del motivo en cada tarjeta no disponible (criterio de diseño D-03). | |

### HU-2.3 · Armar una sesión con una o varias películas

| Criterio | Qué se comprueba | Resultado obtenido |
|---|---|---|
| HU-2.3-CA1 · Primera película | `evaluarSesion(180, [100], 10)` → total 100, restante 80. | |
| HU-2.3-CA2 · Segunda película con pausa | `evaluarSesion(240, [100, 90], 10)` → total 200, restante 40. | |
| HU-2.3-CA3 · Tercera película | `evaluarSesion(300, [100, 90, 60], 10)` → total 270, restante 30. | |
| HU-2.3-CA4 · Ocupa exactamente el tiempo | `evaluarSesion(200, [100, 90], 10)` → `cabe: true`, restante 0. | |
| HU-2.3-CA5 · No cabe en lo que queda | `puedeAgregar(200, [100], 91, 10)` → `excede_tiempo`, exceso 1. | |
| HU-2.3-CA6 · Película sin duración | `puedeAgregar(180, [], null, 10)` → `duracion_desconocida`. | |
| HU-2.3-CA7 · Película repetida | La tarjeta de una película ya agregada no ofrece agregarla de nuevo y muestra «Ya está en tu sesión.» | |
| HU-2.3-CA8 · Quitar una película | `evaluarSesion(t, [60, 90], 10)` → total 160; en pantalla se conserva el orden. | |
| HU-2.3-CA9 · Quitar la única película | `evaluarSesion(180, [], 10)` → total 0, restante 180. | |
| HU-2.3-CA10 · Total y restante siempre visibles | Se ven los dos valores al abrir la pantalla, al agregar y al quitar (criterio de diseño D-05). | |
| HU-2.3-CA11 · Cambio de tiempo con sesión armada | `evaluarSesion(180, [..], 10)` → `excede_tiempo`; el botón de guardar queda deshabilitado. | |
| HU-2.3-CA12 · Película agregada marcada | La tarjeta muestra «Ya está en tu sesión.» | |
| HU-2.3-CA13 · Orden dentro de la sesión | Se agregan B y A y se ve ese orden. | |

### HU-2.4 · Guardar la sesión

| Criterio | Qué se comprueba | Resultado obtenido |
|---|---|---|
| HU-2.4-CA1 · Guardar con nombre | Se guarda y se ve en la lista de sesiones con todos esos datos. | |
| HU-2.4-CA2 · Guardar sin nombre | `validarNombreSesion('')` devuelve `null`; en pantalla se ve «Sesión del {fecha}». | |
| HU-2.4-CA3 · Nombre de 60 caracteres | `validarNombreSesion` con 60 caracteres devuelve `null`. | |
| HU-2.4-CA4 · Nombre de 61 caracteres | `validarNombreSesion` con 61 caracteres devuelve el mensaje de longitud. | |
| HU-2.4-CA5 · Nombre de solo espacios | `normalizarNombreSesion('   ')` devuelve `null`. | |
| HU-2.4-CA6 · Sesión vacía | Con la sesión vacía el botón de guardar está deshabilitado y se lee el motivo. | |
| HU-2.4-CA7 · Guardar una sesión que ocupa justo el tiempo | Se arma una sesión de 200 min con tiempo 200 y se guarda. | |
| HU-2.4-CA8 · Sesión que no cabe | `evaluarSesion` → `excede_tiempo` y guardar deshabilitado. | |
| HU-2.4-CA9 · Las películas siguen «por ver» | Después de guardar, Mi lista muestra las tres como «por ver» y la pantalla las sigue ofreciendo. | |
| HU-2.4-CA10 · Una película en dos sesiones | Dos sesiones con la misma película; en la tabla de películas de sesión hay una fila por sesión. | |
| HU-2.4-CA11 · Después de guardar | Se ve «Sesión guardada.» y el panel queda vacío. | |
| HU-2.4-CA12 · Falla al guardar | Con la red cortada se ve el aviso y la sesión sigue armada; en la base no queda una sesión sin películas. | |
| HU-2.4-CA13 · Un solo guardado por clic | El botón queda deshabilitado durante el guardado y solo aparece una sesión nueva. | |
| HU-2.4-CA14 · Nombres repetidos | Se guardan dos sesiones con el mismo nombre. | |

### HU-2.5 · Consultar mis sesiones guardadas

| Criterio | Qué se comprueba | Resultado obtenido |
|---|---|---|
| HU-2.5-CA1 · Mis sesiones | Con tres sesiones se ven en orden de creación descendente. | |
| HU-2.5-CA2 · Detalle de una sesión | Se comparan los datos con lo guardado. | |
| HU-2.5-CA3 · Sin sesiones | Con una cuenta nueva se ve el aviso. | |
| HU-2.5-CA4 · Cargando sesiones | Con la red limitada se ve la carga. | |
| HU-2.5-CA5 · Error al cargar sesiones | Con la red cortada se ve el aviso. | |
| HU-2.5-CA6 · Solo las mías | Con dos cuentas, cada una ve solo las suyas; una consulta directa a la tabla con la otra cuenta devuelve 0 filas ajenas. | |
| HU-2.5-CA7 · Película borrada de mi lista | Se elimina la película de Mi lista y la sesión conserva título, duración y total. | |
| HU-2.5-CA8 · Película con otro estado | Se marca como «vista» y la sesión sigue igual. | |
| HU-2.5-CA9 · La sesión no se modifica | No hay controles de edición; un intento de actualizar una fila de la sesión es rechazado. | |

### HU-2.6 · Eliminar una sesión guardada

| Criterio | Qué se comprueba | Resultado obtenido |
|---|---|---|
| HU-2.6-CA1 · Eliminar una sesión | Se elimina y deja de verse, también al recargar. | |
| HU-2.6-CA2 · Cancelar la eliminación | Se cancela y la sesión sigue. | |
| HU-2.6-CA3 · Mi lista queda intacta | Tras eliminar, Mi lista no cambia. | |
| HU-2.6-CA4 · No puedo eliminar sesiones ajenas | Con la cuenta B, un `delete` sobre la sesión de A afecta 0 filas. | |
| HU-2.6-CA5 · Falla al eliminar | Con la red cortada se ve el aviso y la sesión sigue. | |

## 3. Criterios de diseño

| # | Criterio | Cómo se comprueba | Resultado obtenido |
|---|---|---|---|
| D-01 | Ningún archivo de E2 contiene un color hexadecimal. | Comando: `grep -rnE "#[0-9a-fA-F]{3,8}\b" src/components/noche src/pages/NocheDePelicula.tsx` sin resultados | |
| D-02 | No hay estilos en línea en E2, salvo el ancho de la barra de tiempo. | Comando: `grep -rn "style={" src/components/noche src/pages/NocheDePelicula.tsx` (solo debe salir `BarraTiempo.tsx`) | |
| D-03 | Cada estado de una película («Cabe», «No cabe», «Sin duración») se muestra con texto, no solo con color. | Navegador | |
| D-04 | Una película sin duración aparece como no disponible, con su motivo escrito. | Navegador, con una película sin duración | |
| D-05 | El total con pausas y el tiempo restante están visibles en todo momento. | Navegador, con la sesión vacía, con películas y al quitar | |
| D-06 | Al recorrer la pantalla con Tab, todo control muestra el foco en dorado. | Navegador, solo con teclado | |
| D-07 | Un campo con error tiene borde rojo, mensaje debajo y `aria-invalid="true"`. | Navegador e inspector, con 29 y con 601 minutos | |
| D-08 | A 1280 px la pantalla tiene dos columnas; a 390 px, una, sin scroll horizontal. | Navegador, con el modo responsive | |
| D-09 | La carga se indica con un spinner con texto accesible y el error con un aviso `role="alert"`. | Navegador, con la red limitada y con la red cortada | |
| D-10 | No hay `react-bootstrap`, `bootstrap-icons` ni JavaScript de Bootstrap. | Comandos: `grep -nE "react-bootstrap|bootstrap-icons" package.json` y `grep -rn "bootstrap/dist/js\|bootstrap.bundle" src` sin resultados | |
| D-11 | Las pantallas del Proyecto 3 se ven igual que en `docs/capturas/`. | Navegador, comparando con las cuatro capturas | |
| D-12 | Los textos visibles coinciden con los de la spec 01 y la sección 2 de la spec 02. | Navegador, leyendo cada texto | |

## 4. Seguridad con dos cuentas

Con las cuentas A y B, cada una con al menos una sesión guardada. Anota el identificador de cada una (Authentication → Users en Supabase). En el editor SQL, para B:

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

| Prueba | Resultado obtenido |
|---|---|
| B cuenta las sesiones de A | |
| B cuenta las películas de sesiones de A | |
| B intenta borrar una sesión de A | |
| B intenta actualizar una sesión suya | |
| Desde la app, A ve solo sus sesiones y B solo las suyas | |
| Una sesión sin películas no se puede guardar con la función `guardar_sesion` | |

## 5. Las funciones del Proyecto 3 siguen funcionando igual

| Función | Resultado obtenido |
|---|---|
| Registro e inicio de sesión | |
| Búsqueda de títulos | |
| Explorar novedades, taquilleras y por año | |
| Agregar un título a Mi lista | |
| Cambiar estado, calificación y comentario | |
| Eliminar un título de Mi lista | |
| Detalle de un título | |
| Las cuatro pantallas se ven como en `docs/capturas/` | |
