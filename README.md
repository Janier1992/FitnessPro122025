# FitnessPro SaaS

Plataforma integral de gestión para gimnasios y entrenadores personales, potenciada con IA (Gemini) y Supabase.

## 🚀 Características

- **Gestión de Clases y Horarios**: Sistema completo de reservas.
- **Biblioteca de Ejercicios**: +50 ejercicios con videos y descripciones detalladas.
- **Panel de Entrenador**: KPIs, gestión de clientes y agenda.
- **Bienestar AI**: Asistente virtual Gemini para recomendaciones personalizadas.
- **Gamificación**: Sistema de niveles y recompensas para usuarios.

## 🛠️ Tecnologías

- **Frontend**: React 18, Vite, TypeScript, TailwindCSS.
- **Backend**: Supabase (PostgreSQL, Auth, RLS).
- **IA**: Google Gemini API.
- **Testing**: Vitest, React Testing Library.

## ⚙️ Instalación

1.  Clonar el repositorio:
    ```bash
    git clone https://github.com/Janier1992/FitnessPro122025.git
    ```
2.  Instalar dependencias:
    ```bash
    npm install
    ```
3.  Configurar variables de entorno (`.env`):
    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_key
    VITE_GEMINI_API_KEY=your_gemini_key
    ```
4.  Ejecutar servidor de desarrollo:
    ```bash
    npm run dev
    ```

## 🧪 Pruebas

Ejecutar suite de pruebas:
```bash
npm run test
```

## 📂 Estructura del Proyecto

```
src/
├── components/   # Componentes UI reutilizables
├── pages/        # Vistas principales (Dashboard, Clases, etc.)
├── services/     # Lógica de negocio y llamadas a API (Supabase, Gemini)
├── types/        # Definiciones TypeScript compartidas
└── lib/          # Configuración de clientes externos
```

## 🤝 Contribución

1.  Fork del proyecto.
2.  Crear rama de feature (`git checkout -b feature/AmazingFeature`).
3.  Commit de cambios (`git commit -m 'Add some AmazingFeature'`).
4.  Push a la rama (`git push origin feature/AmazingFeature`).
5.  Abrir Pull Request.
