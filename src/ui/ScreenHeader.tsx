import { StyleSheet, View } from 'react-native';

import { AppText } from './AppText';
import { Pill, type PillTone } from './Pill';
import { metrics } from './metrics';

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  trailing?: React.ReactNode;
  badge?: { label: string; tone?: PillTone };
};

/**
 * Large-title page header. Replaces ad-hoc `<AppText style={styles.title}>`
 * scattered through screens. Designed to sit at the top of a ScrollView.
 *
 *   <ScreenHeader eyebrow="Screening" title="Record a cough" subtitle="…" />
 */
export function ScreenHeader({ eyebrow, title, subtitle, trailing, badge }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.left}>
        {eyebrow ? (
          <AppText variant="eyebrow" tone="muted">
            {eyebrow}
          </AppText>
        ) : null}
        <View style={styles.titleRow}>
          <AppText variant="h1" style={styles.title}>
            {title}
          </AppText>
          {badge ? <Pill label={badge.label} tone={badge.tone ?? 'neutral'} /> : null}
        </View>
        {subtitle ? (
          <AppText variant="bodySm" tone="muted" style={styles.subtitle}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {trailing ? <View style={styles.trailing}>{trailing}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  left: { flex: 1, gap: 6 },
  titleRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  title: {},
  subtitle: { marginTop: 2 },
  trailing: { paddingTop: metrics.hairline },
});
