import { duracionTotal } from '../../dominio/sesion';
import type { SesionGuardada } from '../../types/noche';

interface Props {
  sesion: SesionGuardada;
  onEliminar: (id: string) => void;
}

// Fecha en la hora local del navegador, con el mes escrito (por ejemplo, 12 nov 2026)
function formatearFecha(iso: string): string {
  return new Date(iso).toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function TarjetaSesion({ sesion, onEliminar }: Props) {
  const fecha = formatearFecha(sesion.createdAt);
  const titulo = sesion.nombre ?? `Sesión del ${fecha}`;
  const total = duracionTotal(
    sesion.peliculas.map((pelicula) => pelicula.duracion),
    sesion.pausaMinutos,
  );

  const eliminar = () => {
    if (window.confirm(`¿Eliminar la sesión «${titulo}»? Tus películas no se tocan.`)) {
      onEliminar(sesion.id);
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <h3 className="h6">{titulo}</h3>
        <p className="form-text tabular mt-0">
          Creada el {fecha} · Tiempo disponible: {sesion.tiempoDisponible} min · Duración total:{' '}
          {total} min
        </p>
        <ol className="mb-3">
          {sesion.peliculas.map((pelicula) => (
            <li key={pelicula.tmdbId}>
              {pelicula.titulo} <span className="tabular">· {pelicula.duracion} min</span>
            </li>
          ))}
        </ol>
        <button type="button" className="btn btn-outline-danger btn-sm" onClick={eliminar}>
          Eliminar
        </button>
      </div>
    </div>
  );
}
