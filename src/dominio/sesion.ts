// Reglas del tiempo y de la sesión. Spec 01, sección 3.
// Funciones puras: no leen el reloj, no llaman a la red ni a Supabase.
import type { MotivoNoDisponible, ResultadoSesion } from '../types/noche';

export const TIEMPO_MINIMO = 30;
export const TIEMPO_MAXIMO = 600;
export const PAUSA_MINUTOS = 10;
export const NOMBRE_MAXIMO = 60;

export const MENSAJE_TIEMPO_VACIO = 'Indica cuántos minutos tienes disponibles.';
export const MENSAJE_TIEMPO_NO_ENTERO = 'El tiempo debe ser un número entero de minutos.';
export const MENSAJE_TIEMPO_RANGO = `El tiempo debe estar entre ${TIEMPO_MINIMO} y ${TIEMPO_MAXIMO} minutos.`;

export const MENSAJES_NO_DISPONIBLE: Record<MotivoNoDisponible, string> = {
  duracion_desconocida: 'No se puede agregar: no se conoce su duración.',
  consulta_fallida: 'No se pudo consultar su duración. Inténtalo de nuevo.',
};

export const MENSAJE_YA_AGREGADA = 'Ya está en tu sesión.';

export function mensajeExceso(exceso: number): string {
  return `No cabe: te pasarías ${exceso} min del tiempo disponible.`;
}

// Devuelve el mensaje de error, o null si el tiempo es válido
export function validarTiempoDisponible(minutos: number | null): string | null {
  if (minutos === null || Number.isNaN(minutos)) return MENSAJE_TIEMPO_VACIO;
  if (!Number.isInteger(minutos)) return MENSAJE_TIEMPO_NO_ENTERO;
  if (minutos < TIEMPO_MINIMO || minutos > TIEMPO_MAXIMO) return MENSAJE_TIEMPO_RANGO;
  return null;
}

// Una duración solo es conocida si es un entero >= 1. Cualquier otro valor (null, 0, decimal…) es null.
export function normalizarDuracion(valor: number | null | undefined): number | null {
  if (typeof valor !== 'number' || !Number.isInteger(valor) || valor < 1) return null;
  return valor;
}

// Suma las duraciones y una pausa por cada película después de la primera
export function duracionTotal(duraciones: number[], pausa: number): number {
  if (duraciones.length === 0) return 0;
  const suma = duraciones.reduce((acumulado, duracion) => acumulado + duracion, 0);
  return suma + pausa * (duraciones.length - 1);
}

// Decide si una sesión cabe. Orden de las comprobaciones: tiempo, duraciones, exceso.
export function evaluarSesion(
  tiempoDisponible: number,
  duraciones: (number | null)[],
  pausa: number,
): ResultadoSesion {
  if (validarTiempoDisponible(tiempoDisponible) !== null) {
    return { cabe: false, motivo: 'tiempo_invalido' };
  }

  const conocidas: number[] = [];
  for (const duracion of duraciones) {
    const normalizada = normalizarDuracion(duracion);
    if (normalizada === null) return { cabe: false, motivo: 'duracion_desconocida' };
    conocidas.push(normalizada);
  }

  const total = duracionTotal(conocidas, pausa);
  if (total > tiempoDisponible) {
    return { cabe: false, motivo: 'excede_tiempo', total, exceso: total - tiempoDisponible };
  }
  return { cabe: true, total, restante: tiempoDisponible - total };
}

// Evalúa la sesión que resultaría de agregar una película
export function puedeAgregar(
  tiempoDisponible: number,
  duracionesActuales: number[],
  duracionNueva: number | null,
  pausa: number,
): ResultadoSesion {
  return evaluarSesion(tiempoDisponible, [...duracionesActuales, duracionNueva], pausa);
}
