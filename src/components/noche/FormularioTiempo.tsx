import { TIEMPO_MAXIMO, TIEMPO_MINIMO } from '../../dominio/sesion';

interface Props {
  valor: string;
  error: string | null;
  onCambio: (valor: string) => void;
  onSalir: () => void;
}

export default function FormularioTiempo({ valor, error, onCambio, onSalir }: Props) {
  return (
    <div className="card mb-3">
      <div className="card-body">
        <h2 className="h5">Tiempo disponible</h2>
        <label htmlFor="tiempo-disponible" className="form-label">
          Minutos disponibles
        </label>
        <input
          id="tiempo-disponible"
          type="number"
          inputMode="numeric"
          min={TIEMPO_MINIMO}
          max={TIEMPO_MAXIMO}
          step={1}
          className={`form-control${error ? ' is-invalid' : ''}`}
          value={valor}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? 'tiempo-error' : 'tiempo-ayuda'}
          onChange={(evento) => onCambio(evento.target.value)}
          onBlur={onSalir}
        />
        {error ? (
          <div id="tiempo-error" className="invalid-feedback">
            {error}
          </div>
        ) : (
          <div id="tiempo-ayuda" className="form-text">
            Entre {TIEMPO_MINIMO} y {TIEMPO_MAXIMO} minutos.
          </div>
        )}
      </div>
    </div>
  );
}
