import TarjetaPelicula from './TarjetaPelicula';
import {
  MENSAJES_NO_DISPONIBLE,
  MENSAJE_YA_AGREGADA,
  PAUSA_MINUTOS,
  mensajeExceso,
  puedeAgregar,
} from '../../dominio/sesion';
import type { ClasificacionPeliculas, PeliculaConDuracion } from '../../types/noche';

interface Props {
  estado: 'cargando' | 'error' | 'ok';
  totalPorVer: number;
  tiempo: number | null;
  clasificacion: ClasificacionPeliculas | null;
  onReintentar: () => void;
  duracionesSesion: number[];
  idsEnSesion: number[];
  onAgregar: (pelicula: PeliculaConDuracion) => void;
}

export default function ListaCandidatas(props: Props) {
  const { estado, totalPorVer, tiempo, clasificacion, onReintentar } = props;
  const { duracionesSesion, idsEnSesion, onAgregar } = props;

  // Estado de cada tarjeta respecto a lo que queda de la sesión
  const estadoDe = (
    pelicula: PeliculaConDuracion,
    tiempoActual: number,
  ): { estado: 'cabe' | 'no_cabe' | 'agregada'; motivo?: string } => {
    if (idsEnSesion.includes(pelicula.tmdbId)) {
      return { estado: 'agregada', motivo: MENSAJE_YA_AGREGADA };
    }
    const resultado = puedeAgregar(tiempoActual, duracionesSesion, pelicula.duracion, PAUSA_MINUTOS);
    if (resultado.cabe) return { estado: 'cabe' };
    if (resultado.motivo === 'excede_tiempo') {
      return { estado: 'no_cabe', motivo: mensajeExceso(resultado.exceso) };
    }
    return { estado: 'no_cabe' };
  };

  const fuera = clasificacion?.fuera ?? 0;
  const textoFuera =
    fuera === 1
      ? '1 película por ver no cabe en este tiempo.'
      : `${fuera} películas por ver no caben en este tiempo.`;

  return (
    <section>
      <h2>Qué cabe en tu tiempo</h2>

      {estado === 'cargando' && (
        <div className="d-flex align-items-center gap-2" role="status">
          <span className="spinner-border spinner-border-sm" aria-hidden="true" />
          <span>Cargando tus películas…</span>
        </div>
      )}

      {estado === 'error' && (
        <>
          <div className="alert alert-danger" role="alert">
            No se pudieron cargar tus películas.
          </div>
          <button type="button" className="btn btn-outline-secondary" onClick={onReintentar}>
            Reintentar
          </button>
        </>
      )}

      {estado === 'ok' && totalPorVer === 0 && (
        <div className="estado-vacio">No tienes películas por ver en tu lista.</div>
      )}

      {estado === 'ok' && totalPorVer > 0 && (tiempo === null || clasificacion === null) && (
        <p className="form-text">Indica cuánto tiempo tienes para ver qué películas caben.</p>
      )}

      {estado === 'ok' && tiempo !== null && clasificacion !== null && (
        <>
          {clasificacion.caben.length === 0 ? (
            <div className="estado-vacio">Ninguna película por ver cabe en {tiempo} min.</div>
          ) : (
            <ul className="list-unstyled row row-cols-2 row-cols-md-3 g-3">
              {clasificacion.caben.map((pelicula) => {
                const { estado: estadoTarjeta, motivo } = estadoDe(pelicula, tiempo);
                return (
                  <li key={pelicula.tmdbId} className="col">
                    <TarjetaPelicula
                      titulo={pelicula.titulo}
                      posterUrl={pelicula.posterUrl}
                      duracion={pelicula.duracion}
                      estado={estadoTarjeta}
                      motivo={motivo}
                      onAgregar={() => onAgregar(pelicula)}
                    />
                  </li>
                );
              })}
            </ul>
          )}

          {fuera > 0 && <p className="form-text">{textoFuera}</p>}

          {clasificacion.noDisponibles.length > 0 && (
            <ul className="list-unstyled row row-cols-2 row-cols-md-3 g-3">
              {clasificacion.noDisponibles.map((pelicula) => (
                <li key={pelicula.tmdbId} className="col">
                  <TarjetaPelicula
                    titulo={pelicula.titulo}
                    posterUrl={pelicula.posterUrl}
                    duracion={null}
                    estado="no_disponible"
                    motivo={MENSAJES_NO_DISPONIBLE[pelicula.motivo]}
                  />
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  );
}
