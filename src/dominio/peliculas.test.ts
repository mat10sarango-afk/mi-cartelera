import { describe, expect, it } from 'vitest';
import type { PeliculaCandidata } from '../types/noche';
import { clasificarPeliculas } from './peliculas';

// Crea una película de prueba; `opciones` permite cambiar cualquier campo
function crear(
  tmdbId: number,
  titulo: string,
  duracion: number | null,
  fechaAgregado = '2026-10-01T10:00:00+00:00',
  opciones: Partial<PeliculaCandidata> = {},
): PeliculaCandidata {
  return {
    itemId: tmdbId,
    tmdbId,
    titulo,
    posterUrl: null,
    fechaAgregado,
    duracion,
    consultaFallida: false,
    ...opciones,
  };
}

const ids = (lista: PeliculaCandidata[]) => lista.map((p) => p.tmdbId);

describe('clasificarPeliculas: qué cabe (HU-2.1-CA1, CA2, CA12, CA13)', () => {
  it('con 150 min deja las de 90 y 120 y cuenta la de 200 como fuera', () => {
    const resultado = clasificarPeliculas(150, [
      crear(1, 'A', 90),
      crear(2, 'B', 120),
      crear(3, 'C', 200),
    ]);
    expect(ids(resultado.caben)).toEqual([1, 2]);
    expect(resultado.fuera).toBe(1);
    expect(resultado.noDisponibles).toEqual([]);
  });

  it('una película que dura exactamente el tiempo sí cabe', () => {
    const resultado = clasificarPeliculas(150, [crear(1, 'A', 150)]);
    expect(ids(resultado.caben)).toEqual([1]);
    expect(resultado.fuera).toBe(0);
  });

  it('una película que dura un minuto más queda fuera', () => {
    const resultado = clasificarPeliculas(150, [crear(1, 'A', 151)]);
    expect(resultado.caben).toEqual([]);
    expect(resultado.fuera).toBe(1);
  });

  it('si ninguna cabe, caben queda vacío y fuera las cuenta todas', () => {
    const resultado = clasificarPeliculas(90, [crear(1, 'A', 120), crear(2, 'B', 150)]);
    expect(resultado.caben).toEqual([]);
    expect(resultado.fuera).toBe(2);
  });

  it('con una lista vacía todo queda vacío', () => {
    expect(clasificarPeliculas(150, [])).toEqual({ caben: [], noDisponibles: [], fuera: 0 });
  });

  it('en el tiempo máximo cabe una película de 600 minutos', () => {
    const resultado = clasificarPeliculas(600, [crear(1, 'A', 600)]);
    expect(ids(resultado.caben)).toEqual([1]);
  });

  it('en el tiempo mínimo caben las de 30 minutos o menos', () => {
    const resultado = clasificarPeliculas(30, [crear(1, 'A', 30), crear(2, 'B', 31)]);
    expect(ids(resultado.caben)).toEqual([1]);
    expect(resultado.fuera).toBe(1);
  });
});

describe('clasificarPeliculas: orden de las que caben (HU-2.1-CA3)', () => {
  it('ordena por duración y, si empatan, la más antigua en la lista primero', () => {
    const a = crear(1, 'A', 120, '2026-10-05T10:00:00+00:00');
    const b = crear(2, 'B', 90, '2026-10-04T10:00:00+00:00'); // hace una semana
    const c = crear(3, 'C', 90, '2026-10-10T10:00:00+00:00'); // ayer
    expect(ids(clasificarPeliculas(300, [a, b, c]).caben)).toEqual([2, 3, 1]);
    expect(ids(clasificarPeliculas(300, [c, a, b]).caben)).toEqual([2, 3, 1]);
  });

  it('si empatan en duración y en fecha, ordena por título', () => {
    const fecha = '2026-10-01T10:00:00+00:00';
    const resultado = clasificarPeliculas(300, [
      crear(1, 'Zorro', 90, fecha),
      crear(2, 'Águila', 90, fecha),
      crear(3, 'Matrix', 90, fecha),
    ]);
    expect(resultado.caben.map((p) => p.titulo)).toEqual(['Águila', 'Matrix', 'Zorro']);
  });

  it('compara las fechas como instantes y no como texto', () => {
    // A: 10:00 UTC. B: 09:00 en UTC-4, es decir 13:00 UTC. Como instante, A es más antigua.
    const a = crear(1, 'A', 90, '2026-10-01T10:00:00+00:00');
    const b = crear(2, 'B', 90, '2026-10-01T09:00:00-04:00');
    expect(ids(clasificarPeliculas(300, [b, a]).caben)).toEqual([1, 2]);
  });

  it('no modifica la lista que recibe', () => {
    const entrada = [crear(1, 'A', 120), crear(2, 'B', 90)];
    clasificarPeliculas(300, entrada);
    expect(ids(entrada)).toEqual([1, 2]);
  });

  it('conserva la duración como número en cada película que cabe', () => {
    const resultado = clasificarPeliculas(300, [crear(1, 'A', 120)]);
    expect(resultado.caben[0].duracion).toBe(120);
  });
});

describe('clasificarPeliculas: no disponibles (HU-2.2-CA1 a CA4)', () => {
  it('una película sin duración (null) queda como no disponible por duración desconocida', () => {
    const resultado = clasificarPeliculas(150, [crear(1, 'A', null)]);
    expect(resultado.caben).toEqual([]);
    expect(resultado.noDisponibles.map((p) => p.motivo)).toEqual(['duracion_desconocida']);
    expect(resultado.fuera).toBe(0);
  });

  it('una duración de 0 minutos se trata como desconocida', () => {
    const resultado = clasificarPeliculas(150, [crear(1, 'A', 0)]);
    expect(resultado.noDisponibles.map((p) => p.motivo)).toEqual(['duracion_desconocida']);
  });

  it('una consulta fallida queda como no disponible con su propio motivo', () => {
    const resultado = clasificarPeliculas(150, [
      crear(1, 'A', null, undefined, { consultaFallida: true }),
    ]);
    expect(resultado.noDisponibles.map((p) => p.motivo)).toEqual(['consulta_fallida']);
  });

  it('una consulta fallida tiene prioridad aunque haya una duración', () => {
    const resultado = clasificarPeliculas(150, [
      crear(1, 'A', 90, undefined, { consultaFallida: true }),
    ]);
    expect(resultado.caben).toEqual([]);
    expect(resultado.noDisponibles.map((p) => p.motivo)).toEqual(['consulta_fallida']);
  });

  it('una película sin duración sigue como no disponible con cualquier tiempo válido', () => {
    for (const tiempo of [30, 150, 600]) {
      const resultado = clasificarPeliculas(tiempo, [crear(1, 'A', null)]);
      expect(ids(resultado.noDisponibles)).toEqual([1]);
    }
  });

  it('una falla puntual no afecta a las demás películas', () => {
    const resultado = clasificarPeliculas(150, [
      crear(1, 'A', 90),
      crear(2, 'B', null, undefined, { consultaFallida: true }),
      crear(3, 'C', 120),
    ]);
    expect(ids(resultado.caben)).toEqual([1, 3]);
    expect(ids(resultado.noDisponibles)).toEqual([2]);
  });

  it('ordena las no disponibles por antigüedad en la lista y luego por título', () => {
    const resultado = clasificarPeliculas(150, [
      crear(1, 'Zeta', null, '2026-10-03T10:00:00+00:00'),
      crear(2, 'Beta', null, '2026-10-02T10:00:00+00:00'),
      crear(3, 'Alfa', null, '2026-10-02T10:00:00+00:00'),
    ]);
    expect(resultado.noDisponibles.map((p) => p.titulo)).toEqual(['Alfa', 'Beta', 'Zeta']);
  });
});
