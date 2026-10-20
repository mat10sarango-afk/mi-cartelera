import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import Navbar from './Navbar';

export default function RutaProtegida() {
  const { session, cargando } = useAuth();

  if (cargando) return <p>Cargando...</p>;
  if (!session) return <Navigate to="/login" replace />;

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}