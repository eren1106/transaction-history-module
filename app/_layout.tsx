import { useSegments, useRouter } from "expo-router";
import { useEffect } from "react";
import { AuthProvider } from "@/context/AuthProvider";
import '~/global.css';
import { Theme, ThemeProvider, DefaultTheme } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { Platform } from 'react-native';
import { NAV_THEME } from '~/lib/constants';
import useAuth from "~/hooks/useAuth";

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};

function RootLayoutNav() {
  const { isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inProtectedGroup = segments[0] === '(protected)';
    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && inProtectedGroup) {
      // redirect to the login page if not authenticated
      router.replace('/login');
    } else if (isAuthenticated && inAuthGroup) {
      // redirect to transactions page after authenticated
      router.replace('/transactions');
    }
  }, [isAuthenticated, segments]);

  return (
    <Stack>
      <Stack.Screen
        name="(auth)"
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="(protected)"
        options={{
          headerShown: false
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const hasMounted = React.useRef(false);
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

  useIsomorphicLayoutEffect(() => {
    if (hasMounted.current) {
      return;
    }

    if (Platform.OS === 'web') {
      // Adds the background color to the html element to prevent white background on overscroll.
      document.documentElement.classList.add('bg-background');
    }
    setIsColorSchemeLoaded(true);
    hasMounted.current = true;
  }, []);

  if (!isColorSchemeLoaded) {
    return null;
  }
  return (
    <AuthProvider>
      <ThemeProvider value={LIGHT_THEME}>
        <StatusBar style={'light'} />
        <RootLayoutNav />
      </ThemeProvider>
    </AuthProvider>
  );
}

const useIsomorphicLayoutEffect =
  Platform.OS === 'web' && typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;