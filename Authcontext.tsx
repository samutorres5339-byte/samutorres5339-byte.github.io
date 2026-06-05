// ============================================================
// CONTEXTO DE AUTENTICACIÓN
// Provee el estado de sesión a toda la aplicación
// ============================================================

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Usuario } from '../types';
import { sesionStore, usuariosStore } from '../data/store';

interface AuthContextType {
  usuario: Usuario | null;
  cargando: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  esAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);

  // Al montar, verifica si hay sesión activa en localStorage
  useEffect(() => {
    const sesion = sesionStore.obtener();
    if (sesion) {
      // Recarga el usuario fresco desde el store (puede haber cambiado)
      const usuarioActual = usuariosStore.obtenerPorId(sesion.usuario.id);
      setUsuario(usuarioActual ?? null);
    }
    setCargando(false);
  }, []);

  /**
   * Intenta autenticar al usuario con email y contraseña.
   * Retorna { ok: true } si tiene éxito o { ok: false, error: '...' } si falla.
   */
  const login = async (email: string, password: string) => {
    // Simula un pequeño retardo de red
    await new Promise(r => setTimeout(r, 600));

    const encontrado = usuariosStore.validarCredenciales(email, password);
    if (!encontrado) {
      return { ok: false, error: 'Credenciales incorrectas o usuario inactivo.' };
    }

    const sesion = { usuario: encontrado, token: `tok_${Date.now()}` };
    sesionStore.guardar(sesion);
    setUsuario(encontrado);
    return { ok: true };
  };

  const logout = () => {
    sesionStore.cerrar();
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{
      usuario,
      cargando,
      login,
      logout,
      esAdmin: usuario?.rol === 'admin',
    }}>
      {children}
    </AuthContext.Provider>
  );
}

/** Hook para consumir el contexto de autenticación */
export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
