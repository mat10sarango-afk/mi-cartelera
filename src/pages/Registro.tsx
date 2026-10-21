import { useState, type SyntheticEvent } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/useAuth';
import LayoutAuth from '../components/LayoutAuth';

export default function Registro() {
  const { session, cargando } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  if (!cargando && session) return <Navigate to="/" replace />;

  const manejarEnvio = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setMensaje(null);
    setEnviando(true);
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
    } else if (!data.session) {
      setMensaje('Cuenta creada. Revisa tu correo para confirmarla y luego inicia sesión.');
    }
    setEnviando(false);
  };

  return (
    <LayoutAuth
      titulo="Crea tu cuenta"
      subtitulo="Guarda las películas y series que quieres ver"
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
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            minLength={6}
            required
          />
        </label>
        <button type="submit" disabled={enviando}>
          {enviando ? 'Creando...' : 'Registrarme'}
        </button>
      </form>
      {error && <p role="alert">{error}</p>}
      {mensaje && <p className="mensaje-ok">{mensaje}</p>}
      <p className="auth-pie">
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
      </p>
    </LayoutAuth>
  );
}