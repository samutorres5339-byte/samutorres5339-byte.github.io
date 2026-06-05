// ============================================================
// STORE GLOBAL — Gestión de estado centralizado
// Usa localStorage para persistir los datos entre sesiones
// ============================================================

import type {
  Usuario, Sala, Horario, Asignacion, SolicitudCambio, SesionUsuario
} from '../types';
import {
  usuariosMock, salasMock, horariosMock, asignacionesMock, solicitudesMock
} from './mockData';

// Clave usada para guardar cada colección en localStorage
const KEYS = {
  usuarios: 'gm_usuarios',
  salas: 'gm_salas',
  horarios: 'gm_horarios',
  asignaciones: 'gm_asignaciones',
  solicitudes: 'gm_solicitudes',
  sesion: 'gm_sesion',
};

// ─── Helpers de persistencia ─────────────────────────────────

/**
 * Carga datos de localStorage; si no existen, inicializa con los mocks.
 */
function cargar<T>(key: string, inicial: T[]): T[] {
  const guardado = localStorage.getItem(key);
  if (guardado) {
    try {
      return JSON.parse(guardado) as T[];
    } catch {
      return inicial;
    }
  }
  localStorage.setItem(key, JSON.stringify(inicial));
  return inicial;
}

/** Persiste un array en localStorage */
function guardar<T>(key: string, datos: T[]): void {
  localStorage.setItem(key, JSON.stringify(datos));
}

// Genera un ID único basado en timestamp + random
export function generarId(): string {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

// ─── Módulo Usuarios ─────────────────────────────────────────

export const usuariosStore = {
  obtenerTodos: (): Usuario[] => cargar(KEYS.usuarios, usuariosMock),

  obtenerPorId: (id: string): Usuario | undefined =>
    usuariosStore.obtenerTodos().find(u => u.id === id),

  obtenerMonitores: (): Usuario[] =>
    usuariosStore.obtenerTodos().filter(u => u.rol === 'monitor'),

  crear: (datos: Omit<Usuario, 'id'>): Usuario => {
    const nuevo: Usuario = { ...datos, id: generarId() };
    const lista = [...usuariosStore.obtenerTodos(), nuevo];
    guardar(KEYS.usuarios, lista);
    return nuevo;
  },

  actualizar: (id: string, cambios: Partial<Usuario>): Usuario | null => {
    const lista = usuariosStore.obtenerTodos();
    const idx = lista.findIndex(u => u.id === id);
    if (idx === -1) return null;
    lista[idx] = { ...lista[idx], ...cambios };
    guardar(KEYS.usuarios, lista);
    return lista[idx];
  },

  eliminar: (id: string): boolean => {
    const lista = usuariosStore.obtenerTodos().filter(u => u.id !== id);
    guardar(KEYS.usuarios, lista);
    return true;
  },

  validarCredenciales: (email: string, password: string): Usuario | null =>
    usuariosStore.obtenerTodos().find(
      u => u.email === email && u.password === password && u.activo
    ) ?? null,
};

// ─── Módulo Salas ────────────────────────────────────────────

export const salasStore = {
  obtenerTodas: (): Sala[] => cargar(KEYS.salas, salasMock),

  obtenerPorId: (id: string): Sala | undefined =>
    salasStore.obtenerTodas().find(s => s.id === id),

  crear: (datos: Omit<Sala, 'id'>): Sala => {
    const nueva: Sala = { ...datos, id: generarId() };
    guardar(KEYS.salas, [...salasStore.obtenerTodas(), nueva]);
    return nueva;
  },

  actualizar: (id: string, cambios: Partial<Sala>): Sala | null => {
    const lista = salasStore.obtenerTodas();
    const idx = lista.findIndex(s => s.id === id);
    if (idx === -1) return null;
    lista[idx] = { ...lista[idx], ...cambios };
    guardar(KEYS.salas, lista);
    return lista[idx];
  },

  eliminar: (id: string): void => {
    guardar(KEYS.salas, salasStore.obtenerTodas().filter(s => s.id !== id));
  },
};

// ─── Módulo Horarios ─────────────────────────────────────────

export const horariosStore = {
  obtenerTodos: (): Horario[] => cargar(KEYS.horarios, horariosMock),

  obtenerPorId: (id: string): Horario | undefined =>
    horariosStore.obtenerTodos().find(h => h.id === id),

  obtenerPorSala: (salaId: string): Horario[] =>
    horariosStore.obtenerTodos().filter(h => h.salaId === salaId),

  crear: (datos: Omit<Horario, 'id'>): Horario => {
    const nuevo: Horario = { ...datos, id: generarId() };
    guardar(KEYS.horarios, [...horariosStore.obtenerTodos(), nuevo]);
    return nuevo;
  },

  actualizar: (id: string, cambios: Partial<Horario>): Horario | null => {
    const lista = horariosStore.obtenerTodos();
    const idx = lista.findIndex(h => h.id === id);
    if (idx === -1) return null;
    lista[idx] = { ...lista[idx], ...cambios };
    guardar(KEYS.horarios, lista);
    return lista[idx];
  },

  eliminar: (id: string): void => {
    guardar(KEYS.horarios, horariosStore.obtenerTodos().filter(h => h.id !== id));
  },
};

// ─── Módulo Asignaciones ─────────────────────────────────────

export const asignacionesStore = {
  obtenerTodas: (): Asignacion[] => cargar(KEYS.asignaciones, asignacionesMock),

  obtenerPorMonitor: (monitorId: string): Asignacion[] =>
    asignacionesStore.obtenerTodas().filter(a => a.monitorId === monitorId),

  obtenerPorHorario: (horarioId: string): Asignacion | undefined =>
    asignacionesStore.obtenerTodas().find(a => a.horarioId === horarioId),

  /** Verifica si un horario ya está asignado */
  horarioDisponible: (horarioId: string): boolean =>
    !asignacionesStore.obtenerTodas().some(a => a.horarioId === horarioId),

  crear: (datos: Omit<Asignacion, 'id'>): Asignacion | null => {
    // Regla de negocio: un horario solo puede tener una asignación activa
    if (!asignacionesStore.horarioDisponible(datos.horarioId)) return null;
    const nueva: Asignacion = { ...datos, id: generarId() };
    guardar(KEYS.asignaciones, [...asignacionesStore.obtenerTodas(), nueva]);
    return nueva;
  },

  eliminar: (id: string): void => {
    guardar(KEYS.asignaciones, asignacionesStore.obtenerTodas().filter(a => a.id !== id));
  },
};

// ─── Módulo Solicitudes ──────────────────────────────────────

export const solicitudesStore = {
  obtenerTodas: (): SolicitudCambio[] => cargar(KEYS.solicitudes, solicitudesMock),

  obtenerPorMonitor: (monitorId: string): SolicitudCambio[] =>
    solicitudesStore.obtenerTodas().filter(
      s => s.solicitanteId === monitorId || s.reemplazanteId === monitorId
    ),

  crear: (datos: Omit<SolicitudCambio, 'id'>): SolicitudCambio => {
    const nueva: SolicitudCambio = { ...datos, id: generarId() };
    guardar(KEYS.solicitudes, [...solicitudesStore.obtenerTodas(), nueva]);
    return nueva;
  },

  cambiarEstado: (id: string, estado: SolicitudCambio['estado']): SolicitudCambio | null => {
    const lista = solicitudesStore.obtenerTodas();
    const idx = lista.findIndex(s => s.id === id);
    if (idx === -1) return null;
    lista[idx] = { ...lista[idx], estado };
    guardar(KEYS.solicitudes, lista);
    return lista[idx];
  },
};

// ─── Módulo Sesión ───────────────────────────────────────────

export const sesionStore = {
  obtener: (): SesionUsuario | null => {
    const raw = localStorage.getItem(KEYS.sesion);
    if (!raw) return null;
    try { return JSON.parse(raw) as SesionUsuario; }
    catch { return null; }
  },

  guardar: (sesion: SesionUsuario): void => {
    localStorage.setItem(KEYS.sesion, JSON.stringify(sesion));
  },

  cerrar: (): void => {
    localStorage.removeItem(KEYS.sesion);
  },
};
