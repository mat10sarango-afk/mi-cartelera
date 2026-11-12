// Duración de cada película según el catálogo (campo runtime). Spec 01, sección 4.
// Solo los servicios consultan el catálogo; los componentes no.
import { normalizarDuracion } from '../dominio/sesion';
import type { ResultadoDuracion } from '../types/noche';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY as string;
const BASE_URL = 'https://api.themoviedb.org/3';
const TAMANO_LOTE = 10;

// Duraciones ya obtenidas con éxito mientras la app esté abierta. Un fallo no se recuerda, para poder reintentar.
const recordadas = new Map<number, number | null>();

async function consultarDuracion(tmdbId: number): Promise<number | null> {
  const respuesta = await fetch(`${BASE_URL}/movie/${tmdbId}?api_key=${API_KEY}&language=es-ES`);
  if (!respuesta.ok) throw new Error(`No se pudo consultar la película ${tmdbId}.`);

  const detalle = (await respuesta.json()) as { runtime?: number | null };
  return normalizarDuracion(detalle.runtime);
}

async function obtener(tmdbIds: number[]): Promise<Map<number, ResultadoDuracion>> {
  if (!API_KEY) throw new Error('Falta VITE_TMDB_API_KEY en .env.local');

  const resultados = new Map<number, ResultadoDuracion>();
  const pendientes: number[] = [];

  for (const id of tmdbIds) {
    const recordada = recordadas.get(id);
    if (recordada !== undefined) {
      resultados.set(id, { estado: 'ok', minutos: recordada });
    } else {
      pendientes.push(id);
    }
  }

  // En lotes de 10 en paralelo; la falla de una película no afecta a las demás
  for (let inicio = 0; inicio < pendientes.length; inicio += TAMANO_LOTE) {
    const lote = pendientes.slice(inicio, inicio + TAMANO_LOTE);
    const respuestas = await Promise.allSettled(lote.map((id) => consultarDuracion(id)));

    respuestas.forEach((respuesta, indice) => {
      const id = lote[indice];
      if (respuesta.status === 'fulfilled') {
        recordadas.set(id, respuesta.value);
        resultados.set(id, { estado: 'ok', minutos: respuesta.value });
      } else {
        resultados.set(id, { estado: 'error' });
      }
    });
  }

  return resultados;
}

export const duracionesService = { obtener };
