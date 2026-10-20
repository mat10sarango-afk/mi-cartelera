import { createContext } from 'react';
import type { Session, User } from '@supabase/supabase-js';

export interface AuthContextValue {
  session: Session | null;
  user: User | null;
  cargando: boolean;
  cerrarSesion: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);