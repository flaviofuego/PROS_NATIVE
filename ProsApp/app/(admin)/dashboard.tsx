import React from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { useGeneralStats } from '@/hooks/useAttendances';
import { useEvents } from '@/hooks/useEvents';

export default function DashboardScreen() {
  const { user } = useAuth();
  const { stats, loading: statsLoading } = useGeneralStats();
  const { eventos, loading: eventosLoading, refetch } = useEvents();

  const recentEventos = eventos.slice(0, 5);

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
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeText}>Bienvenido,</Text>
        <Text style={styles.userName}>{user?.nombre || 'Administrador'}</Text>
      </View>

      <View style={styles.statsGrid}>
        <Card style={styles.statCard}>
          <View style={[styles.statIconContainer, { backgroundColor: '#dbeafe' }]}>
            <Ionicons name="calendar" size={24} color="#2563eb" />
          </View>
          <Text style={styles.statValue}>{stats.totalEventos}</Text>
          <Text style={styles.statLabel}>Total Eventos</Text>
        </Card>

        <Card style={styles.statCard}>
          <View style={[styles.statIconContainer, { backgroundColor: '#dcfce7' }]}>
            <Ionicons name="checkmark-circle" size={24} color="#16a34a" />
          </View>
          <Text style={styles.statValue}>{stats.eventosActivos}</Text>
          <Text style={styles.statLabel}>Eventos Activos</Text>
        </Card>

        <Card style={styles.statCard}>
          <View style={[styles.statIconContainer, { backgroundColor: '#fef3c7' }]}>
            <Ionicons name="people" size={24} color="#d97706" />
          </View>
          <Text style={styles.statValue}>{stats.asistenciasHoy}</Text>
          <Text style={styles.statLabel}>Asistencias Hoy</Text>
        </Card>

        <Card style={styles.statCard}>
          <View style={[styles.statIconContainer, { backgroundColor: '#f3e8ff' }]}>
            <Ionicons name="person" size={24} color="#9333ea" />
          </View>
          <Text style={styles.statValue}>{stats.usuariosActivos}</Text>
          <Text style={styles.statLabel}>Usuarios Activos</Text>
        </Card>
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
        <View style={styles.actionButtons}>
          <Button
            title="Nuevo Evento"
            onPress={() => router.push('/(admin)/eventos/crear')}
            variant="primary"
            style={styles.actionButton}
            icon={<Ionicons name="add-circle-outline" size={20} color="#fff" />}
          />
          <Button
            title="Nuevo Usuario"
            onPress={() => router.push('/(admin)/usuarios/crear')}
            variant="secondary"
            style={styles.actionButton}
            icon={<Ionicons name="person-add-outline" size={20} color="#fff" />}
          />
        </View>
      </View>

      <View style={styles.recentSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Eventos Recientes</Text>
          <Button
            title="Ver todos"
            onPress={() => router.push('/(admin)/eventos')}
            variant="outline"
            size="small"
          />
        </View>

        {recentEventos.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>No hay eventos registrados</Text>
          </Card>
        ) : (
          recentEventos.map((evento) => (
            <Card
              key={evento.id}
              style={styles.eventCard}
              onPress={() => router.push(`/(admin)/eventos/${evento.id}`)}
            >
              <View style={styles.eventHeader}>
                <Text style={styles.eventName}>{evento.nombre}</Text>
                <View
                  style={[
                    styles.eventStatus,
                    { backgroundColor: evento.activo ? '#dcfce7' : '#fee2e2' },
                  ]}
                >
                  <Text
                    style={[
                      styles.eventStatusText,
                      { color: evento.activo ? '#16a34a' : '#dc2626' },
                    ]}
                  >
                    {evento.activo ? 'Activo' : 'Inactivo'}
                  </Text>
                </View>
              </View>
              <Text style={styles.eventCategory}>{evento.categoria}</Text>
              <View style={styles.eventMeta}>
                <Ionicons name="location-outline" size={14} color="#64748b" />
                <Text style={styles.eventMetaText}>{evento.ubicacion}</Text>
              </View>
              <View style={styles.eventMeta}>
                <Ionicons name="calendar-outline" size={14} color="#64748b" />
                <Text style={styles.eventMetaText}>
                  {evento.fecha_inicio} - {evento.fecha_fin}
                </Text>
              </View>
            </Card>
          ))
        )}
      </View>
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
  welcomeSection: {
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 16,
    color: '#64748b',
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    flexGrow: 1,
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
  },
  quickActions: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  recentSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    color: '#94a3b8',
    fontSize: 16,
  },
  eventCard: {
    marginBottom: 8,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    flex: 1,
  },
  eventStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  eventStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  eventCategory: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  eventMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  eventMetaText: {
    fontSize: 13,
    color: '#64748b',
  },
});

