import React, { useEffect, useState } from 'react';
import { View, Alert, ActivityIndicator, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BiometricService from '@/services/BiometricService';
import useAuth from '~/hooks/useAuth';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';

export default function LoginScreen() {
  const [biometricSupported, setBiometricSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn } = useAuth();

  useEffect(() => {
    const checkBiometricAvailability = async () => {
      try {
        setError('');
        const available = await BiometricService.isBiometricAvailable();
        setBiometricSupported(available);
      } catch (err) {
        console.error('Biometric availability check failed:', err);
        setBiometricSupported(false);
        setError('Failed to check biometric availability');
      }
    };

    checkBiometricAvailability();
  }, []);

  const handleBiometricLogin = async () => {
    if (!biometricSupported) {
      setError('Biometric authentication is not available');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      const result = await BiometricService.authenticate();

      if (result.success) signIn();
      else {
        const errorMessage = result.error || 'Authentication failed';
        setError(errorMessage);
        if (!result.error?.includes('cancelled')) {
          Alert.alert('Authentication Error', errorMessage);
        }
      }
    } catch (err) {
      console.error('Authentication error:', err);
      setError('An unexpected error occurred');
      Alert.alert('Error', 'Failed to authenticate. Please try again later.');
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
          <ActivityIndicator size="large" className="text-primary scale-[1.75]" />
        ) : (
          <View className="flex items-center justify-center gap-6">
            <Ionicons name="finger-print" size={120} color="grey" />
            <Button 
              onPress={handleBiometricLogin} 
              disabled={!biometricSupported} 
              size="lg"
            >
              <Text>Login with Biometrics</Text>
            </Button>
          </View>
        )}

        {error && (
          <Text className="text-destructive mt-4 px-4 text-center">{error}</Text>
        )}
        {!biometricSupported && (
          <Text className="text-destructive mt-4 px-4 text-center">
            Biometric authentication is not available on this device.
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
};