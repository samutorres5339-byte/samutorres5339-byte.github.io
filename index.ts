// ============================================================
// TIPOS / INTERFACES DEL SISTEMA
// ============================================================

/** Roles disponibles en el sistema */
export type Rol = 'admin' | 'monitor';

/** Estado de una solicitud de cambio de turno */
export type EstadoSolicitud = 'pendiente' | 'aprobada' | 'rechazada';

/** Días de la semana válidos */
export type DiaSemana = 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado';

// ─── Entidades principales ───────────────────────────────────

export interface Usuario {
  id: string;
  nombre: string;
  cedula: string;
  email: string;
  rol: Rol;
  password: string; // En producción iría hasheada
  activo: boolean;
}

export interface Sala {
  id: string;
  nombre: string;
  descripcion: string;
  capacidad: number;
  ubicacion: string;
}

export interface Horario {
  id: string;
  dia: DiaSemana;
  horaInicio: string; // formato "HH:MM"
  horaFin: string;
  salaId: string;
}

export interface Asignacion {
  id: string;
  monitorId: string;
  horarioId: string;
  fechaAsignacion: string; // ISO date string
}

export interface SolicitudCambio {
  id: string;
  solicitanteId: string;
  reemplazanteId: string;
  horarioId: string;
  estado: EstadoSolicitud;
  fecha: string; // ISO date string
  motivo: string;
}

// ─── Tipos de sesión ────────────────────────────────────────

export interface SesionUsuario {
  usuario: Usuario;
  token: string; // Simulado con timestamp
}
