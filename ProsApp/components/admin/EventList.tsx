import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';
import { Evento } from '@/lib/types';

interface EventListProps {
  eventos: Evento[];
  onEventPress: (evento: Evento) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
  emptyMessage?: string;
}

export function EventList({
  eventos,
  onEventPress,
  onRefresh,
  refreshing = false,
  emptyMessage = 'No hay eventos',
}: EventListProps) {
  const renderItem = ({ item }: { item: Evento }) => (
    <Card style={styles.eventCard} onPress={() => onEventPress(item)}>
      <View style={styles.eventHeader}>
        <View style={styles.eventTitleContainer}>
          <Text style={styles.eventName}>{item.nombre}</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: item.activo ? '#dcfce7' : '#fee2e2' },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: item.activo ? '#16a34a' : '#dc2626' },
              ]}
            >
              {item.activo ? 'Activo' : 'Inactivo'}
            </Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
      </View>

      <Text style={styles.eventCategory}>{item.categoria}</Text>

      <View style={styles.eventDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="location-outline" size={16} color="#64748b" />
          <Text style={styles.detailText}>{item.ubicacion}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={16} color="#64748b" />
          <Text style={styles.detailText}>
            {item.fecha_inicio} - {item.fecha_fin}
          </Text>
        </View>
        {item.encargados && item.encargados.length > 0 && (
          <View style={styles.detailRow}>
            <Ionicons name="people-outline" size={16} color="#64748b" />
            <Text style={styles.detailText}>{item.encargados.join(', ')}</Text>
          </View>
        )}
      </View>

      <View style={styles.accessCode}>
        <Text style={styles.accessCodeLabel}>Código de acceso:</Text>
        <Text style={styles.accessCodeValue}>{item.codigo_acceso}</Text>
      </View>
    </Card>
  );

  if (eventos.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="calendar-outline" size={64} color="#cbd5e1" />
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={eventos}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.listContent}
      onRefresh={onRefresh}
      refreshing={refreshing}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  eventCard: {
    marginBottom: 12,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  eventTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  eventName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  eventCategory: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
  },
  eventDetails: {
    gap: 6,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#475569',
    flex: 1,
  },
  accessCode: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  accessCodeLabel: {
    fontSize: 13,
    color: '#64748b',
  },
  accessCodeValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2563eb',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
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
});

