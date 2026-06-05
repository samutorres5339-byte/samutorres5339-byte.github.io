// ============================================================
// PÁGINA: Gestión de Horarios (Admin)
// ============================================================

import { useState, useMemo, type FormEvent } from 'react';
import Modal from '../../components/Modal';
import { horariosStore, salasStore, generarId } from '../../data/store';
import type { Horario, DiaSemana } from '../../types';

const DIAS: DiaSemana[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

const FORM_VACIO: Omit<Horario, 'id'> = {
  dia: 'Lunes', horaInicio: '07:00', horaFin: '09:00', salaId: '',
};

export default function Horarios() {
  const salas = salasStore.obtenerTodas();
  const [horarios, setHorarios]   = useState<Horario[]>(horariosStore.obtenerTodos());
  const [filtroDia, setFiltroDia] = useState<DiaSemana | 'Todos'>('Todos');
  const [modalAbierto, setModal]  = useState(false);
  const [editando, setEditando]   = useState<Horario | null>(null);
  const [form, setForm]           = useState<Omit<Horario, 'id'>>({ ...FORM_VACIO, salaId: salas[0]?.id ?? '' });
  const [errores, setErrores]     = useState<Record<string, string>>({});

  // Agrupa horarios por día para la vista de semana
  const horariosPorDia = useMemo(() => {
    const diasFiltrados = filtroDia === 'Todos' ? DIAS : [filtroDia];
    return diasFiltrados.map(dia => ({
      dia,
      horarios: horarios.filter(h => h.dia === dia).sort((a, b) => a.horaInicio.localeCompare(b.horaInicio)),
    }));
  }, [horarios, filtroDia]);

  const abrirCrear = () => {
    setEditando(null);
    setForm({ ...FORM_VACIO, salaId: salas[0]?.id ?? '' });
    setErrores({}); setModal(true);
  };

  const abrirEditar = (h: Horario) => {
    setEditando(h);
    setForm({ dia: h.dia, horaInicio: h.horaInicio, horaFin: h.horaFin, salaId: h.salaId });
    setErrores({}); setModal(true);
  };

  const validar = () => {
    const e: Record<string, string> = {};
    if (!form.salaId)                        e.salaId = 'Selecciona una sala.';
    if (form.horaFin <= form.horaInicio)     e.horaFin = 'La hora de fin debe ser después del inicio.';
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const guardar = (e: FormEvent) => {
    e.preventDefault();
    if (!validar()) return;
    if (editando) {
      horariosStore.actualizar(editando.id, form);
    } else {
      horariosStore.crear({ ...form, id: generarId() } as any);
    }
    setHorarios(horariosStore.obtenerTodos());
    setModal(false);
  };

  const eliminar = (id: string) => {
    if (!confirm('¿Eliminar este horario?')) return;
    horariosStore.eliminar(id);
    setHorarios(horariosStore.obtenerTodos());
  };

  const cambio = (campo: keyof Omit<Horario, 'id'>, valor: string) => {
    setForm(prev => ({ ...prev, [campo]: valor }));
    if (errores[campo]) setErrores(prev => { const n = { ...prev }; delete n[campo]; return n; });
  };

  const nombreSala = (salaId: string) => salas.find(s => s.id === salaId)?.nombre ?? '—';

  return (
    <>
      <div className="page-header">
        <div>
          <h2>Gestión de Horarios</h2>
          <p>Define los turnos disponibles por día y sala</p>
        </div>
        <button className="btn btn-primario" onClick={abrirCrear}>+ Nuevo Horario</button>
      </div>

      {/* Filtro por día */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {(['Todos', ...DIAS] as const).map(d => (
          <button
            key={d}
            className={`btn btn-sm ${filtroDia === d ? 'btn-primario' : 'btn-secundario'}`}
            onClick={() => setFiltroDia(d)}
            aria-pressed={filtroDia === d}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Vista de semana por día */}
      <div className="semana-grid">
        {horariosPorDia.map(({ dia, horarios: hDia }) => (
          <div key={dia} className="dia-card">
            <div className="dia-header">{dia}</div>
            <div className="dia-body">
              {hDia.length === 0 ? (
                <p style={{ fontSize: 12, color: 'var(--color-texto-muy-suave)', textAlign: 'center', padding: '12px 0' }}>Sin horarios</p>
              ) : (
                hDia.map(h => (
                  <div key={h.id} className="turno-item" style={{ cursor: 'pointer' }} onClick={() => abrirEditar(h)}>
                    <div className="turno-hora">{h.horaInicio} – {h.horaFin}</div>
                    <div className="turno-sala">{nombreSala(h.salaId)}</div>
                    <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
                      <button className="btn btn-secundario btn-sm"
                        onClick={e => { e.stopPropagation(); abrirEditar(h); }}
                        aria-label={`Editar horario ${h.horaInicio}`} style={{ padding: '2px 8px', fontSize: 11 }}>✏️</button>
                      <button className="btn btn-peligro btn-sm"
                        onClick={e => { e.stopPropagation(); eliminar(h.id); }}
                        aria-label={`Eliminar horario ${h.horaInicio}`} style={{ padding: '2px 8px', fontSize: 11 }}>🗑️</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      <Modal abierto={modalAbierto} titulo={editando ? 'Editar Horario' : 'Nuevo Horario'} onCerrar={() => setModal(false)}>
        <form onSubmit={guardar} noValidate>
          <div className="form-grupo">
            <label htmlFor="h-dia">Día *</label>
            <select id="h-dia" className="campo" value={form.dia} onChange={e => cambio('dia', e.target.value)}>
              {DIAS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-grupo">
              <label htmlFor="h-inicio">Hora inicio *</label>
              <input id="h-inicio" type="time" className="campo" value={form.horaInicio}
                onChange={e => cambio('horaInicio', e.target.value)} />
            </div>
            <div className="form-grupo">
              <label htmlFor="h-fin">Hora fin *</label>
              <input id="h-fin" type="time" className={`campo ${errores.horaFin ? 'campo-error' : ''}`}
                value={form.horaFin} onChange={e => cambio('horaFin', e.target.value)} />
              {errores.horaFin && <p className="mensaje-error">{errores.horaFin}</p>}
            </div>
          </div>
          <div className="form-grupo">
            <label htmlFor="h-sala">Sala *</label>
            <select id="h-sala" className={`campo ${errores.salaId ? 'campo-error' : ''}`}
              value={form.salaId} onChange={e => cambio('salaId', e.target.value)}>
              <option value="">— Selecciona sala —</option>
              {salas.map(s => <option key={s.id} value={s.id}>{s.nombre} — {s.ubicacion}</option>)}
            </select>
            {errores.salaId && <p className="mensaje-error">{errores.salaId}</p>}
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" className="btn btn-primario btn-bloque">{editando ? '💾 Guardar' : '➕ Crear'}</button>
            <button type="button" className="btn btn-secundario" onClick={() => setModal(false)}>Cancelar</button>
          </div>
        </form>
      </Modal>
    </>
  );
}
