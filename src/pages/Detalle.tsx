import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { obtenerItem } from '../lib/lista';
import { obtenerDetalle } from '../lib/tmdb';
import type { DetalleTMDB, ItemLista } from '../types';

const ETIQUETAS_ESTADO = {
  por_ver: 'Por ver',
  viendo: 'Viendo',
  vista: 'Vista',
} as const;

export default function Detalle() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<ItemLista | null>(null);
  const [detalle, setDetalle] = useState<DetalleTMDB | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let activo = true;

    const cargar = async () => {
      try {
        const numero = Number(id);
        if (Number.isNaN(numero)) throw new Error('Dirección no válida.');

        const fila = await obtenerItem(numero);
        const info = await obtenerDetalle(fila.tmdb_id, fila.tipo_contenido);
        if (activo) {
          setItem(fila);
          setDetalle(info);
        }
      } catch (err) {
        if (activo) setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        if (activo) setCargando(false);
      }
    };

    cargar();
    return () => {
      activo = false;
    };
  }, [id]);

  if (cargando) return <p>Cargando...</p>;

  if (error || !item || !detalle) {
    return (
      <main>
        <p role="alert">{error ?? 'No se pudo cargar el título.'}</p>
        <Link to="/mi-lista">← Volver a mi lista</Link>
      </main>
    );
  }

  return (
    <main>
      <Link to="/mi-lista">← Volver a mi lista</Link>
      <h1>{item.titulo}</h1>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        {detalle.poster_grande ? (
          <img
            src={detalle.poster_grande}
            alt={`Póster de ${item.titulo}`}
            style={{ width: 300, maxWidth: '100%' }}
          />
        ) : (
          <div style={{ width: 300, height: 450, background: '#444' }}>Sin póster</div>
        )}

        <div style={{ flex: 1, minWidth: 260 }}>
          <p>
            {item.tipo_contenido} · {detalle.fecha}
            {detalle.generos.length > 0 && ` · ${detalle.generos.join(', ')}`}
          </p>
          <p>Calificación oficial de TMDB: {detalle.calificacion_tmdb.toFixed(1)} / 10</p>

          <h2>Sinopsis</h2>
          <p>{detalle.sinopsis || 'Sin sinopsis disponible.'}</p>

          <h2>Elenco</h2>
          {detalle.elenco.length === 0 ? (
            <p>Sin información de elenco.</p>
          ) : (
            <ul>
              {detalle.elenco.map((m) => (
                <li key={`${m.nombre}-${m.personaje}`}>
                  {m.nombre}
                  {m.personaje && ` como ${m.personaje}`}
                </li>
              ))}
            </ul>
          )}

          <h2>Mi opinión</h2>
          <p>Estado: {ETIQUETAS_ESTADO[item.estado]}</p>
          <p>
            Mi calificación:{' '}
            {item.calificacion_personal ? `${item.calificacion_personal} / 5` : 'Sin calificar'}
          </p>
          <p>Mi comentario: {item.comentario || 'Sin comentario.'}</p>
        </div>
      </div>
    </main>
  );
}