import { Stack } from 'expo-router';

export default function UserEventosLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#ffffff',
        },
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
          color: '#1e293b',
        },
        headerShadowVisible: false,
        headerBackTitle: 'Atrás',
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Eventos Activos',
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Tomar Asistencia',
        }}
      />
      <Stack.Screen
        name="mis-asistencias"
        options={{
          title: 'Mis Asistencias',
        }}
      />
    </Stack>
  );
}

