// ============================================================
// PÁGINA: Login
// Autenticación con email y contraseña
// ============================================================

import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, usuario } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [cargando, setCargando] = useState(false);

  // Si ya hay sesión, redirige automáticamente
  if (usuario) {
    navigate(`/${usuario.rol}/dashboard`, { replace: true });
    return null;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor completa todos los campos.');
      return;
    }

    setCargando(true);
    const resultado = await login(email, password);
    setCargando(false);

    if (resultado.ok) {
      // La redirección la maneja el efecto de arriba cuando cambia `usuario`
    } else {
      setError(resultado.error ?? 'Error al iniciar sesión.');
    }
  };

  return (
    <div className="login-page">
      {/* Panel izquierdo decorativo (solo escritorio) */}
      <div className="login-panel-izq" aria-hidden="true">
        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.85)' }}>
          <div style={{ fontSize: 72, marginBottom: 24 }}>🖥️</div>
          <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12, color: '#fff' }}>
            Gestión de Monitores
          </h2>
          <p style={{ fontSize: 16, opacity: 0.8, maxWidth: 380, lineHeight: 1.7 }}>
            Plataforma centralizada para la administración de salas de cómputo,
            horarios y asignación de monitores.
          </p>
          <div style={{ marginTop: 40, display: 'flex', gap: 32, justifyContent: 'center' }}>
            {['4 Salas', '12 Horarios', '3 Monitores'].map(stat => (
              <div key={stat} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#00c896' }}>
                  {stat.split(' ')[0]}
                </div>
                <div style={{ fontSize: 12, opacity: 0.7, textTransform: 'uppercase', letterSpacing: 1 }}>
                  {stat.split(' ')[1]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Panel derecho — formulario */}
      <div className="login-panel-der">
        <div className="login-form-contenedor">
          <div className="login-logo">
            <h1>🏫 GestorMonitor</h1>
            <p>Sistema de gestión de salas de cómputo</p>
          </div>

          <h2 className="login-titulo">Iniciar sesión</h2>
          <p className="login-subtitulo">Ingresa tus credenciales institucionales</p>

          {error && (
            <div className="alerta alerta-error" role="alert">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-grupo">
              <label htmlFor="email">Correo institucional</label>
              <input
                id="email"
                type="email"
                className="campo"
                placeholder="usuario@universidad.edu.co"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                required
                aria-describedby={error ? 'error-login' : undefined}
              />
            </div>

            <div className="form-grupo">
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                type="password"
                className="campo"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primario btn-bloque btn-lg"
              disabled={cargando}
              style={{ marginTop: 8 }}
            >
              {cargando ? '⏳ Verificando...' : '🔐 Ingresar al sistema'}
            </button>
          </form>

          {/* Credenciales de prueba */}
          <div className="alerta alerta-info" style={{ marginTop: 28 }}>
            <div>
              <strong>Cuentas de prueba:</strong><br />
              Admin: <code>admin@universidad.edu.co</code> / <code>admin123</code><br />
              Monitor: <code>ana.lopez@universidad.edu.co</code> / <code>monitor123</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
