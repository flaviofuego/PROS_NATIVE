import React from 'react';
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
import { useActiveEvents } from '@/hooks/useEvents';
import { useAuth } from '@/contexts/AuthContext';
import { Evento } from '@/lib/types';

export default function EventosActivosScreen() {
  const { user } = useAuth();
  const { eventos, loading, refetch } = useActiveEvents();

  const renderEvento = ({ item }: { item: Evento }) => (
    <Card
      style={styles.eventCard}
      onPress={() => router.push(`/(user)/eventos/${item.id}`)}
    >
      <View style={styles.eventHeader}>
        <View style={styles.eventIconContainer}>
          <Ionicons name="calendar" size={24} color="#2563eb" />
        </View>
        <View style={styles.eventInfo}>
          <Text style={styles.eventName}>{item.nombre}</Text>
          <Text style={styles.eventCategory}>{item.categoria}</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#94a3b8" />
      </View>

      <View style={styles.eventDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="location-outline" size={16} color="#64748b" />
          <Text style={styles.detailText}>{item.ubicacion}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={16} color="#64748b" />
          <Text style={styles.detailText}>
            {item.fecha_inicio} - {item.fecha_fin}
          </Text>
        </View>
      </View>

      <View style={styles.eventAction}>
        <Text style={styles.actionText}>Toca para tomar asistencia</Text>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Hola, {user?.nombre || 'Usuario'}</Text>
        <Text style={styles.subtitleText}>
          Eventos activos para hoy
        </Text>
      </View>

      <TouchableOpacity
        style={styles.historyButton}
        onPress={() => router.push('/(user)/eventos/mis-asistencias')}
      >
        <Ionicons name="time-outline" size={20} color="#2563eb" />
        <Text style={styles.historyButtonText}>Ver mis asistencias</Text>
        <Ionicons name="chevron-forward" size={20} color="#2563eb" />
      </TouchableOpacity>

      <FlatList
        data={eventos}
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
            <Text style={styles.emptyText}>No hay eventos activos hoy</Text>
            <Text style={styles.emptySubtext}>
              Vuelve más tarde o contacta al administrador
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
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
  },
  subtitleText: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    marginHorizontal: 16,
    padding: 12,
    borderRadius: 12,
    gap: 8,
    marginBottom: 8,
  },
  historyButtonText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#2563eb',
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 32,
  },
  eventCard: {
    marginBottom: 12,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  eventIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventInfo: {
    flex: 1,
  },
  eventName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  eventCategory: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
  eventDetails: {
    gap: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
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
  eventAction: {
    paddingTop: 12,
    alignItems: 'center',
  },
  actionText: {
    fontSize: 13,
    color: '#2563eb',
    fontWeight: '600',
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

