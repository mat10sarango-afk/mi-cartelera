import { supabase } from './supabase';
import type { ResultadoBusqueda } from '../types';

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