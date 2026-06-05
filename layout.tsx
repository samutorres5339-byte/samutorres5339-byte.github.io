// ============================================================
// COMPONENTE: Layout principal (sidebar + topbar + contenido)
// Maneja la apertura/cierre del sidebar en móvil
// ============================================================

import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  const [sidebarAbierto, setSidebarAbierto] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar
        abierto={sidebarAbierto}
        onCerrar={() => setSidebarAbierto(false)}
      />

      <div className="main-content">
        {/* Topbar con botón hamburguesa para móvil */}
        <header className="topbar">
          <button
            className="btn-hamburguesa"
            onClick={() => setSidebarAbierto(prev => !prev)}
            aria-label="Abrir menú"
            aria-expanded={sidebarAbierto}
          >
            ☰
          </button>
          <div />
        </header>

        {/* El contenido de cada página se inyecta aquí */}
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
