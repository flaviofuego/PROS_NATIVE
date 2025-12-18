import { useState, useEffect, useCallback } from 'react';
import { supabase, getCurrentDate, getCurrentTime } from '@/lib/supabase';
import { Asistencia, AccesoEvento } from '@/lib/types';

export function useAsistencias(eventoId?: number, usuarioId?: string) {
  const [asistencias, setAsistencias] = useState<Asistencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAsistencias = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('asistencias')
        .select('*, evento:eventos(*), usuario:users(*)')
        .order('created_at', { ascending: false });

      if (eventoId) {
        query = query.eq('id_evento', eventoId);
      }
      if (usuarioId) {
        query = query.eq('id_usuario', usuarioId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setAsistencias(data as Asistencia[]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [eventoId, usuarioId]);

  useEffect(() => {
    fetchAsistencias();
  }, [fetchAsistencias]);

  return { asistencias, loading, error, refetch: fetchAsistencias };
}

export function useAsistenciasHoy(eventoId: number, usuarioId: string) {
  const [asistencias, setAsistencias] = useState<Asistencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAsistenciasHoy = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const today = getCurrentDate();
      const { data, error } = await supabase
        .from('asistencias')
        .select('*')
        .eq('id_evento', eventoId)
        .eq('id_usuario', usuarioId)
        .eq('fecha_asistencia', today)
        .order('hora_asistencia', { ascending: false });

      if (error) throw error;
      setAsistencias(data as Asistencia[]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [eventoId, usuarioId]);

  useEffect(() => {
    fetchAsistenciasHoy();
  }, [fetchAsistenciasHoy]);

  return { asistencias, loading, error, refetch: fetchAsistenciasHoy };
}

export function useAsistenciaMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registrarAsistencia = async (
    eventoId: number,
    usuarioId: string,
    codigoEstudiante: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('asistencias')
        .insert({
          id_evento: eventoId,
          id_usuario: usuarioId,
          codigo_estudiante: codigoEstudiante,
          fecha_asistencia: getCurrentDate(),
          hora_asistencia: getCurrentTime(),
        })
        .select()
        .single();

      if (error) throw error;
      return { asistencia: data as Asistencia, error: null };
    } catch (err: any) {
      setError(err.message);
      return { asistencia: null, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return { registrarAsistencia, loading, error };
}

export function useAccesoEvento(eventoId: number, usuarioId: string) {
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('accesos_eventos')
          .select('id')
          .eq('id_evento', eventoId)
          .eq('id_usuario', usuarioId)
          .single();

        setHasAccess(!!data && !error);
      } catch {
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };

    if (eventoId && usuarioId) {
      checkAccess();
    }
  }, [eventoId, usuarioId]);

  const validateAndGrantAccess = async (codigoAcceso: string) => {
    try {
      // Verify the access code matches the event
      const { data: evento, error: eventoError } = await supabase
        .from('eventos')
        .select('codigo_acceso')
        .eq('id', eventoId)
        .single();

      if (eventoError || !evento) {
        return { success: false, error: 'Evento no encontrado' };
      }

      if (evento.codigo_acceso !== codigoAcceso) {
        return { success: false, error: 'Código de acceso incorrecto' };
      }

      // Grant access
      const { error: insertError } = await supabase.from('accesos_eventos').insert({
        id_evento: eventoId,
        id_usuario: usuarioId,
        codigo_usado: codigoAcceso,
        fecha_acceso: new Date().toISOString(),
      });

      if (insertError) {
        return { success: false, error: insertError.message };
      }

      setHasAccess(true);
      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  return { hasAccess, loading, validateAndGrantAccess };
}

export function useEventoStats(eventoId: number) {
  const [stats, setStats] = useState({
    totalAsistencias: 0,
    estudiantesUnicos: 0,
    asistenciasPorHora: [] as { hora: string; count: number }[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        // Total attendances
        const { count: totalAsistencias } = await supabase
          .from('asistencias')
          .select('*', { count: 'exact', head: true })
          .eq('id_evento', eventoId);

        // Unique students
        const { data: uniqueStudents } = await supabase
          .from('asistencias')
          .select('codigo_estudiante')
          .eq('id_evento', eventoId);

        const estudiantesUnicos = new Set(
          uniqueStudents?.map((a) => a.codigo_estudiante)
        ).size;

        // Attendances per hour
        const { data: asistencias } = await supabase
          .from('asistencias')
          .select('hora_asistencia')
          .eq('id_evento', eventoId);

        const porHora: Record<string, number> = {};
        asistencias?.forEach((a) => {
          const hora = a.hora_asistencia.substring(0, 2) + ':00';
          porHora[hora] = (porHora[hora] || 0) + 1;
        });

        const asistenciasPorHora = Object.entries(porHora)
          .map(([hora, count]) => ({ hora, count }))
          .sort((a, b) => a.hora.localeCompare(b.hora));

        setStats({
          totalAsistencias: totalAsistencias || 0,
          estudiantesUnicos,
          asistenciasPorHora,
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    if (eventoId) {
      fetchStats();
    }
  }, [eventoId]);

  return { stats, loading };
}

export function useGeneralStats() {
  const [stats, setStats] = useState({
    totalEventos: 0,
    eventosActivos: 0,
    asistenciasHoy: 0,
    usuariosActivos: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const today = getCurrentDate();

        // Total events
        const { count: totalEventos } = await supabase
          .from('eventos')
          .select('*', { count: 'exact', head: true });

        // Active events (today is between start and end date)
        const { count: eventosActivos } = await supabase
          .from('eventos')
          .select('*', { count: 'exact', head: true })
          .lte('fecha_inicio', today)
          .gte('fecha_fin', today)
          .eq('activo', true);

        // Attendances today
        const { count: asistenciasHoy } = await supabase
          .from('asistencias')
          .select('*', { count: 'exact', head: true })
          .eq('fecha_asistencia', today);

        // Active users (users who have registered attendances today)
        const { data: activeUsers } = await supabase
          .from('asistencias')
          .select('id_usuario')
          .eq('fecha_asistencia', today);

        const usuariosActivos = new Set(activeUsers?.map((a) => a.id_usuario)).size;

        setStats({
          totalEventos: totalEventos || 0,
          eventosActivos: eventosActivos || 0,
          asistenciasHoy: asistenciasHoy || 0,
          usuariosActivos,
        });
      } catch (err) {
        console.error('Error fetching general stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading };
}

