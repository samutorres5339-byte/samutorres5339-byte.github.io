// ============================================================
// COMPONENTE: Sidebar de navegación
// Muestra los enlaces según el rol del usuario autenticado
// ============================================================

import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  abierto: boolean;
  onCerrar: () => void;
}

// Rutas disponibles por rol
const navAdmin = [
  { a: '/admin/dashboard',    icono: '📊', texto: 'Dashboard'      },
  { a: '/admin/usuarios',     icono: '👥', texto: 'Usuarios'       },
  { a: '/admin/salas',        icono: '🖥️', texto: 'Salas'          },
  { a: '/admin/horarios',     icono: '📅', texto: 'Horarios'       },
  { a: '/admin/asignaciones', icono: '📌', texto: 'Asignaciones'   },
  { a: '/admin/solicitudes',  icono: '🔄', texto: 'Solicitudes'    },
];

const navMonitor = [
  { a: '/monitor/dashboard',  icono: '🏠', texto: 'Inicio'         },
  { a: '/monitor/horarios',   icono: '📅', texto: 'Mis Horarios'   },
  { a: '/monitor/solicitar',  icono: '🔄', texto: 'Pedir Cambio'   },
  { a: '/monitor/solicitudes',icono: '📋', texto: 'Mis Solicitudes'},
];

export default function Sidebar({ abierto, onCerrar }: SidebarProps) {
  const { usuario, logout, esAdmin } = useAuth();
  const enlaces = esAdmin ? navAdmin : navMonitor;

  // Obtiene las iniciales del nombre para el avatar
  const iniciales = usuario?.nombre
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('') ?? '?';

  return (
    <>
      {/* Overlay para cerrar en móvil al tocar fuera */}
      <div
        className={`sidebar-overlay ${abierto ? 'visible' : ''}`}
        onClick={onCerrar}
        aria-hidden="true"
      />

      <aside className={`sidebar ${abierto ? 'abierto' : ''}`} aria-label="Navegación principal">
        {/* Logo / branding */}
        <div className="sidebar-logo">
          <h1>GestorMonitor</h1>
          <span>{esAdmin ? 'Panel Admin' : 'Panel Monitor'}</span>
        </div>

        {/* Navegación */}
        <nav className="sidebar-nav" aria-label="Menú principal">
          <p className="sidebar-section-label">Menú</p>
          {enlaces.map(({ a, icono, texto }) => (
            <NavLink
              key={a}
              to={a}
              className={({ isActive }) => `sidebar-link ${isActive ? 'activo' : ''}`}
              onClick={onCerrar} // cierra el drawer en móvil al navegar
            >
              <span className="icono" aria-hidden="true">{icono}</span>
              {texto}
            </NavLink>
          ))}
        </nav>

        {/* Footer con info del usuario */}
        <div className="sidebar-footer">
          <div className="sidebar-usuario">
            <div className="avatar" aria-hidden="true">{iniciales}</div>
            <div className="usuario-info">
              <div className="usuario-nombre" title={usuario?.nombre}>{usuario?.nombre}</div>
              <div className="usuario-rol">{usuario?.rol}</div>
            </div>
          </div>
          <button className="btn btn-secundario btn-bloque btn-sm" onClick={logout}>
            🚪 Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  );
}
