import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { Screen } from '@/ui/Screen';
import { AppText } from '@/ui/AppText';
import { Card } from '@/ui/Card';
import { Button } from '@/ui/Button';
import { Pill } from '@/ui/Pill';
import { images } from '@/assets/images';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { acceptConsent, selectConsentAccepted, toggleConsentChecked } from '@/store/slices/consentSlice';
import { useNavigationColors } from '@/theme/useNavigationTheme';
import { A, enterDown, enterFade } from '@/ui/animated';
import { metrics } from '@/ui/metrics';
import { brandGradient } from '@/theme/tokens';
import { haptic } from '@/ui/haptics';

export default function OnboardingScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const accepted = useAppSelector(selectConsentAccepted);
  const colors = useNavigationColors();
  const checked = useAppSelector((s) => s.consent.checked);

  const canContinue = checked;

  return (
    <Screen fullBleed>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero gradient with logo */}
        <A.View entering={enterFade(0)}>
          <View style={styles.hero}>
            <LinearGradient
              colors={[...brandGradient(colors)]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.heroBody}>
              <Image source={images.logoWordmark} style={styles.wordmark} resizeMode="contain" />
              <Pill label="RESEARCH PROTOTYPE" tone="primary" />
              <AppText variant="h1" align="center" style={styles.heroTitle}>
                Cough screening, on your device.
              </AppText>
              <AppText variant="bodyLg" align="center" style={styles.heroBody2}>
                Lively records a short cough sample and runs an on-device model to help indicate possible signs of illness.
              </AppText>
            </View>
          </View>
        </A.View>

        <View style={styles.body}>
          <A.View entering={enterDown(120)}>
            <Point icon="offline-bolt" title="Works offline" body="No internet required for screening." />
          </A.View>
          <A.View entering={enterDown(170)}>
            <Point icon="memory" title="Audio processed on device" body="Inference runs locally on your phone." />
          </A.View>
          <A.View entering={enterDown(220)}>
            <Point icon="lock" title="Your recordings stay private" body="Nothing leaves the device unless you sign in to sync." />
          </A.View>

          {/* Consent checkbox */}
          <A.View entering={enterDown(290)}>
            <Pressable
              onPress={() => {
                haptic.selection();
                dispatch(toggleConsentChecked());
              }}
              style={[
                styles.checkboxRow,
                { backgroundColor: colors.surface, borderColor: checked ? colors.primary : colors.outlineMuted },
              ]}
              accessibilityRole="checkbox"
              accessibilityState={{ checked }}>
              <View
                style={[
                  styles.checkbox,
                  {
                    borderColor: checked ? colors.primary : colors.outline,
                    backgroundColor: checked ? colors.primary : 'transparent',
                  },
                ]}>
                {checked ? <MaterialIcons name="check" size={14} color={colors.onPrimary} /> : null}
              </View>
              <AppText variant="bodySm" style={styles.checkboxText}>
                I understand this is a research tool, not a medical diagnosis.
              </AppText>
            </Pressable>
          </A.View>

          <A.View entering={enterDown(350)} style={styles.actions}>
            <Button
              title="Continue"
              variant="primary"
              hapticFeedback="medium"
              disabled={!canContinue}
              onPress={() => {
                dispatch(acceptConsent());
                if (!accepted) router.replace('/(tabs)');
              }}
            />
            <Pressable onPress={() => router.push('/about')} style={styles.privacy}>
              <AppText variant="bodySm" tone="primary" align="center">
                Read the privacy notes
              </AppText>
            </Pressable>
          </A.View>
        </View>
      </ScrollView>
    </Screen>
  );
}

function Point({ icon, title, body }: { icon: React.ComponentProps<typeof MaterialIcons>['name']; title: string; body: string }) {
  const colors = useNavigationColors();
  return (
    <Card tone="surface" elev="xs" bordered density="cozy" style={styles.point}>
      <View style={[styles.pointIcon, { backgroundColor: colors.primaryMuted }]}>
        <MaterialIcons name={icon} size={20} color={colors.primary} />
      </View>
      <View style={styles.pointText}>
        <AppText variant="bodyStrong">{title}</AppText>
        <AppText variant="caption" tone="muted">
          {body}
        </AppText>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 32 },
  hero: {
    height: 360,
    paddingTop: 64,
    paddingHorizontal: 24,
    overflow: 'hidden',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  heroBody: { alignItems: 'center', gap: 14, paddingBottom: 28 },
  wordmark: { height: 26, width: 124, tintColor: '#fff' },
  heroTitle: { color: '#fff', marginTop: 6 },
  heroBody2: { color: 'rgba(255,255,255,0.92)', maxWidth: 320 },
  body: { padding: metrics.screenPadding, gap: 10 },
  point: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  pointIcon: { width: 36, height: 36, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  pointText: { flex: 1, gap: 2 },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: metrics.radius.md,
    borderWidth: 1,
    marginTop: 6,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxText: { flex: 1 },
  actions: { gap: 6, marginTop: 4 },
  privacy: { paddingVertical: 10 },
});
