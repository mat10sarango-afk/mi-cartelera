import type { ResultadoBusqueda } from '../types';

interface Props {
  resultado: ResultadoBusqueda;
  mensaje?: string;
  onAgregar: (resultado: ResultadoBusqueda) => void;
}

export default function TarjetaResultado({ resultado, mensaje, onAgregar }: Props) {
  return (
    <li>
      {resultado.poster_url ? (
        <img src={resultado.poster_url} alt={`Póster de ${resultado.titulo}`} loading="lazy" />
      ) : (
        <div
          style={{
            aspectRatio: '2 / 3',
            background: '#444',
            display: 'grid',
            placeItems: 'center',
            borderRadius: 6,
          }}
        >
          Sin póster
        </div>
      )}
      <strong>{resultado.titulo}</strong>
      <div>
        {resultado.anio} · {resultado.tipo_contenido}
      </div>
      <button onClick={() => onAgregar(resultado)}>Agregar a mi lista</button>
      {mensaje && <div>{mensaje}</div>}
    </li>
  );
}