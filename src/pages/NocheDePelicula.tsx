import { useEffect, useState } from 'react';
import FormularioTiempo from '../components/noche/FormularioTiempo';
import ListaCandidatas from '../components/noche/ListaCandidatas';
import ListaSesionesGuardadas from '../components/noche/ListaSesionesGuardadas';
import PanelSesion from '../components/noche/PanelSesion';
import { clasificarPeliculas } from '../dominio/peliculas';
import { normalizarNombreSesion } from '../dominio/nombreSesion';
import {
  PAUSA_MINUTOS,
  evaluarSesion,
  mensajeExceso,
  puedeAgregar,
  validarTiempoDisponible,
} from '../dominio/sesion';
import { duracionesService } from '../services/duracionesService';
import { peliculasPorVerService } from '../services/peliculasPorVerService';
import { sesionesService } from '../services/sesionesService';
import type {
  PeliculaCandidata,
  PeliculaConDuracion,
  PeliculaEnSesion,
  SesionGuardada,
} from '../types/noche';

type EstadoCarga = 'cargando' | 'error' | 'ok';

interface Aviso {
  tipo: 'exito' | 'error';
  texto: string;
}

// Un campo vacío es «sin tiempo»; cualquier otro texto se convierte a número
function leerTiempo(texto: string): number | null {
  return texto.trim() === '' ? null : Number(texto);
}

function textoExito(nombre: string): string {
  const normalizado = normalizarNombreSesion(nombre);
  return normalizado === null ? 'Sesión guardada.' : `Sesión «${normalizado}» guardada.`;
}

export default function NocheDePelicula() {
  const [tiempoTexto, setTiempoTexto] = useState('');
  const [tiempoTocado, setTiempoTocado] = useState(false);
  const [estadoCarga, setEstadoCarga] = useState<EstadoCarga>('cargando');
  const [candidatas, setCandidatas] = useState<PeliculaCandidata[]>([]);
  const [intento, setIntento] = useState(0);
  const [sesion, setSesion] = useState<PeliculaEnSesion[]>([]);
  const [nombre, setNombre] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [aviso, setAviso] = useState<Aviso | null>(null);
  const [sesionesGuardadas, setSesionesGuardadas] = useState<SesionGuardada[]>([]);
  const [estadoSesiones, setEstadoSesiones] = useState<EstadoCarga>('cargando');
  const [intentoSesiones, setIntentoSesiones] = useState(0);
  const [avisoSesiones, setAvisoSesiones] = useState<string | null>(null);

  // Carga las películas «por ver» y la duración de cada una
  useEffect(() => {
    let activo = true;
    peliculasPorVerService
      .listar()
      .then(async (porVer) => {
        const duraciones = await duracionesService.obtener(porVer.map((pelicula) => pelicula.tmdbId));
        return { porVer, duraciones };
      })
      .then(({ porVer, duraciones }) => {
        if (!activo) return;
        setCandidatas(
          porVer.map((pelicula): PeliculaCandidata => {
            const resultado = duraciones.get(pelicula.tmdbId);
            return {
              ...pelicula,
              duracion: resultado?.estado === 'ok' ? resultado.minutos : null,
              consultaFallida: resultado === undefined || resultado.estado === 'error',
            };
          }),
        );
        setEstadoCarga('ok');
      })
      .catch(() => {
        if (activo) setEstadoCarga('error');
      });
    return () => {
      activo = false;
    };
  }, [intento]);

  // Carga las sesiones guardadas
  useEffect(() => {
    let activo = true;
    sesionesService
      .listar()
      .then((datos) => {
        if (!activo) return;
        setSesionesGuardadas(datos);
        setEstadoSesiones('ok');
      })
      .catch(() => {
        if (activo) setEstadoSesiones('error');
      });
    return () => {
      activo = false;
    };
  }, [intentoSesiones]);

  const tiempo = leerTiempo(tiempoTexto);
  const mensajeTiempo = validarTiempoDisponible(tiempo);
  const errorTiempo = tiempoTocado || tiempoTexto !== '' ? mensajeTiempo : null;
  const tiempoValido = tiempo !== null && mensajeTiempo === null ? tiempo : null;
  const clasificacion =
    tiempoValido !== null && estadoCarga === 'ok'
      ? clasificarPeliculas(tiempoValido, candidatas)
      : null;

  const reintentar = () => {
    setEstadoCarga('cargando');
    setIntento((n) => n + 1);
  };

  const duracionesSesion = sesion.map((pelicula) => pelicula.duracion);
  const evaluacion =
    tiempoValido !== null ? evaluarSesion(tiempoValido, duracionesSesion, PAUSA_MINUTOS) : null;

  const agregar = (pelicula: PeliculaConDuracion) => {
    if (tiempoValido === null) return;
    if (sesion.some((item) => item.tmdbId === pelicula.tmdbId)) return;
    if (!puedeAgregar(tiempoValido, duracionesSesion, pelicula.duracion, PAUSA_MINUTOS).cabe) return;
    setSesion([
      ...sesion,
      {
        tmdbId: pelicula.tmdbId,
        titulo: pelicula.titulo,
        posterUrl: pelicula.posterUrl,
        duracion: pelicula.duracion,
      },
    ]);
    setAviso(null);
  };

  const quitar = (tmdbId: number) => {
    setSesion(sesion.filter((item) => item.tmdbId !== tmdbId));
    setAviso(null);
  };

  const guardar = () => {
    if (tiempoValido === null || guardando) return;
    setGuardando(true);
    setAviso(null);
    sesionesService
      .guardar({ nombre, tiempoDisponible: tiempoValido, peliculas: sesion })
      .then((resultado) => {
        if (resultado.ok) {
          setAviso({ tipo: 'exito', texto: textoExito(nombre) });
          setSesion([]);
          setNombre('');
          setIntentoSesiones((n) => n + 1);
        } else if (resultado.motivo === 'nombre_invalido') {
          setAviso({ tipo: 'error', texto: resultado.mensaje });
        } else if (resultado.motivo === 'no_cabe') {
          setAviso({ tipo: 'error', texto: mensajeExceso(resultado.exceso) });
        } else {
          setAviso({
            tipo: 'error',
            texto: 'Agrega al menos una película para guardar la sesión.',
          });
        }
      })
      .catch(() => {
        setAviso({ tipo: 'error', texto: 'No se pudo guardar la sesión. Inténtalo de nuevo.' });
      })
      .finally(() => {
        setGuardando(false);
      });
  };

  const reintentarSesiones = () => {
    setEstadoSesiones('cargando');
    setIntentoSesiones((n) => n + 1);
  };

  const eliminarSesion = (id: string) => {
    setAvisoSesiones(null);
    sesionesService
      .eliminar(id)
      .then(() => {
        setSesionesGuardadas((anteriores) => anteriores.filter((item) => item.id !== id));
      })
      .catch(() => {
        setAvisoSesiones('No se pudo eliminar la sesión.');
      });
  };

  return (
    <main className="noche-de-pelicula">
      <h1>Noche de película</h1>
      <div className="row g-4">
        <div className="col-lg-4">
          <FormularioTiempo
            valor={tiempoTexto}
            error={errorTiempo}
            onCambio={(valor) => {
              setTiempoTexto(valor);
              setTiempoTocado(true);
            }}
            onSalir={() => setTiempoTocado(true)}
          />
          <PanelSesion
            tiempo={tiempoValido}
            peliculas={sesion}
            evaluacion={evaluacion}
            onQuitar={quitar}
            nombre={nombre}
            onNombre={setNombre}
            guardando={guardando}
            aviso={aviso}
            onGuardar={guardar}
          />
        </div>
        <div className="col-lg-8">
          <ListaCandidatas
            estado={estadoCarga}
            totalPorVer={candidatas.length}
            tiempo={tiempoValido}
            clasificacion={clasificacion}
            onReintentar={reintentar}
            duracionesSesion={duracionesSesion}
            idsEnSesion={sesion.map((item) => item.tmdbId)}
            onAgregar={agregar}
          />
        </div>
      </div>
      <section className="mt-5">
        <ListaSesionesGuardadas
          estado={estadoSesiones}
          sesiones={sesionesGuardadas}
          aviso={avisoSesiones}
          onReintentar={reintentarSesiones}
          onEliminar={eliminarSesion}
        />
      </section>
    </main>
  );
}
