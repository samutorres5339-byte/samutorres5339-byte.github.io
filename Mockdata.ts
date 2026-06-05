// ============================================================
// DATOS MOCK DEL SISTEMA
// Simulan la base de datos en memoria / localStorage
// ============================================================

import type { Usuario, Sala, Horario, Asignacion, SolicitudCambio } from '../types';

// ─── Usuarios ────────────────────────────────────────────────

export const usuariosMock: Usuario[] = [
  {
    id: 'u1',
    nombre: 'Carlos Administrador',
    cedula: '1001234567',
    email: 'admin@universidad.edu.co',
    rol: 'admin',
    password: 'admin123',
    activo: true,
  },
  {
    id: 'u2',
    nombre: 'Ana María López',
    cedula: '1087654321',
    email: 'ana.lopez@universidad.edu.co',
    rol: 'monitor',
    password: 'monitor123',
    activo: true,
  },
  {
    id: 'u3',
    nombre: 'Juan Pablo Gómez',
    cedula: '1093456789',
    email: 'juan.gomez@universidad.edu.co',
    rol: 'monitor',
    password: 'monitor123',
    activo: true,
  },
  {
    id: 'u4',
    nombre: 'Laura Martínez',
    cedula: '1076543210',
    email: 'laura.martinez@universidad.edu.co',
    rol: 'monitor',
    password: 'monitor123',
    activo: true,
  },
  {
    id: 'u5',
    nombre: 'Diego Hernández',
    cedula: '1065432109',
    email: 'diego.hernandez@universidad.edu.co',
    rol: 'monitor',
    password: 'monitor123',
    activo: false,
  },
];

// ─── Salas ───────────────────────────────────────────────────

export const salasMock: Sala[] = [
  {
    id: 's1',
    nombre: 'Sala 101',
    descripcion: 'Sala de cómputo general con equipos de última generación',
    capacidad: 30,
    ubicacion: 'Bloque A - Piso 1',
  },
  {
    id: 's2',
    nombre: 'Sala 205',
    descripcion: 'Laboratorio de programación y desarrollo de software',
    capacidad: 25,
    ubicacion: 'Bloque B - Piso 2',
  },
  {
    id: 's3',
    nombre: 'Sala 310',
    descripcion: 'Sala de diseño gráfico con monitores de alta resolución',
    capacidad: 20,
    ubicacion: 'Bloque C - Piso 3',
  },
  {
    id: 's4',
    nombre: 'Sala 402',
    descripcion: 'Laboratorio de redes y telecomunicaciones',
    capacidad: 15,
    ubicacion: 'Bloque D - Piso 4',
  },
];

// ─── Horarios ────────────────────────────────────────────────

export const horariosMock: Horario[] = [
  { id: 'h1', dia: 'Lunes',     horaInicio: '07:00', horaFin: '09:00', salaId: 's1' },
  { id: 'h2', dia: 'Lunes',     horaInicio: '09:00', horaFin: '11:00', salaId: 's1' },
  { id: 'h3', dia: 'Lunes',     horaInicio: '14:00', horaFin: '16:00', salaId: 's2' },
  { id: 'h4', dia: 'Martes',    horaInicio: '07:00', horaFin: '09:00', salaId: 's2' },
  { id: 'h5', dia: 'Martes',    horaInicio: '11:00', horaFin: '13:00', salaId: 's3' },
  { id: 'h6', dia: 'Miércoles', horaInicio: '09:00', horaFin: '11:00', salaId: 's1' },
  { id: 'h7', dia: 'Miércoles', horaInicio: '14:00', horaFin: '16:00', salaId: 's4' },
  { id: 'h8', dia: 'Jueves',    horaInicio: '07:00', horaFin: '09:00', salaId: 's3' },
  { id: 'h9', dia: 'Jueves',    horaInicio: '16:00', horaFin: '18:00', salaId: 's2' },
  { id: 'h10', dia: 'Viernes',  horaInicio: '09:00', horaFin: '11:00', salaId: 's4' },
  { id: 'h11', dia: 'Viernes',  horaInicio: '13:00', horaFin: '15:00', salaId: 's1' },
  { id: 'h12', dia: 'Sábado',   horaInicio: '08:00', horaFin: '10:00', salaId: 's2' },
];

// ─── Asignaciones ────────────────────────────────────────────

export const asignacionesMock: Asignacion[] = [
  { id: 'a1', monitorId: 'u2', horarioId: 'h1', fechaAsignacion: '2025-01-15' },
  { id: 'a2', monitorId: 'u2', horarioId: 'h5', fechaAsignacion: '2025-01-15' },
  { id: 'a3', monitorId: 'u3', horarioId: 'h2', fechaAsignacion: '2025-01-15' },
  { id: 'a4', monitorId: 'u3', horarioId: 'h7', fechaAsignacion: '2025-01-15' },
  { id: 'a5', monitorId: 'u4', horarioId: 'h3', fechaAsignacion: '2025-01-15' },
  { id: 'a6', monitorId: 'u4', horarioId: 'h8', fechaAsignacion: '2025-01-15' },
  { id: 'a7', monitorId: 'u2', horarioId: 'h11', fechaAsignacion: '2025-01-20' },
  { id: 'a8', monitorId: 'u3', horarioId: 'h9', fechaAsignacion: '2025-01-20' },
];

// ─── Solicitudes de Cambio ───────────────────────────────────

export const solicitudesMock: SolicitudCambio[] = [
  {
    id: 'sc1',
    solicitanteId: 'u2',
    reemplazanteId: 'u3',
    horarioId: 'h1',
    estado: 'pendiente',
    fecha: '2025-05-10',
    motivo: 'Tengo examen parcial ese día.',
  },
  {
    id: 'sc2',
    solicitanteId: 'u3',
    reemplazanteId: 'u4',
    horarioId: 'h2',
    estado: 'aprobada',
    fecha: '2025-05-08',
    motivo: 'Cita médica programada.',
  },
  {
    id: 'sc3',
    solicitanteId: 'u4',
    reemplazanteId: 'u2',
    horarioId: 'h3',
    estado: 'rechazada',
    fecha: '2025-05-05',
    motivo: 'Viaje familiar.',
  },
];
