export type Estado = 'por_ver' | 'viendo' | 'vista';
export type TipoContenido = 'pelicula' | 'serie';

export interface ItemLista {
  id: number;
  user_id: string;
  tmdb_id: number;
  titulo: string;
  poster_url: string | null;
  tipo_contenido: TipoContenido;
  estado: Estado;
  calificacion_personal: number | null;
  comentario: string | null;
  fecha_agregado: string;
}