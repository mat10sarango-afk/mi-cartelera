import { useEffect, useMemo, useState } from 'react';
import TarjetaLista from '../components/TarjetaLista';
import { actualizarItem, eliminarItem, obtenerLista } from '../lib/lista';
import type { Estado, ItemLista } from '../types';

type Filtro = 'todos' | Estado;
type Orden = 'fecha' | 'calificacion';

export default function MiLista() {
  const [items, setItems] = useState<ItemLista[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<Filtro>('todos');
  const [orden, setOrden] = useState<Orden>('fecha');

  useEffect(() => {
    let activo = true;
    obtenerLista()
      .then((datos) => {
        if (activo) setItems(datos);
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
  }, []);

  const conteo = useMemo(
    () => ({
      por_ver: items.filter((i) => i.estado === 'por_ver').length,
      viendo: items.filter((i) => i.estado === 'viendo').length,
      vista: items.filter((i) => i.estado === 'vista').length,
    }),
    [items],
  );

  const itemsVisibles = useMemo(() => {
    const filtrados = filtro === 'todos' ? items : items.filter((i) => i.estado === filtro);

    return [...filtrados].sort((a, b) => {
      if (orden === 'calificacion') {
        // Mejor calificación primero; los que no tienen calificación van al final
        return (b.calificacion_personal ?? 0) - (a.calificacion_personal ?? 0);
      }
      // Más recientes primero
      return new Date(b.fecha_agregado).getTime() - new Date(a.fecha_agregado).getTime();
    });
  }, [items, filtro, orden]);

  const manejarActualizar = async (
    id: number,
    cambios: Partial<Pick<ItemLista, 'estado' | 'calificacion_personal' | 'comentario'>>,
  ) => {
    setError(null);
    try {
      await actualizarItem(id, cambios);
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...cambios } : i)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo actualizar.');
    }
  };

  const manejarEliminar = async (id: number) => {
    if (!window.confirm('¿Eliminar este título de tu lista?')) return;
    setError(null);
    try {
      await eliminarItem(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo eliminar.');
    }
  };

  return (
    <main>
      <h1>Mi lista</h1>

      {cargando && <p>Cargando tu lista...</p>}
      {error && <p role="alert">{error}</p>}

      {!cargando && items.length > 0 && (
        <>
          <p>
            Tienes {conteo.por_ver} pendientes, {conteo.viendo} en progreso y {conteo.vista}{' '}
            vistas.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <label>
              Mostrar{' '}
              <select value={filtro} onChange={(e) => setFiltro(e.target.value as Filtro)}>
                <option value="todos">Todos</option>
                <option value="por_ver">Por ver</option>
                <option value="viendo">Viendo</option>
                <option value="vista">Vista</option>
              </select>
            </label>

            <label>
              Ordenar por{' '}
              <select value={orden} onChange={(e) => setOrden(e.target.value as Orden)}>
                <option value="fecha">Fecha agregada</option>
                <option value="calificacion">Mi calificación</option>
              </select>
            </label>
          </div>
        </>
      )}

      {!cargando && !error && items.length === 0 && (
        <p>Todavía no has agregado ningún título. Búscalos en la pantalla de búsqueda.</p>
      )}
      {!cargando && items.length > 0 && itemsVisibles.length === 0 && (
        <p>No tienes títulos con ese estado.</p>
      )}

      <ul
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1rem',
          listStyle: 'none',
          padding: 0,
        }}
      >
        {itemsVisibles.map((item) => (
          <TarjetaLista
            key={item.id}
            item={item}
            onActualizar={manejarActualizar}
            onEliminar={manejarEliminar}
          />
        ))}
      </ul>
    </main>
  );
}