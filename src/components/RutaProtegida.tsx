// ============================================================
// COMPONENTE: Ruta protegida
// Redirige a login si no hay sesión activa
// También redirige si el rol requerido no coincide
// ============================================================

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Rol } from '../types';

interface Props {
  rolRequerido?: Rol;
  children: React.ReactNode;
}

export default function RutaProtegida({ rolRequerido, children }: Props) {
  const { usuario, cargando } = useAuth();

  // Mientras carga la sesión, no renderiza nada
  if (cargando) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
        <p style={{ color: 'var(--color-texto-suave)' }}>Cargando...</p>
      </div>
    );
  }

  // No autenticado → login
  if (!usuario) return <Navigate to="/login" replace />;

  // Rol incorrecto → su dashboard correspondiente
  if (rolRequerido && usuario.rol !== rolRequerido) {
    return <Navigate to={`/${usuario.rol}/dashboard`} replace />;
  }

  return <>{children}</>;
}
