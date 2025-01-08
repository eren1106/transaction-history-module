import { View, Text, Button, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'expo-router';
import BiometricService from '@/services/BiometricService';

export default function LoginPage() {
  const [biometricSupported, setBiometricSupported] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    const available = await BiometricService.isBiometricAvailable();
    setBiometricSupported(available);
  };

  const handleBiometricLogin = async () => {
    if (!biometricSupported) {
      Alert.alert('Error', 'Biometric authentication is not available.');
      return;
    }

    const result = await BiometricService.authenticate();
    if (result.success) {
      Alert.alert('Success', 'Authentication successful!');
      router.push('/transactions'); // Navigate to the home page
    } else {
      Alert.alert('Error', result.error || 'Authentication failed.');
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-gray-100">
      <Text className="text-2xl font-bold mb-4">Login</Text>
      <Button
        title="Login with Biometrics"
        onPress={handleBiometricLogin}
        disabled={!biometricSupported}
      />
      {!biometricSupported && (
        <Text className="text-red-500 mt-4">
          Biometric authentication is not available on this device.
        </Text>
      )}
    </View>
  );
}