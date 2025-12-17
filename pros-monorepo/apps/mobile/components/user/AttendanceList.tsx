import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Asistencia } from '@/lib/types';

interface AttendanceListProps {
  asistencias: Asistencia[];
  maxItems?: number;
  showEventInfo?: boolean;
}

export function AttendanceList({
  asistencias,
  maxItems,
  showEventInfo = false,
}: AttendanceListProps) {
  const displayData = maxItems ? asistencias.slice(0, maxItems) : asistencias;

  if (asistencias.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="document-text-outline" size={48} color="#cbd5e1" />
        <Text style={styles.emptyText}>No hay asistencias registradas</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: Asistencia }) => (
    <View style={styles.item}>
      <View style={styles.iconContainer}>
        <Ionicons name="checkmark-circle" size={20} color="#16a34a" />
      </View>
      <View style={styles.content}>
        <Text style={styles.code}>{item.codigo_estudiante}</Text>
        {showEventInfo && item.evento && (
          <Text style={styles.eventName}>{item.evento.nombre}</Text>
        )}
        <Text style={styles.dateTime}>
          {item.fecha_asistencia} • {item.hora_asistencia}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={displayData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        scrollEnabled={false}
      />
      {maxItems && asistencias.length > maxItems && (
        <Text style={styles.moreText}>
          +{asistencias.length - maxItems} más
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 12,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#dcfce7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  code: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  eventName: {
    fontSize: 14,
    color: '#2563eb',
    marginTop: 2,
  },
  dateTime: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 4,
  },
  moreText: {
    fontSize: 14,
    color: '#2563eb',
    textAlign: 'center',
    paddingTop: 12,
    fontWeight: '500',
  },
});

