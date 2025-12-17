'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import type { Evento } from '@pros/shared';

export default function EditarEventoPage() {
  const router = useRouter();
  const params = useParams();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: '',
    encargados: '',
    fecha_inicio: '',
    fecha_fin: '',
    ubicacion: '',
    activo: true,
  });

  useEffect(() => {
    async function fetchEvento() {
      const { data, error } = await supabase
        .from('eventos')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error || !data) {
        router.push('/eventos');
        return;
      }

      setFormData({
        nombre: data.nombre,
        categoria: data.categoria,
        encargados: data.encargados?.join(', ') || '',
        fecha_inicio: data.fecha_inicio,
        fecha_fin: data.fecha_fin,
        ubicacion: data.ubicacion,
        activo: data.activo,
      });
      setFetching(false);
    }

    fetchEvento();
  }, [params.id, supabase, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.nombre || !formData.categoria || !formData.fecha_inicio || !formData.fecha_fin || !formData.ubicacion) {
      setError('Todos los campos son requeridos');
      setLoading(false);
      return;
    }

    const encargadosArray = formData.encargados
      .split(',')
      .map((e) => e.trim())
      .filter((e) => e);

    const { error: updateError } = await supabase
      .from('eventos')
      .update({
        nombre: formData.nombre.trim(),
        categoria: formData.categoria.trim(),
        encargados: encargadosArray,
        fecha_inicio: formData.fecha_inicio,
        fecha_fin: formData.fecha_fin,
        ubicacion: formData.ubicacion.trim(),
        activo: formData.activo,
      })
      .eq('id', params.id);

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    router.push(`/eventos/${params.id}`);
    router.refresh();
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/eventos/${params.id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Editar Evento</h2>
          <p className="text-slate-500 mt-1">Modifica la información del evento</p>
        </div>
      </div>

      <Card className="border-slate-200">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre del evento</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoria">Categoría</Label>
              <Input
                id="categoria"
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="encargados">Encargados (separados por coma)</Label>
              <Input
                id="encargados"
                value={formData.encargados}
                onChange={(e) => setFormData({ ...formData, encargados: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fecha_inicio">Fecha de inicio</Label>
                <Input
                  id="fecha_inicio"
                  type="date"
                  value={formData.fecha_inicio}
                  onChange={(e) => setFormData({ ...formData, fecha_inicio: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fecha_fin">Fecha de fin</Label>
                <Input
                  id="fecha_fin"
                  type="date"
                  value={formData.fecha_fin}
                  onChange={(e) => setFormData({ ...formData, fecha_fin: e.target.value })}
                  min={formData.fecha_inicio}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ubicacion">Ubicación</Label>
              <Input
                id="ubicacion"
                value={formData.ubicacion}
                onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="activo"
                checked={formData.activo}
                onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                className="h-4 w-4 rounded border-slate-300"
              />
              <Label htmlFor="activo">Evento activo</Label>
            </div>

            <div className="flex gap-4 pt-4">
              <Link href={`/eventos/${params.id}`} className="flex-1">
                <Button type="button" variant="outline" className="w-full">
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  'Guardar Cambios'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

