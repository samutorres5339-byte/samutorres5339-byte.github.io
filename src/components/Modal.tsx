// ============================================================
// COMPONENTE: Modal reutilizable
// ============================================================

import { useEffect, type ReactNode } from 'react';

interface ModalProps {
  abierto: boolean;
  titulo: string;
  onCerrar: () => void;
  children: ReactNode;
  ancho?: string;
}

export default function Modal({ abierto, titulo, onCerrar, children, ancho }: ModalProps) {
  // Cierra con Escape y bloquea scroll del body
  useEffect(() => {
    if (!abierto) return;
    const manejar = (e: KeyboardEvent) => { if (e.key === 'Escape') onCerrar(); };
    document.addEventListener('keydown', manejar);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', manejar);
      document.body.style.overflow = '';
    };
  }, [abierto, onCerrar]);

  if (!abierto) return null;

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-titulo"
      onClick={(e) => { if (e.target === e.currentTarget) onCerrar(); }}
    >
      <div className="modal" style={ancho ? { maxWidth: ancho } : undefined}>
        <div className="modal-header">
          <h2 className="modal-titulo" id="modal-titulo">{titulo}</h2>
          <button
            className="btn btn-secundario btn-sm"
            onClick={onCerrar}
            aria-label="Cerrar modal"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
