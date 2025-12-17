import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Users, CheckCircle, TrendingUp } from 'lucide-react';
import { formatDateShort } from '@pros/shared';

async function getStats() {
  const supabase = await createClient();
  const today = new Date().toISOString().split('T')[0];

  const [eventosResult, usuariosResult, asistenciasHoyResult, eventosActivosResult] = await Promise.all([
    supabase.from('eventos').select('id', { count: 'exact' }),
    supabase.from('users').select('id', { count: 'exact' }),
    supabase.from('asistencias').select('id', { count: 'exact' }).eq('fecha_asistencia', today),
    supabase.from('eventos').select('id', { count: 'exact' }).eq('activo', true),
  ]);

  return {
    totalEventos: eventosResult.count || 0,
    totalUsuarios: usuariosResult.count || 0,
    asistenciasHoy: asistenciasHoyResult.count || 0,
    eventosActivos: eventosActivosResult.count || 0,
  };
}

async function getRecentEvents() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('eventos')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);
  return data || [];
}

async function getRecentAttendances() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('asistencias')
    .select(`
      *,
      evento:eventos(nombre),
      usuario:users(nombre)
    `)
    .order('created_at', { ascending: false })
    .limit(5);
  return data || [];
}

export default async function DashboardPage() {
  const [stats, recentEvents, recentAttendances] = await Promise.all([
    getStats(),
    getRecentEvents(),
    getRecentAttendances(),
  ]);

  const statCards = [
    {
      title: 'Total Eventos',
      value: stats.totalEventos,
      icon: CalendarDays,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: 'Eventos Activos',
      value: stats.eventosActivos,
      icon: TrendingUp,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      title: 'Usuarios',
      value: stats.totalUsuarios,
      icon: Users,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      title: 'Asistencias Hoy',
      value: stats.asistenciasHoy,
      icon: CheckCircle,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
        <p className="text-slate-500 mt-1">Resumen general del sistema</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-sm text-slate-500">{stat.title}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Events */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">Eventos Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentEvents.length === 0 ? (
                <p className="text-slate-500 text-sm">No hay eventos recientes</p>
              ) : (
                recentEvents.map((evento: any) => (
                  <div key={evento.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                    <div>
                      <p className="font-medium text-slate-900">{evento.nombre}</p>
                      <p className="text-sm text-slate-500">{evento.categoria}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-500">
                        {formatDateShort(evento.fecha_inicio)}
                      </p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${evento.activo ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                        {evento.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Attendances */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">Asistencias Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAttendances.length === 0 ? (
                <p className="text-slate-500 text-sm">No hay asistencias recientes</p>
              ) : (
                recentAttendances.map((asistencia: any) => (
                  <div key={asistencia.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                    <div>
                      <p className="font-medium text-slate-900">{asistencia.codigo_estudiante}</p>
                      <p className="text-sm text-slate-500">{asistencia.evento?.nombre}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-500">{asistencia.hora_asistencia}</p>
                      <p className="text-xs text-slate-400">
                        por {asistencia.usuario?.nombre}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

