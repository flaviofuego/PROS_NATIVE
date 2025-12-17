import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ArrowLeft, Pencil, CalendarDays, MapPin, Users, Copy } from 'lucide-react';
import { formatDateShort, formatDate, formatTime } from '@pros/shared';
import type { Evento } from '@pros/shared';

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getEvento(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('eventos')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error || !data) return null;
  return data as Evento;
}

async function getAsistencias(eventoId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('asistencias')
    .select(`
      *,
      usuario:users(nombre, email)
    `)
    .eq('id_evento', eventoId)
    .order('created_at', { ascending: false });
  
  return data || [];
}

export default async function EventoDetailPage({ params }: PageProps) {
  const { id } = await params;
  const evento = await getEvento(id);

  if (!evento) {
    notFound();
  }

  const asistencias = await getAsistencias(id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/eventos">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{evento.nombre}</h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary">{evento.categoria}</Badge>
              <Badge variant={evento.activo ? 'success' : 'secondary'}>
                {evento.activo ? 'Activo' : 'Inactivo'}
              </Badge>
            </div>
          </div>
        </div>
        <Link href={`/eventos/${evento.id}/editar`}>
          <Button>
            <Pencil className="h-4 w-4 mr-2" />
            Editar
          </Button>
        </Link>
      </div>

      {/* Event Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50">
                <CalendarDays className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Fechas</p>
                <p className="font-medium text-slate-900">
                  {formatDateShort(evento.fecha_inicio)} - {formatDateShort(evento.fecha_fin)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-50">
                <MapPin className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Ubicación</p>
                <p className="font-medium text-slate-900">{evento.ubicacion}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-50">
                <Copy className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Código de Acceso</p>
                <code className="font-mono font-bold text-slate-900">{evento.codigo_acceso}</code>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Encargados */}
      {evento.encargados && evento.encargados.length > 0 && (
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5" />
              Encargados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {evento.encargados.map((encargado: string, index: number) => (
                <Badge key={index} variant="outline">
                  {encargado}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Asistencias */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg">
            Asistencias ({asistencias.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="font-semibold">Código Estudiante</TableHead>
                <TableHead className="font-semibold">Fecha</TableHead>
                <TableHead className="font-semibold">Hora</TableHead>
                <TableHead className="font-semibold">Registrado por</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {asistencias.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <p className="text-slate-500">No hay asistencias registradas</p>
                  </TableCell>
                </TableRow>
              ) : (
                asistencias.map((asistencia: any) => (
                  <TableRow key={asistencia.id}>
                    <TableCell className="font-mono font-medium">
                      {asistencia.codigo_estudiante}
                    </TableCell>
                    <TableCell>{formatDateShort(asistencia.fecha_asistencia)}</TableCell>
                    <TableCell>{formatTime(asistencia.hora_asistencia)}</TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{asistencia.usuario?.nombre}</p>
                        <p className="text-xs text-slate-500">{asistencia.usuario?.email}</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

