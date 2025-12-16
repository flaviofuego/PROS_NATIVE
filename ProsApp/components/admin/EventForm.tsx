import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { EventoFormData, Evento } from '@/lib/types';

interface EventFormProps {
  initialData?: Partial<Evento>;
  onSubmit: (data: EventoFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  submitLabel?: string;
}

export function EventForm({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
  submitLabel = 'Guardar',
}: EventFormProps) {
  const [formData, setFormData] = useState<EventoFormData>({
    nombre: '',
    categoria: '',
    encargados: [],
    fecha_inicio: '',
    fecha_fin: '',
    ubicacion: '',
  });
  const [encargadosText, setEncargadosText] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre || '',
        categoria: initialData.categoria || '',
        encargados: initialData.encargados || [],
        fecha_inicio: initialData.fecha_inicio || '',
        fecha_fin: initialData.fecha_fin || '',
        ubicacion: initialData.ubicacion || '',
      });
      setEncargadosText(initialData.encargados?.join(', ') || '');
    }
  }, [initialData]);

  const validate = () => {
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
    if (validate()) {
      const encargadosArray = encargadosText
        .split(',')
        .map((e) => e.trim())
        .filter((e) => e);

      await onSubmit({
        ...formData,
        encargados: encargadosArray,
      });
    }
  };

  return (
    <View style={styles.container}>
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
        value={encargadosText}
        onChangeText={setEncargadosText}
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

      <View style={styles.buttons}>
        <Button
          title="Cancelar"
          onPress={onCancel}
          variant="outline"
          style={styles.button}
        />
        <Button
          title={submitLabel}
          onPress={handleSubmit}
          loading={loading}
          style={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
  },
});

