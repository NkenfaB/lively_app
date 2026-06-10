import { Image, Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { Screen } from '@/ui/Screen';
import { AppText } from '@/ui/AppText';
import { Button } from '@/ui/Button';
import { images } from '@/assets/images';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { acceptConsent, selectConsentAccepted, toggleConsentChecked } from '@/store/slices/consentSlice';
import { useNavigationColors } from '@/theme/useNavigationTheme';
import { A, enterDown, enterFade } from '@/ui/animated';
import { brandGradient } from '@/theme/tokens';
import { haptic } from '@/ui/haptics';
import { useStackScreenBottomPad } from '@/ui/layoutMetrics';

export default function OnboardingScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const accepted = useAppSelector(selectConsentAccepted);
  const colors = useNavigationColors();
  const checked = useAppSelector((s) => s.consent.checked);
  const bottomPad = useStackScreenBottomPad();

  return (
    <Screen fullBleed>
      <View style={[styles.root, { paddingBottom: bottomPad }]}>

        {/* ── Hero ── */}
        <A.View entering={enterFade(0)} style={styles.heroOuter}>
          {/* This View clips the gradient and circles only */}
          <View style={styles.heroClip}>
            <LinearGradient
              colors={[...brandGradient(colors)]}
              start={{ x: 0.1, y: 0 }}
              end={{ x: 0.9, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={[styles.dec, styles.dec1]} />
            <View style={[styles.dec, styles.dec2]} />
          </View>
          {/* Text sits outside the clipped view — never gets cut */}
          <View style={styles.heroContent}>
            <View style={styles.logoRow}>
              <Image source={images.logoPrimary} style={styles.logo} resizeMode="contain" />
              <AppText variant="h2" style={styles.appName}>Lively</AppText>
            </View>
            <AppText variant="bodySm" style={styles.tagline}>
              Cough screening, on your device.
            </AppText>
          </View>
        </A.View>

        {/* ── Features ── */}
        <View style={styles.features}>
          <A.View entering={enterDown(80)}>
            <Row icon="offline-bolt" title="Works offline" body="No internet required for screening." colors={colors} />
          </A.View>
          <View style={[styles.divider, { backgroundColor: colors.outlineMuted }]} />
          <A.View entering={enterDown(120)}>
            <Row icon="memory" title="On-device AI" body="Audio is processed on-chip — never uploaded." colors={colors} />
          </A.View>
          <View style={[styles.divider, { backgroundColor: colors.outlineMuted }]} />
          <A.View entering={enterDown(160)}>
            <Row icon="lock" title="Private by design" body="Nothing leaves your phone unless you sync." colors={colors} />
          </A.View>
        </View>

        {/* ── Consent + CTA ── */}
        <View style={styles.bottom}>
          <A.View entering={enterDown(220)}>
            <Pressable
              onPress={() => { haptic.selection(); dispatch(toggleConsentChecked()); }}
              style={[
                styles.checkboxRow,
                {
                  backgroundColor: checked ? `${colors.primary}10` : colors.surfaceContainer,
                  borderColor: checked ? colors.primary : colors.outlineMuted,
                },
              ]}
              accessibilityRole="checkbox"
              accessibilityState={{ checked }}>
              <View style={[
                styles.checkbox,
                {
                  borderColor: checked ? colors.primary : colors.outline,
                  backgroundColor: checked ? colors.primary : 'transparent',
                },
              ]}>
                {checked && <MaterialIcons name="check" size={13} color={colors.onPrimary} />}
              </View>
              <AppText variant="bodySm" style={{ flex: 1, color: colors.onSurface }}>
                I understand this is a{' '}
                <AppText variant="bodySmStrong" style={{ color: colors.onSurface }}>
                  research tool, not a medical diagnosis.
                </AppText>
              </AppText>
            </Pressable>
          </A.View>

          <A.View entering={enterDown(270)}>
            <Button
              title="Get started"
              variant="primary"
              size="lg"
              hapticFeedback="medium"
              disabled={!checked}
              onPress={() => {
                dispatch(acceptConsent());
                if (!accepted) router.replace('/(tabs)');
              }}
            />
          </A.View>

          <A.View entering={enterDown(300)} style={{ width: '100%' }}>
            <Pressable onPress={() => router.push('/about')} style={styles.privacy}>
              <AppText variant="bodySm" tone="primary" align="center">
                Read the privacy notes
              </AppText>
            </Pressable>
          </A.View>
        </View>

      </View>
    </Screen>
  );
}

function Row({
  icon,
  title,
  body,
  colors,
}: {
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  title: string;
  body: string;
  colors: ReturnType<typeof useNavigationColors>;
}) {
  return (
    <View style={styles.row}>
      <View style={[styles.rowIcon, { backgroundColor: colors.primaryMuted }]}>
        <MaterialIcons name={icon} size={20} color={colors.primary} />
      </View>
      <View style={styles.rowText}>
        <AppText variant="bodyStrong">{title}</AppText>
        <AppText variant="caption" tone="muted">{body}</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  // Hero — outer has no overflow clipping so text is never cut
  heroOuter: {
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  // Clips only the gradient + decorative circles, never the text
  heroClip: {
    ...StyleSheet.absoluteFillObject,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
  },
  dec: { position: 'absolute', borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.09)' },
  dec1: { width: 200, height: 200, top: -60, right: -40 },
  dec2: { width: 140, height: 140, bottom: -30, left: -30 },

  heroContent: {
    paddingTop: 60,
    paddingBottom: 36,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
    gap: 10,
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 4 },
  logo: { width: 48, height: 48, borderRadius: 12 },
  appName: {
    color: '#fff',
    fontFamily: 'Manrope_700Bold',
    includeFontPadding: true,
    letterSpacing: 1.2,
    lineHeight: 32,
    paddingHorizontal: 2,
  },
  tagline: {
    color: 'rgba(255,255,255,0.85)',
    includeFontPadding: true,
    lineHeight: 20,
    paddingHorizontal: 4,
    textAlign: 'center',
  },

  // Features
  features: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 13 },
  rowIcon: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  rowText: { flex: 1, gap: 1 },
  divider: { height: StyleSheet.hairlineWidth, marginLeft: 52 },

  // Bottom
  bottom: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    gap: 10,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  privacy: { paddingVertical: 6, paddingHorizontal: 4, alignItems: 'center', width: '100%' },
});
