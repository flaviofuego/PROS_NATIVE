import { Stack } from 'expo-router';

export default function UsuariosLayout() {
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
          title: 'Gestión de Usuarios',
        }}
      />
      <Stack.Screen
        name="crear"
        options={{
          title: 'Crear Usuario',
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}

