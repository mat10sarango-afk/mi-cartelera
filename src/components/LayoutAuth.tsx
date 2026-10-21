import type { ReactNode } from 'react';

interface Props {
  titulo: string;
  subtitulo: string;
  children: ReactNode;
}

export default function LayoutAuth({ titulo, subtitulo, children }: Props) {
  return (
    <main className="auth">
      <div className="auth-tarjeta">
        <div className="auth-marca">
          <div className="auth-logo" aria-hidden="true">
            🎬
          </div>
          <span className="auth-nombre">Mi Cartelera Personal</span>
          <h1>{titulo}</h1>
          <p>{subtitulo}</p>
        </div>

        {children}

        <p className="auth-seguridad">🔒 Tu lista es privada: solo tú puedes verla.</p>
      </div>
    </main>
  );
}