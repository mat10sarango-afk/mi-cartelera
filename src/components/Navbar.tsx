import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export default function Navbar() {
  const { user, cerrarSesion } = useAuth();

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
      <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <strong>🎬 GoldenMovies</strong>
        <NavLink to="/">Buscar</NavLink>
        <NavLink to="/mi-lista">Mi lista</NavLink>
      </nav>
      <div>
        <span>{user?.email} </span>
        <button onClick={cerrarSesion}>Cerrar sesión</button>
      </div>
    </header>
  );
}