import { ScrollView, StyleSheet, View } from 'react-native';
import { Link } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

import { Screen } from '@/ui/Screen';
import { AppText } from '@/ui/AppText';
import { Card } from '@/ui/Card';
import { Button } from '@/ui/Button';
import { useNavigationColors } from '@/theme/useNavigationTheme';
import { A, enterDown } from '@/ui/animated';
import { metrics } from '@/ui/metrics';
import { useStackScreenBottomPad } from '@/ui/layoutMetrics';

type StepDef = {
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  title: string;
  body: string;
};

const STEPS: StepDef[] = [
  {
    icon: 'volume-off',
    title: 'Find a quiet place',
    body: 'Avoid TV, music, fans, and strong wind. A quiet room is best.',
  },
  {
    icon: 'phone-android',
    title: 'Hold the phone 20–30 cm away',
    body: 'Keep the microphone facing your mouth; don\'t cover it.',
  },
  {
    icon: 'graphic-eq',
    title: 'Cough naturally 2–3 times',
    body: 'Cough as you normally would. Don\'t speak between coughs.',
  },
  {
    icon: 'check-circle-outline',
    title: 'Stop and analyze',
    body: 'If the recording was too short or noisy, re-record.',
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
        <A.View entering={enterDown(0)}>
          <AppText variant="eyebrow" tone="muted">
            HOW IT WORKS
          </AppText>
          <AppText variant="h1" style={styles.title}>
            Capture a clean cough sample
          </AppText>
          <AppText variant="bodySm" tone="muted" style={{ marginTop: 4 }}>
            A clean recording dramatically improves accuracy. Follow these four steps.
          </AppText>
        </A.View>

        {STEPS.map((s, i) => (
          <A.View key={s.title} entering={enterDown(80 + i * 50)}>
            <Card tone="surface" bordered elev="none" density="comfortable">
              <View style={styles.step}>
                <View style={[styles.num, { backgroundColor: colors.primaryMuted }]}>
                  <AppText style={{ color: colors.primary, fontFamily: 'Inter_700Bold' }}>{i + 1}</AppText>
                </View>
                <View style={styles.stepBody}>
                  <View style={styles.stepTitleRow}>
                    <MaterialIcons name={s.icon} size={18} color={colors.primary} />
                    <AppText variant="bodyStrong">{s.title}</AppText>
                  </View>
                  <AppText variant="bodySm" tone="muted">
                    {s.body}
                  </AppText>
                </View>
              </View>
            </Card>
          </A.View>
        ))}

        <A.View entering={enterDown(340)}>
          <Card tone="info" elev="none" density="cozy">
            <View style={styles.tipRow}>
              <MaterialIcons name="lightbulb-outline" size={18} color={colors.info} />
              <AppText variant="bodyStrong" style={{ color: colors.info }}>
                Pro tip
              </AppText>
            </View>
            <AppText variant="bodySm" style={{ color: colors.info }}>
              Take a deep breath before coughing. Models respond better to deep, natural coughs than dry throat clears.
            </AppText>
          </Card>
        </A.View>

        <A.View entering={enterDown(400)}>
          <Link href="/record" asChild>
            <Button title="Start recording" variant="primary" hapticFeedback="medium" />
          </Link>
        </A.View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: metrics.screenPadding, gap: 12, paddingBottom: 32 },
  title: { marginTop: 4 },
  step: { flexDirection: 'row', gap: 14, alignItems: 'flex-start' },
  num: { width: 36, height: 36, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  stepBody: { flex: 1, gap: 4 },
  stepTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  tipRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
});
