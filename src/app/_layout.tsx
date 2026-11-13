import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { AuthProvider, useAuth } from '@/lib/auth';

SplashScreen.preventAutoHideAsync();

// The root of the app. It decides login screen vs. tabs.
export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <AnimatedSplashOverlay />
        <RootNavigator />
      </AuthProvider>
    </ThemeProvider>
  );
}

// A "Stack" shows one screen at a time. Stack.Protected only allows a screen
// when its guard is true, and redirects automatically when the guard changes:
// log in and you land on the tabs; log out and you're back at login.
function RootNavigator() {
  const { isLoggedIn } = useAuth();
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="login" />
      </Stack.Protected>
    </Stack>
  );
}
