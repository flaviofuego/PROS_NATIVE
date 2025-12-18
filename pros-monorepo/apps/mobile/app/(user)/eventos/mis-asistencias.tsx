import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';
import { useAsistencias } from '@/hooks/useAttendances';
import { useAuth } from '@/contexts/AuthContext';
import { Asistencia } from '@/lib/types';

export default function MisAsistenciasScreen() {
  const { user } = useAuth();
  const { asistencias, loading, refetch } = useAsistencias(undefined, user?.id);

  // Group by event
  const asistenciasPorEvento = asistencias.reduce((acc, asistencia) => {
    const eventoId = asistencia.id_evento;
    if (!acc[eventoId]) {
      acc[eventoId] = {
        evento: asistencia.evento,
        asistencias: [],
      };
    }
    acc[eventoId].asistencias.push(asistencia);
    return acc;
  }, {} as Record<number, { evento: any; asistencias: Asistencia[] }>);

  const eventosData = Object.values(asistenciasPorEvento);

  const renderEvento = ({ item }: { item: { evento: any; asistencias: Asistencia[] } }) => (
    <Card style={styles.eventoCard}>
      <View style={styles.eventoHeader}>
        <View style={styles.eventoIconContainer}>
          <Ionicons name="calendar" size={24} color="#2563eb" />
        </View>
        <View style={styles.eventoInfo}>
          <Text style={styles.eventoName}>
            {item.evento?.nombre || 'Evento sin nombre'}
          </Text>
          <Text style={styles.eventoCategory}>
            {item.evento?.categoria || 'Sin categoría'}
          </Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{item.asistencias.length}</Text>
        </View>
      </View>

      <View style={styles.asistenciasList}>
        {item.asistencias.slice(0, 5).map((asistencia) => (
          <View key={asistencia.id} style={styles.asistenciaRow}>
            <Ionicons name="person-outline" size={16} color="#64748b" />
            <Text style={styles.asistenciaCodigo}>
              {asistencia.codigo_estudiante}
            </Text>
            <Text style={styles.asistenciaFecha}>
              {asistencia.fecha_asistencia}
            </Text>
            <Text style={styles.asistenciaHora}>
              {asistencia.hora_asistencia}
            </Text>
          </View>
        ))}
        {item.asistencias.length > 5 && (
          <Text style={styles.moreText}>
            +{item.asistencias.length - 5} más
          </Text>
        )}
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.summary}>
        <Card style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{asistencias.length}</Text>
              <Text style={styles.summaryLabel}>Total Registros</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{eventosData.length}</Text>
              <Text style={styles.summaryLabel}>Eventos</Text>
            </View>
          </View>
        </Card>
      </View>

      <FlatList
        data={eventosData}
        renderItem={renderEvento}
        keyExtractor={(item) => item.evento?.id?.toString() || Math.random().toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refetch}
            colors={['#2563eb']}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={64} color="#cbd5e1" />
            <Text style={styles.emptyText}>No has registrado asistencias</Text>
            <Text style={styles.emptySubtext}>
              Ve a un evento activo para comenzar a tomar asistencia
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  summary: {
    padding: 16,
    paddingBottom: 8,
  },
  summaryCard: {
    paddingVertical: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e2e8f0',
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 32,
  },
  eventoCard: {
    marginBottom: 12,
  },
  eventoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  eventoIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventoInfo: {
    flex: 1,
  },
  eventoName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  eventoCategory: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  countBadge: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  countText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  asistenciasList: {
    gap: 8,
  },
  asistenciaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  asistenciaCodigo: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
  },
  asistenciaFecha: {
    fontSize: 12,
    color: '#64748b',
  },
  asistenciaHora: {
    fontSize: 12,
    color: '#94a3b8',
    minWidth: 60,
    textAlign: 'right',
  },
  moreText: {
    fontSize: 13,
    color: '#2563eb',
    textAlign: 'center',
    paddingTop: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 4,
    textAlign: 'center',
  },
});

