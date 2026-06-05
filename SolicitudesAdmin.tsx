// ============================================================
// PÁGINA: Gestión de Solicitudes (Admin)
// Aprobar o rechazar solicitudes de cambio de turno
// ============================================================

import { useState, useMemo } from 'react';
import { solicitudesStore, usuariosStore, horariosStore, salasStore } from '../../data/store';
import type { SolicitudCambio } from '../../types';

type Filtro = 'todos' | 'pendiente' | 'aprobada' | 'rechazada';

export default function SolicitudesAdmin() {
  const [solicitudes, setSolicitudes] = useState<SolicitudCambio[]>(solicitudesStore.obtenerTodas());
  const [filtro, setFiltro]           = useState<Filtro>('todos');

  const solicitudesFiltradas = useMemo(() =>
    filtro === 'todos' ? solicitudes : solicitudes.filter(s => s.estado === filtro),
    [solicitudes, filtro]);

  // Enriquece cada solicitud con nombres
  const solicitudesRicas = useMemo(() =>
    solicitudesFiltradas.map(s => ({
      ...s,
      solicitante:  usuariosStore.obtenerPorId(s.solicitanteId),
      reemplazante: usuariosStore.obtenerPorId(s.reemplazanteId),
      horario:      horariosStore.obtenerPorId(s.horarioId),
      sala:         (() => {
        const h = horariosStore.obtenerPorId(s.horarioId);
        return h ? salasStore.obtenerPorId(h.salaId) : undefined;
      })(),
    })), [solicitudesFiltradas]);

  const cambiarEstado = (id: string, estado: SolicitudCambio['estado']) => {
    solicitudesStore.cambiarEstado(id, estado);
    setSolicitudes(solicitudesStore.obtenerTodas());
  };

  const conteo = useMemo(() => ({
    todos:     solicitudes.length,
    pendiente: solicitudes.filter(s => s.estado === 'pendiente').length,
    aprobada:  solicitudes.filter(s => s.estado === 'aprobada').length,
    rechazada: solicitudes.filter(s => s.estado === 'rechazada').length,
  }), [solicitudes]);

  const FILTROS: { valor: Filtro; etiqueta: string }[] = [
    { valor: 'todos',     etiqueta: `Todos (${conteo.todos})`         },
    { valor: 'pendiente', etiqueta: `⏳ Pendientes (${conteo.pendiente})` },
    { valor: 'aprobada',  etiqueta: `✅ Aprobadas (${conteo.aprobada})`  },
    { valor: 'rechazada', etiqueta: `❌ Rechazadas (${conteo.rechazada})` },
  ];

  return (
    <>
      <div className="page-header">
        <div>
          <h2>Solicitudes de Cambio</h2>
          <p>Revisa y gestiona las solicitudes de cambio de turno</p>
        </div>
      </div>

      {/* Filtros de estado */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {FILTROS.map(({ valor, etiqueta }) => (
          <button
            key={valor}
            className={`btn btn-sm ${filtro === valor ? 'btn-primario' : 'btn-secundario'}`}
            onClick={() => setFiltro(valor)}
            aria-pressed={filtro === valor}
          >
            {etiqueta}
          </button>
        ))}
      </div>

      {solicitudesRicas.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icono">🔄</div>
            <p>No hay solicitudes {filtro !== 'todos' ? `con estado "${filtro}"` : ''}</p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {solicitudesRicas.map(s => (
            <article key={s.id} className="card" style={{
              borderLeft: `4px solid ${
                s.estado === 'pendiente'  ? 'var(--color-advertencia)' :
                s.estado === 'aprobada'   ? 'var(--color-exito)' :
                'var(--color-peligro)'
              }`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  {/* Encabezado */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <span className={`badge badge-${s.estado}`}>
                      {s.estado === 'pendiente' ? '⏳' : s.estado === 'aprobada' ? '✅' : '❌'} {s.estado}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--color-texto-suave)' }}>{s.fecha}</span>
                  </div>

                  {/* Detalle */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
                    <div>
                      <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-texto-suave)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Solicitante</p>
                      <p style={{ fontWeight: 600 }}>{s.solicitante?.nombre ?? '—'}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-texto-suave)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Reemplazante</p>
                      <p style={{ fontWeight: 600 }}>{s.reemplazante?.nombre ?? '—'}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-texto-suave)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Turno</p>
                      <p style={{ fontWeight: 600 }}>
                        {s.horario?.dia} {s.horario?.horaInicio}–{s.horario?.horaFin}
                      </p>
                      <p style={{ fontSize: 12, color: 'var(--color-texto-suave)' }}>{s.sala?.nombre}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-texto-suave)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Motivo</p>
                      <p style={{ fontSize: 14, fontStyle: 'italic' }}>"{s.motivo}"</p>
                    </div>
                  </div>
                </div>

                {/* Acciones (solo para pendientes) */}
                {s.estado === 'pendiente' && (
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                    <button
                      className="btn btn-acento btn-sm"
                      onClick={() => cambiarEstado(s.id, 'aprobada')}
                      aria-label="Aprobar solicitud"
                    >
                      ✅ Aprobar
                    </button>
                    <button
                      className="btn btn-peligro btn-sm"
                      onClick={() => cambiarEstado(s.id, 'rechazada')}
                      aria-label="Rechazar solicitud"
                    >
                      ❌ Rechazar
                    </button>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
