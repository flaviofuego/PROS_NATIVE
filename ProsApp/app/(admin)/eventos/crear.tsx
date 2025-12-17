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
import { DatePicker } from '@/components/ui/DatePicker';
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

  // Fecha mínima: hoy
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Fecha mínima para fecha_fin basada en fecha_inicio
  const getMinEndDate = (): Date => {
    if (formData.fecha_inicio) {
      const [year, month, day] = formData.fecha_inicio.split('-').map(Number);
      return new Date(year, month - 1, day);
    }
    return today;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre del evento es requerido';
    } else if (formData.nombre.trim().length < 3) {
      newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
    }

    if (!formData.categoria.trim()) {
      newErrors.categoria = 'La categoría es requerida';
    }

    if (!formData.fecha_inicio) {
      newErrors.fecha_inicio = 'Selecciona la fecha de inicio';
    }

    if (!formData.fecha_fin) {
      newErrors.fecha_fin = 'Selecciona la fecha de fin';
    }

    if (formData.fecha_inicio && formData.fecha_fin) {
      const startDate = new Date(formData.fecha_inicio);
      const endDate = new Date(formData.fecha_fin);
      if (endDate < startDate) {
        newErrors.fecha_fin = 'La fecha de fin no puede ser anterior a la de inicio';
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
      // Cerrar y mostrar mensaje
      router.back();
      setTimeout(() => {
        Alert.alert(
          'Evento Creado',
          `El evento "${evento.nombre}" ha sido creado.\n\nCódigo de acceso: ${evento.codigo_acceso}`
        );
      }, 100);
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
            onChangeText={(text) => {
              setFormData({ ...formData, nombre: text });
              if (errors.nombre) setErrors({ ...errors, nombre: '' });
            }}
            error={errors.nombre}
            leftIcon="document-text-outline"
          />

          <Input
            label="Categoría"
            placeholder="Ej: Conferencia, Taller, Seminario"
            value={formData.categoria}
            onChangeText={(text) => {
              setFormData({ ...formData, categoria: text });
              if (errors.categoria) setErrors({ ...errors, categoria: '' });
            }}
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

          <View style={styles.dateRow}>
            <View style={styles.dateField}>
              <DatePicker
                label="Fecha de inicio"
                value={formData.fecha_inicio}
                onChange={(date) => {
                  setFormData({ ...formData, fecha_inicio: date });
                  if (errors.fecha_inicio) setErrors({ ...errors, fecha_inicio: '' });
                  // Si la fecha de fin es anterior a la nueva fecha de inicio, limpiarla
                  if (formData.fecha_fin && new Date(formData.fecha_fin) < new Date(date)) {
                    setFormData((prev) => ({ ...prev, fecha_inicio: date, fecha_fin: '' }));
                  }
                }}
                error={errors.fecha_inicio}
                placeholder="Seleccionar"
                minimumDate={today}
              />
            </View>

            <View style={styles.dateField}>
              <DatePicker
                label="Fecha de fin"
                value={formData.fecha_fin}
                onChange={(date) => {
                  setFormData({ ...formData, fecha_fin: date });
                  if (errors.fecha_fin) setErrors({ ...errors, fecha_fin: '' });
                }}
                error={errors.fecha_fin}
                placeholder="Seleccionar"
                minimumDate={getMinEndDate()}
              />
            </View>
          </View>

          <Input
            label="Ubicación"
            placeholder="Ej: Auditorio Principal"
            value={formData.ubicacion}
            onChangeText={(text) => {
              setFormData({ ...formData, ubicacion: text });
              if (errors.ubicacion) setErrors({ ...errors, ubicacion: '' });
            }}
            error={errors.ubicacion}
            leftIcon="location-outline"
          />

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              💡 Se generará automáticamente un código de acceso único para este evento.
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
  dateRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateField: {
    flex: 1,
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
