import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  variant?: 'default' | 'elevated' | 'outlined';
}

export function Card({ children, style, onPress, variant = 'default' }: CardProps) {
  const backgroundColor = useThemeColor({}, 'background');

  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: '#ffffff',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 5,
        };
      case 'outlined':
        return {
          backgroundColor: '#ffffff',
          borderWidth: 1,
          borderColor: '#e2e8f0',
        };
      default:
        return {
          backgroundColor: '#ffffff',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 2,
        };
    }
  };

  if (onPress) {
    return (
      <TouchableOpacity
        style={[styles.card, getVariantStyles(), style]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={[styles.card, getVariantStyles(), style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
  },
});

