import Buscador from '../components/Buscador';
import Explorador from '../components/Explorador';

export default function Inicio() {
  return (
    <main>
      <h1>Buscar títulos</h1>
      <p className="subtitulo">
        Encuentra películas y series, o explora las novedades y las más taquilleras.
      </p>
      <Buscador />
      <Explorador />
    </main>
  );
}