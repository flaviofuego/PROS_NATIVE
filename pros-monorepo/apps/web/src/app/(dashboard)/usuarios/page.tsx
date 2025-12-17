import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, UserCircle } from 'lucide-react';
import { formatDateShort, getInitials, type User } from '@pros/shared';
import { UsuarioActions } from './usuario-actions';

async function getUsuarios() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return (data || []) as User[];
}

export default async function UsuariosPage() {
  const usuarios = await getUsuarios();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Usuarios</h2>
          <p className="text-slate-500 mt-1">Gestiona los usuarios del sistema</p>
        </div>
        <Link href="/usuarios/crear">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Usuario
          </Button>
        </Link>
      </div>

      <Card className="border-slate-200">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="font-semibold">Usuario</TableHead>
                <TableHead className="font-semibold">Email</TableHead>
                <TableHead className="font-semibold">Rol</TableHead>
                <TableHead className="font-semibold">Fecha Registro</TableHead>
                <TableHead className="font-semibold text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usuarios.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12">
                    <p className="text-slate-500">No hay usuarios registrados</p>
                    <Link href="/usuarios/crear">
                      <Button variant="outline" className="mt-4">
                        <Plus className="h-4 w-4 mr-2" />
                        Crear primer usuario
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ) : (
                usuarios.map((usuario) => (
                  <TableRow key={usuario.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-semibold text-primary">
                            {getInitials(usuario.nombre)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{usuario.nombre}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600">{usuario.email}</TableCell>
                    <TableCell>
                      <Badge variant={usuario.role === 'admin' ? 'default' : 'secondary'}>
                        {usuario.role === 'admin' ? 'Administrador' : 'Usuario'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-500">
                      {formatDateShort(usuario.created_at)}
                    </TableCell>
                    <TableCell className="text-right">
                      <UsuarioActions usuario={usuario} />
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

