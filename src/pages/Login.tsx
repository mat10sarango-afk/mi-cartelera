import { useState, type SyntheticEvent } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/useAuth';

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
    <main>
      <h1>Iniciar sesión</h1>
      <form onSubmit={manejarEnvio}>
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={enviando}>
          {enviando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
      {error && <p role="alert">{error}</p>}
      <p>
        ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
      </p>
    </main>
  );
}