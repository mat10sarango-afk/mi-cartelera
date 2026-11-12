import TarjetaSesion from './TarjetaSesion';
import type { SesionGuardada } from '../../types/noche';

interface Props {
  estado: 'cargando' | 'error' | 'ok';
  sesiones: SesionGuardada[];
  aviso: string | null;
  onReintentar: () => void;
  onEliminar: (id: string) => void;
}

export default function ListaSesionesGuardadas({
  estado,
  sesiones,
  aviso,
  onReintentar,
  onEliminar,
}: Props) {
  return (
    <section>
      <h2>Tus sesiones guardadas</h2>

      {aviso && (
        <div className="alert alert-danger" role="alert">
          {aviso}
        </div>
      )}

      {estado === 'cargando' && (
        <div className="d-flex align-items-center gap-2" role="status">
          <span className="spinner-border spinner-border-sm" aria-hidden="true" />
          <span>Cargando tus sesiones…</span>
        </div>
      )}

      {estado === 'error' && (
        <>
          <div className="alert alert-danger" role="alert">
            No se pudieron cargar tus sesiones.
          </div>
          <button type="button" className="btn btn-outline-secondary" onClick={onReintentar}>
            Reintentar
          </button>
        </>
      )}

      {estado === 'ok' && sesiones.length === 0 && (
        <div className="estado-vacio">Todavía no has guardado ninguna sesión.</div>
      )}

      {estado === 'ok' && sesiones.length > 0 && (
        <ul className="list-unstyled d-flex flex-column gap-3">
          {sesiones.map((sesion) => (
            <li key={sesion.id}>
              <TarjetaSesion sesion={sesion} onEliminar={onEliminar} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
