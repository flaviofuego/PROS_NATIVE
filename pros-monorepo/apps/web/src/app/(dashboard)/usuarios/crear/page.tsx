'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Loader2, Shield, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function CrearUsuarioPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    role: 'user' as 'admin' | 'user',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!formData.nombre || !formData.email || !formData.password) {
      setError('Todos los campos son requeridos');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    // Try to create user via signup (since admin.createUser requires service role)
    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          nombre: formData.nombre,
          role: formData.role,
        },
      },
    });

    if (signupError) {
      if (signupError.message.includes('already registered')) {
        setError('Este correo electrónico ya está registrado');
      } else {
        setError(signupError.message);
      }
      setLoading(false);
      return;
    }

    if (signupData.user) {
      // Create user profile
      const { error: profileError } = await (supabase.from('users') as any).insert({
        id: signupData.user.id,
        email: formData.email.trim().toLowerCase(),
        nombre: formData.nombre.trim(),
        role: formData.role,
      });

      if (profileError) {
        setError(profileError.message);
        setLoading(false);
        return;
      }
    }

    router.push('/usuarios');
    router.refresh();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/usuarios">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Crear Usuario</h2>
          <p className="text-slate-500 mt-1">Completa la información del nuevo usuario</p>
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
              <Label htmlFor="nombre">Nombre completo</Label>
              <Input
                id="nombre"
                placeholder="Ej: Juan Pérez"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="usuario@ejemplo.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Rol del usuario</Label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'user' })}
                  className={cn(
                    'p-4 rounded-lg border-2 text-left transition-all',
                    formData.role === 'user'
                      ? 'border-primary bg-primary/5'
                      : 'border-slate-200 hover:border-slate-300'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'p-2 rounded-lg',
                      formData.role === 'user' ? 'bg-primary/10' : 'bg-slate-100'
                    )}>
                      <UserIcon className={cn(
                        'h-5 w-5',
                        formData.role === 'user' ? 'text-primary' : 'text-slate-500'
                      )} />
                    </div>
                    <div>
                      <p className={cn(
                        'font-medium',
                        formData.role === 'user' ? 'text-primary' : 'text-slate-700'
                      )}>Usuario</p>
                      <p className="text-xs text-slate-500">Toma asistencias</p>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'admin' })}
                  className={cn(
                    'p-4 rounded-lg border-2 text-left transition-all',
                    formData.role === 'admin'
                      ? 'border-primary bg-primary/5'
                      : 'border-slate-200 hover:border-slate-300'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'p-2 rounded-lg',
                      formData.role === 'admin' ? 'bg-primary/10' : 'bg-slate-100'
                    )}>
                      <Shield className={cn(
                        'h-5 w-5',
                        formData.role === 'admin' ? 'text-primary' : 'text-slate-500'
                      )} />
                    </div>
                    <div>
                      <p className={cn(
                        'font-medium',
                        formData.role === 'admin' ? 'text-primary' : 'text-slate-700'
                      )}>Administrador</p>
                      <p className="text-xs text-slate-500">Acceso completo</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Link href="/usuarios" className="flex-1">
                <Button type="button" variant="outline" className="w-full">
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creando...
                  </>
                ) : (
                  'Crear Usuario'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

