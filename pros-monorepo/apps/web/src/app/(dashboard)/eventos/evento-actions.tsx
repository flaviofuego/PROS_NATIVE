'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, Trash2, Copy, MoreHorizontal } from 'lucide-react';
import type { Evento } from '@pros/shared';
import Link from 'next/link';

interface EventoActionsProps {
  evento: Evento;
}

export function EventoActions({ evento }: EventoActionsProps) {
  const router = useRouter();
  const supabase = createClient();

  const handleCopyCode = () => {
    navigator.clipboard.writeText(evento.codigo_acceso);
  };

  const handleDelete = async () => {
    if (!confirm(`¿Estás seguro de eliminar el evento "${evento.nombre}"?`)) {
      return;
    }

    const { error } = await supabase
      .from('eventos')
      .delete()
      .eq('id', evento.id);

    if (error) {
      alert('Error al eliminar: ' + error.message);
      return;
    }

    router.refresh();
  };

  const handleToggleActive = async () => {
    const { error } = await (supabase.from('eventos') as any)
      .update({ activo: !evento.activo })
      .eq('id', evento.id);

    if (error) {
      alert('Error al actualizar: ' + error.message);
      return;
    }

    router.refresh();
  };

  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleCopyCode}
        title="Copiar código"
      >
        <Copy className="h-4 w-4" />
      </Button>
      <Link href={`/eventos/${evento.id}`}>
        <Button variant="ghost" size="icon" title="Ver detalles">
          <Eye className="h-4 w-4" />
        </Button>
      </Link>
      <Link href={`/eventos/${evento.id}/editar`}>
        <Button variant="ghost" size="icon" title="Editar">
          <Pencil className="h-4 w-4" />
        </Button>
      </Link>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDelete}
        className="text-red-500 hover:text-red-600 hover:bg-red-50"
        title="Eliminar"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

