// Guardar, listar y eliminar sesiones. Spec 01, sección 4.
// Solo los servicios llaman a Supabase; los componentes no.
import { supabase } from '../lib/supabase';
import { normalizarNombreSesion, validarNombreSesion } from '../dominio/nombreSesion';
import { PAUSA_MINUTOS, evaluarSesion } from '../dominio/sesion';
import type { BorradorSesion, ResultadoGuardar, SesionGuardada } from '../types/noche';

interface FilaPelicula {
  orden: number;
  tmdb_id: number;
  titulo: string;
  poster_url: string | null;
  duracion_minutos: number;
}

interface FilaSesion {
  id: string;
  nombre: string | null;
  tiempo_disponible: number;
  pausa_minutos: number;
  created_at: string;
  sesion_peliculas: FilaPelicula[];
}

// Valida con el dominio y guarda la sesión completa en una sola operación (función guardar_sesion)
async function guardar(borrador: BorradorSesion): Promise<ResultadoGuardar> {
  if (borrador.peliculas.length === 0) return { ok: false, motivo: 'sin_peliculas' };

  const mensajeNombre = validarNombreSesion(borrador.nombre);
  if (mensajeNombre !== null) {
    return { ok: false, motivo: 'nombre_invalido', mensaje: mensajeNombre };
  }

  const evaluacion = evaluarSesion(
    borrador.tiempoDisponible,
    borrador.peliculas.map((pelicula) => pelicula.duracion),
    PAUSA_MINUTOS,
  );
  if (!evaluacion.cabe) {
    if (evaluacion.motivo === 'excede_tiempo') {
      return { ok: false, motivo: 'no_cabe', exceso: evaluacion.exceso };
    }
    throw new Error('La sesión no es válida.');
  }

  const { data, error } = await supabase.rpc('guardar_sesion', {
    p_nombre: normalizarNombreSesion(borrador.nombre),
    p_tiempo_disponible: borrador.tiempoDisponible,
    p_pausa_minutos: PAUSA_MINUTOS,
    p_peliculas: borrador.peliculas.map((pelicula, indice) => ({
      orden: indice + 1,
      tmdb_id: pelicula.tmdbId,
      titulo: pelicula.titulo,
      poster_url: pelicula.posterUrl,
      duracion_minutos: pelicula.duracion,
    })),
  });

  if (error) throw new Error(error.message);
  return { ok: true, id: data as string };
}

// La política RLS limita las filas al usuario; de la más reciente a la más antigua
async function listar(): Promise<SesionGuardada[]> {
  const { data, error } = await supabase
    .from('sesiones')
    .select(
      'id, nombre, tiempo_disponible, pausa_minutos, created_at, sesion_peliculas(orden, tmdb_id, titulo, poster_url, duracion_minutos)',
    )
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);

  const filas = (data ?? []) as unknown as FilaSesion[];
  return filas.map((fila) => ({
    id: fila.id,
    nombre: fila.nombre,
    tiempoDisponible: fila.tiempo_disponible,
    pausaMinutos: fila.pausa_minutos,
    createdAt: fila.created_at,
    peliculas: [...fila.sesion_peliculas]
      .sort((a, b) => a.orden - b.orden)
      .map((pelicula) => ({
        tmdbId: pelicula.tmdb_id,
        titulo: pelicula.titulo,
        posterUrl: pelicula.poster_url,
        duracion: pelicula.duracion_minutos,
      })),
  }));
}

// Las películas de la sesión se borran en cascada
async function eliminar(id: string): Promise<void> {
  const { error } = await supabase.from('sesiones').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export const sesionesService = { guardar, listar, eliminar };
