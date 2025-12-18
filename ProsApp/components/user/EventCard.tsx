import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Evento } from '@/lib/types';

interface EventCardProps {
  evento: Evento;
  onPress: () => void;
}

export function EventCard({ evento, onPress }: EventCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="calendar" size={24} color="#2563eb" />
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.name}>{evento.nombre}</Text>
          <Text style={styles.category}>{evento.categoria}</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#94a3b8" />
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Ionicons name="location-outline" size={16} color="#64748b" />
          <Text style={styles.detailText}>{evento.ubicacion}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={16} color="#64748b" />
          <Text style={styles.detailText}>
            {evento.fecha_inicio} - {evento.fecha_fin}
          </Text>
        </View>
        {evento.encargados && evento.encargados.length > 0 && (
          <View style={styles.detailRow}>
            <Ionicons name="people-outline" size={16} color="#64748b" />
            <Text style={styles.detailText}>{evento.encargados.join(', ')}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  category: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
  details: {
    gap: 8,
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
});

