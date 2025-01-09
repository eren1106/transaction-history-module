import { View, Text, Button, Alert, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import BiometricService from '@/services/BiometricService';
import { useAuth } from '@/context/AuthProvider';

export default function LoginScreen() {
  const [biometricSupported, setBiometricSupported] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const { signIn } = useAuth();

  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    try {
      setError('');
      const available = await BiometricService.isBiometricAvailable();
      setBiometricSupported(available);
    } catch (err) {
      setBiometricSupported(false);
      setError('Failed to check biometric availability');
      console.error('Biometric availability check failed:', err);
    }
  };

  const handleBiometricLogin = async () => {
    if (!biometricSupported) {
      setError('Biometric authentication is not available');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      const result = await BiometricService.authenticate();
      
      if (result.success) {
        await signIn();
      } else {
        setError(result.error || 'Authentication failed');
        if (result.error?.includes('cancelled')) {
          // Handle user cancellation quietly
          return;
        }
        Alert.alert('Authentication Error', result.error || 'Please try again');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      Alert.alert('Error', 'Failed to authenticate. Please try again later.');
      console.error('Authentication error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-gray-100">
      <Text className="text-2xl font-bold mb-4">Login</Text>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button
          title="Login with Biometrics"
          onPress={handleBiometricLogin}
          disabled={!biometricSupported || isLoading}
        />
      )}
      {error && (
        <Text className="text-red-500 mt-4 px-4 text-center">
          {error}
        </Text>
      )}
      {!biometricSupported && (
        <Text className="text-red-500 mt-4 px-4 text-center">
          Biometric authentication is not available on this device.
        </Text>
      )}
    </View>
  );
}