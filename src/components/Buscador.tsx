import { useState, type SyntheticEvent } from 'react';
import { buscarTitulos } from '../lib/tmdb';
import type { ResultadoBusqueda } from '../types';

export default function Buscador() {
  const [consulta, setConsulta] = useState('');
  const [resultados, setResultados] = useState<ResultadoBusqueda[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [buscado, setBuscado] = useState(false);

  const manejarEnvio = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!consulta.trim()) return;

    setCargando(true);
    setError(null);
    try {
      setResultados(await buscarTitulos(consulta.trim()));
      setBuscado(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setResultados([]);
    } finally {
      setCargando(false);
    }
  };

  return (
    <section>
      <form onSubmit={manejarEnvio}>
        <input
          type="search"
          placeholder="Busca una película o serie"
          value={consulta}
          onChange={(e) => setConsulta(e.target.value)}
        />
        <button type="submit" disabled={cargando}>
          Buscar
        </button>
      </form>

      {cargando && <p>Buscando...</p>}
      {error && <p role="alert">{error}</p>}
      {!cargando && !error && buscado && resultados.length === 0 && (
        <p>No se encontraron resultados.</p>
      )}

      <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem', listStyle: 'none', padding: 0 }}>
        {resultados.map((r) => (
          <li key={`${r.tipo_contenido}-${r.tmdb_id}`}>
            {r.poster_url ? (
              <img src={r.poster_url} alt={`Póster de ${r.titulo}`} style={{ width: '100%' }} />
            ) : (
              <div style={{ height: 240, background: '#444' }}>Sin póster</div>
            )}
            <strong>{r.titulo}</strong>
            <div>
              {r.anio} · {r.tipo_contenido}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}