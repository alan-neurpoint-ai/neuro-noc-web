# Neuro-NOC Web

> Plataforma integral de gestión operativa y monitoreo para infraestructura tecnológica

## 📋 Descripción del Proyecto

**Neuro-NOC Web** es una aplicación web moderna construida con React, TypeScript y Vite que proporciona una interfaz completa para la gestión de operaciones de red (NOC), monitoreo de alertas, administración de contactos, configuración de IA y gestión de reglas de negocio.

La aplicación está diseñada para equipos de operaciones que necesitan supervisar, gestionar y automatizar procesos de infraestructura tecnológica con una experiencia de usuario intuitiva y eficiente.

---

## 🛠️ Tecnologías y Stack

### Frontend

| Tecnología   | Versión | Propósito                           |
| ------------ | ------- | ----------------------------------- |
| React        | 19.2.5  | Biblioteca de interfaz de usuario   |
| TypeScript   | ~6.0.2  | Tipado estático                     |
| Vite         | 8.0.10  | Build tool y servidor de desarrollo |
| Tailwind CSS | 4.2.4   | Framework de estilos                |
| React Router | 7.14.2  | Enrutamiento de páginas             |
| Zustand      | 5.0.12  | Gestión de estado global            |
| Recharts     | 3.8.1   | Biblioteca de gráficos              |

### Backend / Servicios

| Servicio | Propósito                                                |
| -------- | -------------------------------------------------------- |
| Supabase | Base de datos PostgreSQL, autenticación y almacenamiento |
| VAPI     | Integración de llamadas telephony                        |

### Desarrollo

| Herramienta | Propósito                   |
| ----------- | --------------------------- |
| ESLint      | Linting y calidad de código |
| Prettier    | Formateo de código          |
| Vitest      | Testing unitario            |

---

## 📁 Estructura del Proyecto

```
neuro-noc-web/
├── src/
│   ├── core/                          # Configuración central
│   │   ├── supabase.ts                # Cliente Supabase
│   │   ├── presentation/
│   │   │   └── components/            # Componentes UI core
│   │   │       ├── ui/                # Componentes base (Button, Card, Modal, etc.)
│   │   │       └── layouts/           # Layouts principales
│   │   └── types/                     # Tipos globales
│   │       └── knowledge/             # Tipos de tablas SQL
│   │
│   ├── modules/                       # Módulos de funcionalidad
│   │   ├── auth/                      # Autenticación
│   │   │   ├── presentation/
│   │   │   │   ├── pages/             # LoginPage
│   │   │   │   └── components/
│   │   │   └── stores/                # useAuthStore
│   │   │
│   │   ├── dashboard/                 # Dashboard principal
│   │   │   └── presentation/
│   │   │       └── pages/             # DashboardPage
│   │   │
│   │   ├── organizations/             # Gestión de organizaciones
│   │   │   └── presentation/
│   │   │       ├── pages/             # OrganizationsPage, OrganizationDetailPage
│   │   │       └── components/        # OrganizationHeader, OrganizationInfo, PaymentHistory
│   │   │
│   │   ├── contacts/                 # Contactos
│   │   │   └── presentation/
│   │   │       ├── pages/             # ContactListPage, ContactDetailsPage
│   │   │       └── components/       # ContactForm, ContactEditForm, LinkedUserCard
│   │   │
│   │   ├── monitoring/               # Monitoreo y alertas
│   │   │   └── presentation/
│   │   │       ├── pages/             # MonitoringAlertsPage, AlertDetailsPage
│   │   │       └── components/       # Charts, AlertsTable, VapiModal
│   │   │
│   │   ├── rules/                    # Reglas de negocio
│   │   │   └── presentation/
│   │   │       ├── pages/             # BusinessRuleListPage, BusinessRuleFormPage
│   │   │       └── components/       # RuleHeader, InactivateConfirmModal
│   │   │
│   │   ├── documentation/            # Documentación técnica
│   │   │   └── presentation/
│   │   │       └── pages/            # TechnicalDocumentationListPage, TechnicalDocumentationDetailPage
│   │   │
│   │   ├── ai/                       # Configuración de IA
│   │   │   └── presentation/
│   │   │       ├── pages/            # AIConfigurationListPage
│   │   │       └── components/       # AIConfigCard, AIConfigForm
│   │   │
│   │   └── contexts/                # Contextos temporales
│   │       └── presentation/
│   │           └── pages/            # TemporalContextListPage, TemporalContextFormPage
│   │
│   ├── App.tsx                       # Componente raíz
│   ├── main.tsx                      # Punto de entrada
│   └── index.css                     # Estilos globales
│
├── public/                           # Archivos estáticos
├── index.html                        # HTML principal
├── package.json                      # Dependencias
├── tsconfig.json                     # Configuración TypeScript
├── vite.config.ts                    # Configuración Vite
└── README.md                         # Este archivo
```

---

## 🚀 Funcionalidades Principales

### 1. Autenticación

- Inicio de sesión con Supabase Auth
- Gestión de sesiones y permisos por organización
- Almacenamiento de estado de autenticación con Zustand

### 2. Dashboard

- Vista principal con métricas clave
- Acceso rápido a módulos principales
- Estadísticas operativas

### 3. Gestión de Organizaciones

- Listado de organizaciones con jerarquía
- Detalle de organización con información de contacto
- Historial de pagos
- CRUD de organizaciones

### 4. Contactos

- Administración de contactos por organización
- Vinculación de usuarios a contactos
- Formularios de creación y edición
- Detalle de contacto con información completa

### 5. Monitoreo de Alertas

- Dashboard de alertas con gráficos
  - Gráfico de barras: Problemas más frecuentes
  - Gráfico circular: Contactos con más alertas
- Tabla de alertas con filtrado
- Detalle de alertas
- Integración con VAPI para transcripciones y audios
- Gestión de acciones de alertas

### 6. Reglas de Negocio

- Listado de reglas con paginación y búsqueda
- Creación manual de reglas
- Creación desde documentos
- Edición y eliminación (inactivación)
- Programación de ejecución
- Definición de objetivos afectados

### 7. Documentación Técnica

- Gestión de documentos técnicos
- Listado y búsqueda de documentación
- Detalle de documentos

### 8. Configuración de IA

- Gestión de configuraciones de IA
- Creación y edición de configuraciones
- Tarjetas visuales de configuración

### 9. Contextos Temporales

- Administración de contextos temporales
- Creación y edición de contextos

---

## 📦 Instalación y Configuración

### Prerequisites

- Node.js 18+
- npm o yarn

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/alan-neurpoint-ai/neuro-noc-web.git >
cd neuro-noc-web

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

### Variables de Entorno

Crea un archivo `.env` con las siguientes variables:

```env
VITE_SUPABASE_URL=tu_supabase_url
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
VITE_VAPI_API_KEY=tu_vapi_api_key
```

### Build para Producción

```bash
# Construir aplicación
npm run build

# Previsualizar build
npm run preview
```

---

## 🧪 Comandos Disponibles

| Comando            | Descripción                        |
| ------------------ | ---------------------------------- |
| `npm run dev`      | Iniciar servidor de desarrollo     |
| `npm run build`    | Compilar para producción           |
| `npm run preview`  | Previsualizar build de producción  |
| `npm run lint`     | Ejecutar ESLint                    |
| `npm run test`     | Ejecutar tests en modo watch       |
| `npm run test:ui`  | Ejecutar tests con interfaz visual |
| `npm run test:run` | Ejecutar tests una vez             |

---

## 🎨 Convenciones de Código

### Estructura de Componentes

```
presentation/
├── pages/          # Componentes de página (alto nivel)
└── components/    # Componentes reutilizables
```

### Nomenclatura

- Componentes: PascalCase (`BusinessRuleListPage.tsx`)
- Utilidades: camelCase (`useAuthStore.ts`)
- Estilos Tailwind: clases utilitarias

### Patrones

- Componentes funcionales con hooks
- Prop interfaces explícitas
- Estados locales con `useState`
- Estados globales con Zustand

---

## 📊 Base de Datos (Supabase)

### Tablas Principales

| Tabla                     | Descripción                 |
| ------------------------- | --------------------------- |
| `organizations`           | Organizaciones del sistema  |
| `users`                   | Usuarios de la aplicación   |
| `contacts`                | Contactos por organización  |
| `alerts`                  | Alertas de monitoreo        |
| `alert_actions`           | Acciones tomadas en alertas |
| `business_rule`           | Reglas de negocio           |
| `ai_configuration`        | Configuraciones de IA       |
| `technical_documentation` | Documentación técnica       |
| `temporal_context`        | Contextos temporales        |
| `payments`                | Historial de pagos          |

---

## 🔐 Autenticación y Permisos

- Sistema de Row Level Security (RLS) en Supabase
- Policies por organización
- Validación de acceso en frontend y backend

---

## 🐛 Solución de Problemas

### Error 406 al obtener usuarios

- Causa: Políticas RLS restrictivas
- Solución: Configurar políticas de Supabase correctamente

### VAPI retorna 400

- Causa: Retención de llamadas limitada a 14 días por plan
- Solución: Verificar antigüedad de las llamadas

---

## 📄 Licencia

MIT License - Ver archivo `LICENSE` para más detalles.

---

## 👥 Autores

- **Neuro-NOC Team** - Desarrollo inicial

---

## 🔗 Recursos Adicionales

- [Documentación de React](https://react.dev/)
- [Documentación de Vite](https://vitejs.dev/)
- [Documentación de Supabase](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Router](https://reactrouter.com/)

---

## 🏢 Desarrollado por Neuropoint.ai

<img src="https://neuropoint.ai/assets/logo-n-mini-filled.svg" alt="Neuropoint.ai" width="200"/>

**Neuropoint.ai** es una empresa líder en soluciones tecnológicas especializadas en inteligencia artificial, infraestructura de red y automatización de operaciones NOC.

### Sobre la Empresa

Neuropoint.ai se especializa en el desarrollo de plataformas innovadoras para la gestión operativa de infraestructura tecnológica. Con un enfoque en la automatización, el monitoreo inteligente y la integración de tecnologías de IA, la empresa proporciona soluciones que transforman la manera en que las organizaciones gestionan sus operaciones de red.

### Proyecto

Este desarrollo representa el compromiso de Neuropoint.ai con la excelencia tecnológica y la innovación continua en el campo de las operaciones de red y monitoreo de infraestructura.

---

**Neuropoint.ai** - _Innovación tecnológica al servicio de las operaciones_

📧 Contacto: info@neuropoint.ai  
🌐 Web: https://neuropoint.ai

---

_Última actualización: Mayo 2026_
