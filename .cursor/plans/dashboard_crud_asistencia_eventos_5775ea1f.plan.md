---
name: Dashboard CRUD Asistencia Eventos
overview: Crear un sistema completo de gestión de asistencia a eventos estudiantiles con React Native y Supabase, incluyendo autenticación, roles (admin/usuario), CRUD de eventos, escaneo de códigos de barras, dashboard con estadísticas y gestión de códigos de acceso.
todos:
  - id: todo-1765902440004-vvrx1wp1k
    content: ""
    status: pending
---

# Plan: Sistema de Gestión de Asistencia a Eventos Estudiantiles

## Arquitectura General

El sistema tendrá dos roles principales:

- **Administradores**: Crean eventos, gestionan usuarios, ven estadísticas y todas las asistencias
- **Usuarios**: Toman asistencia escaneando códigos de barras en eventos activos

## 1. Esquema de Base de Datos (Supabase)

### Tablas principales:

**`users`** (extiende `auth.users` de Supabase)

- `id` (UUID, referencia a auth.users)
- `email` (text)
- `role` (enum: 'admin' | 'user')
- `nombre` (text)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**`eventos`**

- `id` (bigint, autoincremental)
- `nombre` (text)
- `categoria` (text)
- `encargados` (text[]) - array de nombres
- `fecha_inicio` (date)
- `fecha_fin` (date)
- `ubicacion` (text)
- `codigo_acceso` (text, único) - código para acceder al evento
- `activo` (boolean) - si el evento está activo hoy
- `created_by` (UUID, referencia a users.id)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**`asistencias`**

- `id` (bigint, autoincremental)
- `id_evento` (bigint, referencia a eventos.id)
- `id_usuario` (UUID, referencia a users.id) - usuario que tomó la asistencia
- `codigo_estudiante` (text) - código escaneado del estudiante
- `fecha_asistencia` (date)
- `hora_asistencia` (time)
- `created_at` (timestamp)

**`accesos_eventos`** (tracking de usuarios que han accedido a eventos)

- `id` (bigint, autoincremental)
- `id_evento` (bigint, referencia a eventos.id)
- `id_usuario` (UUID, referencia a users.id)
- `codigo_usado` (text) - código que usaron para acceder
- `fecha_acceso` (timestamp)

### Políticas RLS (Row Level Security):

- Usuarios solo pueden ver sus propias asistencias registradas
- Administradores pueden ver todo
- Usuarios pueden insertar asistencias para eventos a los que tienen acceso
- Solo administradores pueden CRUD eventos y usuarios

## 2. Estructura de Carpetas y Archivos

```
ProsApp/
├── app/
│   ├── (auth)/
│   │   ├── login.tsx
│   │   └── _layout.tsx
│   ├── (admin)/
│   │   ├── _layout.tsx
│   │   ├── dashboard.tsx
│   │   ├── eventos/
│   │   │   ├── index.tsx (lista)
│   │   │   ├── crear.tsx
│   │   │   ├── [id].tsx (detalle/editar)
│   │   │   └── estadisticas/[id].tsx
│   │   ├── usuarios/
│   │   │   ├── index.tsx (lista)
│   │   │   └── crear.tsx
│   │   └── estadisticas.tsx
│   ├── (user)/
│   │   ├── _layout.tsx
│   │   ├── eventos/
│   │   │   ├── index.tsx (eventos activos del día)
│   │   │   ├── [id].tsx (tomar asistencia)
│   │   │   └── mis-asistencias.tsx
│   │   └── scanner.tsx
│   └── _layout.tsx (root layout con auth guard)
├── lib/
│   ├── supabase.ts (cliente Supabase)
│   └── types.ts (TypeScript types)
├── contexts/
│   └── AuthContext.tsx
├── components/
│   ├── auth/
│   │   └── LoginForm.tsx
│   ├── admin/
│   │   ├── EventForm.tsx
│   │   ├── EventList.tsx
│   │   ├── UserList.tsx
│   │   └── StatsCard.tsx
│   ├── user/
│   │   ├── EventCard.tsx
│   │   ├── AttendanceList.tsx
│   │   └── BarcodeScanner.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       └── Card.tsx
└── hooks/
    ├── useAuth.ts
    ├── useEvents.ts
    └── useAttendances.ts
```

## 3. Implementación por Componentes

### 3.1 Configuración de Supabase

- Crear `lib/supabase.ts` con cliente configurado
- Configurar variables de entorno para URL y anon key
- Setup de tipos TypeScript para las tablas

### 3.2 Sistema de Autenticación

- `contexts/AuthContext.tsx`: Context provider para estado de autenticación
- `hooks/useAuth.ts`: Hook para acceder a auth context
- `app/(auth)/login.tsx`: Pantalla de login con email/password
- Guard en `app/_layout.tsx` para redirigir según autenticación y rol

### 3.3 Navegación por Roles

- Layouts separados para `(admin)` y `(user)`
- Redirección automática según rol después del login
- Bottom tabs para navegación principal

### 3.4 Funcionalidades de Administrador

**Dashboard (`app/(admin)/dashboard.tsx`)**:

- Estadísticas generales: total eventos, asistencias hoy, usuarios activos
- Lista de eventos recientes
- Accesos rápidos a crear evento/usuario

**Gestión de Eventos**:

- `app/(admin)/eventos/index.tsx`: Lista todos los eventos con filtros (activos/pasados)
- `app/(admin)/eventos/crear.tsx`: Formulario para crear evento (genera código de acceso automático)
- `app/(admin)/eventos/[id].tsx`: Ver detalles, editar o eliminar evento
- `app/(admin)/eventos/estadisticas/[id].tsx`: Estadísticas específicas del evento

**Gestión de Usuarios**:

- `app/(admin)/usuarios/index.tsx`: Lista todos los usuarios
- `app/(admin)/usuarios/crear.tsx`: Formulario para crear usuario (con selección de rol)

**Estadísticas**:

- `app/(admin)/estadisticas.tsx`: Vista general con gráficos
- Estadísticas por evento: total asistencias, por hora, estudiantes únicos

### 3.5 Funcionalidades de Usuario

**Eventos Activos**:

- `app/(user)/eventos/index.tsx`: Lista eventos activos del día (fecha actual entre fecha_inicio y fecha_fin)
- Mostrar eventos como cards con información básica

**Tomar Asistencia**:

- `app/(user)/eventos/[id].tsx`: Pantalla principal para tomar asistencia
  - Primera vez: pedir código de acceso y validarlo
  - Guardar acceso en `accesos_eventos`
  - Mostrar scanner de códigos de barras
  - Lista de asistencias tomadas en esta sesión
- `components/user/BarcodeScanner.tsx`: Componente reutilizable para escanear códigos
  - Usar `expo-barcode-scanner`
  - Validar formato de código
  - Registrar asistencia inmediatamente

**Mis Asistencias**:

- `app/(user)/eventos/mis-asistencias.tsx`: Lista de eventos donde el usuario tomó asistencia
- Ver detalles de asistencias por evento

### 3.6 Componentes UI Reutilizables

- `components/ui/Button.tsx`: Botón estilizado
- `components/ui/Input.tsx`: Input con validación
- `components/ui/Card.tsx`: Card container
- Componentes de lista con pull-to-refresh

### 3.7 Hooks Personalizados

- `hooks/useEvents.ts`: Fetch y mutations de eventos
- `hooks/useAttendances.ts`: Fetch y registro de asistencias
- `hooks/useAuth.ts`: Wrapper del AuthContext

## 4. Flujos Principales

### Flujo de Usuario Tomando Asistencia:

1. Usuario hace login
2. Ve lista de eventos activos del día
3. Selecciona un evento
4. Si es primera vez: ingresa código de acceso
5. Se valida código y se guarda acceso
6. Se muestra scanner de códigos de barras
7. Escanea código estudiantil → se registra asistencia inmediatamente
8. Puede seguir escaneando más códigos

### Flujo de Administrador Creando Evento:

1. Admin hace login
2. Va a Dashboard → Crear Evento
3. Llena formulario (nombre, categoría, encargados, fechas, ubicación)
4. Sistema genera código de acceso único automáticamente
5. Guarda evento en BD
6. Puede ver/copiar código de acceso para compartir con usuarios

## 5. Consideraciones Técnicas

- **Códigos de acceso**: Generar automáticamente al crear evento (ej: 6-8 caracteres alfanuméricos)
- **Validación de eventos activos**: Query que filtra por fecha actual entre fecha_inicio y fecha_fin
- **Escaneo de códigos**: Usar `expo-barcode-scanner` con soporte para múltiples formatos (EAN, Code128, etc.)
- **Feedback visual**: Haptic feedback y sonidos al escanear códigos
- **Offline**: Considerar cache local para eventos activos (AsyncStorage)
- **Estadísticas**: Usar queries agregadas de Supabase para contar y agrupar datos

## 6. Scripts SQL para Supabase

Crear migrations SQL para:

- Crear tablas con tipos correctos
- Configurar RLS policies
- Crear índices para performance
- Crear funciones para estadísticas

## Archivos Clave a Modificar/Crear

1. **[lib/supabase.ts](lib/supabase.ts)** - Cliente Supabase
2. **[lib/types.ts](lib/types.ts)** - Tipos TypeScript
3. **[contexts/AuthContext.tsx](contexts/AuthContext.tsx)** - Context de autenticación
4. **[app/_layout.tsx](app/_layout.tsx)** - Root layout con auth guard
5. **[app/(auth)/login.tsx](app/\\\\(auth)/login.tsx)** - Pantalla de login
6. **[app/(admin)/dashboard.tsx](app/\\\\(admin)/dashboard.tsx)** - Dashboard admin
7. **[app/(user)/eventos/index.tsx](app/\\\\(user)/eventos/index.tsx)** - Lista eventos activos
8. **[components/user/BarcodeScanner.tsx](components/user/BarcodeScanner.tsx)** - Scanner de códigos