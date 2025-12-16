import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';
import { useGeneralStats } from '@/hooks/useAttendances';
import { useEvents } from '@/hooks/useEvents';

const { width } = Dimensions.get('window');

export default function EstadisticasScreen() {
  const { stats, loading: statsLoading } = useGeneralStats();
  const { eventos, loading: eventosLoading, refetch } = useEvents();

  const categorias = eventos.reduce((acc, evento) => {
    acc[evento.categoria] = (acc[evento.categoria] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoriasData = Object.entries(categorias)
    .map(([nombre, cantidad]) => ({ nombre, cantidad }))
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, 5);

  const maxCategoria = Math.max(...categoriasData.map((c) => c.cantidad), 1);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={statsLoading || eventosLoading}
          onRefresh={refetch}
          colors={['#2563eb']}
        />
      }
    >
      <View style={styles.statsGrid}>
        <Card style={styles.statCard}>
          <View style={[styles.statIconContainer, { backgroundColor: '#dbeafe' }]}>
            <Ionicons name="calendar" size={28} color="#2563eb" />
          </View>
          <Text style={styles.statValue}>{stats.totalEventos}</Text>
          <Text style={styles.statLabel}>Total Eventos</Text>
        </Card>

        <Card style={styles.statCard}>
          <View style={[styles.statIconContainer, { backgroundColor: '#dcfce7' }]}>
            <Ionicons name="checkmark-done" size={28} color="#16a34a" />
          </View>
          <Text style={styles.statValue}>{stats.eventosActivos}</Text>
          <Text style={styles.statLabel}>Eventos Activos</Text>
        </Card>

        <Card style={styles.statCard}>
          <View style={[styles.statIconContainer, { backgroundColor: '#fef3c7' }]}>
            <Ionicons name="people" size={28} color="#d97706" />
          </View>
          <Text style={styles.statValue}>{stats.asistenciasHoy}</Text>
          <Text style={styles.statLabel}>Asistencias Hoy</Text>
        </Card>

        <Card style={styles.statCard}>
          <View style={[styles.statIconContainer, { backgroundColor: '#f3e8ff' }]}>
            <Ionicons name="person" size={28} color="#9333ea" />
          </View>
          <Text style={styles.statValue}>{stats.usuariosActivos}</Text>
          <Text style={styles.statLabel}>Usuarios Activos</Text>
        </Card>
      </View>

      <Card style={styles.chartCard}>
        <Text style={styles.cardTitle}>Eventos por Categoría</Text>
        {categoriasData.length === 0 ? (
          <View style={styles.emptyChart}>
            <Ionicons name="pie-chart-outline" size={48} color="#cbd5e1" />
            <Text style={styles.emptyText}>No hay datos para mostrar</Text>
          </View>
        ) : (
          <View style={styles.barChart}>
            {categoriasData.map((categoria, index) => {
              const percentage = (categoria.cantidad / maxCategoria) * 100;
              const colors = ['#2563eb', '#16a34a', '#d97706', '#9333ea', '#dc2626'];

              return (
                <View key={index} style={styles.barRow}>
                  <Text style={styles.barLabel} numberOfLines={1}>
                    {categoria.nombre}
                  </Text>
                  <View style={styles.barContainer}>
                    <View
                      style={[
                        styles.bar,
                        {
                          width: `${percentage}%`,
                          backgroundColor: colors[index % colors.length],
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.barValue}>{categoria.cantidad}</Text>
                </View>
              );
            })}
          </View>
        )}
      </Card>

      <Card style={styles.summaryCard}>
        <Text style={styles.cardTitle}>Resumen</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Promedio de asistencias por evento:</Text>
          <Text style={styles.summaryValue}>
            {stats.totalEventos > 0
              ? Math.round(stats.asistenciasHoy / stats.totalEventos)
              : 0}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Categorías registradas:</Text>
          <Text style={styles.summaryValue}>{Object.keys(categorias).length}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Tasa de actividad:</Text>
          <Text style={styles.summaryValue}>
            {stats.totalEventos > 0
              ? Math.round((stats.eventosActivos / stats.totalEventos) * 100)
              : 0}
            %
          </Text>
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    width: (width - 44) / 2,
    alignItems: 'center',
    paddingVertical: 20,
  },
  statIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  chartCard: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
  emptyChart: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 12,
  },
  barChart: {
    gap: 16,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  barLabel: {
    width: 80,
    fontSize: 13,
    color: '#475569',
  },
  barContainer: {
    flex: 1,
    height: 28,
    backgroundColor: '#f1f5f9',
    borderRadius: 6,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 6,
  },
  barValue: {
    width: 30,
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    textAlign: 'right',
  },
  summaryCard: {
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
});

