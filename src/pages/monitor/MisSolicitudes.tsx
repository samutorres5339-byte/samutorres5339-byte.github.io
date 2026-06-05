// ============================================================
// PÁGINA: Mis Solicitudes (Monitor)
// Lista de todas las solicitudes enviadas o recibidas por el monitor
// ============================================================

import { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { solicitudesStore, usuariosStore, horariosStore, salasStore } from '../../data/store';
import type { SolicitudCambio } from '../../types';

type Filtro = 'todas' | 'enviadas' | 'recibidas';

export default function MisSolicitudes() {
  const { usuario } = useAuth();
  const [filtro, setFiltro] = useState<Filtro>('todas');

  const solicitudesRicas = useMemo(() => {
    if (!usuario) return [];
    return solicitudesStore.obtenerPorMonitor(usuario.id).map(s => ({
      ...s,
      solicitante:  usuariosStore.obtenerPorId(s.solicitanteId),
      reemplazante: usuariosStore.obtenerPorId(s.reemplazanteId),
      horario:      horariosStore.obtenerPorId(s.horarioId),
      sala:         (() => {
        const h = horariosStore.obtenerPorId(s.horarioId);
        return h ? salasStore.obtenerPorId(h.salaId) : undefined;
      })(),
      esEnviada: s.solicitanteId === usuario.id,
    }));
  }, [usuario]);

  const filtradas = useMemo(() => {
    if (filtro === 'enviadas')  return solicitudesRicas.filter(s => s.esEnviada);
    if (filtro === 'recibidas') return solicitudesRicas.filter(s => !s.esEnviada);
    return solicitudesRicas;
  }, [solicitudesRicas, filtro]);

  const conteos = {
    todas:    solicitudesRicas.length,
    enviadas: solicitudesRicas.filter(s => s.esEnviada).length,
    recibidas: solicitudesRicas.filter(s => !s.esEnviada).length,
  };

  const estadoConfig = (estado: SolicitudCambio['estado']) => ({
    pendiente: { emoji: '⏳', clase: 'badge-pendiente', texto: 'Pendiente' },
    aprobada:  { emoji: '✅', clase: 'badge-aprobada',  texto: 'Aprobada'  },
    rechazada: { emoji: '❌', clase: 'badge-rechazada', texto: 'Rechazada' },
  }[estado]);

  return (
    <>
      <div className="page-header">
        <div>
          <h2>Mis Solicitudes</h2>
          <p>Historial de solicitudes de cambio de turno</p>
        </div>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {([
          ['todas',    `Todas (${conteos.todas})`],
          ['enviadas', `📤 Enviadas (${conteos.enviadas})`],
          ['recibidas',`📥 Recibidas (${conteos.recibidas})`],
        ] as const).map(([val, label]) => (
          <button
            key={val}
            className={`btn btn-sm ${filtro === val ? 'btn-primario' : 'btn-secundario'}`}
            onClick={() => setFiltro(val)}
            aria-pressed={filtro === val}
          >
            {label}
          </button>
        ))}
      </div>

      {filtradas.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icono">🔄</div>
            <p>No tienes solicitudes {filtro !== 'todas' ? `"${filtro}"` : ''} aún.</p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filtradas.map(s => {
            const conf = estadoConfig(s.estado);
            return (
              <article key={s.id} className="card" style={{
                borderLeft: `4px solid ${
                  s.estado === 'pendiente' ? 'var(--color-advertencia)' :
                  s.estado === 'aprobada'  ? 'var(--color-exito)' :
                  'var(--color-peligro)'
                }`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    {/* Header de la tarjeta */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                      <span className={`badge ${conf.clase}`}>
                        {conf.emoji} {conf.texto}
                      </span>
                      <span style={{
                        fontSize: 11, fontWeight: 700, padding: '2px 8px',
                        borderRadius: 99, background: s.esEnviada ? '#eef2ff' : '#e6faf5',
                        color: s.esEnviada ? '#4f46e5' : '#007a5c',
                      }}>
                        {s.esEnviada ? '📤 Enviada' : '📥 Recibida'}
                      </span>
                      <span style={{ fontSize: 12, color: 'var(--color-texto-suave)' }}>{s.fecha}</span>
                    </div>

                    {/* Detalle */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14 }}>
                      <div>
                        <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-texto-suave)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 }}>
                          {s.esEnviada ? 'Reemplazante solicitado' : 'Solicitante'}
                        </p>
                        <p style={{ fontWeight: 600, fontSize: 14 }}>
                          {s.esEnviada ? s.reemplazante?.nombre : s.solicitante?.nombre}
                        </p>
                      </div>
                      <div>
                        <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-texto-suave)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 }}>Turno</p>
                        <p style={{ fontWeight: 600, fontSize: 14 }}>
                          {s.horario?.dia} {s.horario?.horaInicio}–{s.horario?.horaFin}
                        </p>
                        <p style={{ fontSize: 12, color: 'var(--color-texto-suave)' }}>{s.sala?.nombre}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-texto-suave)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 }}>Motivo</p>
                        <p style={{ fontSize: 13, fontStyle: 'italic', color: 'var(--color-texto)' }}>
                          "{s.motivo}"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}
