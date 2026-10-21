import { Link } from 'react-router-dom';
import { useState } from 'react';
import type { Estado, ItemLista } from '../types';

interface Props {
  item: ItemLista;
  onActualizar: (
    id: number,
    cambios: Partial<Pick<ItemLista, 'estado' | 'calificacion_personal' | 'comentario'>>,
  ) => void;
  onEliminar: (id: number) => void;
}

const ETIQUETAS_ESTADO: Record<Estado, string> = {
  por_ver: 'Por ver',
  viendo: 'Viendo',
  vista: 'Vista',
};

export default function TarjetaLista({ item, onActualizar, onEliminar }: Props) {
  const [comentario, setComentario] = useState(item.comentario ?? '');

  return (
    <li>
      <Link to={`/titulo/${item.id}`}>
  {item.poster_url ? (
    <img src={item.poster_url} alt={`Póster de ${item.titulo}`} style={{ width: '100%' }} />
  ) : (
    <div style={{ height: 240, background: '#444' }}>Sin póster</div>
  )}
  <strong>{item.titulo}</strong>
</Link>
      <div>{item.tipo_contenido}</div>

      <label>
        Estado
        <select
          value={item.estado}
          onChange={(e) => onActualizar(item.id, { estado: e.target.value as Estado })}
        >
          {(Object.keys(ETIQUETAS_ESTADO) as Estado[]).map((estado) => (
            <option key={estado} value={estado}>
              {ETIQUETAS_ESTADO[estado]}
            </option>
          ))}
        </select>
      </label>

      <label>
        Calificación
        <select
          value={item.calificacion_personal ?? ''}
          onChange={(e) =>
            onActualizar(item.id, {
              calificacion_personal: e.target.value === '' ? null : Number(e.target.value),
            })
          }
        >
          <option value="">Sin calificar</option>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </label>

      <label>
        Comentario
        <textarea
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          rows={3}
        />
      </label>
      <button
        onClick={() => onActualizar(item.id, { comentario: comentario.trim() || null })}
        disabled={comentario.trim() === (item.comentario ?? '')}
      >
        Guardar comentario
      </button>

      <button onClick={() => onEliminar(item.id)}>Eliminar</button>
    </li>
  );
}