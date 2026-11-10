# E2 · Noche de película — Registro del refinamiento con la IA

Casos borde que la IA propuso al «buscar huecos» en la ficha del cliente y en las historias (poke-holes). Cada uno se **acepta** o se **rechaza** con una razón escrita, y se indica dónde queda reflejado. Las cinco decisiones que la ficha dejaba al estudiante están al principio.

PRD: [docs/prd/goldenmovies.md](../prd/goldenmovies.md). Historias: [E2-noche-de-pelicula.md](E2-noche-de-pelicula.md).

## 1. Decisiones que la ficha dejaba al estudiante

| # | Pregunta | Decisión | Razón | Dónde queda |
| --- | --- | --- | --- | --- |
| D1 | ¿Una película puede estar en dos sesiones guardadas? | **Sí** | Cada sesión es un plan para una noche distinta y guardar no cambia el estado de la película. Prohibirlo exigiría una regla que el cliente no pidió. | R12, HU-2.4-CA10 |
| D2 | ¿En qué orden se muestran las que caben? | **De menor a mayor duración; si empatan, primero la más antigua en la lista; si aún empatan, por título** | Ayuda a ver rápido cuántas caben y a combinarlas. Es predecible y se puede probar con un test. El desempate por título es [SUPUESTO] para que el orden sea siempre el mismo. | R13, HU-2.1-CA3 |
| D3 | ¿Se puede modificar una sesión guardada? | **No se modifica; sí se puede eliminar** | Modificar obligaría a volver a validar la regla de «cabe» y a permitir actualizaciones en la base de datos. Eliminar es barato y evita acumular sesiones inútiles. Lo de eliminar es [SUPUESTO], porque la ficha solo habla de guardar y consultar. | R14, HU-2.5-CA9, HU-2.6 |
| D4 | Si se elimina de la lista una película que está en una sesión guardada, ¿qué pasa? | **La sesión no cambia.** Al guardar se copian título, duración y póster. | Eliminar una película de la lista es definitivo en el Proyecto 3 y ese comportamiento no se toca. La copia hace que la duración total no cambie sin avisar. | R15, HU-2.5-CA7 y CA8 |
| D5 | ¿Una sesión tiene nombre o fecha? | **Nombre opcional (hasta 60 caracteres) y fecha de creación automática; sin fecha elegida por el usuario** | Elegir una fecha para «esa noche» ya roza recordatorios y calendarios, que son no-alcance. Sin nombre, la sesión se muestra con su fecha. | R16, HU-2.4-CA1 a CA5 |

## 2. Casos borde propuestos por la IA

| # | Caso borde | Decisión | Razón | Dónde queda |
| --- | --- | --- | --- | --- |
| B1 | Una película dura exactamente el tiempo elegido | Aceptado | Lo fija el cliente: el límite exacto sí cabe. | HU-2.1-CA2 |
| B2 | Tiempo de 29 o de 601 minutos | Aceptado: se rechaza con aviso de rango | El rango 30–600 es del cliente. | HU-2.1-CA6 y CA7 |
| B3 | Tiempo vacío, con decimales o con texto | Aceptado: se rechaza y se explica | El cliente pide un número entero de minutos; aceptar 90,5 haría el cálculo ambiguo. | HU-2.1-CA8 y CA9 |
| B4 | Película cuya duración no se conoce | Aceptado: aparece como no disponible con su motivo | Lo fija el cliente. Ocultarla haría pensar que desapareció de la lista. | HU-2.2-CA1 |
| B5 | El catálogo informa 0 minutos de duración | Aceptado: se trata como duración desconocida | 0 minutos no es una duración real; el catálogo suele usar 0 cuando no tiene el dato. [SUPUESTO] | HU-2.2-CA2 |
| B6 | Falla la consulta de la duración de una sola película | Aceptado: motivo distinto («no se pudo consultar») y las demás no se ven afectadas | Un fallo puntual no debe tumbar toda la pantalla, y el usuario necesita distinguirlo de «sin duración». | HU-2.2-CA3 |
| B7 | Sin conexión o falla la carga completa | Aceptado: aviso de error con opción de reintentar | La ficha pide estados de carga y de error. No se debe decir «no tienes películas». | HU-2.1-CA14 y CA15 |
| B8 | Película más larga que todo el tiempo disponible | Aceptado: no se lista; se informa cuántas quedaron fuera | Listarlas todas con «No cabe» llenaría la pantalla. Informar el conteo evita pensar que faltan. [SUPUESTO] | R19, HU-2.1-CA13 |
| B9 | Ninguna película cabe en el tiempo elegido | Aceptado: aviso con el tiempo | Una lista vacía sin explicación parece un fallo. | HU-2.1-CA12 |
| B10 | Cambiar el tiempo con una sesión ya armada | Aceptado: la sesión se conserva, se avisa y no se puede guardar hasta que quepa. Rechazado: vaciar la sesión | Vaciarla haría perder trabajo por explorar un tiempo distinto. La regla de «cabe» ya cubre el caso. | R20, HU-2.3-CA11, HU-2.4-CA8 |
| B11 | La misma película dos veces en una misma sesión | Rechazado: no se permite | No tiene sentido verla dos veces en la misma noche, y simplifica el modelo de datos. | R17, HU-2.3-CA7 |
| B12 | La misma película en dos sesiones guardadas | Aceptado | Decisión D1. | R12, HU-2.4-CA10 |
| B13 | Guardar una sesión sin películas | Rechazado | No hay nada que ver; sería una sesión vacía sin sentido. | R17, HU-2.4-CA6 |
| B14 | Nombre vacío, de solo espacios o de 61 caracteres | Aceptado: vacío o espacios = sin nombre; 61 se rechaza | Decisión D5: el nombre es opcional y acotado. | HU-2.4-CA2 a CA5 |
| B15 | Dos sesiones con el mismo nombre | Aceptado | Se distinguen por su fecha de creación; exigir nombres únicos añade una regla que nadie pidió. | HU-2.4-CA14 |
| B16 | Pulsar guardar dos veces seguidas | Aceptado: el segundo clic se ignora | Evita sesiones duplicadas. | HU-2.4-CA13 |
| B17 | El guardado falla a mitad | Aceptado: se guarda todo o nada y la sesión armada se conserva | Una sesión sin películas sería un dato roto. | HU-2.4-CA12 |
| B18 | La película pasa a «viendo» o «vista» después de guardar la sesión | Aceptado: la sesión no cambia | Decisión D4: la sesión es un registro de lo planeado. | HU-2.5-CA8 |
| B19 | La duración de la película cambia en el catálogo después de guardar | Aceptado: la sesión conserva la duración guardada | Decisión D4; así el total de una sesión no cambia sin avisar. | R15 |
| B20 | Cambia la regla de la pausa en el futuro | Aceptado: cada sesión guarda la pausa con la que se armó | Las sesiones antiguas conservan su cálculo. [SUPUESTO] | R15 |
| B21 | Editar una sesión guardada | Rechazado | Decisión D3; para cambiarla se elimina y se arma otra. | R14, HU-2.7 |
| B22 | Reordenar las películas dentro de la sesión | Rechazado | La ficha no lo pide; queda el orden en que se agregaron. | HU-2.8 |
| B23 | Película sin póster | Aceptado: se muestra un recuadro con el texto «Sin póster» | La tarjeta debe verse completa y la lista de Mi Cartelera ya admite títulos sin póster. | spec 02 |
| B24 | Series en la lista «por ver» | Rechazado: no entran | La ficha dice que solo entran películas. | R7, HU-2.1-CA10 |
| B25 | Lista «por ver» muy grande | Parcial: se consultan las duraciones en lotes. Paginar y filtrar quedan fuera | Un filtro por género es un opcional con puntos extra; no se adelanta. | spec 01, HU-2.10 |
| B26 | Otra cuenta intenta ver o eliminar mis sesiones | Aceptado: imposible por las políticas de seguridad | La ficha exige seguridad real, demostrada con dos cuentas. | R18, HU-2.5-CA6, HU-2.6-CA4 |
| B27 | Salir de la pantalla con una sesión sin guardar | Rechazado: no se guarda un borrador | No lo pide la ficha y añadiría estado persistente. Queda como punto abierto. [SUPUESTO] | PRD §8 |
| B28 | La sesión caduca o se cierra la sesión de usuario mientras se guarda | Aceptado como error de guardado | Se trata igual que cualquier fallo: aviso y sesión armada conservada. | HU-2.4-CA12 |
| B29 | Otro dispositivo cambia la lista mientras la pantalla está abierta | Rechazado como requisito | La pantalla no se sincroniza en vivo; se actualiza al recargar. Es seguro porque la sesión guardada es una copia. | PRD §7 |
| B30 | El usuario no tiene ninguna película «por ver» | Aceptado: aviso | Sin él, la pantalla parecería rota. | HU-2.1-CA11 |
