// ============================================================
// PÁGINA: Dashboard del Monitor
// Vista principal del monitor: sus turnos y solicitudes recientes
// ============================================================

import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { asignacionesStore, horariosStore, salasStore, solicitudesStore } from '../../data/store';

export default function MonitorDashboard() {
  const { usuario } = useAuth();

  const resumen = useMemo(() => {
    if (!usuario) return { turnos: [], solicitudes: [] };
    const asignaciones = asignacionesStore.obtenerPorMonitor(usuario.id);
    const turnos = asignaciones.map(a => {
      const h = horariosStore.obtenerPorId(a.horarioId);
      const s = h ? salasStore.obtenerPorId(h.salaId) : undefined;
      return { ...a, horario: h, sala: s };
    });
    const solicitudes = solicitudesStore.obtenerPorMonitor(usuario.id);
    return { turnos, solicitudes };
  }, [usuario]);

  const pendientes = resumen.solicitudes.filter(s => s.estado === 'pendiente').length;

  return (
    <>
      <div className="page-header">
        <div>
          <h2>Hola, {usuario?.nombre.split(' ')[0]} 👋</h2>
          <p>Resumen de tus turnos — {new Date().toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
        {[
          { valor: resumen.turnos.length,     etiqueta: 'Turnos Asignados',    icono: '📌', color: '#eef2ff', iconoColor: '#4f46e5' },
          { valor: resumen.solicitudes.length, etiqueta: 'Solicitudes Enviadas', icono: '🔄', color: '#e6faf5', iconoColor: '#00a87e' },
          { valor: pendientes,                etiqueta: 'Solicitudes Pendientes', icono: '⏳', color: '#fef9ec', iconoColor: '#d68910' },
        ].map(({ valor, etiqueta, icono, color, iconoColor }) => (
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

      {/* Próximos turnos */}
      <div className="card" style={{ marginTop: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontWeight: 700, fontSize: 16 }}>Mis Turnos</h3>
          <Link to="/monitor/horarios" className="btn btn-secundario btn-sm">Ver todos →</Link>
        </div>
        {resumen.turnos.length === 0 ? (
          <div className="empty-state" style={{ padding: '30px 0' }}>
            <div className="empty-state-icono">📅</div>
            <p>No tienes turnos asignados aún</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {resumen.turnos.slice(0, 4).map(t => (
              <div key={t.id} style={{
                display: 'flex', alignItems: 'center', gap: 16, padding: '12px 16px',
                background: 'var(--color-fondo)', borderRadius: 'var(--radio-md)',
                border: '1.5px solid var(--color-borde)',
              }}>
                <div style={{ fontSize: 24 }}>📍</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{t.horario?.dia}</div>
                  <div style={{ fontSize: 13, color: 'var(--color-texto-suave)' }}>{t.sala?.nombre}</div>
                </div>
                <code style={{ fontFamily: 'var(--fuente-mono)', fontSize: 13, color: 'var(--color-primario)' }}>
                  {t.horario?.horaInicio} – {t.horario?.horaFin}
                </code>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Acceso rápido a solicitar cambio */}
      {resumen.turnos.length > 0 && (
        <div className="card" style={{ marginTop: 20, background: 'linear-gradient(135deg, var(--color-primario) 0%, #2558a0 100%)', border: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h3 style={{ fontWeight: 700, color: '#fff', marginBottom: 4 }}>¿Necesitas cambiar un turno?</h3>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14 }}>Envía una solicitud de cambio y el administrador la revisará.</p>
            </div>
            <Link to="/monitor/solicitar" className="btn btn-acento">
              🔄 Solicitar Cambio
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
