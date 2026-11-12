interface Props {
  titulo: string;
  posterUrl: string | null;
  duracion: number | null;
  estado: 'cabe' | 'no_cabe' | 'agregada' | 'no_disponible';
  motivo?: string;
  onAgregar?: () => void;
}

const INSIGNIAS: Record<Props['estado'], { clase: string; texto: string }> = {
  cabe: { clase: 'insignia-cabe', texto: 'Cabe' },
  no_cabe: { clase: 'insignia-no-cabe', texto: 'No cabe' },
  agregada: { clase: 'insignia-cabe', texto: 'Cabe' },
  no_disponible: { clase: 'insignia-sin-duracion', texto: 'Sin duración' },
};

export default function TarjetaPelicula(props: Props) {
  const { titulo, posterUrl, duracion, estado, motivo } = props;
  const { onAgregar } = props;
  const insignia = INSIGNIAS[estado];

  return (
    <div className="card h-100">
      <div className="card-body d-flex flex-column gap-2">
        {posterUrl ? (
          <img className="poster-pelicula" src={posterUrl} alt={`Póster de ${titulo}`} />
        ) : (
          <div className="poster-pelicula sin-poster">Sin póster</div>
        )}
        <h3 className="h6 mb-0">{titulo}</h3>
        {duracion !== null && <span className="tabular">{duracion} min</span>}
        <span>
          <span className={`badge ${insignia.clase}`}>{insignia.texto}</span>
        </span>
        {motivo && <p className="form-text m-0">{motivo}</p>}
        {estado !== 'no_disponible' && (
          <button
            type="button"
            className="btn btn-primary mt-auto"
            disabled={estado !== 'cabe'}
            onClick={onAgregar}
          >
            Agregar
          </button>
        )}
      </div>
    </div>
  );
}
