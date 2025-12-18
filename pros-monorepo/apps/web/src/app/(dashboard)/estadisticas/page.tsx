import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Users, CheckCircle, TrendingUp, Clock } from 'lucide-react';
import { StatsCharts } from './stats-charts';
import type { Asistencia } from '@pros/shared';

async function getStats() {
  const supabase = await createClient();
  const today = new Date().toISOString().split('T')[0];

  // Get basic counts
  const [
    eventosResult,
    usuariosResult,
    asistenciasResult,
    eventosActivosResult,
  ] = await Promise.all([
    supabase.from('eventos').select('id', { count: 'exact' }),
    supabase.from('users').select('id', { count: 'exact' }),
    supabase.from('asistencias').select('id', { count: 'exact' }),
    supabase.from('eventos').select('id', { count: 'exact' }).eq('activo', true),
  ]);

  // Get attendances by day for the last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const { data: asistenciasPorDia } = await supabase
    .from('asistencias')
    .select('fecha_asistencia')
    .gte('fecha_asistencia', sevenDaysAgo.toISOString().split('T')[0]);

  // Group by date
  const asistenciasByDate: Record<string, number> = {};
  const asistenciasPorDiaRows = (asistenciasPorDia ?? []) as Pick<Asistencia, 'fecha_asistencia'>[];
  asistenciasPorDiaRows.forEach((a) => {
    asistenciasByDate[a.fecha_asistencia] = (asistenciasByDate[a.fecha_asistencia] || 0) + 1;
  });

  // Create data for last 7 days
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    last7Days.push({
      date: dateStr,
      label: date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' }),
      count: asistenciasByDate[dateStr] || 0,
    });
  }

  // Get attendances by hour
  const { data: asistenciasPorHora } = await supabase
    .from('asistencias')
    .select('hora_asistencia')
    .eq('fecha_asistencia', today);

  const hourCounts: Record<number, number> = {};
  const asistenciasPorHoraRows = (asistenciasPorHora ?? []) as Pick<Asistencia, 'hora_asistencia'>[];
  asistenciasPorHoraRows.forEach((a) => {
    const hour = parseInt(a.hora_asistencia.split(':')[0]);
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
  });

  const hourlyData = [];
  for (let i = 7; i <= 21; i++) {
    hourlyData.push({
      hour: `${i}:00`,
      count: hourCounts[i] || 0,
    });
  }

  // Get top events by attendance
  const { data: topEventos } = await supabase
    .from('eventos')
    .select(`
      id,
      nombre,
      asistencias:asistencias(count)
    `)
    .limit(5);

  const topEventosData = (topEventos || []).map((e: any) => ({
    nombre: e.nombre,
    count: e.asistencias?.[0]?.count || 0,
  })).sort((a: any, b: any) => b.count - a.count);

  return {
    totalEventos: eventosResult.count || 0,
    totalUsuarios: usuariosResult.count || 0,
    totalAsistencias: asistenciasResult.count || 0,
    eventosActivos: eventosActivosResult.count || 0,
    asistenciasPorDia: last7Days,
    asistenciasPorHora: hourlyData,
    topEventos: topEventosData,
  };
}

export default async function EstadisticasPage() {
  const stats = await getStats();

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
      title: 'Total Usuarios',
      value: stats.totalUsuarios,
      icon: Users,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      title: 'Total Asistencias',
      value: stats.totalAsistencias,
      icon: CheckCircle,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Estadísticas</h2>
        <p className="text-slate-500 mt-1">Análisis de asistencias y eventos</p>
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

      {/* Charts */}
      <StatsCharts
        asistenciasPorDia={stats.asistenciasPorDia}
        asistenciasPorHora={stats.asistenciasPorHora}
        topEventos={stats.topEventos}
      />
    </div>
  );
}

