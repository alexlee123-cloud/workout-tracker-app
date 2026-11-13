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
  const { isLoggedIn, isLoading } = useAuth();

  // Still checking for a saved login: show nothing for a moment instead of
  // flashing the login screen.
  if (isLoading) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="(tabs)" />
        {/* Opens on top of the tabs, with a back button in the header. */}
        <Stack.Screen
          name="create-exercise"
          options={{ headerShown: true, title: 'New exercise', headerBackTitle: 'Back' }}
        />
      </Stack.Protected>
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="login" />
      </Stack.Protected>
    </Stack>
  );
}
