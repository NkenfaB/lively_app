import { Image, ScrollView, StyleSheet, View, type ImageSourcePropType } from 'react-native';
import { Link } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { Screen } from '@/ui/Screen';
import { AppText } from '@/ui/AppText';
import { Card } from '@/ui/Card';
import { Button } from '@/ui/Button';
import { useNavigationColors } from '@/theme/useNavigationTheme';
import { A, enterDown } from '@/ui/animated';
import { metrics } from '@/ui/metrics';
import { useStackScreenBottomPad } from '@/ui/layoutMetrics';
import { images } from '@/assets/images';

type Step = {
  num: number;
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  title: string;
  caption: string;
  image: ImageSourcePropType;
  badge?: string;
  tags?: string[];
};

const STEPS: Step[] = [
  {
    num: 1,
    icon: 'phone-android',
    title: 'Hold phone 15–20 cm away',
    caption: 'Position the phone 15–20 cm from your mouth. Keep the microphone facing toward you.',
    image: images.howTo4,
    badge: '15–20 cm',
  },
  {
    num: 2,
    icon: 'graphic-eq',
    title: 'Cough naturally 2–3 times',
    caption: "Cough naturally toward the phone 2–3 times. Don't cover the microphone.",
    image: images.homeDarkProfile,
    badge: '2–3×',
  },
  {
    num: 3,
    icon: 'volume-off',
    title: 'Record in a quiet place',
    caption: 'Find a quiet space for the best result.',
    image: images.howTo1,
    tags: ['No talking', 'No loud noise', 'No strong wind'],
  },
  {
    num: 4,
    icon: 'lock',
    title: 'Wait for on-device analysis',
    caption: 'Lively analyzes your sample securely on your device. This may take a few moments.',
    image: images.howTo2,
    badge: 'Private & secure',
  },
  {
    num: 5,
    icon: 'fact-check',
    title: 'View your screening result',
    caption: 'Review your result on the app. Results are for research screening only.',
    image: images.reviewBanner,
  },
  {
    num: 6,
    icon: 'clean-hands',
    title: 'Clean the phone after use',
    caption: 'Wipe the phone with a clean cloth or alcohol wipe. Consult a clinician if symptoms persist.',
    image: images.howTo3,
  },
];

export default function HowToScreen() {
  const colors = useNavigationColors();
  const bottomPad = useStackScreenBottomPad();

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: bottomPad }]}
        showsVerticalScrollIndicator={false}>

        {/* ── Header ── */}
        <A.View entering={enterDown(0)} style={styles.header}>
          <AppText variant="eyebrow" tone="muted">GUIDE</AppText>
          <AppText variant="h1" style={styles.title}>
            How to screen your cough with Lively
          </AppText>
          <View style={[styles.trustBadge, { backgroundColor: colors.primaryMuted }]}>
            <MaterialIcons name="shield" size={13} color={colors.primary} />
            <AppText style={[styles.trustText, { color: colors.primary }]}>
              Private. Secure. On-device.
            </AppText>
          </View>
        </A.View>

        {/* ── Steps ── */}
        {STEPS.map((step, i) => (
          <A.View key={step.num} entering={enterDown(60 + i * 50)}>
            <StepCard step={step} colors={colors} />
          </A.View>
        ))}

        {/* ── Disclaimer ── */}
        <A.View entering={enterDown(380)}>
          <View style={[styles.disclaimer, { backgroundColor: colors.surfaceContainer, borderColor: colors.outlineMuted }]}>
            <MaterialIcons name="shield" size={16} color={colors.onSurfaceVariant} />
            <AppText variant="caption" tone="muted" style={styles.disclaimerText}>
              Lively is not a diagnostic tool. Results are for research screening only and are not intended to diagnose, treat, or monitor any disease.
            </AppText>
          </View>
        </A.View>

        {/* ── CTA ── */}
        <A.View entering={enterDown(420)}>
          <Link href="/record" asChild>
            <Button title="Start recording" variant="primary" hapticFeedback="medium" />
          </Link>
        </A.View>

      </ScrollView>
    </Screen>
  );
}

// ── Step card ──────────────────────────────────────────────────────────────

function StepCard({ step, colors }: { step: Step; colors: ReturnType<typeof useNavigationColors> }) {
  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.outlineMuted }]}>

      {/* Image with gradient overlay */}
      <View style={styles.imageWrap}>
        <Image source={step.image} style={styles.image} resizeMode="cover" />
        {/* Dark gradient over bottom of image for text legibility */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.55)'] as const}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0.4 }}
          end={{ x: 0, y: 1 }}
        />

        {/* Step number badge — top-left */}
        <View style={[styles.numBadge, { backgroundColor: colors.primary }]}>
          <AppText style={styles.numText}>{step.num}</AppText>
        </View>

        {/* Floating metric badge (e.g. "15–20 cm", "2–3×") — bottom-right */}
        {step.badge && (
          <View style={[styles.metricBadge, { backgroundColor: 'rgba(0,0,0,0.55)' }]}>
            <AppText style={styles.metricText}>{step.badge}</AppText>
          </View>
        )}

        {/* Tag row for step 3 (quiet indicators) */}
        {step.tags && (
          <View style={styles.tagRow}>
            {step.tags.map((tag) => (
              <View key={tag} style={[styles.tag, { backgroundColor: 'rgba(0,0,0,0.55)' }]}>
                <MaterialIcons name="do-not-disturb" size={10} color="rgba(255,255,255,0.8)" />
                <AppText style={styles.tagText}>{tag}</AppText>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Text block */}
      <View style={styles.textBlock}>
        <View style={styles.titleRow}>
          <View style={[styles.iconWrap, { backgroundColor: colors.primaryMuted }]}>
            <MaterialIcons name={step.icon} size={16} color={colors.primary} />
          </View>
          <AppText variant="bodyStrong" style={styles.stepTitle}>{step.title}</AppText>
        </View>
        <AppText variant="bodySm" tone="muted" style={styles.caption}>{step.caption}</AppText>
      </View>

    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  content: { padding: metrics.screenPadding, gap: 14, paddingBottom: 32 },

  header: { gap: 8 },
  title: { marginTop: 2 },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  trustText: { fontSize: 12, fontFamily: 'Manrope_700Bold' },

  card: {
    borderRadius: metrics.radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
  },

  imageWrap: {
    height: 200,
    width: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },

  numBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numText: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'Manrope_700Bold',
  },

  metricBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  metricText: {
    color: '#fff',
    fontSize: 13,
    fontFamily: 'Manrope_700Bold',
  },

  tagRow: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  tagText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 10,
    fontFamily: 'Manrope_700Bold',
  },

  textBlock: {
    padding: 14,
    gap: 6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepTitle: { flex: 1 },
  caption: { lineHeight: 19, paddingLeft: 40 },

  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 12,
    borderRadius: metrics.radius.lg,
    borderWidth: 1,
  },
  disclaimerText: { flex: 1, lineHeight: 17 },
});
