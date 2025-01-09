import { View, Alert, ActivityIndicator, SafeAreaView, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import BiometricService from '@/services/BiometricService';
import { useAuth } from '@/context/AuthProvider';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { Ionicons } from '@expo/vector-icons';

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
    <SafeAreaView className="flex-1">
      <View className="w-full bg-primary h-64 items-center justify-center rounded-b-[3rem]">
        <Text className="text-4xl font-bold text-primary-foreground">Welcome Back!</Text>
        <Text className="text-primary-foreground mt-2">Fast and Secure Login</Text>
      </View>
      <View className="flex-1 justify-center items-center">
        {isLoading ? (
          <ActivityIndicator size="large" className='text-primary scale-[1.75]' />
        ) : (
          <View className="flex items-center justify-center gap-6">
            <Ionicons name="finger-print" size={120} color="grey" />
            <Button
              onPress={handleBiometricLogin}
              disabled={!biometricSupported || isLoading}
              size="lg"
            >
              <Text>
                Login with Biometrics
              </Text>
            </Button>
          </View>
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
    </SafeAreaView>
  );
}