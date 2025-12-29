# FitnessFlow Pro 🏋️‍♂️✨

**Plataforma Integral de Bienestar con IA y Gestión de Gimnasios**

> 🚀 **Estado del Proyecto**: Auditoría Completa y Migración a Estándares SaaS Factory (Gemini Edition).

## 📖 Descripción del Proyecto

FitnessFlow Pro es un SaaS (Software as a Service) todo-en-uno diseñado para revolucionar la industria del fitness. Conecta tres pilares fundamentales en un ecosistema unificado:

1.  **Usuarios**: Entrenador personal de bolsillo potenciado por Inteligencia Artificial (Google GenAI). Generación de rutinas, seguimiento de nutrición y bienestar integral.
2.  **Gimnasios (B2B)**: CRM y ERP completo para la gestión de centros deportivos. Control de miembros, finanzas, inventario y automatización de marketing.
3.  **Entrenadores**: Herramientas profesionales para gestionar clientes, horarios y servicios de entrenamiento personal.

## 🛠️ Stack Tecnológico

Este proyecto está construido con tecnologías modernas para garantizar rendimiento, escalabilidad y una experiencia de usuario premium.

*   **Frontend Core**: React 19 + TypeScript
*   **Build System**: Vite (Ultra-rápido)
*   **Estilos**: Tailwind CSS + Diseño UI personalizado (Glassmorphism, Neon accents)
*   **Inteligencia Artificial**: Google GenAI SDK (Gemini)
*   **Gestión de Estado**: React Hooks (Context API / Local State)
*   **PWA**: Vite PWA Plugin (Instalable en móviles)

## 📂 Estructura del Proyecto

El código ha sido refactorizado y organizado bajo el directorio `src/` para mayor mantenibilidad y limpieza, siguiendo estándares de industria.

```bash
c:/wamp64/www/FitnessFlow-SaaS/
├── src/
│   ├── components/      # Componentes UI reutilizables (Botones, Modales, Layouts)
│   ├── pages/           # Vistas principales por ruta (Dashboard, Login, Landing)
│   ├── data/            # Datos estáticos y mocks para desarrollo
│   ├── services/        # Lógica de conexión con APIs y servicios externos
│   ├── types/           # Definiciones de tipos TypeScript (Interfaces, Types)
│   ├── App.tsx          # Componente raíz y enrutamiento principal
│   ├── MainApp.tsx      # Layout principal para usuarios autenticados
│   └── index.tsx        # Punto de entrada de la aplicación
├── public/              # Archivos estáticos (imágenes, favicons)
└── un-config-archivos   # (package.json, vite.config.ts, etc.)
```

## 🚀 Instalación y Ejecución

Sigue estos pasos para levantar el entorno de desarrollo local.

### Prerrequisitos
*   Node.js (v18 o superior recomendado)
*   npm o yarn

### Pasos

1.  **Clonar/Abrir el repositorio**:
    Asegúrate de estar en la carpeta raíz del proyecto.

2.  **Instalar dependencias**:
    ```bash
    npm install
    ```

3.  **Iniciar servidor de desarrollo**:
    ```bash
    npm run dev
    ```
    La aplicación estará disponible en `http://localhost:5173` (o el puerto que indique la consola).

4.  **Construir para producción**:
    ```bash
    npm run build
    ```

## ✨ Características Clave

### Para Usuarios
*   **Onboarding Inteligente**: Encuesta inicial para personalizar la experiencia.
*   **Rutinas IA**: Generación automática de planes de entrenamiento.
*   **Chat con Coach IA**: Asistente virtual 24/7 para dudas de fitness.

### Para Gimnasios
*   **Dashboard Administrativo**: KPIs en tiempo real de ingresos y asistencias.
*   **Gestión de Miembros**: Base de datos de clientes con estados de suscripción.
*   **Finanzas**: Registro simple de ingresos y egresos.

### Para Entrenadores
*   **Agenda Digital**: Gestión de reservas de clases y sesiones.
*   **Perfil Profesional**: Catálogo de servicios ofrecidos.

## 📝 Notas de Mantenibilidad (Auditoría)

Se han aplicado las siguientes mejoras al código base:
*   ✅ **Refactorización de Estructura**: Centralización del código fuente en `src/`.
*   ✅ **Idioma**: Traducción de comentarios e instrucciones clave al español.
*   ✅ **Consistencia**: Unificación de patrones de importación y estructura de componentes.
*   ✅ **Documentación**: Actualización completa de este README.

---
*Desarrollado con ❤️ y estándares SaaS Factory.*
