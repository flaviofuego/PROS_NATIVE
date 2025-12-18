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

// Función para traducir errores de Supabase a mensajes específicos
function getSpecificErrorMessage(error: any): { field: string | null; message: string } {
  const errorMessage = error?.message?.toLowerCase() || '';
  const errorCode = error?.code || '';

  // Errores de email
  if (
    errorMessage.includes('user already registered') ||
    errorMessage.includes('email already registered') ||
    errorMessage.includes('already been registered') ||
    errorCode === 'user_already_exists'
  ) {
    return {
      field: 'email',
      message: 'Este correo electrónico ya está registrado',
    };
  }

  if (
    errorMessage.includes('invalid email') ||
    errorMessage.includes('email not valid')
  ) {
    return {
      field: 'email',
      message: 'El formato del correo electrónico no es válido',
    };
  }

  // Errores de contraseña
  if (
    errorMessage.includes('password') &&
    (errorMessage.includes('weak') || errorMessage.includes('short') || errorMessage.includes('at least'))
  ) {
    return {
      field: 'password',
      message: 'La contraseña es demasiado débil. Usa al menos 6 caracteres con letras y números',
    };
  }

  if (errorMessage.includes('password is required')) {
    return {
      field: 'password',
      message: 'La contraseña es requerida',
    };
  }

  // Errores de permisos
  if (
    errorMessage.includes('not authorized') ||
    errorMessage.includes('permission denied') ||
    errorMessage.includes('rls') ||
    errorCode === '42501'
  ) {
    return {
      field: null,
      message: 'No tienes permisos para crear usuarios. Contacta al administrador.',
    };
  }

  // Error de duplicado en la tabla users
  if (
    errorMessage.includes('duplicate key') ||
    errorMessage.includes('unique constraint') ||
    errorCode === '23505'
  ) {
    if (errorMessage.includes('email')) {
      return {
        field: 'email',
        message: 'Este correo electrónico ya está en uso',
      };
    }
    return {
      field: null,
      message: 'Ya existe un usuario con estos datos',
    };
  }

  // Error de conexión
  if (
    errorMessage.includes('network') ||
    errorMessage.includes('connection') ||
    errorMessage.includes('fetch')
  ) {
    return {
      field: null,
      message: 'Error de conexión. Verifica tu internet e intenta de nuevo.',
    };
  }

  // Error de rate limit
  if (
    errorMessage.includes('rate limit') ||
    errorMessage.includes('too many requests') ||
    errorCode === '429'
  ) {
    return {
      field: null,
      message: 'Demasiados intentos. Espera unos minutos antes de intentar de nuevo.',
    };
  }

  // Error genérico - mostrar el mensaje original
  return {
    field: null,
    message: error?.message || 'Ocurrió un error inesperado. Intenta de nuevo.',
  };
}

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
    } else if (formData.nombre.trim().length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Ingresa un correo electrónico válido (ej: usuario@email.com)';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    } else if (!/[a-zA-Z]/.test(formData.password)) {
      newErrors.password = 'La contraseña debe contener al menos una letra';
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = 'La contraseña debe contener al menos un número';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setErrors({}); // Limpiar errores anteriores

    try {
      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        email_confirm: true,
      });

      // If admin API fails, try regular signup
      if (authError) {
        // Si el error es de admin API no disponible, intentar signup regular
        if (authError.message?.includes('admin')) {
          const { data: signupData, error: signupError } = await supabase.auth.signUp({
            email: formData.email.trim().toLowerCase(),
            password: formData.password,
          });

          if (signupError) {
            const { field, message } = getSpecificErrorMessage(signupError);
            if (field) {
              setErrors({ [field]: message });
            } else {
              Alert.alert('Error', message);
            }
            return;
          }

          if (signupData.user) {
            // Create user profile
            const { error: profileError } = await supabase.from('users').insert({
              id: signupData.user.id,
              email: formData.email.trim().toLowerCase(),
              nombre: formData.nombre.trim(),
              role: formData.role,
              activo: true,
            });

            if (profileError) {
              const { field, message } = getSpecificErrorMessage(profileError);
              if (field) {
                setErrors({ [field]: message });
              } else {
                Alert.alert('Error', message);
              }
              return;
            }
          }
        } else {
          const { field, message } = getSpecificErrorMessage(authError);
          if (field) {
            setErrors({ [field]: message });
          } else {
            Alert.alert('Error', message);
          }
          return;
        }
      } else if (authData.user) {
        // Create user profile
        const { error: profileError } = await supabase.from('users').insert({
          id: authData.user.id,
          email: formData.email.trim().toLowerCase(),
          nombre: formData.nombre.trim(),
          role: formData.role,
          activo: true,
        });

        if (profileError) {
          const { field, message } = getSpecificErrorMessage(profileError);
          if (field) {
            setErrors({ [field]: message });
          } else {
            Alert.alert('Error', message);
          }
          return;
        }
      }

      // Éxito - cerrar y mostrar mensaje
      router.back();
      setTimeout(() => {
        Alert.alert('Éxito', `Usuario "${formData.nombre}" creado correctamente`);
      }, 100);
    } catch (err: any) {
      const { field, message } = getSpecificErrorMessage(err);
      if (field) {
        setErrors({ [field]: message });
      } else {
        Alert.alert('Error', message);
      }
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
            onChangeText={(text) => {
              setFormData({ ...formData, nombre: text });
              if (errors.nombre) setErrors({ ...errors, nombre: '' });
            }}
            error={errors.nombre}
            leftIcon="person-outline"
          />

          <Input
            label="Correo electrónico"
            placeholder="usuario@ejemplo.com"
            value={formData.email}
            onChangeText={(text) => {
              setFormData({ ...formData, email: text });
              if (errors.email) setErrors({ ...errors, email: '' });
            }}
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon="mail-outline"
          />

          <Input
            label="Contraseña"
            placeholder="Mínimo 6 caracteres con letras y números"
            value={formData.password}
            onChangeText={(text) => {
              setFormData({ ...formData, password: text });
              if (errors.password) setErrors({ ...errors, password: '' });
            }}
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
