import { useState, type SyntheticEvent } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/useAuth';
import LayoutAuth from '../components/LayoutAuth';

export default function Login() {
  const { session, cargando } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  if (!cargando && session) return <Navigate to="/" replace />;

  const manejarEnvio = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setEnviando(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setEnviando(false);
  };

  return (
    <LayoutAuth
      titulo="Bienvenido de nuevo"
      subtitulo="Inicia sesión para ver tu cartelera personal"
    >
      <form onSubmit={manejarEnvio}>
        <label>
          Correo
          <input
            type="email"
            placeholder="tucorreo@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </label>
        <label>
          Contraseña
          <input
            type="password"
            placeholder="Tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>
        <button type="submit" disabled={enviando}>
          {enviando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
      {error && <p role="alert">{error}</p>}
      <p className="auth-pie">
        ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
      </p>
    </LayoutAuth>
  );
}