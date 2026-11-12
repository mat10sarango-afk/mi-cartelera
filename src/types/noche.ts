// Tipos de la épica E2 «Noche de película». Spec 01, sección 2.
// Los nombres van en camelCase; los servicios traducen desde y hacia snake_case.

// Una película «por ver» de la lista, con la duración ya consultada
export interface PeliculaCandidata {
  itemId: number; // id en mi_lista
  tmdbId: number;
  titulo: string;
  posterUrl: string | null;
  fechaAgregado: string; // ISO 8601
  duracion: number | null; // minutos, entero >= 1; null si no se conoce
  consultaFallida: boolean; // true si no se pudo consultar la duración
}

export type PeliculaConDuracion = PeliculaCandidata & { duracion: number };

export type MotivoNoDisponible = 'duracion_desconocida' | 'consulta_fallida';

export type PeliculaNoDisponible = PeliculaCandidata & { motivo: MotivoNoDisponible };

export interface ClasificacionPeliculas {
  caben: PeliculaConDuracion[]; // ordenadas
  noDisponibles: PeliculaNoDisponible[];
  fuera: number; // duran más que el tiempo disponible
}

// Una película dentro de la sesión (armada o guardada)
export interface PeliculaEnSesion {
  tmdbId: number;
  titulo: string;
  posterUrl: string | null;
  duracion: number; // minutos, entero >= 1
}

export type ResultadoSesion =
  | { cabe: true; total: number; restante: number }
  | { cabe: false; motivo: 'tiempo_invalido' }
  | { cabe: false; motivo: 'duracion_desconocida' }
  | { cabe: false; motivo: 'excede_tiempo'; total: number; exceso: number };

export interface BorradorSesion {
  nombre: string; // lo que escribió el usuario, sin normalizar
  tiempoDisponible: number;
  peliculas: PeliculaEnSesion[]; // en el orden en que se agregaron
}

export interface SesionGuardada {
  id: string;
  nombre: string | null;
  tiempoDisponible: number;
  pausaMinutos: number;
  createdAt: string; // ISO 8601
  peliculas: PeliculaEnSesion[]; // ordenadas por `orden`
}

export type ResultadoGuardar =
  | { ok: true; id: string }
  | { ok: false; motivo: 'sin_peliculas' }
  | { ok: false; motivo: 'nombre_invalido'; mensaje: string }
  | { ok: false; motivo: 'no_cabe'; exceso: number };

export type ResultadoDuracion = { estado: 'ok'; minutos: number | null } | { estado: 'error' };
