import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

import { Screen } from '@/ui/Screen';
import { AppText } from '@/ui/AppText';
import { Card } from '@/ui/Card';
import { Pill } from '@/ui/Pill';
import { Section } from '@/ui/Section';
import { images } from '@/assets/images';
import { useNavigationColors } from '@/theme/useNavigationTheme';
import { A, enterDown, enterFade } from '@/ui/animated';
import { metrics } from '@/ui/metrics';
import { useStackScreenBottomPad } from '@/ui/layoutMetrics';
import { brandGradient } from '@/theme/tokens';

export default function AboutScreen() {
  const colors = useNavigationColors();
  const bottomPad = useStackScreenBottomPad();
  return (
    <Screen>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: bottomPad }]}
        showsVerticalScrollIndicator={false}>
        {/* Gradient hero */}
        <A.View entering={enterFade(0)}>
          <View style={styles.hero}>
            <LinearGradient
              colors={[...brandGradient(colors)]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            {/* Decorative circles */}
            <View style={[styles.dec, styles.dec1]} />
            <View style={[styles.dec, styles.dec2]} />

            <View style={styles.heroInner}>
              {/* Logo + name */}
              <View style={styles.logoRow}>
                <Image source={images.logoPrimary} style={styles.logoIcon} resizeMode="contain" />
                <AppText style={styles.appName}>Lively</AppText>
              </View>

              <Pill label="RESEARCH PROTOTYPE" tone="primary" />
              <AppText variant="bodySm" style={styles.heroBody}>
                A master's thesis project exploring cough-based screening for COVID-19 and TB with offline-first on-device inference.
              </AppText>
            </View>
          </View>
        </A.View>

        <A.View entering={enterDown(120)}>
          <Section title="ABOUT THE PROJECT">
            <Card tone="surface" bordered elev="none" density="comfortable">
              <AppText variant="bodyStrong">What is Lively?</AppText>
              <AppText variant="bodySm" tone="muted" style={{ marginTop: 4 }}>
                Lively is an offline-first demo that records cough audio and runs on-device inference using a TensorFlow
                Lite model. It is intended as a research tool to study how compact audio classifiers can support early
                screening — not as a diagnostic device.
              </AppText>
            </Card>
          </Section>
        </A.View>

        <A.View entering={enterDown(160)}>
          <Section title="TEAM">
            <Card tone="surface" bordered elev="none" density="comfortable">
              <PersonRow icon="school" role="Student" name="Nkenfa Nkombong Brandon" detail="CT24P016" />
              <View style={[styles.divider, { backgroundColor: colors.outlineMuted }]} />
              <PersonRow icon="psychology" role="Supervisor" name="Dr. Tchapga Tchito Christian" />
            </Card>
          </Section>
        </A.View>

        <A.View entering={enterDown(200)}>
          <Section title="DATASETS">
            <Card tone="container" elev="none" density="cozy">
              <AppText variant="bodySm" tone="muted">
                Coswara and COUGHVID (public, ethically released); TB dataset via Synapse (controlled access).
              </AppText>
            </Card>
          </Section>
        </A.View>

        <A.View entering={enterDown(240)}>
          <Section title="PRIVACY">
            <Card tone="container" elev="none" density="cozy">
              <AppText variant="bodySm" tone="muted">
                All inference runs locally on your device. Recordings are not uploaded unless you sign in and opt into
                sync. You can clear your history at any time from Settings.
              </AppText>
            </Card>
          </Section>
        </A.View>

        <A.View entering={enterDown(300)}>
          <AppText variant="caption" tone="muted" align="center" style={styles.footer}>
            Version 1.0.0 · Made for research
          </AppText>
        </A.View>
      </ScrollView>
    </Screen>
  );
}

function PersonRow({
  icon,
  role,
  name,
  detail,
}: {
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  role: string;
  name: string;
  detail?: string;
}) {
  const colors = useNavigationColors();
  return (
    <View style={styles.personRow}>
      <View style={[styles.personIcon, { backgroundColor: colors.primaryMuted }]}>
        <MaterialIcons name={icon} size={18} color={colors.primary} />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <AppText variant="caption" tone="muted">
          {role.toUpperCase()}
        </AppText>
        <AppText variant="bodyStrong">{name}</AppText>
        {detail ? (
          <AppText variant="caption" tone="muted">
            {detail}
          </AppText>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: metrics.screenPadding, gap: 16, paddingBottom: 32 },
  hero: {
    minHeight: 220,
    borderRadius: metrics.radius.xl,
    overflow: 'hidden',
    padding: 24,
    justifyContent: 'flex-end',
  },
  dec: { position: 'absolute', borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.08)' },
  dec1: { width: 180, height: 180, top: -60, right: -40 },
  dec2: { width: 120, height: 120, top: 20, right: 80 },
  heroInner: { gap: 12 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logoIcon: { width: 52, height: 52, borderRadius: 14 },
  appName: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 32,
    letterSpacing: 0.5,
    color: '#fff',
    lineHeight: 38,
  },
  heroBody: { color: 'rgba(255,255,255,0.88)', maxWidth: 320, lineHeight: 21 },
  personRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 6 },
  personIcon: { width: 32, height: 32, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  divider: { height: 1, marginVertical: 8 },
  footer: { marginTop: 8 },
});
