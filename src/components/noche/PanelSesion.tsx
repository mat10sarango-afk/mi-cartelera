import BarraTiempo from './BarraTiempo';
import { validarNombreSesion } from '../../dominio/nombreSesion';
import { PAUSA_MINUTOS, duracionTotal } from '../../dominio/sesion';
import type { PeliculaEnSesion, ResultadoSesion } from '../../types/noche';

interface Props {
  tiempo: number | null;
  peliculas: PeliculaEnSesion[];
  evaluacion: ResultadoSesion | null;
  onQuitar: (tmdbId: number) => void;
  nombre: string;
  onNombre: (valor: string) => void;
  guardando: boolean;
  aviso: { tipo: 'exito' | 'error'; texto: string } | null;
  onGuardar: () => void;
}

export default function PanelSesion(props: Props) {
  const { tiempo, peliculas, evaluacion, onQuitar } = props;
  const { nombre, onNombre, guardando, aviso, onGuardar } = props;
  const errorNombre = validarNombreSesion(nombre);
  const puedeGuardar =
    peliculas.length > 0 &&
    evaluacion !== null &&
    evaluacion.cabe &&
    errorNombre === null &&
    !guardando;
  const total = duracionTotal(
    peliculas.map((pelicula) => pelicula.duracion),
    PAUSA_MINUTOS,
  );
  const noCabe = evaluacion !== null && !evaluacion.cabe && evaluacion.motivo === 'excede_tiempo';

  return (
    <div className="card mb-3">
      <div className="card-body">
        <h2 className="h5">Tu sesión</h2>

        {peliculas.length === 0 ? (
          <p className="form-text">Todavía no agregaste películas.</p>
        ) : (
          <ul className="list-unstyled d-flex flex-column gap-2">
            {peliculas.map((pelicula) => (
              <li
                key={pelicula.tmdbId}
                className="d-flex justify-content-between align-items-center gap-2"
              >
                <span>
                  {pelicula.titulo} <span className="tabular">· {pelicula.duracion} min</span>
                </span>
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  aria-label={`Quitar ${pelicula.titulo}`}
                  onClick={() => onQuitar(pelicula.tmdbId)}
                >
                  Quitar
                </button>
              </li>
            ))}
          </ul>
        )}

        <BarraTiempo total={total} tiempo={tiempo} />

        {noCabe && (
          <div className="alert alert-danger" role="alert">
            Tu sesión dura {total} min y tu tiempo es de {tiempo} min. Quita películas para poder
            guardarla.
          </div>
        )}

        <label htmlFor="nombre-sesion" className="form-label">
          Nombre de la sesión (opcional)
        </label>
        <input
          id="nombre-sesion"
          type="text"
          className={`form-control${errorNombre ? ' is-invalid' : ''}`}
          value={nombre}
          aria-invalid={errorNombre ? 'true' : undefined}
          aria-describedby={errorNombre ? 'nombre-error' : undefined}
          onChange={(evento) => onNombre(evento.target.value)}
        />
        {errorNombre && (
          <div id="nombre-error" className="invalid-feedback">
            {errorNombre}
          </div>
        )}

        {peliculas.length === 0 && (
          <p className="form-text mb-0 mt-2">Agrega al menos una película para guardar la sesión.</p>
        )}

        <button
          type="button"
          className="btn btn-primary mt-3"
          disabled={!puedeGuardar}
          onClick={onGuardar}
        >
          Guardar sesión
        </button>

        {aviso && (
          <div
            className={`alert mt-3 mb-0 ${aviso.tipo === 'exito' ? 'alert-success' : 'alert-danger'}`}
            role={aviso.tipo === 'exito' ? 'status' : 'alert'}
          >
            {aviso.texto}
          </div>
        )}
      </div>
    </div>
  );
}
