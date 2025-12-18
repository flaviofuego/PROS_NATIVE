import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { TouchableOpacity, StyleSheet } from 'react-native';

export default function UserLayout() {
  const { signOut } = useAuth();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e2e8f0',
          paddingTop: 8,
          paddingBottom: 8,
          height: 70,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: '#ffffff',
        },
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
          color: '#1e293b',
        },
        headerShadowVisible: false,
        headerRight: () => (
          <TouchableOpacity onPress={signOut} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={24} color="#64748b" />
          </TouchableOpacity>
        ),
      }}
    >
      <Tabs.Screen
        name="eventos"
        options={{
          title: 'Eventos',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="scanner"
        options={{
          title: 'Escanear',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="scan-outline" size={size} color={color} />
          ),
          headerTitle: 'Escáner',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  logoutButton: {
    marginRight: 16,
    padding: 8,
  },
});

