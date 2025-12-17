-- Enable Row Level Security on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eventos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asistencias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accesos_eventos ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==================
-- USERS TABLE POLICIES
-- ==================

-- Users can read their own profile
CREATE POLICY "Users can read own profile"
    ON public.users
    FOR SELECT
    USING (auth.uid() = id);

-- Admins can read all users
CREATE POLICY "Admins can read all users"
    ON public.users
    FOR SELECT
    USING (public.is_admin());

-- Admins can insert users
CREATE POLICY "Admins can insert users"
    ON public.users
    FOR INSERT
    WITH CHECK (public.is_admin() OR auth.uid() = id);

-- Admins can update users
CREATE POLICY "Admins can update users"
    ON public.users
    FOR UPDATE
    USING (public.is_admin());

-- Admins can delete users
CREATE POLICY "Admins can delete users"
    ON public.users
    FOR DELETE
    USING (public.is_admin());

-- ==================
-- EVENTOS TABLE POLICIES
-- ==================

-- Everyone authenticated can read active events
CREATE POLICY "Authenticated users can read active events"
    ON public.eventos
    FOR SELECT
    USING (auth.uid() IS NOT NULL);

-- Admins can insert events
CREATE POLICY "Admins can insert events"
    ON public.eventos
    FOR INSERT
    WITH CHECK (public.is_admin());

-- Admins can update events
CREATE POLICY "Admins can update events"
    ON public.eventos
    FOR UPDATE
    USING (public.is_admin());

-- Admins can delete events
CREATE POLICY "Admins can delete events"
    ON public.eventos
    FOR DELETE
    USING (public.is_admin());

-- ==================
-- ASISTENCIAS TABLE POLICIES
-- ==================

-- Admins can read all attendances
CREATE POLICY "Admins can read all asistencias"
    ON public.asistencias
    FOR SELECT
    USING (public.is_admin());

-- Users can read only their own registered attendances
CREATE POLICY "Users can read own asistencias"
    ON public.asistencias
    FOR SELECT
    USING (auth.uid() = id_usuario);

-- Users can insert attendances for events they have access to
CREATE POLICY "Users can insert asistencias for accessible events"
    ON public.asistencias
    FOR INSERT
    WITH CHECK (
        auth.uid() = id_usuario
        AND EXISTS (
            SELECT 1 FROM public.accesos_eventos
            WHERE id_evento = asistencias.id_evento
            AND id_usuario = auth.uid()
        )
    );

-- Admins can insert attendances
CREATE POLICY "Admins can insert asistencias"
    ON public.asistencias
    FOR INSERT
    WITH CHECK (public.is_admin());

-- ==================
-- ACCESOS_EVENTOS TABLE POLICIES
-- ==================

-- Users can check their own access
CREATE POLICY "Users can read own event access"
    ON public.accesos_eventos
    FOR SELECT
    USING (auth.uid() = id_usuario);

-- Admins can read all access records
CREATE POLICY "Admins can read all event access"
    ON public.accesos_eventos
    FOR SELECT
    USING (public.is_admin());

-- Users can insert their own access after validating code
CREATE POLICY "Users can insert own event access"
    ON public.accesos_eventos
    FOR INSERT
    WITH CHECK (auth.uid() = id_usuario);

-- Admins can manage access
CREATE POLICY "Admins can manage event access"
    ON public.accesos_eventos
    FOR ALL
    USING (public.is_admin());

