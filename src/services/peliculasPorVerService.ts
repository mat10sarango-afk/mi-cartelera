// Películas «por ver» del usuario. Spec 01, sección 4.
// Solo los servicios llaman a Supabase; los componentes no.
import { supabase } from '../lib/supabase';
import type { PeliculaCandidata } from '../types/noche';

export type PeliculaPorVer = Omit<PeliculaCandidata, 'duracion' | 'consultaFallida'>;

interface FilaLista {
  id: number;
  tmdb_id: number;
  titulo: string;
  poster_url: string | null;
  fecha_agregado: string;
}

// La política RLS de mi_lista ya limita las filas al usuario que inició sesión
async function listar(): Promise<PeliculaPorVer[]> {
  const { data, error } = await supabase
    .from('mi_lista')
    .select('id, tmdb_id, titulo, poster_url, fecha_agregado')
    .eq('tipo_contenido', 'pelicula')
    .eq('estado', 'por_ver')
    .order('fecha_agregado', { ascending: true });

  if (error) throw new Error(error.message);

  const filas = (data ?? []) as FilaLista[];
  return filas.map((fila) => ({
    itemId: fila.id,
    tmdbId: fila.tmdb_id,
    titulo: fila.titulo,
    posterUrl: fila.poster_url,
    fechaAgregado: fila.fecha_agregado,
  }));
}

export const peliculasPorVerService = { listar };
