# 🖥️ GestorMonitor — Sistema de Gestión de Salas de Cómputo

Aplicación web para la administración de monitores, salas de cómputo, horarios, asignaciones y solicitudes de cambio de turno en un entorno universitario.

---

## 📋 Descripción del Proyecto

GestorMonitor es una SPA (Single Page Application) desarrollada en **React + TypeScript** que permite a dos tipos de usuarios interactuar con el sistema:

- **Administrador**: gestiona usuarios, salas, horarios, asignaciones y aprueba/rechaza solicitudes de cambio.
- **Monitor**: consulta sus horarios asignados y envía solicitudes de cambio de turno.

Los datos se persisten usando **localStorage**, sin necesidad de backend ni base de datos real.

---

## ✅ Requisitos Previos

| Herramienta | Versión mínima |
|-------------|----------------|
| Node.js     | 18.x o superior |
| npm         | 9.x o superior  |

Verifica tu versión con:
```bash
node -v
npm -v
```

---

## 🚀 Instalación y Ejecución

### 1. Clonar o descomprimir el proyecto

```bash
# Si viene en un ZIP, descomprímelo y entra a la carpeta:
cd gestion-monitores
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Iniciar el servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible en: **http://localhost:5173**

### 4. Construir para producción (opcional)

```bash
npm run build
npm run preview  # previsualiza el build
```

---

## 🔐 Cuentas de Prueba

| Rol           | Email                              | Contraseña  |
|---------------|------------------------------------|-------------|
| Administrador | admin@universidad.edu.co           | admin123    |
| Monitor 1     | ana.lopez@universidad.edu.co       | monitor123  |
| Monitor 2     | juan.gomez@universidad.edu.co      | monitor123  |
| Monitor 3     | laura.martinez@universidad.edu.co  | monitor123  |

---

## 🛠️ Tecnologías y Versiones

| Tecnología         | Versión   | Uso                                      |
|--------------------|-----------|------------------------------------------|
| React              | ^19.0.0   | Librería UI principal                    |
| TypeScript         | ~5.7.2    | Tipado estático                          |
| React Router DOM   | ^7.5.3    | Enrutamiento SPA                         |
| Vite               | ^6.3.1    | Bundler y servidor de desarrollo         |
| CSS Custom Props   | —         | Sistema de diseño / variables de tema    |
| localStorage       | Web API   | Persistencia de datos sin backend        |
| Google Fonts       | —         | Tipografía: Plus Jakarta Sans + JetBrains Mono |

---

## 📁 Estructura del Proyecto

```
gestion-monitores/
├── public/                     # Archivos estáticos
├── src/
│   ├── components/             # Componentes reutilizables
│   │   ├── Layout.tsx          # Layout principal (sidebar + topbar)
│   │   ├── Sidebar.tsx         # Barra lateral de navegación
│   │   ├── Modal.tsx           # Modal genérico accesible
│   │   └── RutaProtegida.tsx   # HOC para proteger rutas por rol
│   │
│   ├── context/
│   │   └── AuthContext.tsx     # Contexto global de autenticación
│   │
│   ├── data/
│   │   ├── mockData.ts         # Datos iniciales (seed data)
│   │   └── store.ts            # Capa de acceso a datos (localStorage)
│   │
│   ├── pages/
│   │   ├── Login.tsx           # Página de inicio de sesión
│   │   ├── admin/
│   │   │   ├── AdminDashboard.tsx    # Dashboard con métricas
│   │   │   ├── Usuarios.tsx          # CRUD de usuarios
│   │   │   ├── Salas.tsx             # CRUD de salas
│   │   │   ├── Horarios.tsx          # CRUD de horarios
│   │   │   ├── Asignaciones.tsx      # Asignar monitores a horarios
│   │   │   └── SolicitudesAdmin.tsx  # Aprobar/rechazar solicitudes
│   │   └── monitor/
│   │       ├── MonitorDashboard.tsx  # Dashboard personal del monitor
│   │       ├── MisHorarios.tsx       # Vista de turnos asignados
│   │       ├── SolicitarCambio.tsx   # Formulario de solicitud
│   │       └── MisSolicitudes.tsx    # Historial de solicitudes
│   │
│   ├── types/
│   │   └── index.ts            # Interfaces y tipos TypeScript
│   │
│   ├── App.tsx                 # Configuración de rutas
│   ├── main.tsx                # Punto de entrada
│   └── index.css               # Estilos globales y sistema de diseño
│
├── index.html                  # HTML base
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.ts
```

---

## 🧩 Características Implementadas

### Autenticación
- Login con email y contraseña
- Sesión persistida en localStorage
- Redirección automática según rol (admin / monitor)
- Protección de rutas por rol con `RutaProtegida`
- Cierre de sesión

### Módulo Administrador
- **Dashboard**: tarjetas con métricas en tiempo real (monitores activos, salas, turnos asignados, solicitudes pendientes) y accesos rápidos
- **Usuarios**: CRUD completo (crear, editar, activar/desactivar, eliminar); búsqueda en tiempo real por nombre, email o cédula
- **Salas**: CRUD completo con vista en tarjetas y tabla; gestión de nombre, ubicación y capacidad
- **Horarios**: CRUD con vista de calendario semanal agrupado por día; filtro por día de la semana
- **Asignaciones**: crear y eliminar asignaciones monitor↔horario; validación de que un horario no tenga dos monitores
- **Solicitudes**: listar, filtrar por estado y aprobar/rechazar solicitudes pendientes

### Módulo Monitor
- **Dashboard**: resumen de turnos propios y acceso rápido a solicitar cambio
- **Mis Horarios**: vista de calendario semanal + tabla detallada de todos sus turnos
- **Solicitar Cambio**: formulario con validación completa para pedir cambio de turno
- **Mis Solicitudes**: historial de solicitudes enviadas y recibidas, con filtrado

### Técnico
- Tipado estricto con TypeScript en toda la aplicación
- CSS completamente responsive (mobile-first); menú hamburguesa en móvil
- Componentes reutilizables: `Modal`, `Layout`, `Sidebar`, `RutaProtegida`
- Estado centralizado en `store.ts` con persistencia en `localStorage`
- Validación de formularios con mensajes de error accesibles
- Semántica HTML: uso de `<main>`, `<nav>`, `<header>`, `<article>`, `<aside>`, atributos `aria-*`
- Sistema de diseño con CSS Custom Properties (variables de color, espaciado, tipografía)

---

## 💾 Manejo de Datos

Los datos se inicializan con seed data (mockData.ts) la primera vez que se abre la app. Luego todo se lee y escribe en `localStorage` bajo las claves:

| Clave           | Contenido              |
|-----------------|------------------------|
| `gm_usuarios`   | Lista de usuarios      |
| `gm_salas`      | Lista de salas         |
| `gm_horarios`   | Lista de horarios      |
| `gm_asignaciones` | Lista de asignaciones |
| `gm_solicitudes` | Lista de solicitudes  |
| `gm_sesion`     | Sesión activa          |

Para **reiniciar los datos** a los valores iniciales, abre las DevTools del navegador → Application → Local Storage → selecciona `localhost:5173` → Delete all.

---
 Autor

Samuel Torres montoya 
