import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  loading?: boolean;
  error?: string;
}

export function LoginForm({ onSubmit, loading = false, error }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const errors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      errors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'El email no es válido';
    }

    if (!password) {
      errors.password = 'La contraseña es requerida';
    } else if (password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (validate()) {
      await onSubmit(email, password);
    }
  };

  return (
    <View style={styles.container}>
      <Input
        label="Correo electrónico"
        placeholder="tu@email.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        leftIcon="mail-outline"
        error={formErrors.email}
      />

      <Input
        label="Contraseña"
        placeholder="••••••••"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        leftIcon="lock-closed-outline"
        error={formErrors.password}
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <Button
        title="Iniciar Sesión"
        onPress={handleSubmit}
        loading={loading}
        style={styles.submitButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  error: {
    color: '#dc2626',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 8,
  },
});

