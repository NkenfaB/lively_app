import { ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useFonts } from 'expo-font';
import { Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { Manrope_500Medium, Manrope_700Bold } from '@expo-google-fonts/manrope';

import { persistor, store } from '@/store/store';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectConsentAccepted } from '@/store/slices/consentSlice';
import { useNavigationColors, useNavigationTheme } from '@/theme/useNavigationTheme';
import { restoreSession, setSession } from '@/store/slices/authSlice';
import { isSupabaseConfigured, supabase } from '@/backend/supabaseClient';
import { ToastProvider } from '@/ui/Toast';
import { HeaderBackButton } from '@/ui/HeaderBackButton';
import { ModelUpdateChecker } from '@/ml/useModelUpdateChecker';
import { BackgroundSync } from '@/sync/useBackgroundSync';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
void (async () => {
  try {
    await SplashScreen.preventAutoHideAsync();
  } catch {
    // ignore
  }
})();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    Manrope_500Medium,
    Manrope_700Bold,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    // Hide splash once fonts are loaded — or after a 2.5s safety timeout.
    let cancelled = false;
    const timeout = setTimeout(() => {
      if (cancelled) return;
      SplashScreen.hideAsync().catch(() => {});
    }, 2500);

    if (loaded || error) {
      SplashScreen.hideAsync().catch(() => {});
    }

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [loaded, error]);

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <RootLayoutNav />
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
}

function RootLayoutNav() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const accepted = useAppSelector(selectConsentAccepted);
  const navTheme = useNavigationTheme();
  const colors = useNavigationColors();

  useEffect(() => {
    if (!accepted) {
      router.replace('/onboarding');
    }
  }, [accepted, router]);

  useEffect(() => {
    dispatch(restoreSession());
    if (!isSupabaseConfigured() || !supabase) return;
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      dispatch(setSession(session));
    });
    return () => data.subscription.unsubscribe();
  }, [dispatch]);

  return (
    <ThemeProvider value={navTheme}>
      <ToastProvider>
        <ModelUpdateChecker />
        <BackgroundSync />
        <Stack
          screenOptions={{
            animation: 'slide_from_right',
            animationDuration: 220,
            gestureEnabled: true,
            headerShadowVisible: false,
            headerStyle: { backgroundColor: colors.background },
            headerTitleStyle: { fontFamily: 'Inter_700Bold', fontSize: 16, color: colors.onSurface },
            headerTintColor: colors.onSurface,
            headerBackTitle: '',
            headerLeft: ({ canGoBack }) => <HeaderBackButton canGoBack={!!canGoBack} />,
            contentStyle: { backgroundColor: colors.background },
          }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false, animation: 'fade' }} />
          <Stack.Screen name="how-to" options={{ title: 'How to record' }} />
          <Stack.Screen name="record" options={{ title: 'Record', animation: 'slide_from_bottom' }} />
          <Stack.Screen name="review" options={{ title: 'Review' }} />
          <Stack.Screen name="results" options={{ title: 'Result', animation: 'fade_from_bottom' }} />
          <Stack.Screen name="about" options={{ title: 'About' }} />
          <Stack.Screen name="auth" options={{ title: 'Sign in', animation: 'slide_from_bottom' }} />
        </Stack>
      </ToastProvider>
    </ThemeProvider>
  );
}
