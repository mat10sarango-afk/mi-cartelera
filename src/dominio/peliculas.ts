// Qué películas caben, cuáles no están disponibles y en qué orden. Spec 01, sección 3.
// Funciones puras: no leen el reloj, no llaman a la red ni a Supabase.
import type {
  ClasificacionPeliculas,
  PeliculaCandidata,
  PeliculaConDuracion,
  PeliculaNoDisponible,
} from '../types/noche';
import { PAUSA_MINUTOS, evaluarSesion, normalizarDuracion } from './sesion';

// Instante en milisegundos; una fecha ilegible cuenta como 0 para no romper el orden
function instante(fecha: string): number {
  const milisegundos = Date.parse(fecha);
  return Number.isNaN(milisegundos) ? 0 : milisegundos;
}

// Más antigua primero y, si empatan, por título
function compararPorFechaYTitulo(a: PeliculaCandidata, b: PeliculaCandidata): number {
  const porFecha = instante(a.fechaAgregado) - instante(b.fechaAgregado);
  if (porFecha !== 0) return porFecha;
  return a.titulo.localeCompare(b.titulo, 'es');
}

// Se llama con un tiempo ya validado (validarTiempoDisponible)
export function clasificarPeliculas(
  tiempoDisponible: number,
  peliculas: PeliculaCandidata[],
): ClasificacionPeliculas {
  const caben: PeliculaConDuracion[] = [];
  const noDisponibles: PeliculaNoDisponible[] = [];
  let fuera = 0;

  for (const pelicula of peliculas) {
    if (pelicula.consultaFallida) {
      noDisponibles.push({ ...pelicula, motivo: 'consulta_fallida' });
      continue;
    }

    const duracion = normalizarDuracion(pelicula.duracion);
    if (duracion === null) {
      noDisponibles.push({ ...pelicula, motivo: 'duracion_desconocida' });
      continue;
    }

    // Una película sola no lleva pausa: cabe si dura como máximo el tiempo disponible
    if (evaluarSesion(tiempoDisponible, [duracion], PAUSA_MINUTOS).cabe) {
      caben.push({ ...pelicula, duracion });
    } else {
      fuera += 1;
    }
  }

  // Menor a mayor duración; si empatan, la más antigua en la lista; si aún empatan, por título
  caben.sort((a, b) => a.duracion - b.duracion || compararPorFechaYTitulo(a, b));
  noDisponibles.sort(compararPorFechaYTitulo);

  return { caben, noDisponibles, fuera };
}
