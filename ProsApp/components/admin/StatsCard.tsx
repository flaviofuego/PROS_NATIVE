import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  iconBackgroundColor?: string;
  subtitle?: string;
  style?: ViewStyle;
  onPress?: () => void;
}

export function StatsCard({
  title,
  value,
  icon,
  iconColor = '#2563eb',
  iconBackgroundColor = '#dbeafe',
  subtitle,
  style,
  onPress,
}: StatsCardProps) {
  return (
    <Card style={[styles.card, style]} onPress={onPress}>
      <View style={[styles.iconContainer, { backgroundColor: iconBackgroundColor }]}>
        <Ionicons name={icon} size={24} color={iconColor} />
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </Card>
  );
}

interface StatsGridProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function StatsGrid({ children, style }: StatsGridProps) {
  return <View style={[styles.grid, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    paddingVertical: 20,
    minWidth: 140,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  value: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  title: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
});

