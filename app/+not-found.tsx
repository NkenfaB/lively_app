import { Link, Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { AppText } from '@/ui/AppText';
import { Screen } from '@/ui/Screen';
import { Button } from '@/ui/Button';
import { useNavigationColors } from '@/theme/useNavigationTheme';
import { A, enterDown } from '@/ui/animated';

export default function NotFoundScreen() {
  const colors = useNavigationColors();
  return (
    <Screen>
      <Stack.Screen options={{ title: '404' }} />
      <View style={styles.container}>
        <A.View entering={enterDown(0)} style={styles.inner}>
          <View style={[styles.iconWrap, { backgroundColor: colors.surfaceContainer }]}>
            <MaterialIcons name="explore-off" size={36} color={colors.outline} />
          </View>
          <AppText variant="h1" align="center">
            We can't find that page
          </AppText>
          <AppText variant="bodySm" tone="muted" align="center">
            The screen you're trying to open doesn't exist. Head back to the home tab.
          </AppText>
          <Link href="/" asChild>
            <Button title="Go home" variant="primary" hapticFeedback="medium" />
          </Link>
        </A.View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  inner: { alignItems: 'center', gap: 12, maxWidth: 340 },
  iconWrap: { width: 72, height: 72, borderRadius: 999, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
});
