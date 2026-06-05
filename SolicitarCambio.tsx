// ============================================================
// PÁGINA: Solicitar Cambio de Turno (Monitor)
// Permite al monitor pedir que otro monitor cubra su turno
// ============================================================

import { useState, useMemo, type FormEvent } from 'react';
import { useAuth } from '../../context/AuthContext';
import { asignacionesStore, horariosStore, salasStore, usuariosStore, solicitudesStore } from '../../data/store';

export default function SolicitarCambio() {
  const { usuario } = useAuth();

  const [form, setForm]       = useState({ horarioId: '', reemplazanteId: '', motivo: '' });
  const [enviado, setEnviado] = useState(false);
  const [error, setError]     = useState('');
  const [errores, setErrores] = useState<Record<string, string>>({});

  // Turnos del monitor actual
  const misTurnos = useMemo(() => {
    if (!usuario) return [];
    return asignacionesStore.obtenerPorMonitor(usuario.id).map(a => {
      const h = horariosStore.obtenerPorId(a.horarioId);
      const s = h ? salasStore.obtenerPorId(h.salaId) : undefined;
      return { ...a, horario: h, sala: s };
    });
  }, [usuario]);

  // Otros monitores activos (excluyendo al solicitante)
  const otrosMonitores = useMemo(() =>
    usuariosStore.obtenerMonitores().filter(m => m.activo && m.id !== usuario?.id),
    [usuario]);

  const validar = () => {
    const e: Record<string, string> = {};
    if (!form.horarioId)      e.horarioId      = 'Selecciona el turno que quieres cambiar.';
    if (!form.reemplazanteId) e.reemplazanteId = 'Selecciona el monitor reemplazante.';
    if (!form.motivo.trim())  e.motivo         = 'El motivo es requerido.';
    if (form.motivo.trim().length < 10) e.motivo = 'El motivo debe tener al menos 10 caracteres.';
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validar() || !usuario) return;

    solicitudesStore.crear({
      solicitanteId:  usuario.id,
      reemplazanteId: form.reemplazanteId,
      horarioId:      form.horarioId,
      estado:         'pendiente',
      fecha:          new Date().toISOString().split('T')[0],
      motivo:         form.motivo.trim(),
    });

    setEnviado(true);
  };

  const reiniciar = () => {
    setForm({ horarioId: '', reemplazanteId: '', motivo: '' });
    setErrores({});
    setError('');
    setEnviado(false);
  };

  // Si no tiene turnos, muestra mensaje
  if (misTurnos.length === 0) {
    return (
      <>
        <div className="page-header">
          <div><h2>Solicitar Cambio de Turno</h2><p>No tienes turnos asignados para solicitar cambio</p></div>
        </div>
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icono">📅</div>
            <p>No puedes solicitar un cambio porque aún no tienes turnos asignados.</p>
          </div>
        </div>
      </>
    );
  }

  // Confirmación de envío
  if (enviado) {
    return (
      <>
        <div className="page-header">
          <div><h2>Solicitar Cambio de Turno</h2></div>
        </div>
        <div className="card" style={{ maxWidth: 520, textAlign: 'center', padding: 48 }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>✅</div>
          <h3 style={{ fontWeight: 700, fontSize: 20, marginBottom: 12 }}>¡Solicitud enviada!</h3>
          <p style={{ color: 'var(--color-texto-suave)', marginBottom: 28, lineHeight: 1.7 }}>
            Tu solicitud de cambio de turno ha sido enviada al administrador para su revisión.
            Te notificaremos cuando sea aprobada o rechazada.
          </p>
          <button className="btn btn-primario btn-bloque" onClick={reiniciar}>
            + Enviar otra solicitud
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h2>Solicitar Cambio de Turno</h2>
          <p>Selecciona tu turno y el monitor que podría cubrirte</p>
        </div>
      </div>

      <div style={{ maxWidth: 600 }}>
        <div className="card">
          {error && <div className="alerta alerta-error">⚠️ {error}</div>}

          <form onSubmit={handleSubmit} noValidate>

            {/* Selección de turno */}
            <div className="form-grupo">
              <label htmlFor="sc-horario">¿Qué turno quieres cambiar? *</label>
              <select id="sc-horario"
                className={`campo ${errores.horarioId ? 'campo-error' : ''}`}
                value={form.horarioId}
                onChange={e => {
                  setForm(p => ({ ...p, horarioId: e.target.value }));
                  if (errores.horarioId) setErrores(p => { const n = { ...p }; delete n.horarioId; return n; });
                }}
              >
                <option value="">— Selecciona tu turno —</option>
                {misTurnos.map(t => (
                  <option key={t.id} value={t.horarioId}>
                    {t.horario?.dia} {t.horario?.horaInicio}–{t.horario?.horaFin} — {t.sala?.nombre}
                  </option>
                ))}
              </select>
              {errores.horarioId && <p className="mensaje-error">{errores.horarioId}</p>}
            </div>

            {/* Selección de reemplazante */}
            <div className="form-grupo">
              <label htmlFor="sc-reemplazante">¿Quién te reemplazará? *</label>
              <select id="sc-reemplazante"
                className={`campo ${errores.reemplazanteId ? 'campo-error' : ''}`}
                value={form.reemplazanteId}
                onChange={e => {
                  setForm(p => ({ ...p, reemplazanteId: e.target.value }));
                  if (errores.reemplazanteId) setErrores(p => { const n = { ...p }; delete n.reemplazanteId; return n; });
                }}
              >
                <option value="">— Selecciona monitor reemplazante —</option>
                {otrosMonitores.map(m => (
                  <option key={m.id} value={m.id}>{m.nombre}</option>
                ))}
              </select>
              {errores.reemplazanteId && <p className="mensaje-error">{errores.reemplazanteId}</p>}
            </div>

            {/* Motivo */}
            <div className="form-grupo">
              <label htmlFor="sc-motivo">Motivo del cambio *</label>
              <textarea id="sc-motivo"
                className={`campo ${errores.motivo ? 'campo-error' : ''}`}
                rows={4}
                placeholder="Explica brevemente por qué necesitas el cambio de turno..."
                value={form.motivo}
                onChange={e => {
                  setForm(p => ({ ...p, motivo: e.target.value }));
                  if (errores.motivo) setErrores(p => { const n = { ...p }; delete n.motivo; return n; });
                }}
                style={{ resize: 'vertical' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                {errores.motivo
                  ? <p className="mensaje-error">{errores.motivo}</p>
                  : <span />
                }
                <span style={{ fontSize: 12, color: 'var(--color-texto-muy-suave)' }}>
                  {form.motivo.length} caracteres
                </span>
              </div>
            </div>

            {/* Aviso */}
            <div className="alerta alerta-info">
              ℹ️ Tu solicitud quedará en estado <strong>pendiente</strong> hasta que el administrador la revise.
            </div>

            <button type="submit" className="btn btn-primario btn-bloque btn-lg" style={{ marginTop: 8 }}>
              🔄 Enviar Solicitud
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
