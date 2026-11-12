# Auditoría de la épica E2 · Noche de película

Cada criterio de las specs, con su estado y evidencia. Los estados reflejan las comprobaciones realizadas; lo que no se probó permanece como sin verificar.

**Estados:** `cumple`, `no cumple` o `sin verificar`. Todos empiezan en `sin verificar`. Cambia cada estado según el resultado que anotaste en VERIFICACION.md. La evidencia indica dónde mirar; si hay algo más (un número, una captura), agrégalo.

- **Fecha de la auditoría:** 11-11-2026
- **Resumen:** Auditoría parcial. Se confirmaron las 69 pruebas automatizadas, build, lint, guardado de sesiones y separación de sesiones entre dos cuentas. Los criterios no comprobados permanecen como sin verificar.

## HU-2.1 · Indicar mi tiempo y ver qué películas caben

| Criterio | Estado | Evidencia |
|---|---|---|
| HU-2.1-CA1 · Películas que caben | sin verificar | test en `src/dominio/` y fila HU-2.1-CA1 de `docs/VERIFICACION.md` |
| HU-2.1-CA2 · Cabe justo | sin verificar | test en `src/dominio/` y fila HU-2.1-CA2 de `docs/VERIFICACION.md` |
| HU-2.1-CA3 · Orden de las que caben | sin verificar | test en `src/dominio/` y fila HU-2.1-CA3 de `docs/VERIFICACION.md` |
| HU-2.1-CA4 · Tiempo mínimo | sin verificar | test en `src/dominio/` y fila HU-2.1-CA4 de `docs/VERIFICACION.md` |
| HU-2.1-CA5 · Tiempo máximo | sin verificar | test en `src/dominio/` y fila HU-2.1-CA5 de `docs/VERIFICACION.md` |
| HU-2.1-CA6 · Menos del mínimo | sin verificar | test en `src/dominio/` y fila HU-2.1-CA6 de `docs/VERIFICACION.md` |
| HU-2.1-CA7 · Más del máximo | sin verificar | test en `src/dominio/` y fila HU-2.1-CA7 de `docs/VERIFICACION.md` |
| HU-2.1-CA8 · Sin tiempo | sin verificar | test en `src/dominio/` y fila HU-2.1-CA8 de `docs/VERIFICACION.md` |
| HU-2.1-CA9 · Tiempo no entero | sin verificar | test en `src/dominio/` y fila HU-2.1-CA9 de `docs/VERIFICACION.md` |
| HU-2.1-CA10 · Solo películas por ver | sin verificar | fila HU-2.1-CA10 de `docs/VERIFICACION.md` |
| HU-2.1-CA11 · Sin películas por ver | sin verificar | fila HU-2.1-CA11 de `docs/VERIFICACION.md` |
| HU-2.1-CA12 · Ninguna cabe | sin verificar | test en `src/dominio/` y fila HU-2.1-CA12 de `docs/VERIFICACION.md` |
| HU-2.1-CA13 · Cuántas quedaron fuera | sin verificar | test en `src/dominio/` y fila HU-2.1-CA13 de `docs/VERIFICACION.md` |
| HU-2.1-CA14 · Cargando | sin verificar | fila HU-2.1-CA14 de `docs/VERIFICACION.md` |
| HU-2.1-CA15 · Error al cargar | sin verificar | fila HU-2.1-CA15 de `docs/VERIFICACION.md` |
| HU-2.1-CA16 · Solo con sesión iniciada | sin verificar | fila HU-2.1-CA16 de `docs/VERIFICACION.md` |

## HU-2.2 · Entender por qué una película no está disponible

| Criterio | Estado | Evidencia |
|---|---|---|
| HU-2.2-CA1 · Película sin duración | sin verificar | test en `src/dominio/` y fila HU-2.2-CA1 de `docs/VERIFICACION.md` |
| HU-2.2-CA2 · Duración cero | sin verificar | test en `src/dominio/` y fila HU-2.2-CA2 de `docs/VERIFICACION.md` |
| HU-2.2-CA3 · Falla una consulta | sin verificar | fila HU-2.2-CA3 de `docs/VERIFICACION.md` |
| HU-2.2-CA4 · Siempre visibles | sin verificar | test en `src/dominio/` y fila HU-2.2-CA4 de `docs/VERIFICACION.md` |
| HU-2.2-CA5 · Motivo escrito | sin verificar | fila HU-2.2-CA5 de `docs/VERIFICACION.md` |

## HU-2.3 · Armar una sesión con una o varias películas

| Criterio | Estado | Evidencia |
|---|---|---|
| HU-2.3-CA1 · Primera película | sin verificar | test en `src/dominio/` y fila HU-2.3-CA1 de `docs/VERIFICACION.md` |
| HU-2.3-CA2 · Segunda película con pausa | sin verificar | test en `src/dominio/` y fila HU-2.3-CA2 de `docs/VERIFICACION.md` |
| HU-2.3-CA3 · Tercera película | sin verificar | test en `src/dominio/` y fila HU-2.3-CA3 de `docs/VERIFICACION.md` |
| HU-2.3-CA4 · Ocupa exactamente el tiempo | sin verificar | test en `src/dominio/` y fila HU-2.3-CA4 de `docs/VERIFICACION.md` |
| HU-2.3-CA5 · No cabe en lo que queda | sin verificar | test en `src/dominio/` y fila HU-2.3-CA5 de `docs/VERIFICACION.md` |
| HU-2.3-CA6 · Película sin duración | sin verificar | test en `src/dominio/` y fila HU-2.3-CA6 de `docs/VERIFICACION.md` |
| HU-2.3-CA7 · Película repetida | sin verificar | fila HU-2.3-CA7 de `docs/VERIFICACION.md` |
| HU-2.3-CA8 · Quitar una película | sin verificar | test en `src/dominio/` y fila HU-2.3-CA8 de `docs/VERIFICACION.md` |
| HU-2.3-CA9 · Quitar la única película | sin verificar | test en `src/dominio/` y fila HU-2.3-CA9 de `docs/VERIFICACION.md` |
| HU-2.3-CA10 · Total y restante siempre visibles | sin verificar | fila HU-2.3-CA10 de `docs/VERIFICACION.md` |
| HU-2.3-CA11 · Cambio de tiempo con sesión armada | sin verificar | test en `src/dominio/` y fila HU-2.3-CA11 de `docs/VERIFICACION.md` |
| HU-2.3-CA12 · Película agregada marcada | sin verificar | fila HU-2.3-CA12 de `docs/VERIFICACION.md` |
| HU-2.3-CA13 · Orden dentro de la sesión | sin verificar | fila HU-2.3-CA13 de `docs/VERIFICACION.md` |

## HU-2.4 · Guardar la sesión

| Criterio | Estado | Evidencia |
|---|---|---|
| HU-2.4-CA1 · Guardar con nombre | cumple | fila HU-2.4-CA1 de `docs/VERIFICACION.md` |
| HU-2.4-CA2 · Guardar sin nombre | sin verificar | test en `src/dominio/` y fila HU-2.4-CA2 de `docs/VERIFICACION.md` |
| HU-2.4-CA3 · Nombre de 60 caracteres | sin verificar | test en `src/dominio/` y fila HU-2.4-CA3 de `docs/VERIFICACION.md` |
| HU-2.4-CA4 · Nombre de 61 caracteres | sin verificar | test en `src/dominio/` y fila HU-2.4-CA4 de `docs/VERIFICACION.md` |
| HU-2.4-CA5 · Nombre de solo espacios | sin verificar | test en `src/dominio/` y fila HU-2.4-CA5 de `docs/VERIFICACION.md` |
| HU-2.4-CA6 · Sesión vacía | sin verificar | fila HU-2.4-CA6 de `docs/VERIFICACION.md` |
| HU-2.4-CA7 · Guardar una sesión que ocupa justo el tiempo | sin verificar | fila HU-2.4-CA7 de `docs/VERIFICACION.md` |
| HU-2.4-CA8 · Sesión que no cabe | sin verificar | test en `src/dominio/` y fila HU-2.4-CA8 de `docs/VERIFICACION.md` |
| HU-2.4-CA9 · Las películas siguen «por ver» | sin verificar | fila HU-2.4-CA9 de `docs/VERIFICACION.md` |
| HU-2.4-CA10 · Una película en dos sesiones | sin verificar | consulta SQL y fila HU-2.4-CA10 de `docs/VERIFICACION.md` |
| HU-2.4-CA11 · Después de guardar | sin verificar | fila HU-2.4-CA11 de `docs/VERIFICACION.md` |
| HU-2.4-CA12 · Falla al guardar | sin verificar | consulta SQL y fila HU-2.4-CA12 de `docs/VERIFICACION.md` |
| HU-2.4-CA13 · Un solo guardado por clic | sin verificar | fila HU-2.4-CA13 de `docs/VERIFICACION.md` |
| HU-2.4-CA14 · Nombres repetidos | sin verificar | fila HU-2.4-CA14 de `docs/VERIFICACION.md` |

## HU-2.5 · Consultar mis sesiones guardadas

| Criterio | Estado | Evidencia |
|---|---|---|
| HU-2.5-CA1 · Mis sesiones | sin verificar | fila HU-2.5-CA1 de `docs/VERIFICACION.md` |
| HU-2.5-CA2 · Detalle de una sesión | sin verificar | fila HU-2.5-CA2 de `docs/VERIFICACION.md` |
| HU-2.5-CA3 · Sin sesiones | sin verificar | fila HU-2.5-CA3 de `docs/VERIFICACION.md` |
| HU-2.5-CA4 · Cargando sesiones | sin verificar | fila HU-2.5-CA4 de `docs/VERIFICACION.md` |
| HU-2.5-CA5 · Error al cargar sesiones | sin verificar | fila HU-2.5-CA5 de `docs/VERIFICACION.md` |
| HU-2.5-CA6 · Solo las mías | sin verificar | La prueba desde la aplicación con dos cuentas pasó; faltan las consultas SQL directas de lectura y modificación. |
| HU-2.5-CA7 · Película borrada de mi lista | sin verificar | fila HU-2.5-CA7 de `docs/VERIFICACION.md` |
| HU-2.5-CA8 · Película con otro estado | sin verificar | fila HU-2.5-CA8 de `docs/VERIFICACION.md` |
| HU-2.5-CA9 · La sesión no se modifica | sin verificar | consulta SQL y fila HU-2.5-CA9 de `docs/VERIFICACION.md` |

## HU-2.6 · Eliminar una sesión guardada

| Criterio | Estado | Evidencia |
|---|---|---|
| HU-2.6-CA1 · Eliminar una sesión | sin verificar | fila HU-2.6-CA1 de `docs/VERIFICACION.md` |
| HU-2.6-CA2 · Cancelar la eliminación | sin verificar | fila HU-2.6-CA2 de `docs/VERIFICACION.md` |
| HU-2.6-CA3 · Mi lista queda intacta | sin verificar | fila HU-2.6-CA3 de `docs/VERIFICACION.md` |
| HU-2.6-CA4 · No puedo eliminar sesiones ajenas | sin verificar | consulta SQL y fila HU-2.6-CA4 de `docs/VERIFICACION.md` |
| HU-2.6-CA5 · Falla al eliminar | sin verificar | fila HU-2.6-CA5 de `docs/VERIFICACION.md` |

## Criterios de diseño

| # | Criterio | Estado | Evidencia |
|---|---|---|---|
| D-01 | Ningún archivo de E2 contiene un color hexadecimal. | sin verificar | fila D-01 de `docs/VERIFICACION.md` |
| D-02 | No hay estilos en línea en E2, salvo el ancho de la barra de tiempo. | sin verificar | fila D-02 de `docs/VERIFICACION.md` |
| D-03 | Cada estado de una película («Cabe», «No cabe», «Sin duración») se muestra con texto, no solo con color. | sin verificar | fila D-03 de `docs/VERIFICACION.md` |
| D-04 | Una película sin duración aparece como no disponible, con su motivo escrito. | sin verificar | fila D-04 de `docs/VERIFICACION.md` |
| D-05 | El total con pausas y el tiempo restante están visibles en todo momento. | sin verificar | fila D-05 de `docs/VERIFICACION.md` |
| D-06 | Al recorrer la pantalla con Tab, todo control muestra el foco en dorado. | sin verificar | fila D-06 de `docs/VERIFICACION.md` |
| D-07 | Un campo con error tiene borde rojo, mensaje debajo y `aria-invalid="true"`. | sin verificar | fila D-07 de `docs/VERIFICACION.md` |
| D-08 | A 1280 px la pantalla tiene dos columnas; a 390 px, una, sin scroll horizontal. | sin verificar | fila D-08 de `docs/VERIFICACION.md` |
| D-09 | La carga se indica con un spinner con texto accesible y el error con un aviso `role="alert"`. | sin verificar | fila D-09 de `docs/VERIFICACION.md` |
| D-10 | No hay `react-bootstrap`, `bootstrap-icons` ni JavaScript de Bootstrap. | sin verificar | fila D-10 de `docs/VERIFICACION.md` |
| D-11 | Las pantallas del Proyecto 3 se ven igual que en `docs/capturas/`. | sin verificar | fila D-11 de `docs/VERIFICACION.md` |
| D-12 | Los textos visibles coinciden con los de la spec 01 y la sección 2 de la spec 02. | sin verificar | fila D-12 de `docs/VERIFICACION.md` |

## Requisitos de calidad del enunciado

| Requisito | Estado | Evidencia |
|---|---|---|
| La regla de «cabe» vive en una función pura de `src/dominio/`, sin red ni Supabase | sin verificar | `src/dominio/sesion.ts`, función `evaluarSesion` |
| Tests de Vitest de esa regla, con los bordes | cumple | resultado de `pnpm test` en VERIFICACION.md |
| TypeScript sin `any` | sin verificar | `grep -rnE ": any\b\|as any" src` sin resultados |
| Los componentes no llaman a Supabase ni al catálogo; lo hacen los servicios | sin verificar | `grep -rn "lib/supabase" src/components src/pages/NocheDePelicula.tsx` sin resultados |
| Claves solo en variables de entorno y nunca en el repositorio | sin verificar | `.env.local` está en `.gitignore`; `git log -p` sin claves |
| Políticas RLS: un usuario no ve ni modifica las sesiones de otro | sin verificar | Faltan las pruebas SQL directas de lectura, borrado y actualización descritas en la sección 4 de VERIFICACION.md. |
| Las funciones del Proyecto 3 siguen funcionando igual | sin verificar | sección 5 de VERIFICACION.md |
| Historial: harness → estado inicial → PRD → backlog → specs → código → verificación | cumple | Secuencia de commits visible en `git log --oneline`; harness, planificación, especificaciones, implementación y documentación final. |
| Un commit por ticket, con el id en el mensaje | no cumple | `git log --oneline` (T-01 a T-10) |

## Lo que encontró la auditoría

Cada hallazgo se corrige de arriba hacia abajo (documento primero, código después) o se registra como pendiente con su razón. Agrega aquí lo que salga de la verificación.

| Hallazgo | Qué se hizo | Razón |
|---|---|---|
| El límite de «cabe» solo se valida en el frontend: quien tenga la clave pública podría guardar una sesión que no cabe sin pasar por la app | Pendiente | Validarlo en la base de datos es el opcional HU-2.10, que pide su propia historia |
| La clave del catálogo viaja en cada consulta desde el navegador (R-01) | Pendiente | Corregirlo exige un servidor intermedio; está fuera del alcance de la épica |
| Una sesión sin guardar se pierde al salir de la pantalla | Pendiente | Es un punto abierto del PRD; no lo pide la ficha del cliente |
| `mi_lista` no está versionada en `supabase/migraciones/` | Pendiente | Es deuda del Proyecto 3 y el enunciado dice que nada del Proyecto 3 se reescribe |
| Deuda heredada del Proyecto 3 (estilos en línea, colores literales, llamadas a `supabase.auth` en componentes, `lang="en"`) | Pendiente | Está registrada en `docs/ESTADO-INICIAL.md` y no se corrigió para respetar «nada se reescribe» |
| Historial de commits agrupados | T-07/T-08 y T-09/T-10 quedaron agrupados en dos commits. | No se reescribió el historial para conservar los commits existentes. |
