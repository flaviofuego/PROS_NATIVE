# ProsApp Monorepo

Sistema de gestión de asistencias a eventos estudiantiles.

## Estructura

```
pros-monorepo/
├── apps/
│   ├── web/          # Next.js 14 Dashboard (Web)
│   └── mobile/       # React Native/Expo App (iOS/Android)
│
├── packages/
│   ├── shared/       # Tipos, utilidades compartidas
│   └── supabase/     # Cliente y hooks de Supabase
│
├── turbo.json        # Configuración de Turborepo
└── package.json      # Configuración del monorepo
```

## Requisitos

- Node.js 20+
- npm 10+
- Cuenta de Supabase

## Instalación

```bash
# Instalar dependencias
npm install

# Construir paquetes compartidos
npm run build --filter=@pros/shared
```

## Variables de Entorno

### Web (`apps/web/.env.local`)
```env
NEXT_PUBLIC_SUPABASE_URL=tu-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

### Mobile (`apps/mobile/.env`)
```env
EXPO_PUBLIC_SUPABASE_URL=tu-supabase-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

## Desarrollo

### Ejecutar todo
```bash
npm run dev
```

### Solo Web
```bash
npm run dev:web
# o
cd apps/web && npm run dev
```

### Solo Mobile
```bash
npm run dev:mobile
# o
cd apps/mobile && npm start
```

## Características

### Web Dashboard
- **Dashboard**: Vista general con estadísticas
- **Eventos**: CRUD completo con tabla de datos
- **Usuarios**: Gestión de usuarios y roles
- **Estadísticas**: Gráficos con Recharts

### Mobile App
- **Escáner**: Captura de códigos de barras
- **Eventos**: Lista y selección de eventos activos
- **Asistencias**: Registro de asistencias en tiempo real

## Stack Tecnológico

| Capa | Tecnología |
|------|------------|
| Web | Next.js 14, React 18, TailwindCSS |
| Mobile | React Native, Expo, Expo Router |
| Backend | Supabase (Auth, Database, RLS) |
| Monorepo | Turborepo, npm workspaces |
| Gráficos | Recharts |
| Forms | React Hook Form, Zod |

## Base de Datos

### Tablas
- `users` - Perfiles de usuario
- `eventos` - Eventos con códigos de acceso
- `asistencias` - Registros de asistencia
- `accesos_eventos` - Control de acceso a eventos

### RLS (Row Level Security)
- Usuarios solo ven sus propias asistencias
- Admins tienen acceso completo
- Autenticación requerida para todas las operaciones

## Estructura de Comandos

```bash
# Desarrollo
npm run dev          # Ejecutar todos los apps
npm run dev:web      # Solo web
npm run dev:mobile   # Solo mobile

# Build
npm run build        # Construir todo

# Lint
npm run lint         # Lint de todo el proyecto

# Clean
npm run clean        # Limpiar builds
```

