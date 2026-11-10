# Spec 02 · Interfaz de Noche de película (E2)

- **Historias:** HU-2.1 a HU-2.6 (su aspecto; el comportamiento está en la spec 01).
- **Origen:** [docs/backlog/E2-noche-de-pelicula.md](../backlog/E2-noche-de-pelicula.md), [DESIGN.md](../../DESIGN.md) y [docs/specs/01-noche-de-pelicula.md](01-noche-de-pelicula.md).
- **Tickets:** T-01 y T-07 a T-10.
- **Referencia visual:** [docs/diseno/brand-board.html](../diseno/brand-board.html). Si difiere de DESIGN.md, gana DESIGN.md.

Esta spec dice cómo se ve la pantalla, no lo que hace. Los valores de los tokens y los componentes viven en DESIGN.md; aquí solo se citan por su nombre.

## 0. Decisiones de esta spec
1. **Textos.** Los mensajes de las reglas son los de la spec 01, carácter por carácter. Esta spec fija los demás, en la sección 2.
2. **Una sola pantalla.** Las sesiones guardadas van en la misma ruta, debajo de las dos columnas, en su propia sección. No hay ruta aparte.
3. **Bootstrap solo en E2.** La pantalla nueva usa clases de Bootstrap con sus variables apuntadas a los tokens, como dice DESIGN.md §2. El Proyecto 3 no se toca.
4. **Tema oscuro.** Se activa con `data-bs-theme="dark"` en `index.html`. Por eso `tema.css` apunta las variables de Bootstrap a los tokens también a nivel de página, para que las pantallas del Proyecto 3 conserven su aspecto (criterio D-11).
5. **Película agregada.** Conserva su insignia y añade el texto «Ya está en tu sesión.»; el botón queda deshabilitado. No se inventa una insignia nueva.
6. **Confirmar al eliminar.** Se usa `window.confirm`, como ya hace Mi lista. No se usa el modal de Bootstrap, porque requiere su JavaScript, prohibido en DESIGN.md §9.
7. **Póster.** La proporción es 2:3. Sin póster, un recuadro con el texto «Sin póster».
8. **Fecha.** Se muestra en la hora local del navegador, en formato corto con el mes escrito (por ejemplo, «12 nov 2026»).

## 1. Componentes por parte de la pantalla
Los nombres de la columna «Componentes de DESIGN.md» son los de sus secciones 6 y 7.

| Parte de la pantalla | Componentes de DESIGN.md | Archivo de React |
|---|---|---|
| Contenedor y distribución | Layout: contenedor, dos columnas desde 992 px, una columna debajo (§6) | `src/pages/NocheDePelicula.tsx` |
| Tiempo disponible | Panel, Campo de formulario (§7.1, §7.2) | `src/components/noche/FormularioTiempo.tsx` |
| Sesión que se arma | Panel, Barra de tiempo, Botón primario, Botón «Quitar» (§7.1, §7.5, §7.3) | `src/components/noche/PanelSesion.tsx`, `src/components/noche/BarraTiempo.tsx` |
| Nombre de la sesión | Campo de formulario (§7.2) | `src/components/noche/PanelSesion.tsx` |
| Lista de lo que cabe | Grilla de Tarjetas de película, `ul` con un `li` por tarjeta (§6, §7.6) | `src/components/noche/ListaCandidatas.tsx` |
| Cada película | Tarjeta de película, Insignia de estado (§7.6, §7.4) | `src/components/noche/TarjetaPelicula.tsx` |
| Película no disponible | Tarjeta de película con la insignia «Sin duración» y el motivo (§7.4, §7.6) | `src/components/noche/TarjetaPelicula.tsx` |
| Avisos de éxito, error e información | Avisos (§7.7) | los componentes que los producen |
| Cargando, vacío y error | Estados de la pantalla (§7.8) | `src/components/noche/ListaCandidatas.tsx`, `src/components/noche/ListaSesionesGuardadas.tsx` |
| Sesiones guardadas | Panel por sesión, lista (§7.1) | `src/components/noche/ListaSesionesGuardadas.tsx`, `src/components/noche/TarjetaSesion.tsx` |
| Enlace en la barra | Barra de navegación existente (§6) | `src/components/Navbar.tsx` |

Reglas para estos componentes:
- La pausa, el tiempo mínimo y el máximo se importan de `src/dominio/sesion.ts`; ningún componente los escribe a mano.
- El estado de cada tarjeta (cabe, no cabe en lo que queda, agregada, no disponible) lo decide el dominio con `clasificarPeliculas` y `puedeAgregar`; la tarjeta solo lo dibuja.
- Ningún componente nuevo llama a los servicios salvo `NocheDePelicula`; los demás reciben datos y funciones por props.

## 2. Textos de la interfaz
Los mensajes de validación y de motivos están en la spec 01, sección 3. Estos son los demás.

| Dónde | Texto |
|---|---|
| Título de la pantalla | Noche de película |
| Enlace en la barra | Noche de película |
| Etiqueta del campo del tiempo | Minutos disponibles |
| Ayuda del campo del tiempo | Entre 30 y 600 minutos. |
| Antes de indicar un tiempo válido | Indica cuánto tiempo tienes para ver qué películas caben. |
| Título de la lista | Qué cabe en tu tiempo |
| Cargando películas | Cargando tus películas… |
| Error al cargar películas | No se pudieron cargar tus películas. |
| Botón de reintento | Reintentar |
| Sin películas por ver | No tienes películas por ver en tu lista. |
| Ninguna cabe | Ninguna película por ver cabe en {n} min. |
| Películas fuera | {n} película por ver no cabe en este tiempo. / {n} películas por ver no caben en este tiempo. |
| Insignias | Cabe · No cabe · Sin duración |
| Duración en la tarjeta | {n} min |
| Sin póster | Sin póster |
| Botón de la tarjeta | Agregar |
| Título del panel de la sesión | Tu sesión |
| Sesión vacía | Todavía no agregaste películas. |
| Total | Duración total: {n} min |
| Restante | Te quedan {n} min |
| Botón de quitar | Quitar |
| Etiqueta del nombre | Nombre de la sesión (opcional) |
| Sesión que ya no cabe | Tu sesión dura {total} min y tu tiempo es de {tiempo} min. Quita películas para poder guardarla. |
| Botón de guardar | Guardar sesión |
| Mientras guarda | El botón se deshabilita y conserva su texto. |
| Éxito al guardar | Sesión guardada. / Sesión «{nombre}» guardada. |
| Error al guardar | No se pudo guardar la sesión. Inténtalo de nuevo. |
| Sesión sin películas | Agrega al menos una película para guardar la sesión. |
| Título de las sesiones | Tus sesiones guardadas |
| Cargando sesiones | Cargando tus sesiones… |
| Error al cargar sesiones | No se pudieron cargar tus sesiones. |
| Sin sesiones | Todavía no has guardado ninguna sesión. |
| Sesión sin nombre | Sesión del {fecha} |
| Detalle de la sesión | Creada el {fecha} · Tiempo disponible: {n} min · Duración total: {n} min |
| Botón de eliminar | Eliminar |
| Confirmación al eliminar | ¿Eliminar la sesión «{nombre}»? Tus películas no se tocan. |
| Error al eliminar | No se pudo eliminar la sesión. |

## 3. Criterios de diseño de esta pantalla
Vienen de la sección 10 de DESIGN.md. Los comandos usan las rutas de la tabla ticket → archivos de la spec 01. `src/styles/tema.css` y `src/index.css` quedan fuera de D-01 y D-02, porque ahí viven los tokens.

| # | Criterio | Cómo se comprueba | Ticket |
|---|---|---|---|
| D-01 | Ningún archivo de E2 contiene un color hexadecimal. | Comando: `grep -rnE "#[0-9a-fA-F]{3,8}\b" src/components/noche src/pages/NocheDePelicula.tsx` sin resultados | T-07 a T-10 |
| D-02 | No hay estilos en línea en E2, salvo el ancho de la barra de tiempo. | Comando: `grep -rn "style={" src/components/noche src/pages/NocheDePelicula.tsx` | T-07 a T-10 |
| D-03 | Cada estado de una película («Cabe», «No cabe», «Sin duración») se muestra con texto, no solo con color. | Navegador | T-07 |
| D-04 | Una película sin duración aparece como no disponible, con su motivo escrito. | Navegador, con una película sin duración | T-07 |
| D-05 | El total con pausas y el tiempo restante están visibles en todo momento. | Navegador, con la sesión vacía, con películas y al quitar | T-08 |
| D-06 | Al recorrer la pantalla con Tab, todo control muestra el foco en dorado. | Navegador, solo con teclado | T-07 a T-10 |
| D-07 | Un campo con error tiene borde rojo, mensaje debajo y `aria-invalid="true"`. | Navegador e inspector, con 29 y con 601 minutos | T-07 |
| D-08 | A 1280 px la pantalla tiene dos columnas; a 390 px, una, sin scroll horizontal. | Navegador, con el modo responsive | T-07 a T-10 |
| D-09 | La carga se indica con un spinner con texto accesible y el error con un aviso `role="alert"`. | Navegador, con la red limitada y con la red cortada | T-07, T-10 |
| D-10 | `package.json` no incluye `react-bootstrap` ni `bootstrap-icons`, y el código no importa el JavaScript de Bootstrap. | Comandos: `grep -nE "react-bootstrap\|bootstrap-icons" package.json` y `grep -rn "bootstrap/dist/js\|bootstrap.bundle" src` | T-01 |
| D-11 | Las pantallas del Proyecto 3 se ven igual que en `docs/capturas/` después de instalar Bootstrap. | Navegador, comparando con las cuatro capturas | T-01 |
| D-12 | Los textos visibles coinciden con los de la spec 01 y la sección 2 de esta spec. | Navegador, contra `docs/VERIFICACION.md` | T-11 |

## 4. Verificación
Los criterios D-01, D-02 y D-10 se comprueban con comando; los demás, mirando la pantalla. Los resultados se anotan en `docs/VERIFICACION.md` (T-11), con una fila por criterio de diseño, junto a los de la spec 01.

## Pendientes
1. **Contraste de `--texto-suave`** sobre `--superficie` es 6,4:1 (cumple AA, no AAA). Si el texto de ayuda se ve flojo en pantalla, se ajusta el token en DESIGN.md primero.
2. **`window.confirm`** es nativo y no sigue el tema. Es una decisión consciente para no cargar el JavaScript de Bootstrap.
3. **La barra de navegación del Proyecto 3** usa estilos en línea (deuda registrada); en este proyecto solo se le agrega un enlace.
