'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Trash2, Shield, User as UserIcon } from 'lucide-react';
import type { User } from '@pros/shared';

interface UsuarioActionsProps {
  usuario: User;
}

export function UsuarioActions({ usuario }: UsuarioActionsProps) {
  const router = useRouter();
  const supabase = createClient();

  const handleDelete = async () => {
    if (!confirm(`¿Estás seguro de eliminar al usuario "${usuario.nombre}"?`)) {
      return;
    }

    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', usuario.id);

    if (error) {
      alert('Error al eliminar: ' + error.message);
      return;
    }

    router.refresh();
  };

  const handleToggleRole = async () => {
    const newRole = usuario.role === 'admin' ? 'user' : 'admin';
    const confirmMsg = usuario.role === 'admin'
      ? `¿Cambiar a "${usuario.nombre}" de Administrador a Usuario?`
      : `¿Dar privilegios de Administrador a "${usuario.nombre}"?`;

    if (!confirm(confirmMsg)) {
      return;
    }

    const { error } = await (supabase.from('users') as any)
      .update({ role: newRole })
      .eq('id', usuario.id);

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
        onClick={handleToggleRole}
        title={usuario.role === 'admin' ? 'Quitar admin' : 'Hacer admin'}
      >
        {usuario.role === 'admin' ? (
          <UserIcon className="h-4 w-4" />
        ) : (
          <Shield className="h-4 w-4" />
        )}
      </Button>
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

