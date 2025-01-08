import { View, Text, Button, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import BiometricService from '@/services/BiometricService';
import { useAuth } from '@/context/AuthProvider';

export default function LoginPage() {
  const [biometricSupported, setBiometricSupported] = useState<boolean>(false);
  const { signIn } = useAuth();

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
      signIn(); // This will trigger the navigation to transactions page
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