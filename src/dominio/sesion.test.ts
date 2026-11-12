import { describe, expect, it } from 'vitest';
import {
  MENSAJE_TIEMPO_NO_ENTERO,
  MENSAJE_TIEMPO_RANGO,
  MENSAJE_TIEMPO_VACIO,
  NOMBRE_MAXIMO,
  PAUSA_MINUTOS,
  TIEMPO_MAXIMO,
  TIEMPO_MINIMO,
  duracionTotal,
  evaluarSesion,
  mensajeExceso,
  normalizarDuracion,
  puedeAgregar,
  validarTiempoDisponible,
} from './sesion';

describe('constantes de la regla', () => {
  it('coinciden con las decisiones del cliente y del estudiante (R6, R8 y R16)', () => {
    expect(TIEMPO_MINIMO).toBe(30);
    expect(TIEMPO_MAXIMO).toBe(600);
    expect(PAUSA_MINUTOS).toBe(10);
    expect(NOMBRE_MAXIMO).toBe(60);
  });
});

describe('validarTiempoDisponible (HU-2.1-CA4 a CA9)', () => {
  it('acepta el mínimo, 30 minutos', () => {
    expect(validarTiempoDisponible(30)).toBeNull();
  });
  it('acepta el máximo, 600 minutos', () => {
    expect(validarTiempoDisponible(600)).toBeNull();
  });
  it('acepta un valor intermedio', () => {
    expect(validarTiempoDisponible(150)).toBeNull();
  });
  it('rechaza 29 minutos con el mensaje de rango', () => {
    expect(validarTiempoDisponible(29)).toBe(MENSAJE_TIEMPO_RANGO);
  });
  it('rechaza 601 minutos con el mensaje de rango', () => {
    expect(validarTiempoDisponible(601)).toBe(MENSAJE_TIEMPO_RANGO);
  });
  it('rechaza 0 y los negativos con el mensaje de rango', () => {
    expect(validarTiempoDisponible(0)).toBe(MENSAJE_TIEMPO_RANGO);
    expect(validarTiempoDisponible(-60)).toBe(MENSAJE_TIEMPO_RANGO);
  });
  it('pide el tiempo si está vacío (null o NaN)', () => {
    expect(validarTiempoDisponible(null)).toBe(MENSAJE_TIEMPO_VACIO);
    expect(validarTiempoDisponible(Number.NaN)).toBe(MENSAJE_TIEMPO_VACIO);
  });
  it('rechaza decimales con el mensaje de número entero', () => {
    expect(validarTiempoDisponible(90.5)).toBe(MENSAJE_TIEMPO_NO_ENTERO);
  });
  it('rechaza Infinity con el mensaje de número entero', () => {
    expect(validarTiempoDisponible(Number.POSITIVE_INFINITY)).toBe(MENSAJE_TIEMPO_NO_ENTERO);
  });
});

describe('normalizarDuracion (HU-2.2-CA2)', () => {
  it('conserva un entero mayor o igual que 1', () => {
    expect(normalizarDuracion(1)).toBe(1);
    expect(normalizarDuracion(120)).toBe(120);
  });
  it('trata 0 como duración desconocida', () => {
    expect(normalizarDuracion(0)).toBeNull();
  });
  it('trata negativos, decimales y NaN como duración desconocida', () => {
    expect(normalizarDuracion(-5)).toBeNull();
    expect(normalizarDuracion(90.5)).toBeNull();
    expect(normalizarDuracion(Number.NaN)).toBeNull();
  });
  it('trata null y undefined como duración desconocida', () => {
    expect(normalizarDuracion(null)).toBeNull();
    expect(normalizarDuracion(undefined)).toBeNull();
  });
});

describe('duracionTotal (R8)', () => {
  it('es 0 si no hay películas', () => {
    expect(duracionTotal([], PAUSA_MINUTOS)).toBe(0);
  });
  it('con una sola película no suma pausa', () => {
    expect(duracionTotal([100], PAUSA_MINUTOS)).toBe(100);
  });
  it('suma una pausa entre dos películas', () => {
    expect(duracionTotal([100, 90], PAUSA_MINUTOS)).toBe(200);
  });
  it('suma dos pausas entre tres películas', () => {
    expect(duracionTotal([100, 90, 60], PAUSA_MINUTOS)).toBe(270);
  });
  it('con pausa 0 solo suma las duraciones', () => {
    expect(duracionTotal([100, 90], 0)).toBe(190);
  });
});

describe('evaluarSesion (HU-2.3-CA1 a CA4, CA9)', () => {
  it('una sesión vacía tiene total 0 y todo el tiempo restante', () => {
    expect(evaluarSesion(180, [], PAUSA_MINUTOS)).toEqual({ cabe: true, total: 0, restante: 180 });
  });
  it('una sola película no lleva pausa', () => {
    expect(evaluarSesion(180, [100], PAUSA_MINUTOS)).toEqual({
      cabe: true,
      total: 100,
      restante: 80,
    });
  });
  it('dos películas llevan una pausa', () => {
    expect(evaluarSesion(240, [100, 90], PAUSA_MINUTOS)).toEqual({
      cabe: true,
      total: 200,
      restante: 40,
    });
  });
  it('tres películas llevan dos pausas', () => {
    expect(evaluarSesion(300, [100, 90, 60], PAUSA_MINUTOS)).toEqual({
      cabe: true,
      total: 270,
      restante: 30,
    });
  });
  it('una sesión que ocupa exactamente el tiempo sí cabe', () => {
    expect(evaluarSesion(200, [100, 90], PAUSA_MINUTOS)).toEqual({
      cabe: true,
      total: 200,
      restante: 0,
    });
  });
  it('una sola película que dura exactamente el tiempo sí cabe', () => {
    expect(evaluarSesion(150, [150], PAUSA_MINUTOS)).toEqual({
      cabe: true,
      total: 150,
      restante: 0,
    });
  });
  it('un minuto de más no cabe y dice cuánto se pasa', () => {
    expect(evaluarSesion(200, [100, 91], PAUSA_MINUTOS)).toEqual({
      cabe: false,
      motivo: 'excede_tiempo',
      total: 201,
      exceso: 1,
    });
  });
  it('una película sin duración (null) no permite evaluar', () => {
    expect(evaluarSesion(180, [100, null], PAUSA_MINUTOS)).toEqual({
      cabe: false,
      motivo: 'duracion_desconocida',
    });
  });
  it('una duración de 0 se trata como desconocida', () => {
    expect(evaluarSesion(180, [0], PAUSA_MINUTOS)).toEqual({
      cabe: false,
      motivo: 'duracion_desconocida',
    });
  });
  it('un tiempo menor que el mínimo es inválido', () => {
    expect(evaluarSesion(29, [20], PAUSA_MINUTOS)).toEqual({
      cabe: false,
      motivo: 'tiempo_invalido',
    });
  });
  it('un tiempo mayor que el máximo es inválido', () => {
    expect(evaluarSesion(601, [20], PAUSA_MINUTOS)).toEqual({
      cabe: false,
      motivo: 'tiempo_invalido',
    });
  });
  it('un tiempo con decimales es inválido', () => {
    expect(evaluarSesion(90.5, [20], PAUSA_MINUTOS)).toEqual({
      cabe: false,
      motivo: 'tiempo_invalido',
    });
  });
  it('el tiempo inválido se reporta antes que la duración desconocida', () => {
    expect(evaluarSesion(29, [null], PAUSA_MINUTOS)).toEqual({
      cabe: false,
      motivo: 'tiempo_invalido',
    });
  });
  it('la duración desconocida se reporta antes que el exceso', () => {
    expect(evaluarSesion(30, [500, null], PAUSA_MINUTOS)).toEqual({
      cabe: false,
      motivo: 'duracion_desconocida',
    });
  });
  it('funciona en el límite máximo de tiempo', () => {
    expect(evaluarSesion(600, [300, 290], PAUSA_MINUTOS)).toEqual({
      cabe: true,
      total: 600,
      restante: 0,
    });
  });
});

describe('puedeAgregar (HU-2.3-CA4 a CA6)', () => {
  it('acepta una película que llena justo lo que queda', () => {
    expect(puedeAgregar(200, [100], 90, PAUSA_MINUTOS)).toEqual({
      cabe: true,
      total: 200,
      restante: 0,
    });
  });
  it('rechaza una película que se pasa 1 minuto e informa el exceso', () => {
    expect(puedeAgregar(200, [100], 91, PAUSA_MINUTOS)).toEqual({
      cabe: false,
      motivo: 'excede_tiempo',
      total: 201,
      exceso: 1,
    });
  });
  it('rechaza una película sin duración', () => {
    expect(puedeAgregar(180, [], null, PAUSA_MINUTOS)).toEqual({
      cabe: false,
      motivo: 'duracion_desconocida',
    });
  });
  it('la primera película no necesita pausa', () => {
    expect(puedeAgregar(100, [], 100, PAUSA_MINUTOS)).toEqual({
      cabe: true,
      total: 100,
      restante: 0,
    });
  });
});

describe('mensajeExceso', () => {
  it('escribe los minutos que se pasaría', () => {
    expect(mensajeExceso(1)).toBe('No cabe: te pasarías 1 min del tiempo disponible.');
    expect(mensajeExceso(25)).toBe('No cabe: te pasarías 25 min del tiempo disponible.');
  });
});
