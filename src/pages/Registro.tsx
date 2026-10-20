import { useState, type SyntheticEvent } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/useAuth';

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
    <main>
      <h1>Crear cuenta</h1>
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
          placeholder="Contraseña (mínimo 6 caracteres)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
        />
        <button type="submit" disabled={enviando}>
          {enviando ? 'Creando...' : 'Registrarme'}
        </button>
      </form>
      {error && <p role="alert">{error}</p>}
      {mensaje && <p>{mensaje}</p>}
      <p>
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
      </p>
    </main>
  );
}