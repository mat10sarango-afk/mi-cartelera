import { useState } from 'react';
import { agregarALista } from '../lib/lista';
import type { ResultadoBusqueda } from '../types';

export function claveDe(r: ResultadoBusqueda) {
  return `${r.tipo_contenido}-${r.tmdb_id}`;
}

export function useAgregar() {
  const [mensajes, setMensajes] = useState<Record<string, string>>({});

  const agregar = async (r: ResultadoBusqueda) => {
    const clave = claveDe(r);
    setMensajes((prev) => ({ ...prev, [clave]: 'Agregando...' }));
    try {
      await agregarALista(r);
      setMensajes((prev) => ({ ...prev, [clave]: '✓ Agregado a tu lista' }));
    } catch (err) {
      const texto = err instanceof Error ? err.message : 'No se pudo agregar.';
      setMensajes((prev) => ({ ...prev, [clave]: texto }));
    }
  };

  const limpiar = () => setMensajes({});

  return { mensajes, agregar, limpiar };
}