import { supabase } from './supabase';
import type { ItemLista, ResultadoBusqueda } from '../types';

export async function agregarALista(titulo: ResultadoBusqueda): Promise<void> {
  const { error } = await supabase.from('mi_lista').insert({
    tmdb_id: titulo.tmdb_id,
    titulo: titulo.titulo,
    poster_url: titulo.poster_url,
    tipo_contenido: titulo.tipo_contenido,
    estado: 'por_ver',
  });

  if (error) {
    // 23505 = violación de la restricción unique (ya lo tenías guardado)
    if (error.code === '23505') {
      throw new Error('Este título ya está en tu lista.');
    }
    throw new Error(error.message);
  }
}
export async function obtenerLista(): Promise<ItemLista[]> {
  const { data, error } = await supabase
    .from('mi_lista')
    .select('*')
    .order('fecha_agregado', { ascending: false });

  if (error) throw new Error(error.message);
  return data as ItemLista[];
}

export async function actualizarItem(
  id: number,
  cambios: Partial<Pick<ItemLista, 'estado' | 'calificacion_personal' | 'comentario'>>,
): Promise<void> {
  const { error } = await supabase.from('mi_lista').update(cambios).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function eliminarItem(id: number): Promise<void> {
  const { error } = await supabase.from('mi_lista').delete().eq('id', id);
  if (error) throw new Error(error.message);
}