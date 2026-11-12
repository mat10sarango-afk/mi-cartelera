interface Props {
  total: number;
  tiempo: number | null;
}

export default function BarraTiempo({ total, tiempo }: Props) {
  const restante = tiempo === null ? null : Math.max(0, tiempo - total);
  const porcentaje = tiempo === null ? 0 : Math.min(100, Math.round((total / tiempo) * 100));

  return (
    <div className="mb-3">
      {tiempo !== null && (
        <div
          className="progress mb-2"
          role="progressbar"
          aria-label="Tiempo ocupado de tu sesión"
          aria-valuemin={0}
          aria-valuemax={tiempo}
          aria-valuenow={Math.min(total, tiempo)}
        >
          <div className="progress-bar" style={{ width: `${porcentaje}%` }} />
        </div>
      )}
      <div className="tabular d-flex justify-content-between gap-2">
        <span>Duración total: {total} min</span>
        <span>{restante === null ? 'Te quedan — min' : `Te quedan ${restante} min`}</span>
      </div>
    </div>
  );
}
