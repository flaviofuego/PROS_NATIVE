import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useEventoMutations } from '@/hooks/useEvents';
import { useAuth } from '@/contexts/AuthContext';

export default function CrearEventoScreen() {
  const { user } = useAuth();
  const { createEvento, loading } = useEventoMutations();
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: '',
    encargados: '',
    fecha_inicio: '',
    fecha_fin: '',
    ubicacion: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }
    if (!formData.categoria.trim()) {
      newErrors.categoria = 'La categoría es requerida';
    }
    if (!formData.fecha_inicio) {
      newErrors.fecha_inicio = 'La fecha de inicio es requerida';
    }
    if (!formData.fecha_fin) {
      newErrors.fecha_fin = 'La fecha de fin es requerida';
    }
    if (formData.fecha_inicio && formData.fecha_fin) {
      if (new Date(formData.fecha_fin) < new Date(formData.fecha_inicio)) {
        newErrors.fecha_fin = 'La fecha de fin debe ser posterior a la de inicio';
      }
    }
    if (!formData.ubicacion.trim()) {
      newErrors.ubicacion = 'La ubicación es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const encargadosArray = formData.encargados
      .split(',')
      .map((e) => e.trim())
      .filter((e) => e);

    const { evento, error } = await createEvento(
      {
        nombre: formData.nombre.trim(),
        categoria: formData.categoria.trim(),
        encargados: encargadosArray,
        fecha_inicio: formData.fecha_inicio,
        fecha_fin: formData.fecha_fin,
        ubicacion: formData.ubicacion.trim(),
      },
      user?.id || ''
    );

    if (error) {
      Alert.alert('Error', error);
    } else if (evento) {
      Alert.alert(
        'Evento Creado',
        `El evento "${evento.nombre}" ha sido creado.\n\nCódigo de acceso: ${evento.codigo_acceso}`,
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Card style={styles.formCard}>
          <Text style={styles.formTitle}>Información del Evento</Text>

          <Input
            label="Nombre del evento"
            placeholder="Ej: Conferencia de Tecnología"
            value={formData.nombre}
            onChangeText={(text) => setFormData({ ...formData, nombre: text })}
            error={errors.nombre}
            leftIcon="document-text-outline"
          />

          <Input
            label="Categoría"
            placeholder="Ej: Conferencia, Taller, Seminario"
            value={formData.categoria}
            onChangeText={(text) => setFormData({ ...formData, categoria: text })}
            error={errors.categoria}
            leftIcon="pricetag-outline"
          />

          <Input
            label="Encargados (separados por coma)"
            placeholder="Ej: Juan Pérez, María García"
            value={formData.encargados}
            onChangeText={(text) => setFormData({ ...formData, encargados: text })}
            leftIcon="people-outline"
          />

          <Input
            label="Fecha de inicio (YYYY-MM-DD)"
            placeholder="Ej: 2025-01-15"
            value={formData.fecha_inicio}
            onChangeText={(text) => setFormData({ ...formData, fecha_inicio: text })}
            error={errors.fecha_inicio}
            leftIcon="calendar-outline"
          />

          <Input
            label="Fecha de fin (YYYY-MM-DD)"
            placeholder="Ej: 2025-01-20"
            value={formData.fecha_fin}
            onChangeText={(text) => setFormData({ ...formData, fecha_fin: text })}
            error={errors.fecha_fin}
            leftIcon="calendar-outline"
          />

          <Input
            label="Ubicación"
            placeholder="Ej: Auditorio Principal"
            value={formData.ubicacion}
            onChangeText={(text) => setFormData({ ...formData, ubicacion: text })}
            error={errors.ubicacion}
            leftIcon="location-outline"
          />

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              Se generará automáticamente un código de acceso único para este evento.
            </Text>
          </View>

          <View style={styles.buttons}>
            <Button
              title="Cancelar"
              onPress={() => router.back()}
              variant="outline"
              style={styles.button}
            />
            <Button
              title="Crear Evento"
              onPress={handleSubmit}
              loading={loading}
              style={styles.button}
            />
          </View>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    padding: 16,
  },
  formCard: {
    padding: 20,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 20,
  },
  infoBox: {
    backgroundColor: '#eff6ff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
    color: '#2563eb',
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
  },
});

