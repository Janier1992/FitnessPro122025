# FitnessPro SaaS 🏋️‍♂️

**FitnessPro** es una plataforma integral de gestión para gimnasios y entrenadores personales, potenciada con Inteligencia Artificial (Gemini) y Supabase. Diseñada transformar la experiencia de entrenamiento con tecnología de punta.

## 🚀 Características Principales

### 🧠 Inteligencia Artificial (Gemini)
- **Coach Virtual**: Asistente 24/7 para consultas de fitness y nutrición.
- **Planes Personalizados**: Generación automática de rutinas basadas en objetivos.
- **Análisis de Progreso**: Insights inteligentes sobre el rendimiento del usuario.

### 📱 PWA (Progressive Web App)
- **Instalable**: Funciona como una app nativa en iOS, Android, Windows y Mac.
- **Offline First**: Acceso a contenido básico sin conexión.
- **Icono Premium**: Diseño vectorizado adaptable a cualquier dispositivo.

### 💼 Gestión Integral
- **Clases Grupales**: Reservas en tiempo real y gestión de aforos.
- **Finanzas**: Control de pagos, membresías y facturación.
- **CRM**: Gestión detallada de perfiles de clientes y seguimiento.

## 🛠️ Stack Tecnológico

- **Frontend**: React 19, Vite 6, TypeScript, TailwindCSS v3.
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions).
- **IA Core**: Google Gemini 2.0 Flash (via Google AI Studio).
- **Testing**: Vitest, React Testing Library.
- **Despliegue**: GitHub Pages (con GitHub Actions).

## ⚙️ Configuración y Despliegue

### Requisitos Previos
- Node.js v18+
- Cuenta en Supabase
- API Key de Google Gemini

### Instalación Local
1.  Clonar el repositorio:
    ```bash
    git clone https://github.com/Janier1992/FitnessPro122025.git
    ```
2.  Instalar dependencias:
    ```bash
    npm install
    ```
3.  Configurar `.env` (ver `.env.example`).
4.  Iniciar desarrollo:
    ```bash
    npm run dev
    ```

### Despliegue en GitHub Pages
Este proyecto está configurado para desplegarse automáticamente en GitHub Pages.
1.  Subir cambios a la rama `main`.
2.  En GitHub, ir a **Settings > Pages**.
3.  Seleccionar Source: `gh-pages` (o configurar Action personalizada).

## 📦 Estructura del Proyecto

- `/src`: Código fuente de la aplicación.
- `/public`: Assets estáticos e iconos PWA.
- `/supabase`: Esquemas y migraciones de base de datos.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.

---
Desarrollado con ❤️ para la comunidad fitness.
