import type { ResultadoBusqueda } from '../types';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY as string;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p';

interface ItemTMDB {
  id: number;
  media_type: string;
  title?: string;
  name?: string;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  overview: string;
}

export function urlPoster(ruta: string | null, tamano: 'w185' | 'w500' = 'w185') {
  return ruta ? `${IMG_URL}/${tamano}${ruta}` : null;
}

export async function buscarTitulos(consulta: string): Promise<ResultadoBusqueda[]> {
  if (!API_KEY) {
    throw new Error('Falta VITE_TMDB_API_KEY en .env.local');
  }

  const url = `${BASE_URL}/search/multi?api_key=${API_KEY}&language=es-ES&include_adult=false&query=${encodeURIComponent(consulta)}`;
  const respuesta = await fetch(url);

  if (!respuesta.ok) {
    throw new Error(`Error al consultar TMDB (código ${respuesta.status})`);
  }

  const datos: { results: ItemTMDB[] } = await respuesta.json();

  return datos.results
    .filter((item) => item.media_type === 'movie' || item.media_type === 'tv')
    .map((item) => {
      const esPelicula = item.media_type === 'movie';
      const fecha = esPelicula ? item.release_date : item.first_air_date;
      return {
        tmdb_id: item.id,
        tipo_contenido: esPelicula ? 'pelicula' : 'serie',
        titulo: (esPelicula ? item.title : item.name) ?? 'Sin título',
        poster_url: urlPoster(item.poster_path),
        anio: fecha ? fecha.slice(0, 4) : 's/f',
        sinopsis: item.overview,
      };
    });
}