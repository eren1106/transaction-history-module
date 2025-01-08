import { Stack } from 'expo-router';

export default function ProtectedLayout() {
  return (
    <Stack screenOptions={{
      headerShown: true,
    }}>
      <Stack.Screen
        name="transactions/index"
        options={{
          headerTitle: 'Transactions',
        }}
      />
      <Stack.Screen
        name="transactions/[id]"
        options={{
          headerTitle: 'Transaction Detail',
        }}
      />
    </Stack>
  );
}