import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { supabase } from '@/lib/supabase';
import { UserRole } from '@/lib/types';

export default function CrearUsuarioScreen() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    role: 'user' as UserRole,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: formData.email,
        password: formData.password,
        email_confirm: true,
      });

      // If admin API fails, try regular signup
      if (authError) {
        const { data: signupData, error: signupError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        });

        if (signupError) throw signupError;

        if (signupData.user) {
          // Create user profile
          const { error: profileError } = await supabase.from('users').insert({
            id: signupData.user.id,
            email: formData.email,
            nombre: formData.nombre.trim(),
            role: formData.role,
          });

          if (profileError) throw profileError;
        }
      } else if (authData.user) {
        // Create user profile
        const { error: profileError } = await supabase.from('users').insert({
          id: authData.user.id,
          email: formData.email,
          nombre: formData.nombre.trim(),
          role: formData.role,
        });

        if (profileError) throw profileError;
      }

      Alert.alert('Éxito', `Usuario "${formData.nombre}" creado correctamente`, [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
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
          <Text style={styles.formTitle}>Información del Usuario</Text>

          <Input
            label="Nombre completo"
            placeholder="Ej: Juan Pérez"
            value={formData.nombre}
            onChangeText={(text) => setFormData({ ...formData, nombre: text })}
            error={errors.nombre}
            leftIcon="person-outline"
          />

          <Input
            label="Correo electrónico"
            placeholder="usuario@ejemplo.com"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon="mail-outline"
          />

          <Input
            label="Contraseña"
            placeholder="Mínimo 6 caracteres"
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
            error={errors.password}
            secureTextEntry
            leftIcon="lock-closed-outline"
          />

          <View style={styles.roleSection}>
            <Text style={styles.roleLabel}>Rol del usuario</Text>
            <View style={styles.roleOptions}>
              <TouchableOpacity
                style={[
                  styles.roleOption,
                  formData.role === 'user' && styles.roleOptionActive,
                ]}
                onPress={() => setFormData({ ...formData, role: 'user' })}
              >
                <Text
                  style={[
                    styles.roleOptionText,
                    formData.role === 'user' && styles.roleOptionTextActive,
                  ]}
                >
                  Usuario
                </Text>
                <Text style={styles.roleOptionDesc}>
                  Puede tomar asistencia en eventos asignados
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.roleOption,
                  formData.role === 'admin' && styles.roleOptionActive,
                ]}
                onPress={() => setFormData({ ...formData, role: 'admin' })}
              >
                <Text
                  style={[
                    styles.roleOptionText,
                    formData.role === 'admin' && styles.roleOptionTextActive,
                  ]}
                >
                  Administrador
                </Text>
                <Text style={styles.roleOptionDesc}>
                  Acceso completo al sistema
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.buttons}>
            <Button
              title="Cancelar"
              onPress={() => router.back()}
              variant="outline"
              style={styles.button}
            />
            <Button
              title="Crear Usuario"
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
  roleSection: {
    marginBottom: 20,
  },
  roleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  roleOptions: {
    gap: 12,
  },
  roleOption: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
  },
  roleOptionActive: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  roleOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 4,
  },
  roleOptionTextActive: {
    color: '#2563eb',
  },
  roleOptionDesc: {
    fontSize: 13,
    color: '#94a3b8',
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
  },
});

