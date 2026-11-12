import { describe, expect, it } from 'vitest';
import {
  MENSAJE_NOMBRE_LARGO,
  normalizarNombreSesion,
  validarNombreSesion,
} from './nombreSesion';

describe('normalizarNombreSesion (HU-2.4-CA2 y CA5)', () => {
  it('un nombre vacío es «sin nombre»', () => {
    expect(normalizarNombreSesion('')).toBeNull();
  });
  it('un nombre de solo espacios es «sin nombre»', () => {
    expect(normalizarNombreSesion('   ')).toBeNull();
  });
  it('recorta los espacios de los extremos', () => {
    expect(normalizarNombreSesion('  Viernes de terror  ')).toBe('Viernes de terror');
  });
  it('conserva los espacios del interior', () => {
    expect(normalizarNombreSesion('Noche  de  cine')).toBe('Noche  de  cine');
  });
});

describe('validarNombreSesion (HU-2.4-CA2 a CA5)', () => {
  it('acepta un nombre normal', () => {
    expect(validarNombreSesion('Viernes de terror')).toBeNull();
  });
  it('acepta «sin nombre» (vacío o solo espacios)', () => {
    expect(validarNombreSesion('')).toBeNull();
    expect(validarNombreSesion('    ')).toBeNull();
  });
  it('acepta un nombre de exactamente 60 caracteres', () => {
    expect(validarNombreSesion('a'.repeat(60))).toBeNull();
  });
  it('rechaza un nombre de 61 caracteres con el mensaje de longitud', () => {
    expect(validarNombreSesion('a'.repeat(61))).toBe(MENSAJE_NOMBRE_LARGO);
  });
  it('no cuenta los espacios de los extremos', () => {
    expect(validarNombreSesion(`  ${'a'.repeat(60)}  `)).toBeNull();
  });
  it('cuenta cada emoji como un solo carácter', () => {
    expect(validarNombreSesion('🎬'.repeat(60))).toBeNull();
    expect(validarNombreSesion('🎬'.repeat(61))).toBe(MENSAJE_NOMBRE_LARGO);
  });
  it('el mensaje de longitud dice 60 caracteres', () => {
    expect(MENSAJE_NOMBRE_LARGO).toBe('El nombre no puede pasar de 60 caracteres.');
  });
});
