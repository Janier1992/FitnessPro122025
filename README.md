# FitnessFlow SaaS 🚀

**FitnessFlow** es la plataforma definitiva para la gestión de gimnasios, entrenadores y usuarios apasionados por el fitness. Potenciada por Inteligencia Artificial (Gemini) y construida sobre una arquitectura robusta en la nube, FitnessFlow democratiza el acceso a tecnología de élite para el bienestar físico.

> **Desarrollado por el equipo de SinFlow** con mucho amor para todos los amantes del fitness. 💙

---

## Estado del Proyecto (Versión Final v2.0)
- ✅ **PWA**: Instalable y Offline-capable (Navegación SPA fluida).
- ✅ **SaaS**: Soporte multi-tenant (Usuarios, Gimnasios, Entrenadores) con seguridad de sesión estricta.
- ✅ **Frontend**: React + Vite + Tailwind CSS (Diseño optimizado para Colombia).
- ✅ **IA**: Coach 24/7 con Gemini 1.5 Flash (Veo Video + Audio).
- ✅ **Pagos**: Integración simulada Nequi/Bancolombia.
- ✅ **Despliegue**: GitHub Pages Production Ready.

---

## 📚 Tabla de Contenidos

1. [Sobre el Proyecto](#sobre-el-proyecto)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Estructura del Código](#estructura-del-código)
4. [Funcionalidades Principales](#funcionalidades-principales)
5. [Planes y Suscripciones](#planes-y-suscripciones)
6. [Guía de Instalación](#guía-de-instalación)

---

## 🏋️‍♂️ Sobre el Proyecto

FitnessFlow no es solo un CRM, es un ecosistema completo que conecta:
- **Usuarios**: Que buscan transformar su cuerpo y mente con guía experta e IA.
- **Gimnasios**: Que necesitan herramientas administrativas de nivel empresarial.
- **Entrenadores**: Que requieren plataformas eficientes para escalar sus servicios.

Nuestra misión en **SinFlow** es eliminar las barreras tecnológicas en la industria del fitness.

---

## 🛠️ Stack Tecnológico

El proyecto utiliza un stack moderno, escalable y seguro:

### Frontend (Cliente)
- **Framework**: React 18+ (Vite) para una experiencia SPA veloz.
- **Lenguaje**: TypeScript para tipado estático y robustez.
- **Estilos**: TailwindCSS para diseño responsivo y estética moderna.
- **PWA**: `vite-plugin-pwa` para funcionamiento Offline e instalable en móviles.

### Backend & Datos
- **BaaS (Backend as a Service)**: Supabase.
- **Base de Datos**: PostgreSQL con Row Level Security (RLS) para aislamiento de datos.
- **Autenticación**: Supabase Auth (Email/Password).
- **Almacenamiento**: Supabase Storage para multimedia.

### Inteligencia Artificial
- **Modelo**: Google Gemini 2.0 Flash.
- **Casos de Uso**: Generación de rutinas, chat de bienestar, análisis de datos.

---

## 📂 Estructura del Código

La arquitectura está organizada para facilitar la escalabilidad y el mantenimiento:

```bash
/root
├── /public             # Assets estáticos (iconos, manifest, etc.)
├── /src
│   ├── /components     # Componentes de UI reutilizables (Botones, Cards, Layouts)
│   ├── /pages          # Vistas principales de la aplicación (Rutas)
│   ├── /services       # Lógica de comunicación con APIs (Supabase, Gemini)
│   ├── /hooks          # Custom Hooks para gestión de estado (useAuth, etc.)
│   ├── /types          # Definiciones de tipos TypeScript (Interfaces globales)
│   ├── /utils          # Funciones auxiliares y helpers
│   ├── /data           # Datos estáticos o mockups iniciales
│   └── App.tsx         # Punto de entrada y enrutador principal
├── /supabase
│   └── schema.sql      # Definición de base de datos y políticas de seguridad
├── .env                # Variables de entorno (NO subir al repositorio)
└── vite.config.ts      # Configuración del empaquetador
```

---

## ✨ Funcionalidades Principales

### 👤 Para Usuarios (Potenciado por IA)
- **AI Wellness Hub**: Centro de comando para tu bienestar.
- **Live Audio Coach** (🎙️ Nuevo): Conversa en tiempo real con tu entrenador virtual usando voz natural.
- **Veo Video Generator** (🎥 Nuevo): Genera previos de video de ejercicios simplemente describiendo el movimiento.
- **Mapas Inteligentes** (🗺️ Nuevo): Encuentra gimnasios cercanos validados por IA.
- **Rutinas Personalizadas**: Planes adaptados a tu nivel y equipo disponible.
- **PWA Offline**: Funciona sin internet y se instala como App nativa.

### 🏢 Para Gimnasios
- **Panel Administrativo**: Control total de miembros y personal.
- **Gestión Financiera**: Registro de ingresos, gastos y facturación.
- **Control de Aforo**: Monitoreo en tiempo real de la capacidad.
- **Clases Grupales**: Sistema de reservas automatizado.

### 🧢 Para Entrenadores
- **Gestión de Clientes**: CRM dedicado para tus asesorados.
- **Constructor de Rutinas**: Herramientas rápidas para asignar planes.
- **Agenda**: Gestión de sesiones presenciales o virtuales.

---

## 💎 Planes y Suscripciones

Ofrecemos opciones flexibles adaptadas a la realidad local (Precios en COP):

| Plan | Usuario | Entrenador | Gimnasio |
| :--- | :--- | :--- | :--- |
| **Básico** | $15.000 / mes | $20.000 / mes | $60.000 / mes |
| **Premium** | $20.000 / mes | $30.000 / mes | $80.000 / mes |
| **Beneficios** | Acceso a Gyms, IA Coach | CRM Clientes, Agenda | Gestión Total, Finanzas |

> Los pagos se gestionan de forma segura a través de nuestra pasarela integrada.

---

## � Instalación (PWA)
Esta aplicación es una Progressive Web App. Puedes instalarla directamente desde el navegador:
1. Abre la web en Chrome/Safari.
2. Pulsa en "Instalar App" en la barra de navegación o menú.
3. Disfruta de la experiencia nativa sin tiendas de aplicaciones.

## 🚀 Guía de Desarrollo

1. **Clonar Repositorio**:
   ```bash
   git clone https://github.com/tu-usuario/FitnessFlow-SaaS.git
   ```

2. **Instalar Dependencias**:
   ```bash
   npm install
   ```

3. **Configurar Entorno**:
   Crea un archivo `.env` basado en el ejemplo y añade tus claves de Supabase y Gemini.

4. **Ejecutar en Desarrollo**:
   ```bash
   npm run dev
   ```

---

## 📝 Créditos

- **Desarrollo**: Equipo SinFlow.
- **Diseño**: Inspirado en tendencias modernas de UI/UX (Glassmorphism, Minimalismo).
- **Tecnología**: Potenciado por el ecosistema Open Source.

<div align="center">
  <br>
  <p><b>Desarrollado por el equipo de SinFlow con mucho amor para todos los amantes del fitness. 💙</b></p>
</div>
