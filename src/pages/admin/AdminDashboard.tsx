// ============================================================
// PÁGINA: Dashboard del Administrador
// Muestra métricas generales del sistema en tarjetas de estadísticas
// ============================================================

import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usuariosStore } from '../../data/store';
import { salasStore } from '../../data/store';
import { horariosStore } from '../../data/store';
import { asignacionesStore } from '../../data/store';
import { solicitudesStore } from '../../data/store';

export default function AdminDashboard() {
  const { usuario } = useAuth();

  // Calcula métricas al montar (se recalcula si cambia el store)
  const metricas = useMemo(() => {
    const monitores    = usuariosStore.obtenerMonitores();
    const salas        = salasStore.obtenerTodas();
    const horarios     = horariosStore.obtenerTodos();
    const asignaciones = asignacionesStore.obtenerTodas();
    const solicitudes  = solicitudesStore.obtenerTodas();

    return {
      totalMonitores:     monitores.length,
      monitoresActivos:   monitores.filter(m => m.activo).length,
      totalSalas:         salas.length,
      totalHorarios:      horarios.length,
      horariosAsignados:  asignaciones.length,
      horariosLibres:     horarios.length - asignaciones.length,
      solicPendientes:    solicitudes.filter(s => s.estado === 'pendiente').length,
      solicAprobadas:     solicitudes.filter(s => s.estado === 'aprobada').length,
    };
  }, []);

  const stats = [
    { valor: metricas.monitoresActivos, etiqueta: 'Monitores Activos', icono: '👥', color: '#eef2ff', iconoColor: '#4f46e5' },
    { valor: metricas.totalSalas,       etiqueta: 'Salas de Cómputo',  icono: '🖥️', color: '#e6faf5', iconoColor: '#00a87e' },
    { valor: metricas.horariosAsignados,etiqueta: 'Turnos Asignados',  icono: '📌', color: '#fef9ec', iconoColor: '#d68910' },
    { valor: metricas.horariosLibres,   etiqueta: 'Horarios Libres',   icono: '🕐', color: '#fdecea', iconoColor: '#c0392b' },
    { valor: metricas.solicPendientes,  etiqueta: 'Solicitudes Pendientes', icono: '🔄', color: '#fff8f0', iconoColor: '#e67e22' },
    { valor: metricas.solicAprobadas,   etiqueta: 'Solicitudes Aprobadas',  icono: '✅', color: '#eafaf1', iconoColor: '#27ae60' },
  ];

  const accesosRapidos = [
    { a: '/admin/usuarios',     icono: '👥', texto: 'Gestionar Usuarios',   desc: 'Crear, editar y desactivar monitores' },
    { a: '/admin/salas',        icono: '🖥️', texto: 'Gestionar Salas',      desc: 'Administrar salas de cómputo' },
    { a: '/admin/asignaciones', icono: '📌', texto: 'Ver Asignaciones',     desc: 'Asignar monitores a horarios' },
    { a: '/admin/solicitudes',  icono: '🔄', texto: 'Revisar Solicitudes',  desc: `${metricas.solicPendientes} pendientes de aprobación` },
  ];

  return (
    <>
      {/* Saludo */}
      <div className="page-header">
        <div>
          <h2>Bienvenido, {usuario?.nombre.split(' ')[0]} 👋</h2>
          <p>Resumen del sistema — {new Date().toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="stats-grid">
        {stats.map(({ valor, etiqueta, icono, color, iconoColor }) => (
          <article className="stat-card" key={etiqueta}>
            <div className="stat-icono" style={{ background: color }}>
              <span style={{ color: iconoColor }}>{icono}</span>
            </div>
            <div className="stat-info">
              <div className="stat-valor">{valor}</div>
              <div className="stat-etiqueta">{etiqueta}</div>
            </div>
          </article>
        ))}
      </div>

      {/* Accesos rápidos */}
      <div className="card" style={{ marginTop: 8 }}>
        <h3 style={{ fontWeight: 700, marginBottom: 20, fontSize: 16 }}>Accesos Rápidos</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          {accesosRapidos.map(({ a, icono, texto, desc }) => (
            <Link
              key={a}
              to={a}
              style={{ textDecoration: 'none' }}
            >
              <div style={{
                padding: '16px',
                border: '1.5px solid var(--color-borde)',
                borderRadius: 'var(--radio-md)',
                transition: 'all 0.2s',
                cursor: 'pointer',
                background: 'var(--color-fondo)',
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--color-primario-claro)';
                  (e.currentTarget as HTMLDivElement).style.background = '#fff';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--color-borde)';
                  (e.currentTarget as HTMLDivElement).style.background = 'var(--color-fondo)';
                }}
              >
                <div style={{ fontSize: 24, marginBottom: 8 }}>{icono}</div>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--color-texto)' }}>{texto}</div>
                <div style={{ fontSize: 12, color: 'var(--color-texto-suave)', marginTop: 4 }}>{desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
