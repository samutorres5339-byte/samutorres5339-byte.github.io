// ============================================================
// APP.TSX — Configuración de rutas con React Router
// ============================================================

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import RutaProtegida from './components/RutaProtegida';
import Layout from './components/Layout';

// Páginas públicas
import Login from './pages/Login';

// Páginas Admin
import AdminDashboard   from './pages/admin/AdminDashboard';
import Usuarios         from './pages/admin/Usuarios';
import Salas            from './pages/admin/Salas';
import Horarios         from './pages/admin/Horarios';
import Asignaciones     from './pages/admin/Asignaciones';
import SolicitudesAdmin from './pages/admin/SolicitudesAdmin';

// Páginas Monitor
import MonitorDashboard from './pages/monitor/MonitorDashboard';
import MisHorarios      from './pages/monitor/MisHorarios';
import SolicitarCambio  from './pages/monitor/SolicitarCambio';
import MisSolicitudes   from './pages/monitor/MisSolicitudes';

/** Redirige a la ruta correcta según el rol del usuario autenticado */
function RedireccionInicial() {
  const { usuario, cargando } = useAuth();
  if (cargando) return null;
  if (!usuario) return <Navigate to="/login" replace />;
  return <Navigate to={`/${usuario.rol}/dashboard`} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Ruta raíz → redirige según sesión */}
          <Route path="/" element={<RedireccionInicial />} />

          {/* Login público */}
          <Route path="/login" element={<Login />} />

          {/* ─── Rutas de Administrador ─────────────────────── */}
          <Route
            path="/admin"
            element={
              <RutaProtegida rolRequerido="admin">
                <Layout />
              </RutaProtegida>
            }
          >
            <Route path="dashboard"   element={<AdminDashboard />}   />
            <Route path="usuarios"    element={<Usuarios />}         />
            <Route path="salas"       element={<Salas />}            />
            <Route path="horarios"    element={<Horarios />}         />
            <Route path="asignaciones" element={<Asignaciones />}    />
            <Route path="solicitudes" element={<SolicitudesAdmin />} />
            {/* Redirige /admin a /admin/dashboard */}
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>

          {/* ─── Rutas de Monitor ───────────────────────────── */}
          <Route
            path="/monitor"
            element={
              <RutaProtegida rolRequerido="monitor">
                <Layout />
              </RutaProtegida>
            }
          >
            <Route path="dashboard"   element={<MonitorDashboard />} />
            <Route path="horarios"    element={<MisHorarios />}      />
            <Route path="solicitar"   element={<SolicitarCambio />}  />
            <Route path="solicitudes" element={<MisSolicitudes />}   />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>

          {/* Cualquier ruta no encontrada → inicio */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
