import { useState, useEffect, useCallback } from 'react';
import { supabase, generateAccessCode, getCurrentDate } from '@/lib/supabase';
import { Evento, EventoFormData } from '@/lib/types';

export function useEvents() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEventos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('eventos')
        .select('*')
        .order('fecha_inicio', { ascending: false });

      if (error) throw error;
      setEventos(data as Evento[]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEventos();
  }, [fetchEventos]);

  return { eventos, loading, error, refetch: fetchEventos };
}

export function useActiveEvents() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActiveEventos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const today = getCurrentDate();
      const { data, error } = await supabase
        .from('eventos')
        .select('*')
        .lte('fecha_inicio', today)
        .gte('fecha_fin', today)
        .eq('activo', true)
        .order('nombre');

      if (error) throw error;
      setEventos(data as Evento[]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActiveEventos();
  }, [fetchActiveEventos]);

  return { eventos, loading, error, refetch: fetchActiveEventos };
}

export function useEvento(id: number | null) {
  const [evento, setEvento] = useState<Evento | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id === null) {
      setLoading(false);
      return;
    }

    const fetchEvento = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('eventos')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setEvento(data as Evento);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvento();
  }, [id]);

  return { evento, loading, error };
}

export function useEventoMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createEvento = async (data: EventoFormData, createdBy: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data: evento, error } = await supabase
        .from('eventos')
        .insert({
          ...data,
          codigo_acceso: generateAccessCode(6),
          activo: true,
          created_by: createdBy,
        })
        .select()
        .single();

      if (error) throw error;
      return { evento: evento as Evento, error: null };
    } catch (err: any) {
      setError(err.message);
      return { evento: null, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateEvento = async (id: number, data: Partial<EventoFormData>) => {
    setLoading(true);
    setError(null);
    try {
      const { data: evento, error } = await supabase
        .from('eventos')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { evento: evento as Evento, error: null };
    } catch (err: any) {
      setError(err.message);
      return { evento: null, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteEvento = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.from('eventos').delete().eq('id', id);

      if (error) throw error;
      return { error: null };
    } catch (err: any) {
      setError(err.message);
      return { error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const toggleEventoActivo = async (id: number, activo: boolean) => {
    return updateEvento(id, { activo } as any);
  };

  return { createEvento, updateEvento, deleteEvento, toggleEventoActivo, loading, error };
}

