import { View, Text, TouchableOpacity, Button } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = () => {
    router.replace('/transactions');
  }

  return (
    <View>
      <Button title="Login" onPress={handleLogin} />
    </View>
  )
}