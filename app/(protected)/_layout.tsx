import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { Pressable, Alert } from 'react-native';
import useAuth from '~/hooks/useAuth';

export default function ProtectedLayout() {
  const { signOut } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Logout",
          onPress: signOut,
          style: "destructive"
        }
      ]
    );
  };

  return (
    <Stack screenOptions={{
      headerShown: true,
      headerRight: () => (
        <Pressable
          onPress={handleLogout}
          style={({ pressed }) => ({
            opacity: pressed ? 0.7 : 1,
            marginRight: 15
          })}
        >
          <Ionicons name="log-out-outline" size={24} />
        </Pressable>
      ),
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