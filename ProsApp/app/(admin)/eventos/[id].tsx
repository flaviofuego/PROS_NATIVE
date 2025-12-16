import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Share,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useEvento, useEventoMutations } from '@/hooks/useEvents';
import { useAsistencias } from '@/hooks/useAttendances';

export default function EventoDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const eventoId = parseInt(id || '0');
  const { evento, loading, error } = useEvento(eventoId);
  const { deleteEvento, updateEvento, toggleEventoActivo, loading: mutationLoading } =
    useEventoMutations();
  const { asistencias } = useAsistencias(eventoId);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: '',
    encargados: '',
    fecha_inicio: '',
    fecha_fin: '',
    ubicacion: '',
  });

  useEffect(() => {
    if (evento) {
      setFormData({
        nombre: evento.nombre,
        categoria: evento.categoria,
        encargados: evento.encargados?.join(', ') || '',
        fecha_inicio: evento.fecha_inicio,
        fecha_fin: evento.fecha_fin,
        ubicacion: evento.ubicacion,
      });
    }
  }, [evento]);

  const handleShare = async () => {
    if (!evento) return;
    try {
      await Share.share({
        message: `Código de acceso para "${evento.nombre}": ${evento.codigo_acceso}`,
      });
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const handleToggleActive = async () => {
    if (!evento) return;
    await toggleEventoActivo(evento.id, !evento.activo);
    router.back();
  };

  const handleDelete = () => {
    Alert.alert(
      'Eliminar Evento',
      '¿Estás seguro de que deseas eliminar este evento? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const { error } = await deleteEvento(eventoId);
            if (error) {
              Alert.alert('Error', error);
            } else {
              router.back();
            }
          },
        },
      ]
    );
  };

  const handleSave = async () => {
    const encargadosArray = formData.encargados
      .split(',')
      .map((e) => e.trim())
      .filter((e) => e);

    const { error } = await updateEvento(eventoId, {
      nombre: formData.nombre,
      categoria: formData.categoria,
      encargados: encargadosArray,
      fecha_inicio: formData.fecha_inicio,
      fecha_fin: formData.fecha_fin,
      ubicacion: formData.ubicacion,
    });

    if (error) {
      Alert.alert('Error', error);
    } else {
      setIsEditing(false);
      Alert.alert('Éxito', 'El evento ha sido actualizado');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (error || !evento) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error al cargar el evento</Text>
        <Button title="Volver" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card style={styles.accessCodeCard}>
        <Text style={styles.accessCodeLabel}>Código de Acceso</Text>
        <Text style={styles.accessCode}>{evento.codigo_acceso}</Text>
        <Button
          title="Compartir Código"
          onPress={handleShare}
          variant="outline"
          size="small"
          icon={<Ionicons name="share-outline" size={18} color="#2563eb" />}
        />
      </Card>

      <Card style={styles.detailCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Información del Evento</Text>
          <Button
            title={isEditing ? 'Cancelar' : 'Editar'}
            onPress={() => setIsEditing(!isEditing)}
            variant="outline"
            size="small"
          />
        </View>

        {isEditing ? (
          <>
            <Input
              label="Nombre"
              value={formData.nombre}
              onChangeText={(text) => setFormData({ ...formData, nombre: text })}
            />
            <Input
              label="Categoría"
              value={formData.categoria}
              onChangeText={(text) => setFormData({ ...formData, categoria: text })}
            />
            <Input
              label="Encargados"
              value={formData.encargados}
              onChangeText={(text) => setFormData({ ...formData, encargados: text })}
            />
            <Input
              label="Fecha inicio"
              value={formData.fecha_inicio}
              onChangeText={(text) => setFormData({ ...formData, fecha_inicio: text })}
            />
            <Input
              label="Fecha fin"
              value={formData.fecha_fin}
              onChangeText={(text) => setFormData({ ...formData, fecha_fin: text })}
            />
            <Input
              label="Ubicación"
              value={formData.ubicacion}
              onChangeText={(text) => setFormData({ ...formData, ubicacion: text })}
            />
            <Button
              title="Guardar Cambios"
              onPress={handleSave}
              loading={mutationLoading}
            />
          </>
        ) : (
          <>
            <View style={styles.detailRow}>
              <Ionicons name="document-text-outline" size={20} color="#64748b" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Nombre</Text>
                <Text style={styles.detailValue}>{evento.nombre}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="pricetag-outline" size={20} color="#64748b" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Categoría</Text>
                <Text style={styles.detailValue}>{evento.categoria}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="people-outline" size={20} color="#64748b" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Encargados</Text>
                <Text style={styles.detailValue}>
                  {evento.encargados?.join(', ') || 'Sin encargados'}
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={20} color="#64748b" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Fechas</Text>
                <Text style={styles.detailValue}>
                  {evento.fecha_inicio} - {evento.fecha_fin}
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="location-outline" size={20} color="#64748b" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Ubicación</Text>
                <Text style={styles.detailValue}>{evento.ubicacion}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="checkmark-circle-outline" size={20} color="#64748b" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Estado</Text>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: evento.activo ? '#dcfce7' : '#fee2e2' },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      { color: evento.activo ? '#16a34a' : '#dc2626' },
                    ]}
                  >
                    {evento.activo ? 'Activo' : 'Inactivo'}
                  </Text>
                </View>
              </View>
            </View>
          </>
        )}
      </Card>

      <Card style={styles.statsCard}>
        <Text style={styles.cardTitle}>Estadísticas</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{asistencias.length}</Text>
            <Text style={styles.statLabel}>Total Asistencias</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {new Set(asistencias.map((a) => a.codigo_estudiante)).size}
            </Text>
            <Text style={styles.statLabel}>Estudiantes Únicos</Text>
          </View>
        </View>
        <Button
          title="Ver Estadísticas Completas"
          onPress={() => router.push(`/(admin)/eventos/estadisticas/${evento.id}`)}
          variant="outline"
        />
      </Card>

      <Card style={styles.actionsCard}>
        <Text style={styles.cardTitle}>Acciones</Text>
        <View style={styles.actionButtons}>
          <Button
            title={evento.activo ? 'Desactivar' : 'Activar'}
            onPress={handleToggleActive}
            variant={evento.activo ? 'secondary' : 'primary'}
            loading={mutationLoading}
          />
          <Button
            title="Eliminar Evento"
            onPress={handleDelete}
            variant="danger"
            loading={mutationLoading}
          />
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
  accessCodeCard: {
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 8,
  },
  accessCodeLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  accessCode: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2563eb',
    letterSpacing: 4,
    marginBottom: 16,
  },
  detailCard: {
    marginBottom: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: '#1e293b',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statsCard: {
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  statItem: {
    alignItems: 'center',
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
  actionsCard: {
    marginBottom: 8,
  },
  actionButtons: {
    gap: 12,
    marginTop: 16,
  },
});

