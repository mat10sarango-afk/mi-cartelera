import { useEffect, useState } from 'react';
import TarjetaLista from '../components/TarjetaLista';
import { actualizarItem, eliminarItem, obtenerLista } from '../lib/lista';
import type { ItemLista } from '../types';

export default function MiLista() {
  const [items, setItems] = useState<ItemLista[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      {!cargando && !error && items.length === 0 && (
        <p>Todavía no has agregado ningún título. Búscalos en la pantalla de búsqueda.</p>
      )}

      <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', listStyle: 'none', padding: 0 }}>
        {items.map((item) => (
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