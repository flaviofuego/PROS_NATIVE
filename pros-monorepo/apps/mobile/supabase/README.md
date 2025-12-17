# Supabase Setup Instructions

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note down your project URL and anon key from Project Settings > API

## 2. Run Migrations

Run the SQL migrations in order:

1. `001_create_tables.sql` - Creates all tables and indexes
2. `002_rls_policies.sql` - Sets up Row Level Security policies
3. `003_seed_admin.sql` - Creates the trigger for auto-creating user profiles

You can run these in the Supabase SQL Editor.

## 3. Configure Environment

Create a `.env` file in the ProsApp folder with your Supabase credentials:

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 4. Create First Admin User

1. Sign up a user through the app or Supabase Auth
2. Run this SQL to promote them to admin:

```sql
UPDATE public.users SET role = 'admin' WHERE email = 'admin@example.com';
```

## Database Schema

### Tables

- **users** - User profiles (extends auth.users)
  - id (UUID, PK)
  - email (TEXT)
  - role (ENUM: 'admin' | 'user')
  - nombre (TEXT)
  - timestamps

- **eventos** - Events
  - id (BIGSERIAL, PK)
  - nombre, categoria, encargados[], fecha_inicio, fecha_fin, ubicacion
  - codigo_acceso (unique access code)
  - activo (boolean)
  - created_by (FK to users)
  - timestamps

- **asistencias** - Attendance records
  - id (BIGSERIAL, PK)
  - id_evento (FK to eventos)
  - id_usuario (FK to users)
  - codigo_estudiante (scanned student code)
  - fecha_asistencia, hora_asistencia
  - timestamps

- **accesos_eventos** - Event access tracking
  - id (BIGSERIAL, PK)
  - id_evento (FK to eventos)
  - id_usuario (FK to users)
  - codigo_usado (access code used)
  - fecha_acceso

### Row Level Security

- **Users**: Can only read their own profile; admins can read/write all
- **Eventos**: Authenticated users can read; only admins can create/update/delete
- **Asistencias**: Users can only see their own records; admins can see all
- **Accesos**: Users can check/create their own access; admins can manage all

