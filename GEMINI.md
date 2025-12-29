# SaaS Factory - Sistema de Templates para Gemini

## 🎯 Qué es este Proyecto

**SaaS Factory** es un sistema de templates pre-configurados para crear aplicaciones production-ready usando Gemini. Es un "factory" que genera proyectos completos en minutos con toda la configuración de IA lista.

## 📦 Estructura del Repositorio

```
saas-factory-setup/
├── setup/                      # Config base Gemini (sin frameworks)
│   ├── GEMINI.md              # System prompt para proyectos genéricos
│   ├── .gemini/               # Comandos, agentes, skills
│   └── example.mcp.json       # MCPs disponibles
│
├── nextjs-gemini-setup/        # Template Frontend (Next.js + Supabase)
│   ├── GEMINI.md              # System prompt optimizado para Next.js
│   ├── .gemini/               # Config específica de frontend
│   └── example.mcp.json       # MCPs + Playwright (bucle agéntico)
│
├── python-gemini-setup/        # Template Full-Stack (Next.js + FastAPI)
│   ├── GEMINI.md              # System prompt híbrido (frontend + backend)
│   ├── .gemini/               # Config para full-stack
│   └── example.mcp.json       # MCPs completos
│
├── GEMINI_TEMPLATE.md          # Template educativo para crear GEMINI.md custom
└── README.md                   # Documentación completa del factory system
```

## 🚀 Cómo Funciona el Sistema

### Concepto: Aliases + Templates

1. **Usuario ejecuta alias** en cualquier directorio:
   ```bash
   cd ~/mi-nuevo-proyecto
   nextjs-gemini-setup  # o python-gemini-setup
   ```

2. **Alias copia archivos** del factory al proyecto actual:
   ```bash
   # Copia automáticamente:
   GEMINI.md           # System prompt específico
   .gemini/            # Comandos, agentes, skills
   .mcp.json           # Configuración de MCPs
   .gitignore          # Git config
   README.md           # Guía del template
   ```

3. **Usuario abre en Gemini**:
   ```bash
   gemini .
   ```

4. **Gemini lee automáticamente**:
   - `GEMINI.md` → Conoce arquitectura, convenciones, principios
   - `.gemini/commands/` → Slash commands disponibles
   - `.gemini/agents/` → Agentes especializados
   - `.mcp.json` → MCPs activos (Playwright, Supabase, etc.)

5. **IA ya sabe exactamente cómo trabajar** en ese proyecto específico

## 🎨 Filosofía del Sistema

> "La IA debe hacer el trabajo técnico. Tú solo describes lo que quieres."

**Principios:**
- ✅ **System prompts optimizados** → IA entiende contexto completo
- ✅ **Arquitecturas AI-friendly** → Feature-First (frontend), Clean (backend)
- ✅ **MCPs integrados** → Bucle agéntico visual, DB access, search
- ✅ **Templates production-ready** → No boilerplate, código real
- ✅ **Workflow automatizado** → Un comando, todo listo

## 📋 Qué Incluye Cada Setup

### 1. `setup/` - Base Configuration Only

**Para:** Añadir Gemini a proyectos existentes sin imponer tech stack

**Incluye:**
- `.gemini/` con comandos, agentes, skills
- `GEMINI.md` genérico (plantilla vacía)
- MCPs básicos (Chrome DevTools, Sequential Thinking)
- Sistema de skills con skill-creator

**NO incluye:** Frameworks, dependencias, código de proyecto

### 2. `nextjs-gemini-setup/` - Frontend Template

**Para:** Apps frontend-only con Next.js + Supabase

**Tech Stack:**
- Next.js 16 (App Router) + TypeScript
- Supabase (Auth + Database)
- Tailwind CSS + shadcn/ui
- Zustand, Zod, React Query

**Arquitectura:** Feature-First
```
src/features/[feature]/{components,hooks,services,types,store}
```

**MCPs:** Playwright (bucle agéntico visual), Supabase, Sequential Thinking

**GEMINI.md:** System prompt optimizado para frontend development

### 3. `python-gemini-setup/` - Full-Stack Template

**Para:** Apps full-stack completas con frontend + backend separados

**Tech Stack:**
- **Frontend:** Next.js 16 + TypeScript + Tailwind
- **Backend:** FastAPI + SQLModel + Python 3.10+
- **Database:** PostgreSQL/Supabase

**Arquitectura Híbrida:**
- Frontend: Feature-First (rápido con IA)
- Backend: Clean Architecture (capas: api/application/domain/infrastructure)

**MCPs:** Playwright, Supabase, Brave Search, Sequential Thinking

**GEMINI.md:** System prompt híbrido (frontend + backend conventions)

## 🔧 Componentes del Sistema

### GEMINI.md (System Prompt)

El archivo que Gemini lee automáticamente. Define:
- Tech stack y versiones exactas
- Arquitectura del proyecto (con diagramas ASCII)
- Convenciones de código
- Testing strategy
- Security best practices
- Git workflow
- Sección "No Hacer" (restricciones críticas)

**Cada setup tiene su GEMINI.md optimizado** para ese stack específico.

### .gemini/ Directory

```
.gemini/
├── commands/          # Slash commands (/explorador, /ejecutar-prp, etc.)
├── agents/            # Agentes especializados (codebase-analyst, gestor-docs)
├── skills/            # Skills reutilizables + skill-creator system
├── PRPs/              # Prompt Request Patterns (templates para features complejas)
├── prompts/           # Metodologías (bucle-agentico.md, etc.)
└── hooks/             # Logging infrastructure
```

### example.mcp.json

Configuración de MCPs (Model Context Protocol). Define herramientas disponibles:

**MCPs incluidos:**
- `playwright` → Control de navegador, screenshots, testing visual
- `chrome-devtools` → DevTools access avanzado
- `supabase` → Query directo a database, schema inspection
- `brave-search` → Búsquedas web en tiempo real
- `firecrawl-mcp` → Web scraping
- `n8n-mcp` → Automatizaciones con workflows
- `sequential-thinking` → Razonamiento mejorado para problemas complejos

**Importante:**
- `example.mcp.json` tiene placeholders (committear)
- `.mcp.json` tiene valores reales (NO committear)

### Skills System

Sistema de "paquetes de conocimiento" reutilizables:

```bash
# Crear nuevo skill
python .gemini/skills/skill-creator/scripts/init_skill.py my-skill

# Validar skill
python .gemini/skills/skill-creator/scripts/quick_validate.py ./my-skill

# Empaquetar skill
python .gemini/skills/skill-creator/scripts/package_skill.py ./my-skill
```

Skills permiten encapsular conocimiento específico (ej: "Stripe integration", "Auth flows") y reutilizarlo entre proyectos.

## 🎯 Workflow de Instalación (Para Gemini)

Cuando un usuario pide ayuda para instalar SaaS Factory:

### 1. Detectar Sistema
```bash
echo $SHELL  # Detectar zsh o bash
pwd          # Guardar ruta del repo
```

### 2. Preguntar Setup Deseado
Usar `AskUserQuestion`:
- "Aplicación web frontend" → nextjs-gemini-setup
- "Aplicación completa (frontend + backend)" → python-gemini-setup
- "Ambos" → Configurar ambos aliases

### 3. Generar Aliases con Rutas Absolutas
```bash
# Ejemplo para Next.js (reemplazar [REPO_PATH] con pwd)
alias nextjs-gemini-setup="cp [REPO_PATH]/nextjs-gemini-setup/GEMINI.md . && cp -r [REPO_PATH]/nextjs-gemini-setup/.gemini . && cp [REPO_PATH]/nextjs-gemini-setup/.mcp.json . && cp [REPO_PATH]/nextjs-gemini-setup/.gitignore . && cp [REPO_PATH]/nextjs-gemini-setup/README.md ."
```

### 4. Añadir a .zshrc/.bashrc
```bash
echo "alias nextjs-gemini-setup='...'" >> ~/.zshrc
source ~/.zshrc
```

### 5. Validar
```bash
type nextjs-gemini-setup  # Debe retornar: "is an alias for..."
```

### 6. Explicar Uso
```
🎉 Configuración completa!

Para crear un nuevo proyecto:
1. cd ~/mi-nuevo-proyecto
2. nextjs-gemini-setup (o python-gemini-setup)
3. gemini .

Ya tienes: GEMINI.md, .gemini/, .mcp.json, README.md
```

## 🔄 Bucle Agéntico (Visual Development)

Metodología única de SaaS Factory para desarrollo frontend:

```
1. Implementar componente UI
2. Playwright MCP captura screenshot automático
3. IA compara vs design requirements
4. Itera hasta pixel-perfect
5. Valida responsiveness (mobile/tablet/desktop)
```

**Objetivo:** Prevenir frontends genéricos dándole "ojos" a la IA.

**Documentación completa:** `.gemini/prompts/bucle-agentico.md` (en cada setup)

## 📚 Archivos de Documentación

### En el Root
- **README.md** → Guía completa del factory system para usuarios
- **GEMINI.md** → Este archivo (para que Gemini entienda el proyecto)
- **GEMINI_TEMPLATE.md** → Template educativo para crear GEMINI.md custom
- **CHANGELOG.md** → Historial de versiones

### En cada Setup
- **README.md** → Guía específica del template (setup, uso, deploy)
- **GEMINI.md** → System prompt optimizado para ese stack
- **example.mcp.json** → Template de configuración de MCPs
- **.gemini/prompts/** → Metodologías específicas

## 🎓 Para Usuarios que Quieren Crear su Propio Setup

1. **Usar `GEMINI_TEMPLATE.md`** como guía
2. Personalizar según tech stack
3. Definir arquitectura específica
4. Configurar MCPs necesarios
5. Crear aliases personalizados

## ❌ Restricciones del Factory System

**Este repositorio NO debe:**
- ❌ Convertirse en un proyecto específico (es un factory)
- ❌ Tener código de aplicación en el root (solo en setups)
- ❌ Mezclar configuraciones de diferentes setups
- ❌ Committear `.mcp.json` con secrets (solo `example.mcp.json`)

**Los setups NO deben:**
- ❌ Tener dependencias cruzadas entre ellos
- ❌ Compartir código (cada uno es standalone)
- ❌ Modificar archivos del setup padre

## 🔄 Mantenimiento del Factory

**Actualizar cuando:**
- Nuevas versiones de frameworks (Next.js 16 → 17)
- Nuevos MCPs disponibles
- Mejoras en metodologías (bucle agéntico, PRPs)
- Feedback de usuarios (anti-patterns descubiertos)

**Sincronización:**
- Cambios comunes (skills, prompts) → Propagar a todos los setups
- Cambios específicos → Solo en setup correspondiente
- GEMINI.md → Mantener actualizado en cada setup

## 📊 Estado del Proyecto

**Versión:** v1.0
**Última actualización:** 2025-01-07

**Componentes completos:**
- ✅ Setup base (`setup/`)
- ✅ Next.js template (`nextjs-gemini-setup/`)
- ✅ Python full-stack template (`python-gemini-setup/`)
- ✅ Sistema de skills con skill-creator
- ✅ MCPs configurados (7 MCPs disponibles)
- ✅ Bucle agéntico documentado
- ✅ GEMINI_TEMPLATE.md educativo
- ✅ README.md completo

**Pendiente:**
- 🔄 Tests automáticos del factory
- 🔄 Script de validación de setups
- 🔄 GitHub Actions para CI/CD
- 🔄 Más setups (Django, Vue, Angular, etc.)

---

*Este archivo es para que Gemini entienda la naturaleza del proyecto SaaS Factory. Para metodología de desarrollo específica, cada setup tiene su propio GEMINI.md optimizado.*
