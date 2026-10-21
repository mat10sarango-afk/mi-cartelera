import { useEffect, useState } from 'react';
import { explorarPeliculas, type Categoria } from '../lib/tmdb';
import { claveDe, useAgregar } from '../hooks/useAgregar';
import TarjetaResultado from './TarjetaResultado';
import type { ResultadoBusqueda } from '../types';

const ANIO_ACTUAL = new Date().getFullYear();
const ANIOS = Array.from({ length: ANIO_ACTUAL - 1979 }, (_, i) => ANIO_ACTUAL - i);

const PESTANAS: { id: Categoria; etiqueta: string }[] = [
  { id: 'novedades', etiqueta: '🔥 Novedades' },
  { id: 'taquilleras', etiqueta: '💰 Más taquilleras' },
  { id: 'anio', etiqueta: '📅 Por año' },
];

export default function Explorador() {
  const [categoria, setCategoria] = useState<Categoria>('novedades');
  const [anio, setAnio] = useState(ANIO_ACTUAL);
  const [pagina, setPagina] = useState(1);
  const [items, setItems] = useState<ResultadoBusqueda[]>([]);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { mensajes, agregar } = useAgregar();

  useEffect(() => {
    let activo = true;

    explorarPeliculas(categoria, pagina, anio)
      .then(({ resultados, totalPaginas: total }) => {
        if (!activo) return;
        setItems((prev) =>
          pagina === 1
            ? resultados
            : [...prev, ...resultados.filter((r) => !prev.some((p) => p.tmdb_id === r.tmdb_id))],
        );
        setTotalPaginas(total);
        setError(null);
      })
      .catch((err) => {
        if (activo) setError(err instanceof Error ? err.message : 'Error desconocido');
      })
      .finally(() => {
        if (activo) setCargando(false);
      });

    return () => {
      activo = false;
    };
  }, [categoria, anio, pagina]);

  const cambiarCategoria = (nueva: Categoria) => {
    if (nueva === categoria) return;
    setCategoria(nueva);
    setPagina(1);
    setItems([]);
    setError(null);
    setCargando(true);
  };

  const cambiarAnio = (nuevo: number) => {
    setAnio(nuevo);
    setPagina(1);
    setItems([]);
    setError(null);
    setCargando(true);
  };

  const cargarMas = () => {
    setPagina((p) => p + 1);
    setCargando(true);
  };

  return (
    <section className="explorar">
      <h2>Explorar películas</h2>

      <div className="pestanas" role="tablist">
        {PESTANAS.map((p) => (
          <button
            key={p.id}
            role="tab"
            aria-selected={categoria === p.id}
            className={`pestana${categoria === p.id ? ' activa' : ''}`}
            onClick={() => cambiarCategoria(p.id)}
          >
            {p.etiqueta}
          </button>
        ))}
      </div>

      {categoria === 'anio' && (
        <div className="explorar-barra">
          <label>
            Año{' '}
            <select value={anio} onChange={(e) => cambiarAnio(Number(e.target.value))}>
              {ANIOS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </label>
          <span>Las más populares de ese año</span>
        </div>
      )}

      {error && <p role="alert">{error}</p>}
      {cargando && items.length === 0 && <p>Cargando películas...</p>}
      {!cargando && !error && items.length === 0 && <p>No hay películas para mostrar.</p>}

      <ul className="cuadricula">
        {items.map((r) => (
          <TarjetaResultado
            key={claveDe(r)}
            resultado={r}
            mensaje={mensajes[claveDe(r)]}
            onAgregar={agregar}
          />
        ))}
      </ul>

      {items.length > 0 && pagina < totalPaginas && (
        <button className="explorar-mas" onClick={cargarMas} disabled={cargando}>
          {cargando ? 'Cargando...' : 'Cargar más'}
        </button>
      )}
    </section>
  );
}