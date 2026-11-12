// Nombre opcional de la sesión. Spec 01, sección 3.
// Funciones puras: no leen el reloj, no llaman a la red ni a Supabase.
import { NOMBRE_MAXIMO } from './sesion';

export const MENSAJE_NOMBRE_LARGO = `El nombre no puede pasar de ${NOMBRE_MAXIMO} caracteres.`;

// Recorta los espacios de los extremos; un nombre vacío o de solo espacios es «sin nombre»
export function normalizarNombreSesion(nombre: string): string | null {
  const recortado = nombre.trim();
  return recortado === '' ? null : recortado;
}

// Devuelve el mensaje de error, o null si el nombre es válido (incluido «sin nombre»)
export function validarNombreSesion(nombre: string): string | null {
  const normalizado = normalizarNombreSesion(nombre);
  if (normalizado === null) return null;
  // Se cuentan caracteres reales, igual que char_length en la base de datos
  return Array.from(normalizado).length > NOMBRE_MAXIMO ? MENSAJE_NOMBRE_LARGO : null;
}
