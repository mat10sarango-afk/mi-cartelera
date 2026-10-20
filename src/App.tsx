import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Inicio from './pages/Inicio';
import RutaProtegida from './components/RutaProtegida';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route element={<RutaProtegida />}>
        <Route path="/" element={<Inicio />} />
      </Route>
    </Routes>
  );
}