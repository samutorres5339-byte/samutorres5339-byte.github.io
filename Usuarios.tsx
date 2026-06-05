// ============================================================
// PÁGINA: Gestión de Usuarios (Admin)
// CRUD completo de monitores y administradores
// ============================================================

import { useState, useMemo, type FormEvent } from 'react';
import Modal from '../../components/Modal';
import { usuariosStore, generarId } from '../../data/store';
import type { Usuario, Rol } from '../../types';

// Estado vacío para el formulario
const FORM_VACIO: Omit<Usuario, 'id'> = {
  nombre: '', cedula: '', email: '', rol: 'monitor', password: '', activo: true,
};

export default function Usuarios() {
  const [usuarios, setUsuarios]     = useState<Usuario[]>(usuariosStore.obtenerTodos());
  const [busqueda, setBusqueda]     = useState('');
  const [modalAbierto, setModal]    = useState(false);
  const [editando, setEditando]     = useState<Usuario | null>(null);
  const [form, setForm]             = useState<Omit<Usuario, 'id'>>(FORM_VACIO);
  const [errores, setErrores]       = useState<Record<string, string>>({});

  // Filtra usuarios según la búsqueda
  const usuariosFiltrados = useMemo(() =>
    usuarios.filter(u =>
      u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.email.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.cedula.includes(busqueda)
    ), [usuarios, busqueda]);

  const abrirCrear = () => {
    setEditando(null);
    setForm(FORM_VACIO);
    setErrores({});
    setModal(true);
  };

  const abrirEditar = (u: Usuario) => {
    setEditando(u);
    setForm({ nombre: u.nombre, cedula: u.cedula, email: u.email, rol: u.rol, password: u.password, activo: u.activo });
    setErrores({});
    setModal(true);
  };

  /** Validación básica del formulario */
  const validar = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.nombre.trim())   e.nombre   = 'El nombre es requerido.';
    if (!form.cedula.trim())   e.cedula   = 'La cédula es requerida.';
    if (!form.email.trim())    e.email    = 'El email es requerido.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email inválido.';
    if (!editando && !form.password.trim()) e.password = 'La contraseña es requerida.';
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const guardar = (e: FormEvent) => {
    e.preventDefault();
    if (!validar()) return;

    if (editando) {
      usuariosStore.actualizar(editando.id, form);
    } else {
      usuariosStore.crear({ ...form, id: generarId() } as any);
    }
    setUsuarios(usuariosStore.obtenerTodos());
    setModal(false);
  };

  const toggleActivo = (id: string, activo: boolean) => {
    usuariosStore.actualizar(id, { activo: !activo });
    setUsuarios(usuariosStore.obtenerTodos());
  };

  const eliminar = (id: string) => {
    if (!confirm('¿Eliminar este usuario?')) return;
    usuariosStore.eliminar(id);
    setUsuarios(usuariosStore.obtenerTodos());
  };

  const cambioForm = (campo: keyof Omit<Usuario, 'id'>, valor: string | boolean) => {
    setForm(prev => ({ ...prev, [campo]: valor }));
    if (errores[campo]) setErrores(prev => { const n = { ...prev }; delete n[campo]; return n; });
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h2>Gestión de Usuarios</h2>
          <p>Administra monitores y administradores del sistema</p>
        </div>
        <button className="btn btn-primario" onClick={abrirCrear}>
          + Nuevo Usuario
        </button>
      </div>

      <div className="tabla-contenedor">
        {/* Barra de búsqueda */}
        <div className="tabla-header">
          <h3 className="tabla-titulo">
            Usuarios ({usuariosFiltrados.length})
          </h3>
          <div className="buscador-contenedor" style={{ minWidth: 260 }}>
            <span className="buscador-icono" aria-hidden="true">🔍</span>
            <input
              type="search"
              className="campo"
              placeholder="Buscar por nombre, email o cédula..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              aria-label="Buscar usuarios"
              style={{ paddingLeft: 38 }}
            />
          </div>
        </div>

        {/* Tabla */}
        <div style={{ overflowX: 'auto' }}>
          <table aria-label="Lista de usuarios">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Cédula</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="empty-state">
                      <div className="empty-state-icono">👤</div>
                      <p>No se encontraron usuarios</p>
                    </div>
                  </td>
                </tr>
              ) : (
                usuariosFiltrados.map(u => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="avatar" style={{ width: 32, height: 32, fontSize: 12 }}>
                          {u.nombre.split(' ').slice(0,2).map(n => n[0]).join('')}
                        </div>
                        <strong>{u.nombre}</strong>
                      </div>
                    </td>
                    <td><code style={{ fontFamily: 'var(--fuente-mono)', fontSize: 13 }}>{u.cedula}</code></td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`badge badge-${u.rol}`}>{u.rol}</span>
                    </td>
                    <td>
                      <span className={`badge badge-${u.activo ? 'activo' : 'inactivo'}`}>
                        {u.activo ? '● Activo' : '○ Inactivo'}
                      </span>
                    </td>
                    <td>
                      <div className="acciones-tabla">
                        <button
                          className="btn btn-secundario btn-sm"
                          onClick={() => abrirEditar(u)}
                          aria-label={`Editar ${u.nombre}`}
                        >✏️</button>
                        <button
                          className="btn btn-secundario btn-sm"
                          onClick={() => toggleActivo(u.id, u.activo)}
                          aria-label={u.activo ? 'Desactivar' : 'Activar'}
                          title={u.activo ? 'Desactivar usuario' : 'Activar usuario'}
                        >
                          {u.activo ? '🔒' : '🔓'}
                        </button>
                        <button
                          className="btn btn-peligro btn-sm"
                          onClick={() => eliminar(u.id)}
                          aria-label={`Eliminar ${u.nombre}`}
                        >🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal formulario */}
      <Modal
        abierto={modalAbierto}
        titulo={editando ? 'Editar Usuario' : 'Nuevo Usuario'}
        onCerrar={() => setModal(false)}
      >
        <form onSubmit={guardar} noValidate>
          <div className="form-grupo">
            <label htmlFor="u-nombre">Nombre completo *</label>
            <input id="u-nombre" type="text" className={`campo ${errores.nombre ? 'campo-error' : ''}`}
              value={form.nombre} onChange={e => cambioForm('nombre', e.target.value)} />
            {errores.nombre && <p className="mensaje-error">{errores.nombre}</p>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-grupo">
              <label htmlFor="u-cedula">Cédula *</label>
              <input id="u-cedula" type="text" className={`campo ${errores.cedula ? 'campo-error' : ''}`}
                value={form.cedula} onChange={e => cambioForm('cedula', e.target.value)} />
              {errores.cedula && <p className="mensaje-error">{errores.cedula}</p>}
            </div>
            <div className="form-grupo">
              <label htmlFor="u-rol">Rol *</label>
              <select id="u-rol" className="campo"
                value={form.rol} onChange={e => cambioForm('rol', e.target.value as Rol)}>
                <option value="monitor">Monitor</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
          </div>

          <div className="form-grupo">
            <label htmlFor="u-email">Email *</label>
            <input id="u-email" type="email" className={`campo ${errores.email ? 'campo-error' : ''}`}
              value={form.email} onChange={e => cambioForm('email', e.target.value)} />
            {errores.email && <p className="mensaje-error">{errores.email}</p>}
          </div>

          <div className="form-grupo">
            <label htmlFor="u-password">{editando ? 'Nueva contraseña (dejar vacío para no cambiar)' : 'Contraseña *'}</label>
            <input id="u-password" type="password" className={`campo ${errores.password ? 'campo-error' : ''}`}
              value={form.password} onChange={e => cambioForm('password', e.target.value)}
              placeholder={editando ? '••••••••' : ''} />
            {errores.password && <p className="mensaje-error">{errores.password}</p>}
          </div>

          <div className="form-grupo" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <input id="u-activo" type="checkbox" checked={form.activo}
              onChange={e => cambioForm('activo', e.target.checked)}
              style={{ width: 18, height: 18, cursor: 'pointer' }} />
            <label htmlFor="u-activo" style={{ margin: 0, cursor: 'pointer' }}>Usuario activo</label>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button type="submit" className="btn btn-primario btn-bloque">
              {editando ? '💾 Guardar cambios' : '➕ Crear usuario'}
            </button>
            <button type="button" className="btn btn-secundario" onClick={() => setModal(false)}>
              Cancelar
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
