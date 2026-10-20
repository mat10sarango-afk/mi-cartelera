import { useAuth } from '../context/useAuth';

export default function Navbar() {
  const { user, cerrarSesion } = useAuth();

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem' }}>
      <strong>Mi Cartelera Personal</strong>
      <div>
        <span>{user?.email} </span>
        <button onClick={cerrarSesion}>Cerrar sesión</button>
      </div>
    </header>
  );
}