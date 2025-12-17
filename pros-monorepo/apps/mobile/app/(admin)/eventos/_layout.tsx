import { Stack } from 'expo-router';

export default function EventosLayout() {
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
          title: 'Gestión de Eventos',
        }}
      />
      <Stack.Screen
        name="crear"
        options={{
          title: 'Crear Evento',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Detalle del Evento',
        }}
      />
      <Stack.Screen
        name="estadisticas/[id]"
        options={{
          title: 'Estadísticas del Evento',
        }}
      />
    </Stack>
  );
}

