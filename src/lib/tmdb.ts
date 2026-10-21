import type { DetalleTMDB, ResultadoBusqueda, TipoContenido } from '../types';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY as string;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p';

export type Categoria = 'novedades' | 'taquilleras' | 'anio';

interface ItemTMDB {
  id: number;
  media_type?: string;
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

function mapearItem(item: ItemTMDB): ResultadoBusqueda {
  const esPelicula = item.media_type !== 'tv';
  const fecha = esPelicula ? item.release_date : item.first_air_date;
  return {
    tmdb_id: item.id,
    tipo_contenido: esPelicula ? 'pelicula' : 'serie',
    titulo: (esPelicula ? item.title : item.name) ?? 'Sin título',
    poster_url: urlPoster(item.poster_path),
    anio: fecha ? fecha.slice(0, 4) : 's/f',
    sinopsis: item.overview,
  };
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
    .map(mapearItem);
}

export async function explorarPeliculas(
  categoria: Categoria,
  pagina = 1,
  anio?: number,
): Promise<{ resultados: ResultadoBusqueda[]; totalPaginas: number }> {
  if (!API_KEY) {
    throw new Error('Falta VITE_TMDB_API_KEY en .env.local');
  }

  let ruta = 'discover/movie';
  let extra = '';

  if (categoria === 'novedades') {
    ruta = 'movie/now_playing';
  } else if (categoria === 'taquilleras') {
    extra = '&sort_by=revenue.desc';
  } else {
    extra = `&sort_by=popularity.desc&primary_release_year=${anio}`;
  }

  const url = `${BASE_URL}/${ruta}?api_key=${API_KEY}&language=es-ES&include_adult=false&page=${pagina}${extra}`;
  const respuesta = await fetch(url);

  if (!respuesta.ok) {
    throw new Error(`Error al consultar TMDB (código ${respuesta.status})`);
  }

  const datos: { results: ItemTMDB[]; total_pages: number } = await respuesta.json();

  return {
    // Solo mostramos las que tienen póster, para que la cuadrícula se vea bien
    resultados: datos.results.filter((item) => item.poster_path).map(mapearItem),
    // TMDB solo permite hasta la página 500
    totalPaginas: Math.min(datos.total_pages, 500),
  };
}

interface RespuestaDetalle {
  overview: string;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  genres: { name: string }[];
  vote_average: number;
  credits: { cast: { name: string; character: string }[] };
}

export async function obtenerDetalle(
  tmdbId: number,
  tipo: TipoContenido,
): Promise<DetalleTMDB> {
  if (!API_KEY) {
    throw new Error('Falta VITE_TMDB_API_KEY en .env.local');
  }

  const ruta = tipo === 'pelicula' ? 'movie' : 'tv';
  const url = `${BASE_URL}/${ruta}/${tmdbId}?api_key=${API_KEY}&language=es-ES&append_to_response=credits`;
  const respuesta = await fetch(url);

  if (!respuesta.ok) {
    throw new Error(`Error al consultar TMDB (código ${respuesta.status})`);
  }

  const d: RespuestaDetalle = await respuesta.json();
  const fecha = d.release_date ?? d.first_air_date;

  return {
    sinopsis: d.overview,
    poster_grande: urlPoster(d.poster_path, 'w500'),
    fecha: fecha ?? 'Sin fecha',
    generos: d.genres.map((g) => g.name),
    calificacion_tmdb: d.vote_average,
    elenco: d.credits.cast.slice(0, 10).map((c) => ({
      nombre: c.name,
      personaje: c.character,
    })),
  };
}