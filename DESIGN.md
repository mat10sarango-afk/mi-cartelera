# DESIGN.md · GoldenMovies

Sistema de diseño **«Cartelera dorada»**, versión 1.0 (noviembre 2026).

Este archivo es la fuente de verdad de cómo se **ve** y se **siente** la app. No define funcionalidad: qué hace la app lo dicen el PRD, las historias y las specs. Cuando una tarea toque la interfaz, el agente lee este archivo antes de escribir código.

## 1. Cómo se usa este archivo

| Pregunta | Respuesta |
| --- | --- |
| ¿Quién lo lee? | Quien implementa y el agente. `AGENTS.md` lo referencia para cualquier tarea visual. |
| ¿Qué decide? | Tokens (color, tipografía, espaciado), componentes de Bootstrap permitidos, layout, accesibilidad y reglas de estilo. |
| ¿Qué no decide? | Reglas de negocio, textos de la app ni comportamiento. Esos viven en `docs/specs/` y en `src/dominio/`. |
| ¿Cómo se relaciona con una spec? | La spec de interfaz cita tokens y componentes **por su nombre** (`--peligro-texto`, «Tarjeta de película»). No copia valores. |
| ¿Cómo se cambia? | Se edita este archivo y `src/styles/tema.css` en el mismo commit, con un mensaje `docs(diseño): …`. |
| ¿Qué pasa si choca con una spec? | Gana la spec en lo que hace la app; gana este archivo en cómo se ve. Si la duda persiste, se pregunta antes de implementar. |

## 2. Dos capas de estilo

La app tiene hoy un solo archivo de estilos, `src/index.css`, con CSS plano y variables. El Proyecto 3 no usa Bootstrap. Este sistema convive con eso en dos capas:

| Capa | Dónde | Quién la usa | Regla |
| --- | --- | --- | --- |
| Proyecto 3 | `src/index.css` | Login, Registro, Inicio, Mi lista, Detalle | Se conserva tal cual. No se reescribe ni se migra a Bootstrap. |
| Épica E2 | Bootstrap 5.3 (solo CSS) + `src/styles/tema.css` | Pantalla «Noche de película» y sus componentes | Todo componente nuevo usa clases de Bootstrap, con sus variables sobrescritas por los tokens de la sección 4. |

Las dos capas comparten los mismos tokens. Por eso una pantalla nueva y una vieja se ven como la misma app.

**Orden de importación** en `src/main.tsx`: primero el CSS de Bootstrap, después `index.css`, al final `tema.css`. Así `index.css` gana sobre el CSS base de Bootstrap en los elementos que ya estilizaba.

**Riesgo conocido (R-05 de `docs/ESTADO-INICIAL.md`):** el CSS base de Bootstrap puede cambiar márgenes, interlineado o enlaces de las pantallas viejas. Al instalarlo se comparan esas pantallas con `docs/capturas/` (criterio D-11).

## 3. Principios

1. **Cine de noche.** Fondo oscuro y un solo acento dorado. La app se usa por la noche, antes de ver algo.
2. **El tiempo se lee de un vistazo.** En «Noche de película», lo primero que importa es cuánto queda. La duración total y el tiempo restante son siempre visibles.
3. **Nunca solo color.** Todo estado lleva texto («Cabe», «No cabe», «Sin duración»). El color refuerza; no informa por sí solo.
4. **Un solo acento.** El dorado marca lo que se puede hacer (botones, foco, enlaces). Rojo y verde se reservan para errores y confirmaciones.
5. **Plano y en calma.** Sin sombras, gradientes ni animaciones decorativas en lo nuevo. La jerarquía sale del color de la superficie, del tamaño y del espacio.

## 4. Decisiones de diseño

| Decisión | Por qué |
| --- | --- |
| Tema oscuro único | Es el que ya tiene la app. Bootstrap se activa en su modo oscuro (`data-bs-theme="dark"`) para que sus componentes nazcan oscuros. |
| Bootstrap solo en lo nuevo | El proyecto debe evolucionar sin reescribirse. Lo nuevo aprovecha los componentes de Bootstrap; lo viejo no se toca. |
| Solo el CSS de Bootstrap | La app es React: el JavaScript de Bootstrap y `react-bootstrap` duplicarían el manejo del DOM y sumarían dependencias. |
| Fuente del sistema | La app ya usa `system-ui`. No se cargan fuentes externas. |
| Tarjetas con póster | Cada película es una unidad con estado propio; el póster la identifica más rápido que una tabla. |
| Tokens existentes primero | Los siete colores de `index.css` se conservan con su nombre. Solo se agregan los que faltan. |

## 5. Tokens

### 5.1 Color

Los primeros siete ya existen en `src/index.css`. Los cuatro siguientes se agregan en `src/styles/tema.css`. Ningún archivo de E2 escribe un color literal.

| Token | Valor | Uso | Dónde vive |
| --- | --- | --- | --- |
| `--fondo` | `#0f1117` | Fondo de la página y de los campos | `index.css` |
| `--superficie` | `#1a1d27` | Paneles y tarjetas | `index.css` |
| `--borde` | `#2a2e3b` | Separadores y borde de tarjetas (decorativo) | `index.css` |
| `--texto` | `#e8e9ed` | Texto principal | `index.css` |
| `--texto-suave` | `#9aa0b0` | Texto secundario, etiquetas, ayudas | `index.css` |
| `--acento` | `#f5b301` | Botón primario, foco, enlaces | `index.css` |
| `--peligro` | `#e5484d` | Borde de error y relleno de avisos de error | `index.css` |
| `--sobre-acento` | `#111111` | Texto sobre el acento | `tema.css` |
| `--peligro-texto` | `#ff6b6b` | Texto de error (el `--peligro` no alcanza AA como texto) | `tema.css` |
| `--exito` | `#46c37b` | Confirmaciones y estado «Cabe» | `tema.css` |
| `--borde-control` | `#6b7280` | Borde de campos y controles | `tema.css` |

Contrastes comprobados (WCAG 2.1):

| Combinación | Contraste | Nivel |
| --- | --- | --- |
| `--texto` sobre `--superficie` | 13,9:1 | AAA |
| `--texto-suave` sobre `--superficie` | 6,4:1 | AA |
| `--acento` sobre `--superficie` | 9,1:1 | AAA |
| `--sobre-acento` sobre `--acento` | 10,2:1 | AAA |
| `--peligro-texto` sobre `--superficie` | 6,1:1 | AA |
| `--exito` sobre `--superficie` | 7,5:1 | AAA |
| `--borde-control` sobre `--fondo` | 3,9:1 | Contraste de controles (1.4.11) |

`--peligro` sobre `--superficie` da 4,3:1: sirve para bordes y rellenos, no para texto pequeño.

### 5.2 Cómo se personaliza Bootstrap

`tema.css` sobrescribe las variables de Bootstrap dentro de `[data-bs-theme='dark']`, apuntándolas a los tokens. No se compila Sass ni se edita el CSS de Bootstrap.

| Variable de Bootstrap | Se apunta a |
| --- | --- |
| `--bs-body-bg` | `--fondo` |
| `--bs-body-color` | `--texto` |
| `--bs-secondary-color` | `--texto-suave` |
| `--bs-border-color` | `--borde` |
| `--bs-primary` (y su versión `-rgb`) | `--acento` |
| `--bs-link-color`, `--bs-link-hover-color` | `--acento` |
| `--bs-danger` | `--peligro` |
| `--bs-success` | `--exito` |
| `--bs-border-radius`, `--bs-border-radius-lg` | `--radio-sm`, `--radio-md` |

Para las variables propias de cada componente (por ejemplo el color del texto de `btn-primary`, que debe ser `--sobre-acento` y no blanco, o el fondo de `card`, que debe ser `--superficie`), se ajustan dentro de `tema.css` con un comentario que diga por qué.

### 5.3 Tipografía

Familia única: la del sistema, la misma que ya usa la app.

| Token | Valor | Uso |
| --- | --- | --- |
| `--fuente` | `system-ui, 'Segoe UI', Roboto, sans-serif` | Todo el texto |

| Nivel | Tamaño | Peso | Uso |
| --- | --- | --- | --- |
| Título de pantalla (`h1`) | 1.8rem | 600 | Una vez por pantalla |
| Título de sección (`h2`) | 1.2rem | 600, color `--acento` | Paneles y secciones |
| Texto | 1rem | 400 | Texto y campos |
| Texto pequeño | 0.875rem | 400 o 600 | Etiquetas de campo, motivos, mensajes de error |

Interlineado 1.5. Las duraciones usan `font-variant-numeric: tabular-nums` para que se comparen en columna.

### 5.4 Espaciado y radios

El espaciado sale de la escala de Bootstrap (`p-3`, `gap-2`, `g-3`, `mb-3`…). No se escriben márgenes ni rellenos en píxeles. Los dos radios se agregan en `src/styles/tema.css`, con los valores que `index.css` ya usa en sus botones, campos y tarjetas.

| Token | Valor | Uso |
| --- | --- | --- |
| `--radio-sm` | 6px | Botones, campos, insignias |
| `--radio-md` | 10px | Tarjetas y paneles |

### 5.5 Movimiento

- Sin animaciones decorativas. Nada se anima al cargar la página.
- El indicador de carga (`spinner-border`) es la única animación permitida, porque comunica un estado.
- Con `prefers-reduced-motion: reduce`, las transiciones de Bootstrap se desactivan.

## 6. Layout

- **Contenedor:** `container` de Bootstrap, con un máximo de 1100 px, el mismo ancho de `main` en el Proyecto 3.
- **Pantalla «Noche de película» (≥ 992 px):** dos columnas (`row` con `col-lg-4` y `col-lg-8`).
  - Izquierda: panel del tiempo disponible y, debajo, panel de la sesión que se está armando.
  - Derecha: sección de las películas que caben, con las tarjetas en una grilla (`row-cols-2 row-cols-md-3`).
- **Pantalla angosta (< 992 px):** una sola columna, en el mismo orden. Margen lateral de Bootstrap.
- Nunca hay scroll horizontal, ni a 390 px de ancho.
- La barra de navegación existente (`Navbar`) se conserva; agregar el enlace a la pantalla nueva es parte de un ticket de la spec.

## 7. Componentes

Las clases propias, si hacen falta, van en español y en kebab-case (`tarjeta-pelicula`) dentro de `tema.css`. Lo demás son clases de Bootstrap.

### 7.1 Panel
`card` de Bootstrap con `--superficie` de fondo, borde `--borde` y `--radio-md`. El título del panel es un `h2`.

### 7.2 Campo de formulario
- `form-label` visible encima del campo, siempre asociada con `for` / `id`.
- `form-control`, fondo `--fondo`, borde `--borde-control`, 40 px de alto mínimo.
- **Foco:** contorno de 2 px en `--acento`, separado 2 px, igual al que ya usa `index.css`.
- **Error:** clase `is-invalid`, `aria-invalid="true"` y el mensaje debajo (`invalid-feedback` visible), en `--peligro-texto`, enlazado con `aria-describedby`.
- El texto de cada error es el de la spec. Este archivo no lo cambia.
- La ayuda del campo (`form-text`) va en `--texto-suave`.

### 7.3 Botón

| Variante | Clases | Uso |
| --- | --- | --- |
| Primario | `btn btn-primary` | Acción principal del panel |
| Secundario | `btn btn-outline-secondary` | Acciones de apoyo |
| Quitar | `btn btn-outline-danger`, texto en `--peligro-texto` | Quitar una película de la sesión |

- Alto mínimo 40 px.
- **Enviando:** el botón se deshabilita (`disabled`) y baja su opacidad, sin cambiar de ancho.
- No hay botón relleno en rojo: el texto blanco sobre `--peligro` no alcanza el contraste.

### 7.4 Insignia de estado
`badge` con texto obligatorio.

| Estado | Texto | Color |
| --- | --- | --- |
| Cabe | «Cabe» | `--exito` sobre fondo `--superficie`, con borde `--exito` |
| No cabe | «No cabe» | `--peligro-texto` sobre fondo `--superficie`, con borde `--peligro` |
| No disponible | «Sin duración» | `--texto-suave` sobre fondo `--superficie`, con borde `--borde-control` |

### 7.5 Barra de tiempo
- `progress` de Bootstrap, de 8 px de alto, con el relleno proporcional al tiempo ocupado.
- Relleno en `--acento`; si la sesión llega justo al límite se mantiene igual (cabe exacto sigue siendo válido).
- Junto a la barra, en texto y en cifras tabulares, el tiempo ocupado, las pausas y el tiempo restante.
- Accesibilidad: `role="progressbar"` con `aria-valuemin`, `aria-valuemax`, `aria-valuenow` y `aria-label`.
- El tiempo disponible y los minutos de pausa se importan del dominio; nunca se escribe 10 ni 600 a mano en un componente.

### 7.6 Tarjeta de película
Orden fijo de arriba abajo:
1. Póster con proporción 2:3. Sin póster, un recuadro en `--borde` con el texto «Sin póster».
2. Título.
3. Duración en minutos, en cifras tabulares, o la insignia «Sin duración».
4. Insignia de estado.
5. Motivo, solo si no se puede agregar, en `--texto-suave`.
6. Botón de agregar o de quitar.

Fondo `--superficie`, borde `--borde`, `--radio-md`. Las tarjetas van en una lista (`ul` con un `li` por tarjeta).

### 7.7 Avisos
| Tipo | Clases | Rol |
| --- | --- | --- |
| Éxito | `alert alert-success` | `role="status"` |
| Error | `alert alert-danger` | `role="alert"` |
| Información | `alert alert-secondary` | `role="status"` |

Aparecen debajo del control que los produjo.

### 7.8 Estados de la pantalla
| Estado | Cómo se ve |
| --- | --- |
| Cargando | `spinner-border` con `role="status"` y un texto oculto (`visually-hidden`) |
| Vacío | Panel con borde punteado `--borde` y texto centrado |
| Error | Aviso de error con la opción de reintentar |

Los textos los define la spec.

## 8. Accesibilidad

- Contraste mínimo AA (4,5:1 en texto, 3:1 en bordes de controles).
- Foco visible en todo elemento interactivo; nunca `outline: none` sin reemplazo.
- Objetivos táctiles de 40 × 40 px como mínimo.
- Toda la pantalla se puede usar solo con teclado, en el orden en que se lee.
- `lang="es"` en `index.html` (hoy está en `en`; es una deuda registrada).

## 9. Reglas para el agente

**Haz:**
- Usa solo tokens: `var(--acento)`, `var(--superficie)`, etc.
- Usa clases de Bootstrap para todo componente nuevo de E2.
- Importa Bootstrap, `index.css` y `tema.css` en ese orden en `src/main.tsx`.
- Importa los límites del dominio (tiempo mínimo y máximo, pausa) desde `src/dominio/`.
- Conserva los textos de la spec, carácter por carácter.
- Comprueba el resultado a 1280 px y a 390 px de ancho.

**No hagas:**
- No escribas colores hexadecimales fuera de `index.css` y `tema.css`.
- No instales `react-bootstrap`, `bootstrap-icons`, Tailwind ni otra librería de estilos o de componentes.
- No importes el JavaScript de Bootstrap (`bootstrap/dist/js`, `bootstrap.bundle`).
- No cargues Bootstrap desde un CDN.
- No uses `style={…}`, salvo el ancho del relleno de la barra de tiempo.
- No uses las clases de color de Bootstrap (`text-warning`, `bg-dark`, `bg-primary`…): el color sale de los tokens.
- No añadas sombras (`shadow-*`), gradientes, fuentes nuevas ni iconos de librerías.
- No uses el color como única señal de un estado.
- No edites `src/index.css` ni las pantallas del Proyecto 3 en una tarea visual de E2.
- No toques `src/dominio/`, `src/services/` ni `supabase/` en una tarea visual.

## 10. Criterios verificables de diseño

La spec de interfaz convierte estas reglas en criterios con id. Las rutas de E2 que usan los comandos son las que la spec liste en su tabla ticket → archivos.

| # | Criterio | Cómo se comprueba |
| --- | --- | --- |
| D-01 | Ningún archivo de E2 contiene un color hexadecimal; solo `index.css` y `tema.css` los tienen. | Comando: `grep -rnE "#[0-9a-fA-F]{3,8}\b" src/components/noche src/pages/NocheDePelicula.tsx` sin resultados |
| D-02 | No hay estilos en línea en E2, salvo el ancho de la barra de tiempo. | Comando: `grep -rn "style={" src/components/noche src/pages/NocheDePelicula.tsx` |
| D-03 | Cada estado de una película («Cabe», «No cabe», «Sin duración») se muestra con texto, no solo con color. | Navegador |
| D-04 | Una película sin duración aparece como no disponible, con su motivo escrito. | Navegador |
| D-05 | La duración total, con pausas, y el tiempo restante están visibles en todo momento mientras se arma la sesión. | Navegador |
| D-06 | Al recorrer la pantalla con Tab, todo control muestra el foco en dorado. | Navegador, solo con teclado |
| D-07 | Un campo con error tiene borde rojo, mensaje debajo y `aria-invalid="true"`. | Navegador e inspector |
| D-08 | A 1280 px la pantalla tiene dos columnas; a 390 px, una, sin scroll horizontal. | Navegador, con el modo responsive |
| D-09 | La carga se indica con un spinner con texto accesible y el error con un aviso `role="alert"`. | Navegador, con la red limitada o cortada |
| D-10 | `package.json` no incluye `react-bootstrap` ni `bootstrap-icons`, y el código no importa el JavaScript de Bootstrap. | Comando: `grep -nE "react-bootstrap\|bootstrap-icons" package.json` y `grep -rn "bootstrap/dist/js\|bootstrap.bundle" src` |
| D-11 | Las pantallas del Proyecto 3 (login, búsqueda, mi lista, detalle) se ven igual que en `docs/capturas/` después de instalar Bootstrap. | Navegador, comparando con las capturas |
| D-12 | Los textos visibles coinciden con los de la spec. | Navegador, contra `docs/VERIFICACION.md` |
