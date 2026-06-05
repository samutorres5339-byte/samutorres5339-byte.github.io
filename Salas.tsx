// ============================================================
// PÁGINA: Gestión de Salas (Admin)
// ============================================================

import { useState, useMemo, type FormEvent } from 'react';
import Modal from '../../components/Modal';
import { salasStore, generarId } from '../../data/store';
import type { Sala } from '../../types';

const FORM_VACIO: Omit<Sala, 'id'> = {
  nombre: '', descripcion: '', capacidad: 30, ubicacion: '',
};

export default function Salas() {
  const [salas, setSalas]         = useState<Sala[]>(salasStore.obtenerTodas());
  const [busqueda, setBusqueda]   = useState('');
  const [modalAbierto, setModal]  = useState(false);
  const [editando, setEditando]   = useState<Sala | null>(null);
  const [form, setForm]           = useState<Omit<Sala, 'id'>>(FORM_VACIO);
  const [errores, setErrores]     = useState<Record<string, string>>({});

  const salasFiltradas = useMemo(() =>
    salas.filter(s =>
      s.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      s.ubicacion.toLowerCase().includes(busqueda.toLowerCase())
    ), [salas, busqueda]);

  const abrirCrear = () => {
    setEditando(null); setForm(FORM_VACIO); setErrores({}); setModal(true);
  };

  const abrirEditar = (s: Sala) => {
    setEditando(s);
    setForm({ nombre: s.nombre, descripcion: s.descripcion, capacidad: s.capacidad, ubicacion: s.ubicacion });
    setErrores({}); setModal(true);
  };

  const validar = () => {
    const e: Record<string, string> = {};
    if (!form.nombre.trim())    e.nombre    = 'El nombre es requerido.';
    if (!form.ubicacion.trim()) e.ubicacion = 'La ubicación es requerida.';
    if (form.capacidad < 1)     e.capacidad = 'La capacidad debe ser mayor a 0.';
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const guardar = (e: FormEvent) => {
    e.preventDefault();
    if (!validar()) return;
    if (editando) {
      salasStore.actualizar(editando.id, form);
    } else {
      salasStore.crear({ ...form, id: generarId() } as any);
    }
    setSalas(salasStore.obtenerTodas());
    setModal(false);
  };

  const eliminar = (id: string) => {
    if (!confirm('¿Eliminar esta sala? Los horarios asociados quedarán sin sala.')) return;
    salasStore.eliminar(id);
    setSalas(salasStore.obtenerTodas());
  };

  const cambio = (campo: keyof Omit<Sala, 'id'>, valor: string | number) => {
    setForm(prev => ({ ...prev, [campo]: valor }));
    if (errores[campo]) setErrores(prev => { const n = { ...prev }; delete n[campo]; return n; });
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h2>Gestión de Salas</h2>
          <p>Administra las salas de cómputo disponibles</p>
        </div>
        <button className="btn btn-primario" onClick={abrirCrear}>+ Nueva Sala</button>
      </div>

      {/* Tarjetas de salas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20, marginBottom: 28 }}>
        {salasFiltradas.map(s => (
          <article key={s.id} className="card" style={{ position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <span style={{ fontSize: 28 }}>🖥️</span>
              <div className="acciones-tabla">
                <button className="btn btn-secundario btn-sm" onClick={() => abrirEditar(s)} aria-label={`Editar ${s.nombre}`}>✏️</button>
                <button className="btn btn-peligro btn-sm" onClick={() => eliminar(s.id)} aria-label={`Eliminar ${s.nombre}`}>🗑️</button>
              </div>
            </div>
            <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{s.nombre}</h3>
            <p style={{ fontSize: 13, color: 'var(--color-texto-suave)', marginBottom: 12, lineHeight: 1.5 }}>{s.descripcion}</p>
            <div style={{ display: 'flex', gap: 16, fontSize: 13 }}>
              <span>📍 {s.ubicacion}</span>
              <span>👥 {s.capacidad} equipos</span>
            </div>
          </article>
        ))}
      </div>

      {/* También tabla */}
      <div className="tabla-contenedor">
        <div className="tabla-header">
          <h3 className="tabla-titulo">Todas las salas ({salasFiltradas.length})</h3>
          <div className="buscador-contenedor" style={{ minWidth: 240 }}>
            <span className="buscador-icono">🔍</span>
            <input type="search" className="campo" placeholder="Buscar sala..." value={busqueda}
              onChange={e => setBusqueda(e.target.value)} aria-label="Buscar salas" style={{ paddingLeft: 38 }} />
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table aria-label="Lista de salas">
            <thead>
              <tr>
                <th>Nombre</th><th>Ubicación</th><th>Capacidad</th><th>Descripción</th><th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {salasFiltradas.length === 0 ? (
                <tr><td colSpan={5}><div className="empty-state"><div className="empty-state-icono">🖥️</div><p>No hay salas</p></div></td></tr>
              ) : salasFiltradas.map(s => (
                <tr key={s.id}>
                  <td><strong>{s.nombre}</strong></td>
                  <td>{s.ubicacion}</td>
                  <td>{s.capacidad} equipos</td>
                  <td style={{ maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.descripcion}</td>
                  <td>
                    <div className="acciones-tabla">
                      <button className="btn btn-secundario btn-sm" onClick={() => abrirEditar(s)}>✏️ Editar</button>
                      <button className="btn btn-peligro btn-sm" onClick={() => eliminar(s.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal abierto={modalAbierto} titulo={editando ? 'Editar Sala' : 'Nueva Sala'} onCerrar={() => setModal(false)}>
        <form onSubmit={guardar} noValidate>
          <div className="form-grupo">
            <label htmlFor="s-nombre">Nombre *</label>
            <input id="s-nombre" type="text" className={`campo ${errores.nombre ? 'campo-error' : ''}`}
              value={form.nombre} onChange={e => cambio('nombre', e.target.value)} placeholder="Ej: Sala 101" />
            {errores.nombre && <p className="mensaje-error">{errores.nombre}</p>}
          </div>
          <div className="form-grupo">
            <label htmlFor="s-ubicacion">Ubicación *</label>
            <input id="s-ubicacion" type="text" className={`campo ${errores.ubicacion ? 'campo-error' : ''}`}
              value={form.ubicacion} onChange={e => cambio('ubicacion', e.target.value)} placeholder="Ej: Bloque A - Piso 1" />
            {errores.ubicacion && <p className="mensaje-error">{errores.ubicacion}</p>}
          </div>
          <div className="form-grupo">
            <label htmlFor="s-capacidad">Capacidad (equipos) *</label>
            <input id="s-capacidad" type="number" min={1} max={100} className={`campo ${errores.capacidad ? 'campo-error' : ''}`}
              value={form.capacidad} onChange={e => cambio('capacidad', Number(e.target.value))} />
            {errores.capacidad && <p className="mensaje-error">{errores.capacidad}</p>}
          </div>
          <div className="form-grupo">
            <label htmlFor="s-desc">Descripción</label>
            <textarea id="s-desc" className="campo" rows={3}
              value={form.descripcion} onChange={e => cambio('descripcion', e.target.value)}
              placeholder="Descripción opcional de la sala..." style={{ resize: 'vertical' }} />
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
