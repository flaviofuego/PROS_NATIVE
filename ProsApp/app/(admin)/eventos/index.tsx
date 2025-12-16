import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useEvents } from '@/hooks/useEvents';
import { Evento } from '@/lib/types';

type FilterType = 'all' | 'active' | 'inactive';

export default function EventosListScreen() {
  const { eventos, loading, refetch } = useEvents();
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredEventos = eventos.filter((evento) => {
    if (filter === 'active') return evento.activo;
    if (filter === 'inactive') return !evento.activo;
    return true;
  });

  const renderEvento = ({ item }: { item: Evento }) => (
    <Card
      style={styles.eventCard}
      onPress={() => router.push(`/(admin)/eventos/${item.id}`)}
    >
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
        <View style={styles.detailRow}>
          <Ionicons name="people-outline" size={16} color="#64748b" />
          <Text style={styles.detailText}>
            {item.encargados?.join(', ') || 'Sin encargados'}
          </Text>
        </View>
      </View>

      <View style={styles.accessCode}>
        <Text style={styles.accessCodeLabel}>Código de acceso:</Text>
        <Text style={styles.accessCodeValue}>{item.codigo_acceso}</Text>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
          onPress={() => setFilter('all')}
        >
          <Text
            style={[
              styles.filterButtonText,
              filter === 'all' && styles.filterButtonTextActive,
            ]}
          >
            Todos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'active' && styles.filterButtonActive]}
          onPress={() => setFilter('active')}
        >
          <Text
            style={[
              styles.filterButtonText,
              filter === 'active' && styles.filterButtonTextActive,
            ]}
          >
            Activos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'inactive' && styles.filterButtonActive,
          ]}
          onPress={() => setFilter('inactive')}
        >
          <Text
            style={[
              styles.filterButtonText,
              filter === 'inactive' && styles.filterButtonTextActive,
            ]}
          >
            Inactivos
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredEventos}
        renderItem={renderEvento}
        keyExtractor={(item) => item.id.toString()}
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
            <Ionicons name="calendar-outline" size={64} color="#cbd5e1" />
            <Text style={styles.emptyText}>No hay eventos</Text>
            <Text style={styles.emptySubtext}>
              Crea tu primer evento para comenzar
            </Text>
          </View>
        }
      />

      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push('/(admin)/eventos/crear')}
        >
          <Ionicons name="add" size={28} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e2e8f0',
  },
  filterButtonActive: {
    backgroundColor: '#2563eb',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  filterButtonTextActive: {
    color: '#ffffff',
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
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
  emptySubtext: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 4,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 24,
    right: 24,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

