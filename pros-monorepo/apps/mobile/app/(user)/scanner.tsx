import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function ScannerScreen() {
  return (
    <View style={styles.container}>
      <Card style={styles.infoCard}>
        <View style={styles.iconContainer}>
          <Ionicons name="information-circle" size={48} color="#2563eb" />
        </View>
        <Text style={styles.title}>Selecciona un evento</Text>
        <Text style={styles.description}>
          Para escanear códigos de estudiantes, primero debes seleccionar un evento activo desde la pestaña de Eventos.
        </Text>
        <Button
          title="Ir a Eventos"
          onPress={() => router.push('/(user)/eventos')}
          icon={<Ionicons name="calendar-outline" size={20} color="#fff" />}
        />
      </Card>

      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsTitle}>Cómo funciona:</Text>
        
        <View style={styles.step}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>1</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Selecciona un evento</Text>
            <Text style={styles.stepDescription}>
              Ve a la pestaña de Eventos y elige un evento activo del día
            </Text>
          </View>
        </View>

        <View style={styles.step}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>2</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Ingresa el código de acceso</Text>
            <Text style={styles.stepDescription}>
              La primera vez, necesitarás el código proporcionado por el administrador
            </Text>
          </View>
        </View>

        <View style={styles.step}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>3</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Escanea los códigos</Text>
            <Text style={styles.stepDescription}>
              Apunta la cámara al código de barras del estudiante para registrar su asistencia
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
  },
  infoCard: {
    alignItems: 'center',
    padding: 24,
    marginBottom: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  instructionsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 20,
  },
  step: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
});

