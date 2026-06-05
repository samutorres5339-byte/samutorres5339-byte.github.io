// ============================================================
// PÁGINA: Gestión de Asignaciones (Admin)
// Asignar monitores a horarios disponibles
// ============================================================

import { useState, useMemo, type FormEvent } from 'react';
import Modal from '../../components/Modal';
import { asignacionesStore, horariosStore, usuariosStore, salasStore, generarId } from '../../data/store';
import type { Asignacion } from '../../types';

export default function Asignaciones() {
  const [asignaciones, setAsignaciones] = useState<Asignacion[]>(asignacionesStore.obtenerTodas());
  const [modalAbierto, setModal]        = useState(false);
  const [form, setForm] = useState({ monitorId: '', horarioId: '', fechaAsignacion: new Date().toISOString().split('T')[0] });
  const [error, setError] = useState('');

  // Datos auxiliares
  const monitores = usuariosStore.obtenerMonitores().filter(m => m.activo);
  const horarios  = horariosStore.obtenerTodos();
  const salas     = salasStore.obtenerTodas();

  // Solo horarios sin asignación activa
  const horariosDisponibles = useMemo(() =>
    horarios.filter(h => asignacionesStore.horarioDisponible(h.id)),
    [asignaciones] // eslint-disable-line
  );

  // Enriquece asignaciones con datos de monitor y horario para mostrar
  const asignacionesRicas = useMemo(() =>
    asignaciones.map(a => {
      const monitor = usuariosStore.obtenerPorId(a.monitorId);
      const horario = horariosStore.obtenerPorId(a.horarioId);
      const sala    = horario ? salasStore.obtenerPorId(horario.salaId) : undefined;
      return { ...a, monitor, horario, sala };
    }), [asignaciones]);

  const guardar = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.monitorId || !form.horarioId) {
      setError('Selecciona un monitor y un horario.');
      return;
    }
    const nueva = asignacionesStore.crear({
      monitorId: form.monitorId,
      horarioId: form.horarioId,
      fechaAsignacion: form.fechaAsignacion,
    });
    if (!nueva) {
      setError('Este horario ya tiene un monitor asignado.');
      return;
    }
    setAsignaciones(asignacionesStore.obtenerTodas());
    setModal(false);
    setForm({ monitorId: '', horarioId: '', fechaAsignacion: new Date().toISOString().split('T')[0] });
  };

  const eliminar = (id: string) => {
    if (!confirm('¿Eliminar esta asignación?')) return;
    asignacionesStore.eliminar(id);
    setAsignaciones(asignacionesStore.obtenerTodas());
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h2>Asignaciones</h2>
          <p>Asigna monitores a los horarios disponibles</p>
        </div>
        <button
          className="btn btn-primario"
          onClick={() => { setError(''); setModal(true); }}
          disabled={horariosDisponibles.length === 0 || monitores.length === 0}
          title={horariosDisponibles.length === 0 ? 'No hay horarios disponibles' : ''}
        >
          + Nueva Asignación
        </button>
      </div>

      {horariosDisponibles.length === 0 && (
        <div className="alerta alerta-info">
          ℹ️ Todos los horarios están asignados. Elimina una asignación existente para liberar un horario.
        </div>
      )}

      <div className="tabla-contenedor">
        <div className="tabla-header">
          <h3 className="tabla-titulo">Asignaciones activas ({asignaciones.length})</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table aria-label="Lista de asignaciones">
            <thead>
              <tr>
                <th>Monitor</th>
                <th>Día</th>
                <th>Horario</th>
                <th>Sala</th>
                <th>Fecha Asignación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {asignacionesRicas.length === 0 ? (
                <tr><td colSpan={6}>
                  <div className="empty-state">
                    <div className="empty-state-icono">📌</div>
                    <p>No hay asignaciones registradas</p>
                  </div>
                </td></tr>
              ) : (
                asignacionesRicas.map(a => (
                  <tr key={a.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="avatar" style={{ width: 30, height: 30, fontSize: 11 }}>
                          {a.monitor?.nombre.split(' ').slice(0,2).map(n => n[0]).join('')}
                        </div>
                        {a.monitor?.nombre ?? '—'}
                      </div>
                    </td>
                    <td>{a.horario?.dia ?? '—'}</td>
                    <td>
                      <code style={{ fontFamily: 'var(--fuente-mono)', fontSize: 13, background: 'var(--color-acento-suave)', padding: '2px 8px', borderRadius: 4 }}>
                        {a.horario?.horaInicio} – {a.horario?.horaFin}
                      </code>
                    </td>
                    <td>{a.sala?.nombre ?? '—'}</td>
                    <td>{a.fechaAsignacion}</td>
                    <td>
                      <button className="btn btn-peligro btn-sm" onClick={() => eliminar(a.id)} aria-label="Eliminar asignación">
                        🗑️ Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal abierto={modalAbierto} titulo="Nueva Asignación" onCerrar={() => setModal(false)}>
        <form onSubmit={guardar} noValidate>
          {error && <div className="alerta alerta-error">⚠️ {error}</div>}

          <div className="form-grupo">
            <label htmlFor="a-monitor">Monitor *</label>
            <select id="a-monitor" className="campo" value={form.monitorId}
              onChange={e => setForm(prev => ({ ...prev, monitorId: e.target.value }))}>
              <option value="">— Selecciona monitor —</option>
              {monitores.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
            </select>
          </div>

          <div className="form-grupo">
            <label htmlFor="a-horario">Horario disponible *</label>
            <select id="a-horario" className="campo" value={form.horarioId}
              onChange={e => setForm(prev => ({ ...prev, horarioId: e.target.value }))}>
              <option value="">— Selecciona horario —</option>
              {horariosDisponibles.map(h => {
                const sala = salas.find(s => s.id === h.salaId);
                return (
                  <option key={h.id} value={h.id}>
                    {h.dia} {h.horaInicio}–{h.horaFin} — {sala?.nombre}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="form-grupo">
            <label htmlFor="a-fecha">Fecha de asignación</label>
            <input id="a-fecha" type="date" className="campo" value={form.fechaAsignacion}
              onChange={e => setForm(prev => ({ ...prev, fechaAsignacion: e.target.value }))} />
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" className="btn btn-primario btn-bloque">📌 Asignar</button>
            <button type="button" className="btn btn-secundario" onClick={() => setModal(false)}>Cancelar</button>
          </div>
        </form>
      </Modal>
    </>
  );
}
