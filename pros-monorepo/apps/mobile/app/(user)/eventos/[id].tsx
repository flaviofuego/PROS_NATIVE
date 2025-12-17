import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { BarcodeScanner } from '@/components/user/BarcodeScanner';
import { useEvento } from '@/hooks/useEvents';
import {
  useAccesoEvento,
  useAsistenciasHoy,
  useAsistenciaMutations,
} from '@/hooks/useAttendances';
import { useAuth } from '@/contexts/AuthContext';
import { Asistencia } from '@/lib/types';
import * as Haptics from 'expo-haptics';

export default function TomarAsistenciaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const eventoId = parseInt(id || '0');
  const { user } = useAuth();
  const { evento, loading: eventoLoading } = useEvento(eventoId);
  const { hasAccess, loading: accessLoading, validateAndGrantAccess } = useAccesoEvento(
    eventoId,
    user?.id || ''
  );
  const { asistencias, refetch: refetchAsistencias } = useAsistenciasHoy(
    eventoId,
    user?.id || ''
  );
  const { registrarAsistencia, loading: registrando } = useAsistenciaMutations();

  const [accessCode, setAccessCode] = useState('');
  const [accessError, setAccessError] = useState('');
  const [validatingAccess, setValidatingAccess] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [lastScanned, setLastScanned] = useState<string | null>(null);

  const handleValidateAccess = async () => {
    if (!accessCode.trim()) {
      setAccessError('Ingresa el código de acceso');
      return;
    }

    setAccessError('');
    setValidatingAccess(true);

    const { success, error } = await validateAndGrantAccess(accessCode.trim().toUpperCase());

    if (!success) {
      setAccessError(error || 'Código inválido');
    }

    setValidatingAccess(false);
  };

  const handleBarcodeScanned = async (code: string) => {
    if (registrando || code === lastScanned) return;

    setLastScanned(code);

    // Haptic feedback
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const { asistencia, error } = await registrarAsistencia(
      eventoId,
      user?.id || '',
      code
    );

    if (error) {
      Alert.alert('Error', error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } else {
      refetchAsistencias();
    }

    // Reset lastScanned after a delay to allow re-scanning
    setTimeout(() => setLastScanned(null), 2000);
  };

  if (eventoLoading || accessLoading) {
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
      </View>
    );
  }

  // Show access code screen if user doesn't have access
  if (!hasAccess) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.accessContent}>
        <Card style={styles.accessCard}>
          <View style={styles.accessIconContainer}>
            <Ionicons name="lock-closed" size={48} color="#2563eb" />
          </View>
          <Text style={styles.accessTitle}>Código de Acceso Requerido</Text>
          <Text style={styles.accessSubtitle}>
            Para tomar asistencia en este evento, necesitas ingresar el código de acceso
            proporcionado por el administrador.
          </Text>

          <View style={styles.eventInfo}>
            <Text style={styles.eventName}>{evento.nombre}</Text>
            <Text style={styles.eventCategory}>{evento.categoria}</Text>
          </View>

          <Input
            label="Código de Acceso"
            placeholder="Ingresa el código"
            value={accessCode}
            onChangeText={(text) => setAccessCode(text.toUpperCase())}
            error={accessError}
            autoCapitalize="characters"
            leftIcon="key-outline"
          />

          <Button
            title="Verificar Código"
            onPress={handleValidateAccess}
            loading={validatingAccess}
          />
        </Card>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.eventHeader}>
        <Text style={styles.eventHeaderName}>{evento.nombre}</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{asistencias.length}</Text>
            <Text style={styles.statLabel}>Registros hoy</Text>
          </View>
        </View>
      </View>

      {scanning ? (
        <View style={styles.scannerContainer}>
          <BarcodeScanner
            onCodeScanned={handleBarcodeScanned}
            enabled={!registrando}
          />
          <View style={styles.scannerOverlay}>
            {registrando && (
              <View style={styles.processingIndicator}>
                <ActivityIndicator color="#ffffff" />
                <Text style={styles.processingText}>Registrando...</Text>
              </View>
            )}
          </View>
          <Button
            title="Detener Escaneo"
            onPress={() => setScanning(false)}
            variant="secondary"
            style={styles.stopButton}
          />
        </View>
      ) : (
        <View style={styles.startScanContainer}>
          <Card style={styles.startScanCard}>
            <Ionicons name="scan" size={64} color="#2563eb" />
            <Text style={styles.startScanTitle}>Listo para escanear</Text>
            <Text style={styles.startScanSubtitle}>
              Presiona el botón para comenzar a escanear códigos de barras estudiantiles
            </Text>
            <Button
              title="Iniciar Escaneo"
              onPress={() => setScanning(true)}
              icon={<Ionicons name="scan-outline" size={20} color="#fff" />}
            />
          </Card>
        </View>
      )}

      {asistencias.length > 0 && (
        <View style={styles.recentContainer}>
          <Text style={styles.recentTitle}>Asistencias recientes</Text>
          <FlatList
            data={asistencias.slice(0, 5)}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }: { item: Asistencia }) => (
              <View style={styles.asistenciaItem}>
                <View style={styles.asistenciaIcon}>
                  <Ionicons name="checkmark-circle" size={20} color="#16a34a" />
                </View>
                <Text style={styles.asistenciaCodigo}>{item.codigo_estudiante}</Text>
                <Text style={styles.asistenciaHora}>{item.hora_asistencia}</Text>
              </View>
            )}
            scrollEnabled={false}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
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
  },
  accessContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  accessCard: {
    alignItems: 'center',
    padding: 24,
  },
  accessIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  accessTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
    textAlign: 'center',
  },
  accessSubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  eventInfo: {
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  eventName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  eventCategory: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  eventHeader: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  eventHeaderName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  scannerContainer: {
    flex: 1,
    position: 'relative',
  },
  scannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  processingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  processingText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  stopButton: {
    position: 'absolute',
    bottom: 32,
    left: 16,
    right: 16,
  },
  startScanContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  startScanCard: {
    alignItems: 'center',
    padding: 32,
  },
  startScanTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginTop: 16,
    marginBottom: 8,
  },
  startScanSubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  recentContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    maxHeight: 200,
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  asistenciaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  asistenciaIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#dcfce7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  asistenciaCodigo: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  asistenciaHora: {
    fontSize: 14,
    color: '#64748b',
  },
});

