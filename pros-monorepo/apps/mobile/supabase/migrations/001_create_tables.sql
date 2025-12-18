-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'user');

-- Create users table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    role user_role NOT NULL DEFAULT 'user',
    nombre TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create eventos table
CREATE TABLE IF NOT EXISTS public.eventos (
    id BIGSERIAL PRIMARY KEY,
    nombre TEXT NOT NULL,
    categoria TEXT NOT NULL,
    encargados TEXT[] DEFAULT '{}',
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    ubicacion TEXT NOT NULL,
    codigo_acceso TEXT NOT NULL UNIQUE,
    activo BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create asistencias table
CREATE TABLE IF NOT EXISTS public.asistencias (
    id BIGSERIAL PRIMARY KEY,
    id_evento BIGINT NOT NULL REFERENCES public.eventos(id) ON DELETE CASCADE,
    id_usuario UUID NOT NULL REFERENCES public.users(id),
    codigo_estudiante TEXT NOT NULL,
    fecha_asistencia DATE NOT NULL,
    hora_asistencia TIME NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create accesos_eventos table (tracking user access to events)
CREATE TABLE IF NOT EXISTS public.accesos_eventos (
    id BIGSERIAL PRIMARY KEY,
    id_evento BIGINT NOT NULL REFERENCES public.eventos(id) ON DELETE CASCADE,
    id_usuario UUID NOT NULL REFERENCES public.users(id),
    codigo_usado TEXT NOT NULL,
    fecha_acceso TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(id_evento, id_usuario)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_eventos_fecha ON public.eventos(fecha_inicio, fecha_fin);
CREATE INDEX IF NOT EXISTS idx_eventos_activo ON public.eventos(activo);
CREATE INDEX IF NOT EXISTS idx_eventos_codigo_acceso ON public.eventos(codigo_acceso);
CREATE INDEX IF NOT EXISTS idx_asistencias_evento ON public.asistencias(id_evento);
CREATE INDEX IF NOT EXISTS idx_asistencias_usuario ON public.asistencias(id_usuario);
CREATE INDEX IF NOT EXISTS idx_asistencias_fecha ON public.asistencias(fecha_asistencia);
CREATE INDEX IF NOT EXISTS idx_accesos_evento_usuario ON public.accesos_eventos(id_evento, id_usuario);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables with updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_eventos_updated_at
    BEFORE UPDATE ON public.eventos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE public.users IS 'User profiles extending auth.users';
COMMENT ON TABLE public.eventos IS 'Events for student attendance tracking';
COMMENT ON TABLE public.asistencias IS 'Student attendance records for events';
COMMENT ON TABLE public.accesos_eventos IS 'Tracks which users have access to which events';

