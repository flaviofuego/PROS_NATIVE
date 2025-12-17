import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useEvento } from '@/hooks/useEvents';
import { useEventoStats, useAsistencias } from '@/hooks/useAttendances';

export default function EventoStatsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const eventoId = parseInt(id || '0');
  const { evento, loading: eventoLoading } = useEvento(eventoId);
  const { stats, loading: statsLoading } = useEventoStats(eventoId);
  const { asistencias, loading: asistenciasLoading } = useAsistencias(eventoId);

  const loading = eventoLoading || statsLoading || asistenciasLoading;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (!evento) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Evento no encontrado</Text>
        <Button title="Volver" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card style={styles.headerCard}>
        <Text style={styles.eventName}>{evento.nombre}</Text>
        <Text style={styles.eventCategory}>{evento.categoria}</Text>
        <Text style={styles.eventDates}>
          {evento.fecha_inicio} - {evento.fecha_fin}
        </Text>
      </Card>

      <View style={styles.statsGrid}>
        <Card style={styles.statCard}>
          <View style={[styles.statIconContainer, { backgroundColor: '#dbeafe' }]}>
            <Ionicons name="checkmark-done" size={24} color="#2563eb" />
          </View>
          <Text style={styles.statValue}>{stats.totalAsistencias}</Text>
          <Text style={styles.statLabel}>Total Asistencias</Text>
        </Card>

        <Card style={styles.statCard}>
          <View style={[styles.statIconContainer, { backgroundColor: '#dcfce7' }]}>
            <Ionicons name="people" size={24} color="#16a34a" />
          </View>
          <Text style={styles.statValue}>{stats.estudiantesUnicos}</Text>
          <Text style={styles.statLabel}>Estudiantes Únicos</Text>
        </Card>
      </View>

      <Card style={styles.chartCard}>
        <Text style={styles.cardTitle}>Asistencias por Hora</Text>
        {stats.asistenciasPorHora.length === 0 ? (
          <Text style={styles.noDataText}>Sin datos de asistencia</Text>
        ) : (
          <View style={styles.barChart}>
            {stats.asistenciasPorHora.map((item, index) => {
              const maxCount = Math.max(...stats.asistenciasPorHora.map((i) => i.count));
              const percentage = maxCount > 0 ? (item.count / maxCount) * 100 : 0;

              return (
                <View key={index} style={styles.barContainer}>
                  <Text style={styles.barLabel}>{item.hora}</Text>
                  <View style={styles.barBackground}>
                    <View style={[styles.bar, { width: `${percentage}%` }]} />
                  </View>
                  <Text style={styles.barValue}>{item.count}</Text>
                </View>
              );
            })}
          </View>
        )}
      </Card>

      <Card style={styles.listCard}>
        <Text style={styles.cardTitle}>Últimas Asistencias</Text>
        {asistencias.length === 0 ? (
          <Text style={styles.noDataText}>No hay asistencias registradas</Text>
        ) : (
          <View style={styles.asistenciasList}>
            {asistencias.slice(0, 20).map((asistencia) => (
              <View key={asistencia.id} style={styles.asistenciaItem}>
                <View style={styles.asistenciaIcon}>
                  <Ionicons name="person-outline" size={20} color="#64748b" />
                </View>
                <View style={styles.asistenciaContent}>
                  <Text style={styles.asistenciaCodigo}>
                    {asistencia.codigo_estudiante}
                  </Text>
                  <Text style={styles.asistenciaTime}>
                    {asistencia.fecha_asistencia} • {asistencia.hora_asistencia}
                  </Text>
                </View>
              </View>
            ))}
            {asistencias.length > 20 && (
              <Text style={styles.moreText}>
                Y {asistencias.length - 20} asistencias más...
              </Text>
            )}
          </View>
        )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#dc2626',
    marginBottom: 16,
  },
  headerCard: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 8,
  },
  eventName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1e293b',
    textAlign: 'center',
  },
  eventCategory: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  eventDates: {
    fontSize: 14,
    color: '#2563eb',
    marginTop: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  statLabel: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 4,
    textAlign: 'center',
  },
  chartCard: {
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
  noDataText: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    paddingVertical: 20,
  },
  barChart: {
    gap: 12,
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  barLabel: {
    width: 50,
    fontSize: 12,
    color: '#64748b',
  },
  barBackground: {
    flex: 1,
    height: 24,
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    backgroundColor: '#2563eb',
    borderRadius: 4,
  },
  barValue: {
    width: 30,
    fontSize: 12,
    fontWeight: '600',
    color: '#1e293b',
    textAlign: 'right',
  },
  listCard: {
    marginBottom: 8,
  },
  asistenciasList: {
    gap: 8,
  },
  asistenciaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  asistenciaIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  asistenciaContent: {
    flex: 1,
  },
  asistenciaCodigo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  asistenciaTime: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  moreText: {
    fontSize: 14,
    color: '#2563eb',
    textAlign: 'center',
    paddingTop: 12,
  },
});

