// ============================================================
// PÁGINA: Mis Horarios (Monitor)
// Vista de todos los turnos asignados al monitor actual
// ============================================================

import { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { asignacionesStore, horariosStore, salasStore } from '../../data/store';

const ORDEN_DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export default function MisHorarios() {
  const { usuario } = useAuth();

  const turnos = useMemo(() => {
    if (!usuario) return [];
    return asignacionesStore
      .obtenerPorMonitor(usuario.id)
      .map(a => {
        const horario = horariosStore.obtenerPorId(a.horarioId);
        const sala    = horario ? salasStore.obtenerPorId(horario.salaId) : undefined;
        return { ...a, horario, sala };
      })
      // Ordena por día de la semana
      .sort((a, b) =>
        ORDEN_DIAS.indexOf(a.horario?.dia ?? '') - ORDEN_DIAS.indexOf(b.horario?.dia ?? '')
      );
  }, [usuario]);

  // Agrupa por día para el calendario semanal
  const turnosPorDia = useMemo(() =>
    ORDEN_DIAS.map(dia => ({
      dia,
      turnos: turnos.filter(t => t.horario?.dia === dia),
    })).filter(d => d.turnos.length > 0),
    [turnos]);

  return (
    <>
      <div className="page-header">
        <div>
          <h2>Mis Horarios</h2>
          <p>Vista completa de tus turnos asignados esta temporada</p>
        </div>
      </div>

      {turnos.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icono">📅</div>
            <p>No tienes turnos asignados aún.<br />El administrador te asignará horarios próximamente.</p>
          </div>
        </div>
      ) : (
        <>
          {/* Resumen rápido */}
          <div className="alerta alerta-info" style={{ marginBottom: 24 }}>
            📊 Tienes <strong>{turnos.length} turno{turnos.length !== 1 ? 's' : ''}</strong> asignado{turnos.length !== 1 ? 's' : ''} en {turnosPorDia.length} día{turnosPorDia.length !== 1 ? 's' : ''} de la semana.
          </div>

          {/* Calendario por día */}
          <div className="semana-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
            {ORDEN_DIAS.map(dia => {
              const turnosDia = turnos.filter(t => t.horario?.dia === dia);
              return (
                <div key={dia} className="dia-card" style={{ opacity: turnosDia.length === 0 ? 0.45 : 1 }}>
                  <div className="dia-header" style={{ background: turnosDia.length > 0 ? 'var(--color-primario)' : '#64748b' }}>
                    {dia} {turnosDia.length > 0 && <span style={{ float: 'right', fontSize: 11, opacity: 0.8 }}>{turnosDia.length} turno{turnosDia.length > 1 ? 's' : ''}</span>}
                  </div>
                  <div className="dia-body">
                    {turnosDia.length === 0 ? (
                      <p style={{ fontSize: 12, color: 'var(--color-texto-muy-suave)', textAlign: 'center', padding: '12px 0' }}>Sin turnos</p>
                    ) : (
                      turnosDia.map(t => (
                        <div key={t.id} className="turno-item">
                          <div className="turno-hora">{t.horario?.horaInicio} – {t.horario?.horaFin}</div>
                          <div className="turno-sala">🖥️ {t.sala?.nombre}</div>
                          <div style={{ fontSize: 11, color: 'var(--color-texto-muy-suave)', marginTop: 2 }}>📍 {t.sala?.ubicacion}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* También tabla detallada */}
          <div className="tabla-contenedor" style={{ marginTop: 28 }}>
            <div className="tabla-header">
              <h3 className="tabla-titulo">Detalle de turnos</h3>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table aria-label="Detalle de mis turnos">
                <thead>
                  <tr>
                    <th>Día</th>
                    <th>Horario</th>
                    <th>Sala</th>
                    <th>Ubicación</th>
                    <th>Asignado el</th>
                  </tr>
                </thead>
                <tbody>
                  {turnos.map(t => (
                    <tr key={t.id}>
                      <td><strong>{t.horario?.dia}</strong></td>
                      <td>
                        <code style={{ fontFamily: 'var(--fuente-mono)', fontSize: 13, background: 'var(--color-acento-suave)', padding: '2px 8px', borderRadius: 4, color: 'var(--color-acento-hover)' }}>
                          {t.horario?.horaInicio} – {t.horario?.horaFin}
                        </code>
                      </td>
                      <td>{t.sala?.nombre}</td>
                      <td>{t.sala?.ubicacion}</td>
                      <td style={{ color: 'var(--color-texto-suave)', fontSize: 13 }}>{t.fechaAsignacion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </>
  );
}
