import { useState, type SyntheticEvent } from 'react';
import { buscarTitulos } from '../lib/tmdb';
import { claveDe, useAgregar } from '../hooks/useAgregar';
import TarjetaResultado from './TarjetaResultado';
import type { ResultadoBusqueda } from '../types';

export default function Buscador() {
  const [consulta, setConsulta] = useState('');
  const [resultados, setResultados] = useState<ResultadoBusqueda[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [buscado, setBuscado] = useState(false);
  const { mensajes, agregar, limpiar } = useAgregar();

  const manejarEnvio = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!consulta.trim()) return;

    setCargando(true);
    setError(null);
    limpiar();
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
          style={{ flex: 1, minWidth: 220 }}
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

      {resultados.length > 0 && <h2>Resultados de tu búsqueda</h2>}
      <ul className="cuadricula">
        {resultados.map((r) => (
          <TarjetaResultado
            key={claveDe(r)}
            resultado={r}
            mensaje={mensajes[claveDe(r)]}
            onAgregar={agregar}
          />
        ))}
      </ul>
    </section>
  );
}