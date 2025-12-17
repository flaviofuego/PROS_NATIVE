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
import { Plus, Eye, Pencil, Trash2, Copy } from 'lucide-react';
import { formatDateShort, type Evento } from '@pros/shared';
import { EventoActions } from './evento-actions';

async function getEventos() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('eventos')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return (data || []) as Evento[];
}

export default async function EventosPage() {
  const eventos = await getEventos();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Eventos</h2>
          <p className="text-slate-500 mt-1">Gestiona los eventos del sistema</p>
        </div>
        <Link href="/eventos/crear">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Evento
          </Button>
        </Link>
      </div>

      <Card className="border-slate-200">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="font-semibold">Nombre</TableHead>
                <TableHead className="font-semibold">Categoría</TableHead>
                <TableHead className="font-semibold">Fechas</TableHead>
                <TableHead className="font-semibold">Código</TableHead>
                <TableHead className="font-semibold">Estado</TableHead>
                <TableHead className="font-semibold text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {eventos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <p className="text-slate-500">No hay eventos registrados</p>
                    <Link href="/eventos/crear">
                      <Button variant="outline" className="mt-4">
                        <Plus className="h-4 w-4 mr-2" />
                        Crear primer evento
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ) : (
                eventos.map((evento) => (
                  <TableRow key={evento.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-slate-900">{evento.nombre}</p>
                        <p className="text-sm text-slate-500">{evento.ubicacion}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{evento.categoria}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{formatDateShort(evento.fecha_inicio)}</p>
                        <p className="text-slate-500">al {formatDateShort(evento.fecha_fin)}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="px-2 py-1 bg-slate-100 rounded text-sm font-mono">
                        {evento.codigo_acceso}
                      </code>
                    </TableCell>
                    <TableCell>
                      <Badge variant={evento.activo ? 'success' : 'secondary'}>
                        {evento.activo ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <EventoActions evento={evento} />
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

