import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { useNavigationColors } from '@/theme/useNavigationTheme';
import { AppText } from './AppText';
import { Card } from './Card';
import { metrics } from './metrics';

export type AlertIntent = 'info' | 'success' | 'warning' | 'danger';

type Props = {
  intent?: AlertIntent;
  title?: string;
  message: string;
  /** Optional dismiss handler — when present, an "x" appears. */
  onDismiss?: () => void;
  action?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

const ICONS: Record<AlertIntent, React.ComponentProps<typeof MaterialIcons>['name']> = {
  info: 'info-outline',
  success: 'check-circle-outline',
  warning: 'warning-amber',
  danger: 'error-outline',
};

/**
 * Inline alert card — replaces raw red `<AppText>` error blocks.
 *
 *   <Alert intent="danger" title="Recording failed" message={err} />
 */
export function Alert({ intent = 'info', title, message, onDismiss, action, style }: Props) {
  const colors = useNavigationColors();
  const palette = (() => {
    switch (intent) {
      case 'success':
        return { fg: colors.success, tone: 'success' as const };
      case 'warning':
        return { fg: colors.warning, tone: 'warning' as const };
      case 'danger':
        return { fg: colors.danger, tone: 'danger' as const };
      default:
        return { fg: colors.info, tone: 'info' as const };
    }
  })();

  return (
    <Card tone={palette.tone} elev="none" density="cozy" style={[styles.card, style]}>
      <View style={styles.row}>
        <MaterialIcons name={ICONS[intent]} size={20} color={palette.fg} style={styles.icon} />
        <View style={styles.body}>
          {title ? (
            <AppText variant="bodyStrong" style={{ color: palette.fg }}>
              {title}
            </AppText>
          ) : null}
          <AppText variant="bodySm" style={{ color: palette.fg }}>
            {message}
          </AppText>
          {action ? <View style={styles.action}>{action}</View> : null}
        </View>
        {onDismiss ? (
          <Pressable onPress={onDismiss} accessibilityLabel="Dismiss" hitSlop={10} style={styles.close}>
            <MaterialIcons name="close" size={18} color={palette.fg} />
          </Pressable>
        ) : null}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: metrics.radius.md },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  icon: { marginTop: 1 },
  body: { flex: 1, gap: 4 },
  action: { marginTop: 6 },
  close: { padding: 2 },
});
